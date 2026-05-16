import { PrismaService } from '../../prisma/prisma.service';
export declare class RestaurantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
}
