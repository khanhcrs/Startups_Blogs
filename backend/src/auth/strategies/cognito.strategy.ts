import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import type {
  CognitoIdentityPayload,
  CognitoStrategyUser,
} from '../auth.types';
import { Role } from '@prisma/client';

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {
  constructor() {
    const userPoolId = process.env.COGNITO_USER_POOL_ID || 'us-east-1_example';
    const region = process.env.AWS_REGION || 'us-east-1';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: process.env.COGNITO_CLIENT_ID,
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
      }),
    });
  }

  validate(payload: CognitoIdentityPayload): Promise<CognitoStrategyUser> {
    if (typeof payload.email !== 'string' || !payload.email) {
      return Promise.reject(new UnauthorizedException('Invalid Cognito Token'));
    }
    if (typeof payload.sub !== 'string' || !payload.sub) {
      return Promise.reject(new UnauthorizedException('Invalid Cognito Token'));
    }

    const role = payload['custom:role'] === Role.ADMIN ? Role.ADMIN : Role.USER;
    const user: CognitoStrategyUser = {
      userId: payload.sub,
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : payload.email,
      role,
    };

    return Promise.resolve(user);
  }
}
