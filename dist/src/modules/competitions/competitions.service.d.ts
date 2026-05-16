import { PrismaService } from '../../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
export declare class CompetitionsService {
    private readonly prisma;
    private readonly loyalty;
    constructor(prisma: PrismaService, loyalty: LoyaltyService);
    listForRestaurant(restaurantId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CompetitionStatus;
        restaurantId: string;
        title: string;
        prizeDescription: string;
        platforms: string[];
        entryMechanics: string;
        targetEntries: number;
        startsAt: Date | null;
        endsAt: Date | null;
        winnerMemberId: string | null;
    }[]>;
    getActive(restaurantSlug: string): import(".prisma/client").Prisma.Prisma__CompetitionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CompetitionStatus;
        restaurantId: string;
        title: string;
        prizeDescription: string;
        platforms: string[];
        entryMechanics: string;
        targetEntries: number;
        startsAt: Date | null;
        endsAt: Date | null;
        winnerMemberId: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    announceWinner(competitionId: string, winnerMemberId: string): Promise<{
        competitionId: string;
        winnerMemberId: string;
        participantsToMessage: number;
        messengerTemplate: string;
    }>;
    grantParticipantVoucher(competitionEntryId: string, memberId: string): Promise<{
        competition: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CompetitionStatus;
            restaurantId: string;
            title: string;
            prizeDescription: string;
            platforms: string[];
            entryMechanics: string;
            targetEntries: number;
            startsAt: Date | null;
            endsAt: Date | null;
            winnerMemberId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        memberId: string | null;
        externalHandle: string | null;
        messengerSent: boolean;
        voucherGranted: boolean;
        competitionId: string;
    }>;
}
