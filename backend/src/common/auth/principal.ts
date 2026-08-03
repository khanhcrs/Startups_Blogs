import type { RoleCode, UserStatus } from '@prisma/client';

export type RequestPrincipal = {
  userId: string;
  cognitoSub: string;
  email?: string;
  displayName?: string;
  roles: RoleCode[];
  accountStatus: UserStatus;
};

declare global {
  namespace Express {
    interface Request {
      principal?: RequestPrincipal;
    }
  }
}
