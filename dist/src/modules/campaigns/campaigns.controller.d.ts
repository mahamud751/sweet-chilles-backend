import { CampaignsService } from './campaigns.service';
export declare class CampaignsController {
    private readonly campaigns;
    constructor(campaigns: CampaignsService);
    list(authHeader?: string): import(".prisma/client").Prisma.PrismaPromise<{
        type: import(".prisma/client").$Enums.CampaignType;
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        bodyTemplate: string;
        isEnabled: boolean;
    }[]>;
    runBirthday(authHeader?: string): Promise<{
        sent: number;
    }>;
    seed(restaurantId: string): Promise<void>;
    private restaurantId;
}
