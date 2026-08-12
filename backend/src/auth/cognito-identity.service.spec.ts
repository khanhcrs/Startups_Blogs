import { UnauthorizedException } from '@nestjs/common';
import type { AdminListGroupsForUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityService } from './cognito-identity.service';

describe('CognitoIdentityService', () => {
  const sentCommands: unknown[] = [];
  const send = jest.fn((command: unknown) => {
    sentCommands.push(command);
    return Promise.resolve({});
  });
  let service: CognitoIdentityService;

  beforeAll(() => {
    process.env.COGNITO_USER_POOL_ID = 'ap-southeast-1_example';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sentCommands.length = 0;
    service = new CognitoIdentityService();
    (
      service as unknown as {
        client: { send: typeof send };
      }
    ).client = { send };
  });

  it('returns the verified email and name from Cognito GetUser', async () => {
    send.mockResolvedValue({
      UserAttributes: [
        { Name: 'email', Value: 'admin@example.com' },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: 'Platform Admin' },
      ],
    });

    await expect(service.getProfile('access-token')).resolves.toEqual({
      email: 'admin@example.com',
      emailVerified: true,
      name: 'Platform Admin',
    });
  });

  it('fails closed when Cognito does not return an email', async () => {
    send.mockResolvedValue({ UserAttributes: [] });

    await expect(service.getProfile('access-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('checks all Cognito group pages for current ADMIN membership', async () => {
    send
      .mockResolvedValueOnce({
        Groups: [{ GroupName: 'USER' }],
        NextToken: 'next-page',
      })
      .mockResolvedValueOnce({ Groups: [{ GroupName: 'ADMIN' }] });

    await expect(service.isAdminMember('cognito-username')).resolves.toBe(true);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it('passes the verified Cognito username to the membership lookup', async () => {
    send.mockImplementationOnce((command: unknown) => {
      sentCommands.push(command);
      return Promise.resolve({ Groups: [{ GroupName: 'ADMIN' }] });
    });

    await service.isAdminMember('cognito-username');

    const command = sentCommands[0] as AdminListGroupsForUserCommand;
    expect(command.input).toMatchObject({
      Username: 'cognito-username',
      UserPoolId: 'ap-southeast-1_example',
    });
  });

  it('fails closed when current ADMIN membership cannot be verified', async () => {
    send.mockRejectedValue(new Error('missing IAM permission'));

    await expect(service.isAdminMember('cognito-username')).rejects.toThrow(
      'Unable to verify Cognito group membership',
    );
  });
});
