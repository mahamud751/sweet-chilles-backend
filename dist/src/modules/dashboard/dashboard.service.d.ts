import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    stats(restaurantId: string): Promise<{
        customers: {
            total: number;
            active: number;
            lost: number;
            gold: number;
            birthdayMembers: number;
        };
        revenue: {
            totalBillAmount: number | import("@prisma/client/runtime/library").Decimal;
            totalDiscountGiven: number | import("@prisma/client/runtime/library").Decimal;
            voucherRedemptions: number;
            repeatVisits: number;
            orders: number;
            bookings: number;
        };
        growthTargets: {
            month1to2Members: string;
            month6to8RevenueUplift: string;
        };
    }>;
    members(restaurantId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        isGoldMember: boolean;
        lastVisitAt: Date | null;
    }[]>;
}
