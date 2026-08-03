import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class IdentityService {
  private readonly verifier;
  constructor(config: ConfigService, private readonly prisma: PrismaService) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: config.getOrThrow<string>('COGNITO_USER_POOL_ID'), tokenUse: 'id', clientId: config.getOrThrow<string>('COGNITO_CLIENT_ID'),
    });
  }
  async sync(token?: string) {
    if (!token) throw new UnauthorizedException('Missing identity token');
    try {
      const claims = await this.verifier.verify(token);
      const email = typeof claims.email === 'string' ? claims.email.toLowerCase() : undefined;
      if (!email || claims.email_verified !== true) throw new UnauthorizedException('Verified email is required');
      const displayName = typeof claims.name === 'string' ? claims.name : email.split('@')[0];
      return this.prisma.user.upsert({
        where: { cognitoSub: claims.sub },
        create: { cognitoSub: claims.sub, email, displayName },
        update: { email, displayName },
        select: { id: true, email: true, displayName: true, status: true },
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired identity token');
    }
  }
}
