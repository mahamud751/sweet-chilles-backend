import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole, VoucherStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly restaurants: RestaurantsService,
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
}
