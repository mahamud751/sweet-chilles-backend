import { Module } from '@nestjs/common';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { VouchersController } from './vouchers.controller';

@Module({
  imports: [LoyaltyModule],
  controllers: [VouchersController],
})
export class VouchersModule {}
