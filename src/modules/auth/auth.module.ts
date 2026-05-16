import { Module } from '@nestjs/common';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [RestaurantsModule, LoyaltyModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
