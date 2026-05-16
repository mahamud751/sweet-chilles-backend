import { PrismaService } from '../../prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
export declare class RestaurantsService {
    private readonly prisma;
    private readonly campaigns;
    constructor(prisma: PrismaService, campaigns: CampaignsService);
    findBySlug(slug: string): import(".prisma/client").Prisma.Prisma__RestaurantClient<{
        id: string;
        slug: string;
        name: string;
        appDisplayName: string;
        tagline: string | null;
        primaryColor: string;
        logoUrl: string | null;
        welcomeDiscountPercent: number;
        foodOnlyExcludesDrinks: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    getBranding(slug: string): Promise<{
        id: string;
        slug: string;
        name: string;
        appDisplayName: string;
        tagline: string | null;
        primaryColor: string;
        logoUrl: string | null;
        welcomeDiscountPercent: number;
        foodOnlyExcludesDrinks: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listActive(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        slug: string;
        name: string;
        appDisplayName: string;
        tagline: string | null;
        primaryColor: string;
        logoUrl: string | null;
        welcomeDiscountPercent: number;
        foodOnlyExcludesDrinks: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    listCampaigns(slug: string): Promise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }[]>;
}
