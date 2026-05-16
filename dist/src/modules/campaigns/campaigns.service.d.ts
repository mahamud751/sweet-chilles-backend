import { PrismaService } from '../../prisma/prisma.service';
export declare class CampaignsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    ensureDefaults(restaurantId: string): Promise<void>;
    list(restaurantId: string): import(".prisma/client").Prisma.PrismaPromise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }[]>;
    runBirthdayCampaign(restaurantId: string): Promise<{
        sent: number;
    }>;
}
