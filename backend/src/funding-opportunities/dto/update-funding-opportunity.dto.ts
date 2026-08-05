import { PartialType } from '@nestjs/mapped-types';
import { CreateFundingOpportunityDto } from './create-funding-opportunity.dto';

export class UpdateFundingOpportunityDto extends PartialType(CreateFundingOpportunityDto) {}
