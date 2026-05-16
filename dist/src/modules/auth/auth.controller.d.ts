import { MemberLoginDto, MemberRegisterDto, StaffLoginDto } from './dto/login.dto';
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
    login(slug: string, body: MemberLoginDto): Promise<{
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
    staffLogin(body: StaffLoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            displayName: string;
            role: import(".prisma/client").$Enums.UserRole;
            restaurantId: string | null;
        };
    }>;
    me(authHeader?: string): Promise<{
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
    private memberIdFromHeader;
}
