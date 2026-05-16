import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { CampaignType, VoucherStatus, VoucherType } from '@prisma/client';

export class UpdateDashboardMemberDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateDashboardVoucherDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  percentOff?: number;

  @ApiProperty({ required: false, enum: VoucherStatus })
  @IsOptional()
  @IsEnum(VoucherStatus)
  status?: VoucherStatus;

  @ApiProperty({ required: false, example: '2026-12-31' })
  @IsOptional()
  @IsString()
  validUntil?: string;
}

export class UpdateDashboardCampaignDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bodyTemplate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

export class CreateDashboardMemberDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Welcome123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  issueWelcomeVoucher?: boolean;
}

export class CreateDashboardVoucherDto {
  @ApiProperty({ description: 'Member email at this restaurant' })
  @IsEmail()
  memberEmail!: string;

  @ApiProperty({ enum: VoucherType })
  @IsEnum(VoucherType)
  type!: VoucherType;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(100)
  percentOff!: number;

  @ApiProperty({ required: false, example: '2026-12-31' })
  @IsOptional()
  @IsString()
  validUntil?: string;

  @ApiProperty({ required: false, enum: VoucherStatus })
  @IsOptional()
  @IsEnum(VoucherStatus)
  status?: VoucherStatus;
}

export class CreateDashboardCampaignDto {
  @ApiProperty({ enum: CampaignType })
  @IsEnum(CampaignType)
  type!: CampaignType;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  bodyTemplate!: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
