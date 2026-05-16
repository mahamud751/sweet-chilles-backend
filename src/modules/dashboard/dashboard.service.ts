import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async stats(restaurantId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const [totalMembers, activeMembers, lostMembers, birthdayThisMonth, voucherRedemptions, visits, orders, bookings] =
      await Promise.all([
        this.prisma.member.count({ where: { restaurantId } }),
        this.prisma.member.count({
          where: { restaurantId, lastVisitAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.member.count({
          where: {
            restaurantId,
            OR: [{ lastVisitAt: null }, { lastVisitAt: { lt: ninetyDaysAgo } }],
          },
        }),
        this.prisma.member.count({
          where: {
            restaurantId,
            birthday: { not: null },
          },
        }),
        this.prisma.voucher.count({
          where: { restaurantId, status: 'REDEEMED' },
        }),
        this.prisma.visit.count({ where: { restaurantId } }),
        this.prisma.order.count({ where: { restaurantId } }),
        this.prisma.booking.count({ where: { restaurantId } }),
      ]);

    const goldMembers = await this.prisma.member.count({
      where: { restaurantId, isGoldMember: true },
    });

    const revenueFromVisits = await this.prisma.visit.aggregate({
      where: { restaurantId, billAmount: { not: null } },
      _sum: { billAmount: true, discountAmount: true },
    });

    return {
      customers: {
        total: totalMembers,
        active: activeMembers,
        lost: lostMembers,
        gold: goldMembers,
        birthdayMembers: birthdayThisMonth,
      },
      revenue: {
        totalBillAmount: revenueFromVisits._sum.billAmount ?? 0,
        totalDiscountGiven: revenueFromVisits._sum.discountAmount ?? 0,
        voucherRedemptions,
        repeatVisits: visits,
        orders,
        bookings,
      },
      growthTargets: {
        month1to2Members: '50–150',
        month6to8RevenueUplift: '£3,000–£5,000',
      },
    };
  }

  members(restaurantId: string) {
    return this.prisma.member.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        loyaltyStage: true,
        isGoldMember: true,
        lastVisitAt: true,
        createdAt: true,
      },
    });
  }
}
