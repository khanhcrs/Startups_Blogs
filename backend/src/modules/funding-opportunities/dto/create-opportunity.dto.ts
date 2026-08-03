import { IsArray, IsISO4217CurrencyCode, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class CreateOpportunityDto {
  @IsString() @Length(3, 180) title: string;
  @IsOptional() @IsString() @Length(10, 500) shortDescription?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() useOfFunds?: string;
  @IsOptional() @IsString() fundingPurpose?: string;
  @IsOptional() @IsNumberString() fundingAmountMin?: string;
  @IsOptional() @IsNumberString() fundingAmountMax?: string;
  @IsOptional() @IsISO4217CurrencyCode() currency?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) fundingTypeIds?: string[];
}
