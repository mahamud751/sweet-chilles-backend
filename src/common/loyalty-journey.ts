import { LoyaltyStage, VoucherType } from '@prisma/client';

export const LOYALTY_VISITS_COUNT = 5;
export const LOYALTY_VISITS_MONTHS = 3;
export const VOUCHER_VALID_DAYS = 30;

export type NextVoucherSpec = {
  type: VoucherType;
  percentOff: number;
  validDays: number;
};

export function welcomePercent(restaurantWelcomePercent: number): number {
  return restaurantWelcomePercent === 20 ? 20 : 30;
}

export function nextStageAfterRedeem(
  current: LoyaltyStage,
  loyaltyVisitsRemaining: number,
): { stage: LoyaltyStage; nextVoucher?: NextVoucherSpec; loyaltyVisitsRemaining?: number } {
  switch (current) {
    case LoyaltyStage.REGISTERED:
      return {
        stage: LoyaltyStage.WELCOME_REDEEMED,
        nextVoucher: { type: VoucherType.RETURN, percentOff: 20, validDays: VOUCHER_VALID_DAYS },
      };
    case LoyaltyStage.WELCOME_REDEEMED:
      return {
        stage: LoyaltyStage.RETURN_REDEEMED,
        nextVoucher: { type: VoucherType.THIRD, percentOff: 15, validDays: VOUCHER_VALID_DAYS },
      };
    case LoyaltyStage.RETURN_REDEEMED:
      return {
        stage: LoyaltyStage.THIRD_REDEEMED,
        loyaltyVisitsRemaining: LOYALTY_VISITS_COUNT,
        nextVoucher: {
          type: VoucherType.LOYALTY,
          percentOff: 15,
          validDays: LOYALTY_VISITS_MONTHS * 30,
        },
      };
    case LoyaltyStage.THIRD_REDEEMED:
    case LoyaltyStage.LOYALTY_ACTIVE: {
      const remaining = loyaltyVisitsRemaining - 1;
      if (remaining <= 0) {
        return {
          stage: LoyaltyStage.GOLD,
          loyaltyVisitsRemaining: 0,
          nextVoucher: { type: VoucherType.GOLD, percentOff: 10, validDays: 3650 },
        };
      }
      return {
        stage: LoyaltyStage.LOYALTY_ACTIVE,
        loyaltyVisitsRemaining: remaining,
        nextVoucher: {
          type: VoucherType.LOYALTY,
          percentOff: 15,
          validDays: LOYALTY_VISITS_MONTHS * 30,
        },
      };
    }
    default:
      return { stage: current, loyaltyVisitsRemaining };
  }
}

export function stageLabel(stage: LoyaltyStage, isGold: boolean): string {
  if (isGold) return 'Gold Member';
  switch (stage) {
    case LoyaltyStage.REGISTERED:
      return 'New Member';
    case LoyaltyStage.WELCOME_REDEEMED:
      return 'Welcome redeemed';
    case LoyaltyStage.RETURN_REDEEMED:
      return 'Return visit complete';
    case LoyaltyStage.THIRD_REDEEMED:
      return 'Third visit complete';
    case LoyaltyStage.LOYALTY_ACTIVE:
      return 'Loyalty rewards';
    case LoyaltyStage.GOLD:
      return 'Gold Member';
    default:
      return stage;
  }
}
