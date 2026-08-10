import { IsIn } from 'class-validator';

export const BUSINESS_STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'SUSPENDED',
] as const;
export type BusinessStatus = (typeof BUSINESS_STATUSES)[number];

export class UpdateBusinessStatusDto {
  @IsIn(BUSINESS_STATUSES)
  status!: BusinessStatus;
}
