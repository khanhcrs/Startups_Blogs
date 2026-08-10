import { IsIn } from 'class-validator';

export const USER_STATUSES = ['ACTIVE', 'LOCKED'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export class UpdateUserStatusDto {
  @IsIn(USER_STATUSES)
  status!: UserStatus;
}
