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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_util_1 = require("../../common/auth.util");
const loyalty_journey_1 = require("../../common/loyalty-journey");
const prisma_service_1 = require("../../prisma/prisma.service");
const loyalty_service_1 = require("../loyalty/loyalty.service");
const restaurants_service_1 = require("../restaurants/restaurants.service");
function daysFromNow(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}
let DashboardService = class DashboardService {
    constructor(prisma, restaurants, loyalty) {
        this.prisma = prisma;
        this.restaurants = restaurants;
        this.loyalty = loyalty;
    }
    async resolveRestaurantId(userId, slug) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
        });
        if (user.restaurantId)
            return user.restaurantId;
        if (user.role === client_1.UserRole.SAVASAACHI_ADMIN && slug) {
            const restaurant = await this.restaurants.findBySlug(slug);
            if (restaurant)
                return restaurant.id;
        }
        const fallback = await this.prisma.restaurant.findFirst({
            where: { slug: slug ?? 'sweet-chillies' },
        });
        if (!fallback)
            throw new common_1.ForbiddenException('No restaurant access');
        return fallback.id;
    }
    async summary(userId, slug) {
        const restaurantId = await this.resolveRestaurantId(userId, slug);
        const [members, activeVouchers, redeemedVouchers, campaigns] = await Promise.all([
            this.prisma.member.count({ where: { restaurantId } }),
            this.prisma.voucher.count({
                where: { restaurantId, status: client_1.VoucherStatus.ACTIVE },
            }),
            this.prisma.voucher.count({
                where: { restaurantId, status: client_1.VoucherStatus.REDEEMED },
            }),
            this.prisma.campaignTemplate.count({ where: { restaurantId } }),
        ]);
        return { members, activeVouchers, redeemedVouchers, campaigns };
    }
    async listMembers(userId, slug) {
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
    async listVouchers(userId, slug) {
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
    async listCampaigns(userId, slug) {
        const restaurantId = await this.resolveRestaurantId(userId, slug);
        return this.prisma.campaignTemplate.findMany({
            where: { restaurantId },
            orderBy: { type: 'asc' },
        });
    }
    async assertManager(userId) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
        });
        if (user.role !== client_1.UserRole.RESTAURANT_OWNER &&
            user.role !== client_1.UserRole.SAVASAACHI_ADMIN) {
            throw new common_1.ForbiddenException('Only restaurant owners and admins can edit or delete');
        }
        return user;
    }
    async memberInRestaurant(memberId, restaurantId) {
        const member = await this.prisma.member.findFirst({
            where: { id: memberId, restaurantId },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return member;
    }
    async updateMember(userId, memberId, data, slug) {
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
            if (taken)
                throw new common_1.ConflictException('Email already in use');
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
    async createMember(userId, data, slug) {
        await this.assertManager(userId);
        const restaurantId = await this.resolveRestaurantId(userId, slug);
        const email = data.email.toLowerCase();
        const existing = await this.prisma.member.findUnique({
            where: { restaurantId_email: { restaurantId, email } },
        });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const member = await this.prisma.member.create({
            data: {
                restaurantId,
                name: data.name.trim(),
                email,
                phone: data.phone?.trim() || null,
                passwordHash: await (0, auth_util_1.hashPassword)(data.password),
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
    async deleteMember(userId, memberId, slug) {
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
    async createVoucher(userId, data, slug) {
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
        if (!member)
            throw new common_1.NotFoundException('Member not found for this email');
        const validUntil = data.validUntil
            ? new Date(data.validUntil)
            : daysFromNow(loyalty_journey_1.VOUCHER_VALID_DAYS);
        const created = await this.prisma.voucher.create({
            data: {
                restaurantId,
                memberId: member.id,
                type: data.type,
                percentOff: data.percentOff,
                validUntil,
                status: data.status ?? client_1.VoucherStatus.ACTIVE,
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
    async updateVoucher(userId, voucherId, data, slug) {
        await this.assertManager(userId);
        const restaurantId = await this.resolveRestaurantId(userId, slug);
        const voucher = await this.prisma.voucher.findFirst({
            where: { id: voucherId, restaurantId },
        });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher not found');
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
    async deleteVoucher(userId, voucherId, slug) {
        await this.assertManager(userId);
        const restaurantId = await this.resolveRestaurantId(userId, slug);
        const voucher = await this.prisma.voucher.findFirst({
            where: { id: voucherId, restaurantId },
        });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher not found');
        await this.prisma.voucher.delete({ where: { id: voucherId } });
        return { success: true };
    }
    async createCampaign(userId, data, slug) {
        await this.assertManager(userId);
        const restaurantId = await this.resolveRestaurantId(userId, slug);
        const existing = await this.prisma.campaignTemplate.findUnique({
            where: {
                restaurantId_type: { restaurantId, type: data.type },
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`A campaign of type ${data.type} already exists. Edit or delete it first.`);
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
    async updateCampaign(userId, campaignId, data, slug) {
        await this.assertManager(userId);
        const restaurantId = await this.resolveRestaurantId(userId, slug);
        const campaign = await this.prisma.campaignTemplate.findFirst({
            where: { id: campaignId, restaurantId },
        });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        return this.prisma.campaignTemplate.update({
            where: { id: campaignId },
            data: {
                title: data.title?.trim() || undefined,
                bodyTemplate: data.bodyTemplate?.trim() || undefined,
                isEnabled: data.isEnabled,
            },
        });
    }
    async deleteCampaign(userId, campaignId, slug) {
        await this.assertManager(userId);
        const restaurantId = await this.resolveRestaurantId(userId, slug);
        const campaign = await this.prisma.campaignTemplate.findFirst({
            where: { id: campaignId, restaurantId },
        });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        await this.prisma.campaignTemplate.delete({ where: { id: campaignId } });
        return { success: true };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        restaurants_service_1.RestaurantsService,
        loyalty_service_1.LoyaltyService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map