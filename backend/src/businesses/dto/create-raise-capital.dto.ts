import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TeamMemberItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsOptional()
  bio?: string;
}

export class CreateRaiseCapitalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  industry!: string;

  @IsString()
  @IsNotEmpty()
  businessStage!: string;

  @IsString()
  @IsNotEmpty()
  businessType!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  detailedOverview?: string;

  @IsString()
  @IsOptional()
  businessModel?: string;

  @IsString()
  @IsOptional()
  productsOrServices?: string;

  @IsString()
  @IsOptional()
  employeeRange?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberItemDto)
  teamMembers?: TeamMemberItemDto[];

  @IsString()
  @IsOptional()
  fundingPurpose?: string;

  @IsNumber()
  @IsOptional()
  fundingAmountMin?: number;

  @IsNumber()
  @IsOptional()
  fundingAmountMax?: number;

  @IsString()
  @IsOptional()
  currency?: string;
}
