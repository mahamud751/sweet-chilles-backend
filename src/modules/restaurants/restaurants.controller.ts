import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RestaurantBrandingDto } from './dto/restaurant-branding.dto';
import { RestaurantsService } from './restaurants.service';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurants: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active restaurant tenants' })
  list() {
    return this.restaurants.listActive();
  }

  @Get(':slug/branding')
  @ApiOperation({ summary: 'White-label branding for mobile app' })
  @ApiOkResponse({ type: RestaurantBrandingDto })
  branding(@Param('slug') slug: string) {
    return this.restaurants.getBranding(slug);
  }

  @Get(':slug/campaigns')
  @ApiOperation({ summary: 'Engagement campaigns for mobile app (birthday, seasonal, etc.)' })
  campaigns(@Param('slug') slug: string) {
    return this.restaurants.listCampaigns(slug);
  }
}
