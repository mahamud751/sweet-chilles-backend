import { LoyaltyService } from '../loyalty/loyalty.service';
import { PrismaService } from '../../prisma/prisma.service';
declare class RedeemDto {
    qrToken: string;
    billAmount?: number;
}
export declare class VouchersController {
    private readonly loyalty;
    private readonly prisma;
    constructor(loyalty: LoyaltyService, prisma: PrismaService);
    wallet(authHeader?: string): Promise<{
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
    }[]>;
    redeem(authHeader: string | undefined, body: RedeemDto): Promise<({
        vouchers: {
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
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        referralCode: string;
        email: string;
        passwordHash: string;
        phone: string | null;
        birthday: Date | null;
        loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        isGoldMember: boolean;
        loyaltyVisitsRemaining: number;
        lastVisitAt: Date | null;
    }) | null>;
    lookup(qrToken: string): import(".prisma/client").Prisma.Prisma__VoucherClient<({
        member: {
            name: string;
            email: string;
            loyaltyStage: import(".prisma/client").$Enums.LoyaltyStage;
        };
    } & {
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    private memberId;
    private staffIdOptional;
    private parseToken;
}
export {};
