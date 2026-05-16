import { RestaurantsService } from '../restaurants/restaurants.service';
import { CompetitionsService } from './competitions.service';
declare class AnnounceWinnerDto {
    winnerMemberId: string;
}
export declare class CompetitionsController {
    private readonly competitions;
    private readonly restaurants;
    constructor(competitions: CompetitionsService, restaurants: RestaurantsService);
    active(slug: string): Promise<{
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
    } | null>;
    list(slug: string): Promise<{
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
    announce(id: string, body: AnnounceWinnerDto): Promise<{
        competitionId: string;
        winnerMemberId: string;
        participantsToMessage: number;
        messengerTemplate: string;
    }>;
}
export {};
