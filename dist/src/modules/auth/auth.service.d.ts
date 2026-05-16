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
            avatarUrl: string | null;
            birthday: Date | null;
            referralCode: string;
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
    loginUnified(restaurantSlug: string, email: string, password: string): Promise<{
        accountType: "member";
        token: string;
        member: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            avatarUrl: string | null;
            birthday: Date | null;
            referralCode: string;
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
        staff?: undefined;
    } | {
        accountType: "staff";
        token: string;
        staff: {
            id: string;
            email: string;
            displayName: string;
            role: import(".prisma/client").$Enums.UserRole;
            restaurantId: string | null;
            restaurant: {
                slug: string;
                name: string;
                appDisplayName: string;
                primaryColor: string;
            } | null;
        };
        member?: undefined;
    }>;
    loginMember(restaurantSlug: string, email: string, password: string): Promise<{
        token: string;
        member: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            avatarUrl: string | null;
            birthday: Date | null;
            referralCode: string;
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
            restaurant: {
                slug: string;
                name: string;
                appDisplayName: string;
                primaryColor: string;
            } | null;
        };
    }>;
    staffProfile(userId: string): Promise<{
        id: string;
        email: string;
        displayName: string;
        role: import(".prisma/client").$Enums.UserRole;
        restaurantId: string | null;
        restaurant: {
            slug: string;
            name: string;
            appDisplayName: string;
            primaryColor: string;
        } | null;
    }>;
    updateStaffProfile(userId: string, data: {
        displayName?: string;
        email?: string;
    }): Promise<{
        id: string;
        email: string;
        displayName: string;
        role: import(".prisma/client").$Enums.UserRole;
        restaurantId: string | null;
        restaurant: {
            slug: string;
            name: string;
            appDisplayName: string;
            primaryColor: string;
        } | null;
    }>;
    changeStaffPassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    memberProfile(memberId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        birthday: Date | null;
        referralCode: string;
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
    updateMemberProfile(memberId: string, data: {
        name?: string;
        email?: string;
        phone?: string;
        birthday?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        birthday: Date | null;
        referralCode: string;
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
    changeMemberPassword(memberId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    createBooking(memberId: string, data: {
        partySize: number;
        bookedFor: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        restaurantId: string;
        memberId: string;
        partySize: number;
        bookedFor: Date;
    }>;
    updateMemberAvatar(memberId: string, filename: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        birthday: Date | null;
        referralCode: string;
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
