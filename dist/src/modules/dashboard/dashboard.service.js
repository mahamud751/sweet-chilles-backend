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
const prisma_service_1 = require("../../prisma/prisma.service");
const restaurants_service_1 = require("../restaurants/restaurants.service");
let DashboardService = class DashboardService {
    constructor(prisma, restaurants) {
        this.prisma = prisma;
        this.restaurants = restaurants;
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        restaurants_service_1.RestaurantsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map