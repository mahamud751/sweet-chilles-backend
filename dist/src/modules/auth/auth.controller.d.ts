import { MemberLoginDto, MemberRegisterDto, StaffLoginDto } from './dto/login.dto';
import { ChangeMemberPasswordDto, UpdateMemberProfileDto } from './dto/update-profile.dto';
import { ChangeStaffPasswordDto, UpdateStaffProfileDto } from './dto/update-staff-profile.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(slug: string, body: MemberRegisterDto): Promise<{
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
    unifiedLogin(slug: string, body: MemberLoginDto): Promise<{
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
    login(slug: string, body: MemberLoginDto): Promise<{
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
    staffLogin(body: StaffLoginDto): Promise<{
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
    me(authHeader?: string): Promise<{
        accountType: "member";
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
    updateStaffMe(authHeader: string | undefined, body: UpdateStaffProfileDto): Promise<{
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
    changeStaffPassword(authHeader: string | undefined, body: ChangeStaffPasswordDto): Promise<{
        success: boolean;
    }>;
    updateMe(authHeader: string | undefined, body: UpdateMemberProfileDto): Promise<{
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
    changePassword(authHeader: string | undefined, body: ChangeMemberPasswordDto): Promise<{
        success: boolean;
    }>;
    createBooking(authHeader: string | undefined, body: CreateBookingDto): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        restaurantId: string;
        memberId: string;
        partySize: number;
        bookedFor: Date;
    }>;
    uploadAvatar(authHeader: string | undefined, file: Express.Multer.File): Promise<{
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
    private memberIdFromHeader;
    private payloadFromHeader;
}
