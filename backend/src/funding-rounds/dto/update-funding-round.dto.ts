import { PartialType } from '@nestjs/mapped-types';
import { CreateFundingRoundDto } from './create-funding-round.dto';

export class UpdateFundingRoundDto extends PartialType(CreateFundingRoundDto) {}
