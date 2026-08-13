import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { Role } from '@prisma/client';
import { UsersService } from '../../users/users.service';
import type { AuthenticatedRequest } from '../auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    clientId: process.env.COGNITO_CLIENT_ID!,
    tokenUse: 'access',
  });

  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : undefined;
    if (!token) throw new UnauthorizedException('Missing access token');

    try {
      const payload = await this.verifier.verify(token);
      const email =
        typeof payload.email === 'string' && payload.email
          ? payload.email
          : typeof payload.username === 'string' && payload.username
            ? payload.username
            : undefined;
      if (!email) {
        throw new Error('Cognito token does not contain a valid identity');
      }
      const user = await this.usersService.findOrCreateFromCognito({
        cognitoSub: payload.sub,
        email,
        name: typeof payload.name === 'string' ? payload.name : undefined,
      });
      const groups = Array.isArray(payload['cognito:groups'])
        ? payload['cognito:groups']
        : [];
      const effectiveRole = groups.includes('ADMIN') || user.role === Role.ADMIN
        ? Role.ADMIN
        : user.role;
      if (user.role !== effectiveRole) {
        await this.usersService.syncRoleFromCognito(user.id, effectiveRole);
      }
      request.user = {
        userId: user.id,
        cognitoSub: payload.sub,
        email: user.email,
        role: effectiveRole,
      };
      return true;
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired Cognito access token',
      );
    }
  }
}
