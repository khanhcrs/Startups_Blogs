import { Module } from '@nestjs/common';
import { FundingOpportunitiesService } from './funding-opportunities.service';
import { FundingOpportunitiesController } from './funding-opportunities.controller';

@Module({
  providers: [FundingOpportunitiesService],
  controllers: [FundingOpportunitiesController]
})
export class FundingOpportunitiesModule {}
