import { Module } from '@nestjs/common';
import { FundingOpportunitiesController } from './funding-opportunities.controller';
import { FundingOpportunitiesService } from './funding-opportunities.service';

@Module({ controllers: [FundingOpportunitiesController], providers: [FundingOpportunitiesService] })
export class FundingOpportunitiesModule {}
