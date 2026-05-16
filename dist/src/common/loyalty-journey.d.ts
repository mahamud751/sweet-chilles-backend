import { LoyaltyStage, VoucherType } from '@prisma/client';
export declare const LOYALTY_VISITS_COUNT = 5;
export declare const LOYALTY_VISITS_MONTHS = 3;
export declare const VOUCHER_VALID_DAYS = 30;
export type NextVoucherSpec = {
    type: VoucherType;
    percentOff: number;
    validDays: number;
};
export declare function welcomePercent(restaurantWelcomePercent: number): number;
export declare function nextStageAfterRedeem(current: LoyaltyStage, loyaltyVisitsRemaining: number): {
    stage: LoyaltyStage;
    nextVoucher?: NextVoucherSpec;
    loyaltyVisitsRemaining?: number;
};
export declare function stageLabel(stage: LoyaltyStage, isGold: boolean): string;
