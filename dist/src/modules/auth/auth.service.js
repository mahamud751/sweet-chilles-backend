"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const auth_util_1 = require("../../common/auth.util");
const loyalty_service_1 = require("../loyalty/loyalty.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const restaurants_service_1 = require("../restaurants/restaurants.service");
let AuthService = class AuthService {
    constructor(prisma, restaurants, loyalty) {
        this.prisma = prisma;
        this.restaurants = restaurants;
        this.loyalty = loyalty;
    }
    async registerMember(restaurantSlug, data) {
        const restaurant = await this.restaurants.findBySlug(restaurantSlug);
        if (!restaurant)
            throw new common_1.UnauthorizedException('Invalid restaurant');
        const existing = await this.prisma.member.findUnique({
            where: {
                restaurantId_email: {
                    restaurantId: restaurant.id,
                    email: data.email.toLowerCase(),
                },
            },
        });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await (0, auth_util_1.hashPassword)(data.password);
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
        const token = (0, auth_util_1.signToken)({
            sub: member.id,
            role: 'MEMBER',
            restaurantId: restaurant.id,
            type: 'member',
        });
        return { token, member: await this.memberProfile(member.id) };
    }
    async loginUnified(restaurantSlug, email, password) {
        const restaurant = await this.restaurants.findBySlug(restaurantSlug);
        if (!restaurant)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const normalizedEmail = email.toLowerCase();
        const member = await this.prisma.member.findUnique({
            where: {
                restaurantId_email: {
                    restaurantId: restaurant.id,
                    email: normalizedEmail,
                },
            },
        });
        if (member) {
            const ok = await (0, auth_util_1.comparePassword)(password, member.passwordHash);
            if (!ok)
                throw new common_1.UnauthorizedException('Invalid credentials');
            const token = (0, auth_util_1.signToken)({
                sub: member.id,
                role: 'MEMBER',
                restaurantId: restaurant.id,
                type: 'member',
            });
            return {
                accountType: 'member',
                token,
                member: await this.memberProfile(member.id),
            };
        }
        const user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (user) {
            const ok = await (0, auth_util_1.comparePassword)(password, user.passwordHash);
            if (!ok)
                throw new common_1.UnauthorizedException('Invalid credentials');
            const token = (0, auth_util_1.signToken)({
                sub: user.id,
                role: user.role,
                restaurantId: user.restaurantId ?? undefined,
                type: 'staff',
            });
            return {
                accountType: 'staff',
                token,
                staff: await this.staffProfile(user.id),
            };
        }
        throw new common_1.UnauthorizedException('Invalid credentials');
    }
    async loginMember(restaurantSlug, email, password) {
        const restaurant = await this.restaurants.findBySlug(restaurantSlug);
        if (!restaurant)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const member = await this.prisma.member.findUnique({
            where: {
                restaurantId_email: {
                    restaurantId: restaurant.id,
                    email: email.toLowerCase(),
                },
            },
        });
        if (!member)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await (0, auth_util_1.comparePassword)(password, member.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = (0, auth_util_1.signToken)({
            sub: member.id,
            role: 'MEMBER',
            restaurantId: restaurant.id,
            type: 'member',
        });
        return { token, member: await this.memberProfile(member.id) };
    }
    async loginStaff(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await (0, auth_util_1.comparePassword)(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = (0, auth_util_1.signToken)({
            sub: user.id,
            role: user.role,
            restaurantId: user.restaurantId ?? undefined,
            type: 'staff',
        });
        return {
            token,
            user: await this.staffProfile(user.id),
        };
    }
    async staffProfile(userId) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: { restaurant: true },
        });
        return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            restaurantId: user.restaurantId,
            restaurant: user.restaurant
                ? {
                    slug: user.restaurant.slug,
                    name: user.restaurant.name,
                    appDisplayName: user.restaurant.appDisplayName,
                    primaryColor: user.restaurant.primaryColor,
                }
                : null,
        };
    }
    async updateStaffProfile(userId, data) {
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        if (data.email && data.email.toLowerCase() !== user.email) {
            const taken = await this.prisma.user.findUnique({
                where: { email: data.email.toLowerCase() },
            });
            if (taken)
                throw new common_1.ConflictException('Email already in use');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                displayName: data.displayName?.trim() || undefined,
                email: data.email?.toLowerCase(),
            },
        });
        return this.staffProfile(userId);
    }
    async changeStaffPassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        const ok = await (0, auth_util_1.comparePassword)(currentPassword, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: await (0, auth_util_1.hashPassword)(newPassword) },
        });
        return { success: true };
    }
    async memberProfile(memberId) {
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
            referralCode: member.referralCode,
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
    async updateMemberProfile(memberId, data) {
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
            if (taken)
                throw new common_1.ConflictException('Email already in use');
        }
        await this.prisma.member.update({
            where: { id: memberId },
            data: {
                name: data.name?.trim() || undefined,
                email: data.email?.toLowerCase(),
                phone: data.phone === '' ? null : data.phone,
                birthday: data.birthday === undefined
                    ? undefined
                    : data.birthday === ''
                        ? null
                        : new Date(data.birthday),
            },
        });
        return this.memberProfile(memberId);
    }
    async changeMemberPassword(memberId, currentPassword, newPassword) {
        const member = await this.prisma.member.findUniqueOrThrow({
            where: { id: memberId },
        });
        const ok = await (0, auth_util_1.comparePassword)(currentPassword, member.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        await this.prisma.member.update({
            where: { id: memberId },
            data: { passwordHash: await (0, auth_util_1.hashPassword)(newPassword) },
        });
        return { success: true };
    }
    async createBooking(memberId, data) {
        const member = await this.prisma.member.findUniqueOrThrow({
            where: { id: memberId },
            include: { restaurant: true },
        });
        const booking = await this.prisma.booking.create({
            data: {
                restaurantId: member.restaurantId,
                memberId: member.id,
                partySize: data.partySize,
                bookedFor: new Date(data.bookedFor),
            },
        });
        await this.prisma.memberNotification.create({
            data: {
                memberId: member.id,
                title: 'Table booked',
                body: `Your table for ${data.partySize} on ${new Date(data.bookedFor).toLocaleString()} is confirmed at ${member.restaurant.name}.`,
            },
        });
        return booking;
    }
    async updateMemberAvatar(memberId, filename) {
        const member = await this.prisma.member.findUniqueOrThrow({
            where: { id: memberId },
        });
        const avatarUrl = `/uploads/avatars/${filename}`;
        if (member.avatarUrl?.startsWith('/uploads/')) {
            const oldPath = (0, path_1.join)(process.cwd(), member.avatarUrl.replace(/^\//, ''));
            await (0, promises_1.unlink)(oldPath).catch(() => undefined);
        }
        await this.prisma.member.update({
            where: { id: memberId },
            data: { avatarUrl },
        });
        return this.memberProfile(memberId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        restaurants_service_1.RestaurantsService,
        loyalty_service_1.LoyaltyService])
], AuthService);
//# sourceMappingURL=auth.service.js.map