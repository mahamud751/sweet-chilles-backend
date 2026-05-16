import { Controller, Get, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { verifyToken } from '../../common/auth.util';
import { CampaignsService } from './campaigns.service';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaigns: CampaignsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'AI engagement templates (birthday, inactive, quiet day, seasonal)' })
  list(@Headers('authorization') authHeader?: string) {
    const restaurantId = this.restaurantId(authHeader);
    return this.campaigns.list(restaurantId);
  }

  @Post('run/birthday')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger birthday messages for today' })
  runBirthday(@Headers('authorization') authHeader?: string) {
    const restaurantId = this.restaurantId(authHeader);
    return this.campaigns.runBirthdayCampaign(restaurantId);
  }

  @Post('restaurants/:restaurantId/seed-templates')
  @ApiOperation({ summary: 'Install default campaign templates for a restaurant' })
  seed(@Param('restaurantId') restaurantId: string) {
    return this.campaigns.ensureDefaults(restaurantId);
  }

  private restaurantId(authHeader?: string): string {
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException();
    const payload = verifyToken(authHeader.slice(7));
    if (!payload.restaurantId) throw new UnauthorizedException();
    return payload.restaurantId;
  }
}
