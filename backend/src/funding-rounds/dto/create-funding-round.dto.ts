import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateFundingRoundDto {
  @IsString()
  @IsNotEmpty()
  roundName!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  investors!: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
