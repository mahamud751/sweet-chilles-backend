import { CreateDashboardCampaignDto, CreateDashboardMemberDto, CreateDashboardVoucherDto, UpdateDashboardCampaignDto, UpdateDashboardMemberDto, UpdateDashboardVoucherDto } from './dto/dashboard.dto';
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
    members(authHeader: string | undefined, slug?: string, q?: string): Promise<{
        id: string;
        name: string;
        email: string;
    }[]>;
    createMember(authHeader: string | undefined, body: CreateDashboardMemberDto, slug?: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        isGoldMember: boolean;
        joinedAt: Date;
        voucherCount: number;
    }>;
    updateMember(authHeader: string | undefined, id: string, body: UpdateDashboardMemberDto, slug?: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        isGoldMember: boolean;
        joinedAt: Date;
        voucherCount: number;
    }>;
    deleteMember(authHeader: string | undefined, id: string, slug?: string): Promise<{
        success: boolean;
    }>;
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
    createVoucher(authHeader: string | undefined, body: CreateDashboardVoucherDto, slug?: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.VoucherType;
        percentOff: number;
        status: import(".prisma/client").$Enums.VoucherStatus;
        validUntil: Date;
        redeemedAt: Date | null;
        qrToken: string;
        memberName: string;
        memberEmail: string;
    }>;
    updateVoucher(authHeader: string | undefined, id: string, body: UpdateDashboardVoucherDto, slug?: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.VoucherType;
        percentOff: number;
        status: import(".prisma/client").$Enums.VoucherStatus;
        validUntil: Date;
        redeemedAt: Date | null;
        qrToken: string;
        memberName: string;
        memberEmail: string;
    }>;
    deleteVoucher(authHeader: string | undefined, id: string, slug?: string): Promise<{
        success: boolean;
    }>;
    campaigns(authHeader: string | undefined, slug?: string): Promise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }[]>;
    createCampaign(authHeader: string | undefined, body: CreateDashboardCampaignDto, slug?: string): Promise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }>;
    updateCampaign(authHeader: string | undefined, id: string, body: UpdateDashboardCampaignDto, slug?: string): Promise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }>;
    deleteCampaign(authHeader: string | undefined, id: string, slug?: string): Promise<{
        success: boolean;
    }>;
}
