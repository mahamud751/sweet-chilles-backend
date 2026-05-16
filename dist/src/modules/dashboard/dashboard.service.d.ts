import { CampaignType, VoucherStatus, VoucherType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
export declare class DashboardService {
    private readonly prisma;
    private readonly restaurants;
    private readonly loyalty;
    constructor(prisma: PrismaService, restaurants: RestaurantsService, loyalty: LoyaltyService);
    resolveRestaurantId(userId: string, slug?: string): Promise<string>;
    summary(userId: string, slug?: string): Promise<{
        members: number;
        activeVouchers: number;
        redeemedVouchers: number;
        campaigns: number;
    }>;
    searchMembers(userId: string, query: string, slug?: string): Promise<{
        id: string;
        name: string;
        email: string;
    }[]>;
    listMembers(userId: string, slug?: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        isGoldMember: boolean;
        joinedAt: Date;
        voucherCount: number;
    }[]>;
    listVouchers(userId: string, slug?: string): Promise<{
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
    listCampaigns(userId: string, slug?: string): Promise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }[]>;
    private assertManager;
    private memberInRestaurant;
    updateMember(userId: string, memberId: string, data: {
        name?: string;
        email?: string;
        phone?: string;
    }, slug?: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        isGoldMember: boolean;
        joinedAt: Date;
        voucherCount: number;
    }>;
    createMember(userId: string, data: {
        name: string;
        email: string;
        phone?: string;
        password: string;
        issueWelcomeVoucher?: boolean;
    }, slug?: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        isGoldMember: boolean;
        joinedAt: Date;
        voucherCount: number;
    }>;
    deleteMember(userId: string, memberId: string, slug?: string): Promise<{
        success: boolean;
    }>;
    createVoucher(userId: string, data: {
        memberEmail: string;
        type: VoucherType;
        percentOff: number;
        validUntil?: string;
        status?: VoucherStatus;
    }, slug?: string): Promise<{
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
    updateVoucher(userId: string, voucherId: string, data: {
        percentOff?: number;
        status?: VoucherStatus;
        validUntil?: string;
    }, slug?: string): Promise<{
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
    deleteVoucher(userId: string, voucherId: string, slug?: string): Promise<{
        success: boolean;
    }>;
    createCampaign(userId: string, data: {
        type: CampaignType;
        title: string;
        bodyTemplate: string;
        isEnabled?: boolean;
    }, slug?: string): Promise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }>;
    updateCampaign(userId: string, campaignId: string, data: {
        title?: string;
        bodyTemplate?: string;
        isEnabled?: boolean;
    }, slug?: string): Promise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }>;
    deleteCampaign(userId: string, campaignId: string, slug?: string): Promise<{
        success: boolean;
    }>;
}
