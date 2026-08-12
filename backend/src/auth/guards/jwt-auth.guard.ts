import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { Role } from '@prisma/client';
import { UsersService } from '../../users/users.service';
import type { AuthenticatedRequest } from '../auth.types';
import { CognitoIdentityService } from '../cognito-identity.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    clientId: process.env.COGNITO_CLIENT_ID!,
    tokenUse: 'access',
  });

  constructor(
    private readonly usersService: UsersService,
    private readonly cognitoIdentity: CognitoIdentityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : undefined;
    if (!token) throw new UnauthorizedException('Missing access token');

    try {
      const payload = await this.verifier.verify(token);
      let user = await this.usersService.findByCognitoSub(payload.sub);
      if (!user) {
        const tokenEmail =
          typeof payload.email === 'string' && payload.email.includes('@')
            ? payload.email.trim().toLowerCase()
            : typeof payload.username === 'string' &&
                payload.username.includes('@')
              ? payload.username.trim().toLowerCase()
              : undefined;
        const tokenEmailVerified = payload.email_verified === true;
        const profile =
          tokenEmail && tokenEmailVerified
            ? {
                email: tokenEmail,
                emailVerified: true,
                name:
                  typeof payload.name === 'string' ? payload.name : undefined,
              }
            : await this.cognitoIdentity.getProfile(token);

        user = await this.usersService.findOrCreateFromCognito({
          cognitoSub: payload.sub,
          email: profile.email,
          emailVerified: profile.emailVerified,
          name: profile.name,
        });
      }
      if (user.status === 'LOCKED') {
        throw new UnauthorizedException('User account is locked');
      }
      const groups = Array.isArray(payload['cognito:groups'])
        ? payload['cognito:groups']
        : [];
      const shouldVerifyAdminMembership =
        groups.includes('ADMIN') || user.role === Role.ADMIN;
      const cognitoUsername =
        typeof payload.username === 'string' && payload.username.length > 0
          ? payload.username
          : payload.sub;
      const hasCurrentAdminMembership = shouldVerifyAdminMembership
        ? await this.cognitoIdentity.isAdminMember(cognitoUsername)
        : false;
      const effectiveRole = hasCurrentAdminMembership
        ? Role.ADMIN
        : user.role === Role.ADMIN
          ? Role.USER
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
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }
      throw new UnauthorizedException(
        'Invalid or expired Cognito access token',
      );
    }
  }
}
