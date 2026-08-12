import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  legalName?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  detailedOverview?: string;

  @IsString()
  @IsNotEmpty()
  businessType!: string;

  @IsString()
  @IsNotEmpty()
  businessStage!: string;

  @IsString()
  @IsNotEmpty()
  industry!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsUrl()
  @IsOptional()
  coverUrl?: string;

  @IsInt()
  @Min(1800)
  @Max(3000)
  @IsOptional()
  foundedYear?: number;

  @IsString()
  @IsOptional()
  employeeRange?: string;

  @IsString()
  @IsOptional()
  businessModel?: string;

  @IsString()
  @IsOptional()
  productsOrServices?: string;

  @IsString()
  @IsOptional()
  mainMarket?: string;
}
