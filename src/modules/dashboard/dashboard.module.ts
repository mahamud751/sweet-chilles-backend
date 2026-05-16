import { Module } from '@nestjs/common';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [RestaurantsModule, LoyaltyModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
