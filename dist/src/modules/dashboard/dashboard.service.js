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
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async stats(restaurantId) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const [totalMembers, activeMembers, lostMembers, birthdayThisMonth, voucherRedemptions, visits, orders, bookings] = await Promise.all([
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
    members(restaurantId) {
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map