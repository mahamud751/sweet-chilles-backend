import { Injectable, NotFoundException } from '@nestjs/common';
import { CompetitionStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';

@Injectable()
export class CompetitionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loyalty: LoyaltyService,
  ) {}

  listForRestaurant(restaurantId: string) {
    return this.prisma.competition.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  getActive(restaurantSlug: string) {
    return this.prisma.competition.findFirst({
      where: {
        status: CompetitionStatus.ACTIVE,
        restaurant: { slug: restaurantSlug },
      },
    });
  }

  async announceWinner(competitionId: string, winnerMemberId: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      include: { entries: true },
    });
    if (!competition) throw new NotFoundException('Competition not found');

    await this.prisma.competition.update({
      where: { id: competitionId },
      data: { status: CompetitionStatus.WINNER_ANNOUNCED, winnerMemberId },
    });

    const losers = competition.entries.filter((e) => e.memberId !== winnerMemberId);
    return {
      competitionId,
      winnerMemberId,
      participantsToMessage: losers.length,
      messengerTemplate: `Thank you for taking part. Although you didn't win this time, the management would still love to welcome you. As a thank you, we are giving every participant an exclusive voucher — valid for the next 30 days. Download our members app to claim.`,
    };
  }

  async grantParticipantVoucher(competitionEntryId: string, memberId: string) {
    const entry = await this.prisma.competitionEntry.update({
      where: { id: competitionEntryId },
      data: { memberId, voucherGranted: true, messengerSent: true },
      include: { competition: true },
    });
    await this.loyalty.issueWelcomeVoucher(memberId, entry.competition.restaurantId);
    return entry;
  }
}
