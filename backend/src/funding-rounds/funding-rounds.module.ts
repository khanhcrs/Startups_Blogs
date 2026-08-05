import { Module } from '@nestjs/common';
import { FundingRoundsService } from './funding-rounds.service';
import { FundingRoundsController } from './funding-rounds.controller';

@Module({
  providers: [FundingRoundsService],
  controllers: [FundingRoundsController]
})
export class FundingRoundsModule {}
