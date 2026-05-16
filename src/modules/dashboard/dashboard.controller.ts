import { Controller, Get, Headers, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { staffPayloadFromHeader } from '../../common/staff-auth.util';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('summary')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Counts for owner/admin dashboard' })
  summary(
    @Headers('authorization') authHeader: string | undefined,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.summary(sub, slug);
  }

  @Get('members')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'All loyalty members for this restaurant' })
  members(
    @Headers('authorization') authHeader: string | undefined,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.listMembers(sub, slug);
  }

  @Get('vouchers')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'All vouchers/rewards for this restaurant' })
  vouchers(
    @Headers('authorization') authHeader: string | undefined,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.listVouchers(sub, slug);
  }

  @Get('campaigns')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Campaign templates / offers' })
  campaigns(
    @Headers('authorization') authHeader: string | undefined,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.listCampaigns(sub, slug);
  }
}
