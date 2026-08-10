import type { Request } from 'express';
import type { Role } from '@prisma/client';

export interface AuthenticatedUser {
  userId: string;
  cognitoSub: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface CognitoIdentityPayload {
  sub: string;
  email?: unknown;
  username?: unknown;
  name?: unknown;
  'custom:role'?: unknown;
}

export interface CognitoStrategyUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
}
