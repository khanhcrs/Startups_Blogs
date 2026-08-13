import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { resolveCognitoRegion } from './cognito-region';

interface CognitoProfile {
  email: string;
  emailVerified: boolean;
  name?: string;
}

@Injectable()
export class CognitoIdentityService {
  private readonly client = new CognitoIdentityProviderClient({
    region: resolveCognitoRegion(),
  });

  async getProfile(accessToken: string): Promise<CognitoProfile> {
    const response = await this.client.send(
      new GetUserCommand({ AccessToken: accessToken }),
    );
    const attributes = response.UserAttributes ?? [];
    const email = attributes.find(({ Name }) => Name === 'email')?.Value;
    const emailVerified =
      attributes.find(({ Name }) => Name === 'email_verified')?.Value ===
      'true';
    const name = attributes.find(({ Name }) => Name === 'name')?.Value;

    if (!email || !email.includes('@')) {
      throw new UnauthorizedException(
        'Cognito account does not contain a valid email',
      );
    }

    return {
      email: email.trim().toLowerCase(),
      emailVerified,
      name,
    };
  }

  async isAdminMember(username: string): Promise<boolean> {
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (!userPoolId) {
      throw new ServiceUnavailableException(
        'COGNITO_USER_POOL_ID is not configured',
      );
    }

    try {
      let nextToken: string | undefined;
      do {
        const response = await this.client.send(
          new AdminListGroupsForUserCommand({
            UserPoolId: userPoolId,
            Username: username,
            Limit: 60,
            NextToken: nextToken,
          }),
        );
        if (response.Groups?.some(({ GroupName }) => GroupName === 'ADMIN')) {
          return true;
        }
        nextToken = response.NextToken;
      } while (nextToken);

      return false;
    } catch {
      throw new ServiceUnavailableException(
        'Unable to verify Cognito group membership',
      );
    }
  }
}
