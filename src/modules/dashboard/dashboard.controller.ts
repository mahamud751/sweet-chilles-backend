import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { staffPayloadFromHeader } from '../../common/staff-auth.util';
import {
  CreateDashboardCampaignDto,
  CreateDashboardMemberDto,
  CreateDashboardVoucherDto,
  UpdateDashboardCampaignDto,
  UpdateDashboardMemberDto,
  UpdateDashboardVoucherDto,
} from './dto/dashboard.dto';
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
    @Query('q') q?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    if (q?.trim()) {
      return this.dashboard.searchMembers(sub, q.trim(), slug);
    }
    return this.dashboard.listMembers(sub, slug);
  }

  @Post('members')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a member (owner/admin)' })
  createMember(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: CreateDashboardMemberDto,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.createMember(sub, body, slug);
  }

  @Patch('members/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a member (owner/admin)' })
  updateMember(
    @Headers('authorization') authHeader: string | undefined,
    @Param('id') id: string,
    @Body() body: UpdateDashboardMemberDto,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.updateMember(sub, id, body, slug);
  }

  @Delete('members/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a member (owner/admin)' })
  deleteMember(
    @Headers('authorization') authHeader: string | undefined,
    @Param('id') id: string,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.deleteMember(sub, id, slug);
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

  @Post('vouchers')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a voucher for a member (owner/admin)' })
  createVoucher(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: CreateDashboardVoucherDto,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.createVoucher(sub, body, slug);
  }

  @Patch('vouchers/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a voucher (owner/admin)' })
  updateVoucher(
    @Headers('authorization') authHeader: string | undefined,
    @Param('id') id: string,
    @Body() body: UpdateDashboardVoucherDto,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.updateVoucher(sub, id, body, slug);
  }

  @Delete('vouchers/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a voucher (owner/admin)' })
  deleteVoucher(
    @Headers('authorization') authHeader: string | undefined,
    @Param('id') id: string,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.deleteVoucher(sub, id, slug);
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

  @Post('campaigns')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a campaign template (owner/admin)' })
  createCampaign(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: CreateDashboardCampaignDto,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.createCampaign(sub, body, slug);
  }

  @Patch('campaigns/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a campaign (owner/admin)' })
  updateCampaign(
    @Headers('authorization') authHeader: string | undefined,
    @Param('id') id: string,
    @Body() body: UpdateDashboardCampaignDto,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.updateCampaign(sub, id, body, slug);
  }

  @Delete('campaigns/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a campaign (owner/admin)' })
  deleteCampaign(
    @Headers('authorization') authHeader: string | undefined,
    @Param('id') id: string,
    @Query('slug') slug?: string,
  ) {
    const { sub } = staffPayloadFromHeader(authHeader);
    return this.dashboard.deleteCampaign(sub, id, slug);
  }
}
