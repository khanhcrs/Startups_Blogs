import {
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminUserGlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoGroupsService } from './cognito-groups.service';

describe('CognitoGroupsService', () => {
  const sentCommands: unknown[] = [];
  const send = jest.fn((command: unknown) => {
    sentCommands.push(command);
    return Promise.resolve({});
  });
  let service: CognitoGroupsService;

  beforeAll(() => {
    process.env.COGNITO_USER_POOL_ID = 'ap-southeast-1_example';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sentCommands.length = 0;
    service = new CognitoGroupsService();
    (
      service as unknown as {
        client: { send: typeof send };
      }
    ).client = { send };
  });

  it('adds ADMIN membership and invalidates existing sessions', async () => {
    await service.setAdminMembership('admin@example.com', true);

    const membershipCommand = sentCommands[0];
    const signOutCommand = sentCommands[1];
    expect(membershipCommand).toBeInstanceOf(AdminAddUserToGroupCommand);
    expect(signOutCommand).toBeInstanceOf(AdminUserGlobalSignOutCommand);
  });

  it('removes ADMIN membership before invalidating existing sessions', async () => {
    await service.setAdminMembership('admin@example.com', false);

    const membershipCommand = sentCommands[0];
    const signOutCommand = sentCommands[1];
    expect(membershipCommand).toBeInstanceOf(AdminRemoveUserFromGroupCommand);
    expect(signOutCommand).toBeInstanceOf(AdminUserGlobalSignOutCommand);
  });
});
