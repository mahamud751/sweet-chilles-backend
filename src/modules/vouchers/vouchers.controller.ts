import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { verifyToken } from '../../common/auth.util';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { PrismaService } from '../../prisma/prisma.service';

class RedeemDto {
  @IsString()
  qrToken!: string;

  @IsOptional()
  @IsNumber()
  billAmount?: number;
}

@ApiTags('Vouchers')
@Controller('vouchers')
export class VouchersController {
  constructor(
    private readonly loyalty: LoyaltyService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('wallet')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Active vouchers in member wallet' })
  async wallet(@Headers('authorization') authHeader?: string) {
    const memberId = this.memberId(authHeader);
    return this.prisma.voucher.findMany({
      where: { memberId, status: 'ACTIVE' },
      orderBy: { validUntil: 'asc' },
    });
  }

  @Post('redeem')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Staff scans QR — redeem voucher and advance loyalty journey' })
  redeem(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: RedeemDto,
  ) {
    const staffId = this.staffIdOptional(authHeader);
    return this.loyalty.redeemByQrToken(body.qrToken, staffId, body.billAmount);
  }

  @Get('lookup/:qrToken')
  @ApiOperation({ summary: 'Preview voucher before scan (staff)' })
  lookup(@Param('qrToken') qrToken: string) {
    return this.prisma.voucher.findUnique({
      where: { qrToken },
      include: { member: { select: { name: true, email: true, loyaltyStage: true } } },
    });
  }

  private memberId(authHeader?: string): string {
    const payload = this.parseToken(authHeader);
    if (payload.type !== 'member') throw new UnauthorizedException();
    return payload.sub;
  }

  private staffIdOptional(authHeader?: string): string | undefined {
    if (!authHeader) return undefined;
    const payload = this.parseToken(authHeader);
    if (payload.type === 'staff') return payload.sub;
    return undefined;
  }

  private parseToken(authHeader?: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    return verifyToken(authHeader.slice(7));
  }
}
