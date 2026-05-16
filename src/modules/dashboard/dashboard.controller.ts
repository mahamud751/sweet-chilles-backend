import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { verifyToken } from '../../common/auth.util';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Owner dashboard — members, revenue, redemptions' })
  stats(@Headers('authorization') authHeader?: string) {
    const restaurantId = this.restaurantId(authHeader);
    return this.dashboard.stats(restaurantId);
  }

  @Get('members')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Member list for restaurant CRM' })
  members(@Headers('authorization') authHeader?: string) {
    const restaurantId = this.restaurantId(authHeader);
    return this.dashboard.members(restaurantId);
  }

  private restaurantId(authHeader?: string): string {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }
    const payload = verifyToken(authHeader.slice(7));
    if (payload.type !== 'staff' || !payload.restaurantId) {
      throw new UnauthorizedException('Staff access required');
    }
    return payload.restaurantId;
  }
}
