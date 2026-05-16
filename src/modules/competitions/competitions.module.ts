import { Module } from '@nestjs/common';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';

@Module({
  imports: [RestaurantsModule, LoyaltyModule],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
})
export class CompetitionsModule {}
