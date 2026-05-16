import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CampaignType,
  UserRole,
  VoucherStatus,
  VoucherType,
} from '@prisma/client';
import { hashPassword } from '../../common/auth.util';
import { VOUCHER_VALID_DAYS } from '../../common/loyalty-journey';
import { PrismaService } from '../../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { RestaurantsService } from '../restaurants/restaurants.service';

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly restaurants: RestaurantsService,
    private readonly loyalty: LoyaltyService,
  ) {}

  async resolveRestaurantId(userId: string, slug?: string): Promise<string> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (user.restaurantId) return user.restaurantId;

    if (user.role === UserRole.SAVASAACHI_ADMIN && slug) {
      const restaurant = await this.restaurants.findBySlug(slug);
      if (restaurant) return restaurant.id;
    }

    const fallback = await this.prisma.restaurant.findFirst({
      where: { slug: slug ?? 'sweet-chillies' },
    });
    if (!fallback) throw new ForbiddenException('No restaurant access');
    return fallback.id;
  }

  async summary(userId: string, slug?: string) {
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    const [members, activeVouchers, redeemedVouchers, campaigns] =
      await Promise.all([
        this.prisma.member.count({ where: { restaurantId } }),
        this.prisma.voucher.count({
          where: { restaurantId, status: VoucherStatus.ACTIVE },
        }),
        this.prisma.voucher.count({
          where: { restaurantId, status: VoucherStatus.REDEEMED },
        }),
        this.prisma.campaignTemplate.count({ where: { restaurantId } }),
      ]);

    return { members, activeVouchers, redeemedVouchers, campaigns };
  }

  async searchMembers(userId: string, query: string, slug?: string) {
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    const q = query.trim();
    if (!q) return [];

    const members = await this.prisma.member.findMany({
      where: {
        restaurantId,
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
      take: 12,
      select: { id: true, name: true, email: true },
    });

    return members;
  }

  async listMembers(userId: string, slug?: string) {
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    const members = await this.prisma.member.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        loyaltyStage: true,
        isGoldMember: true,
        createdAt: true,
        _count: { select: { vouchers: true } },
      },
    });

    return members.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      loyaltyStage: m.loyaltyStage,
      isGoldMember: m.isGoldMember,
      joinedAt: m.createdAt,
      voucherCount: m._count.vouchers,
    }));
  }

  async listVouchers(userId: string, slug?: string) {
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    const vouchers = await this.prisma.voucher.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      take: 300,
      include: {
        member: { select: { name: true, email: true } },
      },
    });

    return vouchers.map(v => ({
      id: v.id,
      type: v.type,
      percentOff: v.percentOff,
      status: v.status,
      validUntil: v.validUntil,
      redeemedAt: v.redeemedAt,
      qrToken: v.qrToken,
      memberName: v.member.name,
      memberEmail: v.member.email,
    }));
  }

  async listCampaigns(userId: string, slug?: string) {
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    return this.prisma.campaignTemplate.findMany({
      where: { restaurantId },
      orderBy: { type: 'asc' },
    });
  }

  private async assertManager(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    if (
      user.role !== UserRole.RESTAURANT_OWNER &&
      user.role !== UserRole.SAVASAACHI_ADMIN
    ) {
      throw new ForbiddenException('Only restaurant owners and admins can edit or delete');
    }
    return user;
  }

  private async memberInRestaurant(memberId: string, restaurantId: string) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, restaurantId },
    });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async updateMember(
    userId: string,
    memberId: string,
    data: { name?: string; email?: string; phone?: string },
    slug?: string,
  ) {
    await this.assertManager(userId);
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    await this.memberInRestaurant(memberId, restaurantId);

    if (data.email) {
      const taken = await this.prisma.member.findFirst({
        where: {
          restaurantId,
          email: data.email.toLowerCase(),
          NOT: { id: memberId },
        },
      });
      if (taken) throw new ConflictException('Email already in use');
    }

    const updated = await this.prisma.member.update({
      where: { id: memberId },
      data: {
        name: data.name?.trim() || undefined,
        email: data.email?.toLowerCase(),
        phone: data.phone === '' ? null : data.phone,
      },
      include: { _count: { select: { vouchers: true } } },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      loyaltyStage: updated.loyaltyStage,
      isGoldMember: updated.isGoldMember,
      joinedAt: updated.createdAt,
      voucherCount: updated._count.vouchers,
    };
  }

  async createMember(
    userId: string,
    data: {
      name: string;
      email: string;
      phone?: string;
      password: string;
      issueWelcomeVoucher?: boolean;
    },
    slug?: string,
  ) {
    await this.assertManager(userId);
    const restaurantId = await this.resolveRestaurantId(userId, slug);

    const email = data.email.toLowerCase();
    const existing = await this.prisma.member.findUnique({
      where: { restaurantId_email: { restaurantId, email } },
    });
    if (existing) throw new ConflictException('Email already in use');

    const member = await this.prisma.member.create({
      data: {
        restaurantId,
        name: data.name.trim(),
        email,
        phone: data.phone?.trim() || null,
        passwordHash: await hashPassword(data.password),
      },
      include: { _count: { select: { vouchers: true } } },
    });

    if (data.issueWelcomeVoucher !== false) {
      await this.loyalty.issueWelcomeVoucher(member.id, restaurantId);
    }

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      loyaltyStage: member.loyaltyStage,
      isGoldMember: member.isGoldMember,
      joinedAt: member.createdAt,
      voucherCount: member._count.vouchers + (data.issueWelcomeVoucher !== false ? 1 : 0),
    };
  }

  async deleteMember(userId: string, memberId: string, slug?: string) {
    await this.assertManager(userId);
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    await this.memberInRestaurant(memberId, restaurantId);

    await this.prisma.$transaction([
      this.prisma.voucher.deleteMany({ where: { memberId } }),
      this.prisma.memberNotification.deleteMany({ where: { memberId } }),
      this.prisma.booking.deleteMany({ where: { memberId } }),
      this.prisma.order.deleteMany({ where: { memberId } }),
      this.prisma.competitionEntry.updateMany({
        where: { memberId },
        data: { memberId: null },
      }),
      this.prisma.visit.deleteMany({ where: { memberId } }),
      this.prisma.member.delete({ where: { id: memberId } }),
    ]);

    return { success: true };
  }

  async createVoucher(
    userId: string,
    data: {
      memberEmail: string;
      type: VoucherType;
      percentOff: number;
      validUntil?: string;
      status?: VoucherStatus;
    },
    slug?: string,
  ) {
    await this.assertManager(userId);
    const restaurantId = await this.resolveRestaurantId(userId, slug);

    const member = await this.prisma.member.findUnique({
      where: {
        restaurantId_email: {
          restaurantId,
          email: data.memberEmail.toLowerCase(),
        },
      },
    });
    if (!member) throw new NotFoundException('Member not found for this email');

    const validUntil = data.validUntil
      ? new Date(data.validUntil)
      : daysFromNow(VOUCHER_VALID_DAYS);

    const created = await this.prisma.voucher.create({
      data: {
        restaurantId,
        memberId: member.id,
        type: data.type,
        percentOff: data.percentOff,
        validUntil,
        status: data.status ?? VoucherStatus.ACTIVE,
      },
      include: { member: { select: { name: true, email: true } } },
    });

    return {
      id: created.id,
      type: created.type,
      percentOff: created.percentOff,
      status: created.status,
      validUntil: created.validUntil,
      redeemedAt: created.redeemedAt,
      qrToken: created.qrToken,
      memberName: created.member.name,
      memberEmail: created.member.email,
    };
  }

  async updateVoucher(
    userId: string,
    voucherId: string,
    data: {
      percentOff?: number;
      status?: VoucherStatus;
      validUntil?: string;
    },
    slug?: string,
  ) {
    await this.assertManager(userId);
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    const voucher = await this.prisma.voucher.findFirst({
      where: { id: voucherId, restaurantId },
    });
    if (!voucher) throw new NotFoundException('Voucher not found');

    const updated = await this.prisma.voucher.update({
      where: { id: voucherId },
      data: {
        percentOff: data.percentOff,
        status: data.status,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      },
      include: { member: { select: { name: true, email: true } } },
    });

    return {
      id: updated.id,
      type: updated.type,
      percentOff: updated.percentOff,
      status: updated.status,
      validUntil: updated.validUntil,
      redeemedAt: updated.redeemedAt,
      qrToken: updated.qrToken,
      memberName: updated.member.name,
      memberEmail: updated.member.email,
    };
  }

  async deleteVoucher(userId: string, voucherId: string, slug?: string) {
    await this.assertManager(userId);
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    const voucher = await this.prisma.voucher.findFirst({
      where: { id: voucherId, restaurantId },
    });
    if (!voucher) throw new NotFoundException('Voucher not found');

    await this.prisma.voucher.delete({ where: { id: voucherId } });
    return { success: true };
  }

  async createCampaign(
    userId: string,
    data: {
      type: CampaignType;
      title: string;
      bodyTemplate: string;
      isEnabled?: boolean;
    },
    slug?: string,
  ) {
    await this.assertManager(userId);
    const restaurantId = await this.resolveRestaurantId(userId, slug);

    const existing = await this.prisma.campaignTemplate.findUnique({
      where: {
        restaurantId_type: { restaurantId, type: data.type },
      },
    });
    if (existing) {
      throw new ConflictException(
        `A campaign of type ${data.type} already exists. Edit or delete it first.`,
      );
    }

    return this.prisma.campaignTemplate.create({
      data: {
        restaurantId,
        type: data.type,
        title: data.title.trim(),
        bodyTemplate: data.bodyTemplate.trim(),
        isEnabled: data.isEnabled ?? true,
      },
    });
  }

  async updateCampaign(
    userId: string,
    campaignId: string,
    data: { title?: string; bodyTemplate?: string; isEnabled?: boolean },
    slug?: string,
  ) {
    await this.assertManager(userId);
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    const campaign = await this.prisma.campaignTemplate.findFirst({
      where: { id: campaignId, restaurantId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    return this.prisma.campaignTemplate.update({
      where: { id: campaignId },
      data: {
        title: data.title?.trim() || undefined,
        bodyTemplate: data.bodyTemplate?.trim() || undefined,
        isEnabled: data.isEnabled,
      },
    });
  }

  async deleteCampaign(userId: string, campaignId: string, slug?: string) {
    await this.assertManager(userId);
    const restaurantId = await this.resolveRestaurantId(userId, slug);
    const campaign = await this.prisma.campaignTemplate.findFirst({
      where: { id: campaignId, restaurantId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    await this.prisma.campaignTemplate.delete({ where: { id: campaignId } });
    return { success: true };
  }
}
