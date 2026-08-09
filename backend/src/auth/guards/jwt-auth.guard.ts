import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    clientId: process.env.COGNITO_CLIENT_ID!,
    tokenUse: 'access',
  });

  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization as string | undefined;
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : undefined;
    if (!token) throw new UnauthorizedException('Missing access token');

    try {
      const payload = await this.verifier.verify(token);
      const email = String(payload.email || payload.username || '');
      if (!email) throw new Error('Cognito token does not contain a username');
      const user = await this.usersService.findOrCreateFromCognito({
        cognitoSub: payload.sub,
        email,
        name: typeof payload.name === 'string' ? payload.name : undefined,
      });
      const groups = Array.isArray(payload['cognito:groups'])
        ? payload['cognito:groups']
        : [];
      request.user = {
        userId: user.id,
        cognitoSub: payload.sub,
        email: user.email,
        role: groups.includes('ADMIN') ? 'ADMIN' : user.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired Cognito access token');
    }
  }
}
