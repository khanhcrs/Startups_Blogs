import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateFundingOpportunityDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  shortDescription!: string;

  @IsString()
  @IsOptional()
  detailedOverview?: string;

  @IsNumber()
  @IsNotEmpty()
  fundingAmountMin!: number;

  @IsNumber()
  @IsNotEmpty()
  fundingAmountMax!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  fundingPurpose!: string;

  @IsString()
  @IsNotEmpty()
  fundingType!: string;

  @IsString()
  @IsOptional()
  status?: string; // Draft, Pending Review, Published

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;
}
