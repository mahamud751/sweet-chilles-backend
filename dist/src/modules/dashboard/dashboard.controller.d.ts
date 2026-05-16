import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboard;
    constructor(dashboard: DashboardService);
    summary(authHeader: string | undefined, slug?: string): Promise<{
        members: number;
        activeVouchers: number;
        redeemedVouchers: number;
        campaigns: number;
    }>;
    members(authHeader: string | undefined, slug?: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        isGoldMember: boolean;
        joinedAt: Date;
        voucherCount: number;
    }[]>;
    vouchers(authHeader: string | undefined, slug?: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.VoucherType;
        percentOff: number;
        status: import(".prisma/client").$Enums.VoucherStatus;
        validUntil: Date;
        redeemedAt: Date | null;
        qrToken: string;
        memberName: string;
        memberEmail: string;
    }[]>;
    campaigns(authHeader: string | undefined, slug?: string): Promise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }[]>;
}
