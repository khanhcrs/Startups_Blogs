import { IsArray, IsInt, IsOptional, IsString, IsUrl, Length, Max, Min } from 'class-validator';

export class CreateBusinessDto {
  @IsString() @Length(2, 160) name: string;
  @IsOptional() @IsString() @Length(2, 200) legalName?: string;
  @IsString() @Length(2, 80) businessType: string;
  @IsOptional() @IsString() @Length(2, 80) stage?: string;
  @IsOptional() @IsString() @Length(10, 500) shortDescription?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() @Min(1800) @Max(2200) foundedYear?: number;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsUrl() website?: string;
  @IsOptional() @IsString() productsServices?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) industryIds?: string[];
}
