import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [RestaurantsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
