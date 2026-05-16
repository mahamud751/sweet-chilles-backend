import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RestaurantsModule,
    AuthModule,
    VouchersModule,
    CompetitionsModule,
    DashboardModule,
    CampaignsModule,
  ],
})
export class AppModule {}
