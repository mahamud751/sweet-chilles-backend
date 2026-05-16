import { RestaurantsService } from './restaurants.service';
export declare class RestaurantsController {
    private readonly restaurants;
    constructor(restaurants: RestaurantsService);
    list(): import(".prisma/client").Prisma.PrismaPromise<{
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
    branding(slug: string): Promise<{
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
    campaigns(slug: string): Promise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }[]>;
}
