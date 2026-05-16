import { CampaignType, VoucherStatus, VoucherType } from '@prisma/client';
export declare class UpdateDashboardMemberDto {
    name?: string;
    email?: string;
    phone?: string;
}
export declare class UpdateDashboardVoucherDto {
    percentOff?: number;
    status?: VoucherStatus;
    validUntil?: string;
}
export declare class UpdateDashboardCampaignDto {
    title?: string;
    bodyTemplate?: string;
    isEnabled?: boolean;
}
export declare class CreateDashboardMemberDto {
    name: string;
    email: string;
    phone?: string;
    password: string;
    issueWelcomeVoucher?: boolean;
}
export declare class CreateDashboardVoucherDto {
    memberEmail: string;
    type: VoucherType;
    percentOff: number;
    validUntil?: string;
    status?: VoucherStatus;
}
export declare class CreateDashboardCampaignDto {
    type: CampaignType;
    title: string;
    bodyTemplate: string;
    isEnabled?: boolean;
}
