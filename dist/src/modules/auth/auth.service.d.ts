import { LoyaltyService } from '../loyalty/loyalty.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
export declare class AuthService {
    private readonly prisma;
    private readonly restaurants;
    private readonly loyalty;
    constructor(prisma: PrismaService, restaurants: RestaurantsService, loyalty: LoyaltyService);
    registerMember(restaurantSlug: string, data: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        birthday?: string;
        competitionEntryId?: string;
    }): Promise<{
        token: string;
        member: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            birthday: Date | null;
            loyalty: {
                stage: import(".prisma/client").$Enums.LoyaltyStage;
                stageLabel: string;
                isGoldMember: boolean;
                loyaltyVisitsRemaining: number;
            };
            restaurant: {
                slug: string;
                name: string;
                appDisplayName: string;
                primaryColor: string;
            };
            activeVouchers: {
                type: import(".prisma/client").$Enums.VoucherType;
                percentOff: number;
                id: string;
                createdAt: Date;
                qrToken: string;
                status: import(".prisma/client").$Enums.VoucherStatus;
                validFrom: Date;
                validUntil: Date;
                redeemedAt: Date | null;
                restaurantId: string;
                memberId: string;
                visitId: string | null;
            }[];
            notifications: {
                id: string;
                memberId: string;
                title: string;
                body: string;
                read: boolean;
                sentAt: Date;
            }[];
        };
    }>;
    loginMember(restaurantSlug: string, email: string, password: string): Promise<{
        token: string;
        member: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            birthday: Date | null;
            loyalty: {
                stage: import(".prisma/client").$Enums.LoyaltyStage;
                stageLabel: string;
                isGoldMember: boolean;
                loyaltyVisitsRemaining: number;
            };
            restaurant: {
                slug: string;
                name: string;
                appDisplayName: string;
                primaryColor: string;
            };
            activeVouchers: {
                type: import(".prisma/client").$Enums.VoucherType;
                percentOff: number;
                id: string;
                createdAt: Date;
                qrToken: string;
                status: import(".prisma/client").$Enums.VoucherStatus;
                validFrom: Date;
                validUntil: Date;
                redeemedAt: Date | null;
                restaurantId: string;
                memberId: string;
                visitId: string | null;
            }[];
            notifications: {
                id: string;
                memberId: string;
                title: string;
                body: string;
                read: boolean;
                sentAt: Date;
            }[];
        };
    }>;
    loginStaff(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            displayName: string;
            role: import(".prisma/client").$Enums.UserRole;
            restaurantId: string | null;
        };
    }>;
    memberProfile(memberId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        birthday: Date | null;
        loyalty: {
            stage: import(".prisma/client").$Enums.LoyaltyStage;
            stageLabel: string;
            isGoldMember: boolean;
            loyaltyVisitsRemaining: number;
        };
        restaurant: {
            slug: string;
            name: string;
            appDisplayName: string;
            primaryColor: string;
        };
        activeVouchers: {
            type: import(".prisma/client").$Enums.VoucherType;
            percentOff: number;
            id: string;
            createdAt: Date;
            qrToken: string;
            status: import(".prisma/client").$Enums.VoucherStatus;
            validFrom: Date;
            validUntil: Date;
            redeemedAt: Date | null;
            restaurantId: string;
            memberId: string;
            visitId: string | null;
        }[];
        notifications: {
            id: string;
            memberId: string;
            title: string;
            body: string;
            read: boolean;
            sentAt: Date;
        }[];
    }>;
}
