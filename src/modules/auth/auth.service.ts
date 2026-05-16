import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UserRole } from '@prisma/client';
import { comparePassword, hashPassword, signToken } from '../../common/auth.util';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly restaurants: RestaurantsService,
    private readonly loyalty: LoyaltyService,
  ) {}

  async registerMember(
    restaurantSlug: string,
    data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      birthday?: string;
      competitionEntryId?: string;
    },
  ) {
    const restaurant = await this.restaurants.findBySlug(restaurantSlug);
    if (!restaurant) throw new UnauthorizedException('Invalid restaurant');

    const existing = await this.prisma.member.findUnique({
      where: {
        restaurantId_email: {
          restaurantId: restaurant.id,
          email: data.email.toLowerCase(),
        },
      },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await hashPassword(data.password);

    const member = await this.prisma.member.create({
      data: {
        restaurantId: restaurant.id,
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        phone: data.phone,
        birthday: data.birthday ? new Date(data.birthday) : undefined,
      },
    });

    await this.loyalty.issueWelcomeVoucher(member.id, restaurant.id);

    if (data.competitionEntryId) {
      await this.prisma.competitionEntry.updateMany({
        where: { id: data.competitionEntryId, competition: { restaurantId: restaurant.id } },
        data: { memberId: member.id, voucherGranted: true },
      });
    }

    await this.prisma.memberNotification.create({
      data: {
        memberId: member.id,
        title: `Welcome to ${restaurant.appDisplayName}`,
        body: `Your ${restaurant.welcomeDiscountPercent}% welcome voucher is in your wallet. Valid for 30 days. Food only — drinks excluded.`,
      },
    });

    const token = signToken({
      sub: member.id,
      role: 'MEMBER',
      restaurantId: restaurant.id,
      type: 'member',
    });

    return { token, member: await this.memberProfile(member.id) };
  }

  async loginMember(restaurantSlug: string, email: string, password: string) {
    const restaurant = await this.restaurants.findBySlug(restaurantSlug);
    if (!restaurant) throw new UnauthorizedException('Invalid credentials');

    const member = await this.prisma.member.findUnique({
      where: {
        restaurantId_email: {
          restaurantId: restaurant.id,
          email: email.toLowerCase(),
        },
      },
    });
    if (!member) throw new UnauthorizedException('Invalid credentials');
    const ok = await comparePassword(password, member.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = signToken({
      sub: member.id,
      role: 'MEMBER',
      restaurantId: restaurant.id,
      type: 'member',
    });

    return { token, member: await this.memberProfile(member.id) };
  }

  async loginStaff(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = signToken({
      sub: user.id,
      role: user.role,
      restaurantId: user.restaurantId ?? undefined,
      type: 'staff',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    };
  }

  async memberProfile(memberId: string) {
    const member = await this.prisma.member.findUniqueOrThrow({
      where: { id: memberId },
      include: {
        restaurant: true,
        vouchers: { where: { status: 'ACTIVE' }, orderBy: { validUntil: 'asc' } },
        notifications: { orderBy: { sentAt: 'desc' }, take: 20 },
      },
    });

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      avatarUrl: member.avatarUrl,
      birthday: member.birthday,
      loyalty: this.loyalty.memberSummary(member),
      restaurant: {
        slug: member.restaurant.slug,
        name: member.restaurant.name,
        appDisplayName: member.restaurant.appDisplayName,
        primaryColor: member.restaurant.primaryColor,
      },
      activeVouchers: member.vouchers,
      notifications: member.notifications,
    };
  }

  async updateMemberProfile(
    memberId: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      birthday?: string;
    },
  ) {
    const member = await this.prisma.member.findUniqueOrThrow({
      where: { id: memberId },
    });

    if (data.email && data.email.toLowerCase() !== member.email) {
      const taken = await this.prisma.member.findUnique({
        where: {
          restaurantId_email: {
            restaurantId: member.restaurantId,
            email: data.email.toLowerCase(),
          },
        },
      });
      if (taken) throw new ConflictException('Email already in use');
    }

    await this.prisma.member.update({
      where: { id: memberId },
      data: {
        name: data.name?.trim() || undefined,
        email: data.email?.toLowerCase(),
        phone: data.phone === '' ? null : data.phone,
        birthday:
          data.birthday === undefined
            ? undefined
            : data.birthday === ''
              ? null
              : new Date(data.birthday),
      },
    });

    return this.memberProfile(memberId);
  }

  async changeMemberPassword(
    memberId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const member = await this.prisma.member.findUniqueOrThrow({
      where: { id: memberId },
    });
    const ok = await comparePassword(currentPassword, member.passwordHash);
    if (!ok) throw new UnauthorizedException('Current password is incorrect');

    await this.prisma.member.update({
      where: { id: memberId },
      data: { passwordHash: await hashPassword(newPassword) },
    });

    return { success: true };
  }

  async updateMemberAvatar(memberId: string, filename: string) {
    const member = await this.prisma.member.findUniqueOrThrow({
      where: { id: memberId },
    });

    const avatarUrl = `/uploads/avatars/${filename}`;

    if (member.avatarUrl?.startsWith('/uploads/')) {
      const oldPath = join(process.cwd(), member.avatarUrl.replace(/^\//, ''));
      await unlink(oldPath).catch(() => undefined);
    }

    await this.prisma.member.update({
      where: { id: memberId },
      data: { avatarUrl },
    });

    return this.memberProfile(memberId);
  }
}
