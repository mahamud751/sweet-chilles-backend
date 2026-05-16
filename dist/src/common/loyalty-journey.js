"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOUCHER_VALID_DAYS = exports.LOYALTY_VISITS_MONTHS = exports.LOYALTY_VISITS_COUNT = void 0;
exports.welcomePercent = welcomePercent;
exports.nextStageAfterRedeem = nextStageAfterRedeem;
exports.stageLabel = stageLabel;
const client_1 = require("@prisma/client");
exports.LOYALTY_VISITS_COUNT = 5;
exports.LOYALTY_VISITS_MONTHS = 3;
exports.VOUCHER_VALID_DAYS = 30;
function welcomePercent(restaurantWelcomePercent) {
    return restaurantWelcomePercent === 20 ? 20 : 30;
}
function nextStageAfterRedeem(current, loyaltyVisitsRemaining) {
    switch (current) {
        case client_1.LoyaltyStage.REGISTERED:
            return {
                stage: client_1.LoyaltyStage.WELCOME_REDEEMED,
                nextVoucher: { type: client_1.VoucherType.RETURN, percentOff: 20, validDays: exports.VOUCHER_VALID_DAYS },
            };
        case client_1.LoyaltyStage.WELCOME_REDEEMED:
            return {
                stage: client_1.LoyaltyStage.RETURN_REDEEMED,
                nextVoucher: { type: client_1.VoucherType.THIRD, percentOff: 15, validDays: exports.VOUCHER_VALID_DAYS },
            };
        case client_1.LoyaltyStage.RETURN_REDEEMED:
            return {
                stage: client_1.LoyaltyStage.THIRD_REDEEMED,
                loyaltyVisitsRemaining: exports.LOYALTY_VISITS_COUNT,
                nextVoucher: {
                    type: client_1.VoucherType.LOYALTY,
                    percentOff: 15,
                    validDays: exports.LOYALTY_VISITS_MONTHS * 30,
                },
            };
        case client_1.LoyaltyStage.THIRD_REDEEMED:
        case client_1.LoyaltyStage.LOYALTY_ACTIVE: {
            const remaining = loyaltyVisitsRemaining - 1;
            if (remaining <= 0) {
                return {
                    stage: client_1.LoyaltyStage.GOLD,
                    loyaltyVisitsRemaining: 0,
                    nextVoucher: { type: client_1.VoucherType.GOLD, percentOff: 10, validDays: 3650 },
                };
            }
            return {
                stage: client_1.LoyaltyStage.LOYALTY_ACTIVE,
                loyaltyVisitsRemaining: remaining,
                nextVoucher: {
                    type: client_1.VoucherType.LOYALTY,
                    percentOff: 15,
                    validDays: exports.LOYALTY_VISITS_MONTHS * 30,
                },
            };
        }
        default:
            return { stage: current, loyaltyVisitsRemaining };
    }
}
function stageLabel(stage, isGold) {
    if (isGold)
        return 'Gold Member';
    switch (stage) {
        case client_1.LoyaltyStage.REGISTERED:
            return 'New Member';
        case client_1.LoyaltyStage.WELCOME_REDEEMED:
            return 'Welcome redeemed';
        case client_1.LoyaltyStage.RETURN_REDEEMED:
            return 'Return visit complete';
        case client_1.LoyaltyStage.THIRD_REDEEMED:
            return 'Third visit complete';
        case client_1.LoyaltyStage.LOYALTY_ACTIVE:
            return 'Loyalty rewards';
        case client_1.LoyaltyStage.GOLD:
            return 'Gold Member';
        default:
            return stage;
    }
}
//# sourceMappingURL=loyalty-journey.js.map