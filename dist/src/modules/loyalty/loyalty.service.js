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
exports.LoyaltyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const loyalty_journey_1 = require("../../common/loyalty-journey");
let LoyaltyService = class LoyaltyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async issueWelcomeVoucher(memberId, restaurantId) {
        const restaurant = await this.prisma.restaurant.findUniqueOrThrow({
            where: { id: restaurantId },
        });
        const percent = (0, loyalty_journey_1.welcomePercent)(restaurant.welcomeDiscountPercent);
        const validUntil = daysFromNow(loyalty_journey_1.VOUCHER_VALID_DAYS);
        return this.prisma.voucher.create({
            data: {
                restaurantId,
                memberId,
                type: client_1.VoucherType.WELCOME,
                percentOff: percent,
                validUntil,
            },
        });
    }
    async redeemByQrToken(qrToken, staffUserId, billAmount) {
        const voucher = await this.prisma.voucher.findUnique({
            where: { qrToken },
            include: { member: true, restaurant: true },
        });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher not found');
        if (voucher.status !== client_1.VoucherStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Voucher is ${voucher.status.toLowerCase()}`);
        }
        if (voucher.validUntil < new Date()) {
            await this.prisma.voucher.update({
                where: { id: voucher.id },
                data: { status: client_1.VoucherStatus.EXPIRED },
            });
            throw new common_1.BadRequestException('Voucher has expired');
        }
        const discount = billAmount != null
            ? new client_1.Prisma.Decimal(billAmount * (voucher.percentOff / 100))
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
                    status: client_1.VoucherStatus.REDEEMED,
                    redeemedAt: new Date(),
                    visitId: createdVisit.id,
                },
            });
            const member = voucher.member;
            const transition = (0, loyalty_journey_1.nextStageAfterRedeem)(member.loyaltyStage, member.loyaltyVisitsRemaining);
            const memberUpdate = {
                loyaltyStage: transition.stage,
                loyaltyVisitsRemaining: transition.loyaltyVisitsRemaining ?? member.loyaltyVisitsRemaining,
                lastVisitAt: new Date(),
                isGoldMember: transition.stage === client_1.LoyaltyStage.GOLD,
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
            if (transition.stage === client_1.LoyaltyStage.LOYALTY_ACTIVE && member.loyaltyStage === client_1.LoyaltyStage.THIRD_REDEEMED) {
                await tx.memberNotification.create({
                    data: {
                        memberId: member.id,
                        title: 'Loyalty rewards unlocked',
                        body: `Congratulations. You are now in our loyalty rewards stage. For your next ${loyalty_journey_1.LOYALTY_VISITS_COUNT} visits over the next 3 months, enjoy 15% off your food bill.`,
                    },
                });
            }
            if (transition.stage === client_1.LoyaltyStage.GOLD) {
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
                vouchers: { where: { status: client_1.VoucherStatus.ACTIVE }, orderBy: { validUntil: 'asc' } },
            },
        });
    }
    memberSummary(member) {
        return {
            stage: member.loyaltyStage,
            stageLabel: (0, loyalty_journey_1.stageLabel)(member.loyaltyStage, member.isGoldMember),
            isGoldMember: member.isGoldMember,
            loyaltyVisitsRemaining: member.loyaltyVisitsRemaining,
        };
    }
};
exports.LoyaltyService = LoyaltyService;
exports.LoyaltyService = LoyaltyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoyaltyService);
function daysFromNow(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}
function unlockMessage(type, percent) {
    switch (type) {
        case client_1.VoucherType.RETURN:
            return 'Thank you for dining with us. Your next reward has been unlocked. Enjoy 20% off your next visit.';
        case client_1.VoucherType.THIRD:
            return `Your ${percent}% discount for your next visit is ready in your wallet.`;
        case client_1.VoucherType.LOYALTY:
            return `Enjoy ${percent}% off your next visit — loyalty reward unlocked.`;
        case client_1.VoucherType.GOLD:
            return 'Gold Member status unlocked — 10% off every visit.';
        default:
            return `Your ${percent}% voucher is ready.`;
    }
}
//# sourceMappingURL=loyalty.service.js.map