import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  LoyaltyStage,
  Prisma,
  VoucherStatus,
  VoucherType,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  LOYALTY_VISITS_COUNT,
  nextStageAfterRedeem,
  stageLabel,
  VOUCHER_VALID_DAYS,
  welcomePercent,
} from '../../common/loyalty-journey';

@Injectable()
export class LoyaltyService {
  constructor(private readonly prisma: PrismaService) {}

  async issueWelcomeVoucher(memberId: string, restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUniqueOrThrow({
      where: { id: restaurantId },
    });
    const percent = welcomePercent(restaurant.welcomeDiscountPercent);
    const validUntil = daysFromNow(VOUCHER_VALID_DAYS);

    return this.prisma.voucher.create({
      data: {
        restaurantId,
        memberId,
        type: VoucherType.WELCOME,
        percentOff: percent,
        validUntil,
      },
    });
  }

  async redeemByQrToken(qrToken: string, staffUserId?: string, billAmount?: number) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { qrToken },
      include: { member: true, restaurant: true },
    });
    if (!voucher) throw new NotFoundException('Voucher not found');
    if (voucher.status !== VoucherStatus.ACTIVE) {
      throw new BadRequestException(`Voucher is ${voucher.status.toLowerCase()}`);
    }
    if (voucher.validUntil < new Date()) {
      await this.prisma.voucher.update({
        where: { id: voucher.id },
        data: { status: VoucherStatus.EXPIRED },
      });
      throw new BadRequestException('Voucher has expired');
    }

    const discount =
      billAmount != null
        ? new Prisma.Decimal(billAmount * (voucher.percentOff / 100))
        : null;

    const visit = await this.prisma.$transaction(async (tx) => {
      const createdVisit = await tx.visit.create({
        data: {
          restaurantId: voucher.restaurantId,
          memberId: voucher.memberId,
          staffUserId,
          billAmount: billAmount != null ? billAmount : null,
          discountAmount: discount,
        },
      });

      await tx.voucher.update({
        where: { id: voucher.id },
        data: {
          status: VoucherStatus.REDEEMED,
          redeemedAt: new Date(),
          visitId: createdVisit.id,
        },
      });

      const member = voucher.member;
      const transition = nextStageAfterRedeem(
        member.loyaltyStage,
        member.loyaltyVisitsRemaining,
      );

      const memberUpdate: Prisma.MemberUpdateInput = {
        loyaltyStage: transition.stage,
        loyaltyVisitsRemaining: transition.loyaltyVisitsRemaining ?? member.loyaltyVisitsRemaining,
        lastVisitAt: new Date(),
        isGoldMember: transition.stage === LoyaltyStage.GOLD,
      };

      await tx.member.update({
        where: { id: member.id },
        data: memberUpdate,
      });

      if (transition.nextVoucher) {
        await tx.voucher.create({
          data: {
            restaurantId: voucher.restaurantId,
            memberId: voucher.memberId,
            type: transition.nextVoucher.type,
            percentOff: transition.nextVoucher.percentOff,
            validUntil: daysFromNow(transition.nextVoucher.validDays),
          },
        });

        const message = unlockMessage(transition.nextVoucher.type, transition.nextVoucher.percentOff);
        await tx.memberNotification.create({
          data: {
            memberId: member.id,
            title: 'Reward unlocked',
            body: message,
          },
        });
      }

      if (transition.stage === LoyaltyStage.LOYALTY_ACTIVE && member.loyaltyStage === LoyaltyStage.THIRD_REDEEMED) {
        await tx.memberNotification.create({
          data: {
            memberId: member.id,
            title: 'Loyalty rewards unlocked',
            body: `Congratulations. You are now in our loyalty rewards stage. For your next ${LOYALTY_VISITS_COUNT} visits over the next 3 months, enjoy 15% off your food bill.`,
          },
        });
      }

      if (transition.stage === LoyaltyStage.GOLD) {
        await tx.memberNotification.create({
          data: {
            memberId: member.id,
            title: 'Gold Member',
            body: 'You are now a Gold Member — 10% off every visit, for life of membership.',
          },
        });
      }

      return createdVisit;
    });

    return this.prisma.member.findUnique({
      where: { id: voucher.memberId },
      include: {
        vouchers: { where: { status: VoucherStatus.ACTIVE }, orderBy: { validUntil: 'asc' } },
      },
    });
  }

  memberSummary(member: {
    loyaltyStage: LoyaltyStage;
    isGoldMember: boolean;
    loyaltyVisitsRemaining: number;
  }) {
    return {
      stage: member.loyaltyStage,
      stageLabel: stageLabel(member.loyaltyStage, member.isGoldMember),
      isGoldMember: member.isGoldMember,
      loyaltyVisitsRemaining: member.loyaltyVisitsRemaining,
    };
  }
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function unlockMessage(type: VoucherType, percent: number): string {
  switch (type) {
    case VoucherType.RETURN:
      return 'Thank you for dining with us. Your next reward has been unlocked. Enjoy 20% off your next visit.';
    case VoucherType.THIRD:
      return `Your ${percent}% discount for your next visit is ready in your wallet.`;
    case VoucherType.LOYALTY:
      return `Enjoy ${percent}% off your next visit — loyalty reward unlocked.`;
    case VoucherType.GOLD:
      return 'Gold Member status unlocked — 10% off every visit.';
    default:
      return `Your ${percent}% voucher is ready.`;
  }
}
