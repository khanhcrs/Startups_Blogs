import {
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminUserGlobalSignOutCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { resolveCognitoRegion } from '../auth/cognito-region';

@Injectable()
export class CognitoGroupsService {
  private readonly client = new CognitoIdentityProviderClient({
    region: resolveCognitoRegion(),
  });

  async setAdminMembership(username: string, isAdmin: boolean): Promise<void> {
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (!userPoolId) {
      throw new ServiceUnavailableException(
        'COGNITO_USER_POOL_ID is not configured',
      );
    }

    const input = {
      GroupName: 'ADMIN',
      Username: username,
      UserPoolId: userPoolId,
    };
    const command = isAdmin
      ? new AdminAddUserToGroupCommand(input)
      : new AdminRemoveUserFromGroupCommand(input);
    await this.client.send(command);
    await this.client.send(
      new AdminUserGlobalSignOutCommand({
        Username: username,
        UserPoolId: userPoolId,
      }),
    );
  }
}
