import { LoyaltyStage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class LoyaltyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    issueWelcomeVoucher(memberId: string, restaurantId: string): Promise<{
        type: import(".prisma/client").$Enums.VoucherType;
        percentOff: number;
        id: string;
        createdAt: Date;
        qrToken: string;
        status: import(".prisma/client").$Enums.VoucherStatus;
        validFrom: Date;
        validUntil: Date;
        redeemedAt: Date | null;
        restaurantId: string;
        memberId: string;
        visitId: string | null;
    }>;
    redeemByQrToken(qrToken: string, staffUserId?: string, billAmount?: number): Promise<({
        vouchers: {
            type: import(".prisma/client").$Enums.VoucherType;
            percentOff: number;
            id: string;
            createdAt: Date;
            qrToken: string;
            status: import(".prisma/client").$Enums.VoucherStatus;
            validFrom: Date;
            validUntil: Date;
            redeemedAt: Date | null;
            restaurantId: string;
            memberId: string;
            visitId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        referralCode: string;
        email: string;
        passwordHash: string;
        phone: string | null;
        avatarUrl: string | null;
        birthday: Date | null;
        loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        isGoldMember: boolean;
        loyaltyVisitsRemaining: number;
        lastVisitAt: Date | null;
    }) | null>;
    memberSummary(member: {
        loyaltyStage: LoyaltyStage;
        isGoldMember: boolean;
        loyaltyVisitsRemaining: number;
    }): {
        stage: import(".prisma/client").$Enums.LoyaltyStage;
        stageLabel: string;
        isGoldMember: boolean;
        loyaltyVisitsRemaining: number;
    };
}
