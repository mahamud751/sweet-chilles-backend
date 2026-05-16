import { PrismaService } from '../../prisma/prisma.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
export declare class DashboardService {
    private readonly prisma;
    private readonly restaurants;
    constructor(prisma: PrismaService, restaurants: RestaurantsService);
    resolveRestaurantId(userId: string, slug?: string): Promise<string>;
    summary(userId: string, slug?: string): Promise<{
        members: number;
        activeVouchers: number;
        redeemedVouchers: number;
        campaigns: number;
    }>;
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
}
