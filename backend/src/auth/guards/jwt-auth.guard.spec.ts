import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { UsersService } from '../../users/users.service';
import type { CognitoIdentityService } from '../cognito-identity.service';
import { JwtAuthGuard } from './jwt-auth.guard';

type TokenVerifier = {
  verify: jest.Mock<Promise<Record<string, unknown>>, [string]>;
};

function createContext(authorization?: string): {
  context: ExecutionContext;
  request: { headers: { authorization?: string }; user?: unknown };
} {
  const request = {
    headers: authorization ? { authorization } : {},
  } as { headers: { authorization?: string }; user?: unknown };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;

  return { context, request };
}

describe('JwtAuthGuard', () => {
  const findOrCreateFromCognito = jest.fn();
  const findByCognitoSub = jest.fn();
  const syncRoleFromCognito = jest.fn();
  const getProfile = jest.fn();
  const isAdminMember = jest.fn();
  let verifier: TokenVerifier;
  let guard: JwtAuthGuard;

  beforeAll(() => {
    process.env.COGNITO_USER_POOL_ID = 'us-east-1_example';
    process.env.COGNITO_CLIENT_ID = 'test-client-id';
  });

  beforeEach(() => {
    jest.resetAllMocks();
    guard = new JwtAuthGuard(
      {
        findOrCreateFromCognito,
        findByCognitoSub,
        syncRoleFromCognito,
      } as unknown as UsersService,
      {
        getProfile,
        isAdminMember,
      } as unknown as CognitoIdentityService,
    );
    verifier = {
      verify: jest
        .fn<Promise<Record<string, unknown>>, [string]>()
        .mockResolvedValue({}),
    };
    (
      guard as unknown as {
        verifier: TokenVerifier;
      }
    ).verifier = verifier;
  });

  it('rejects a request without a bearer token', async () => {
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Missing access token'),
    );
    expect(verifier.verify).not.toHaveBeenCalled();
  });

  it('rejects a token that cannot be verified', async () => {
    verifier.verify.mockRejectedValue(new Error('bad signature'));
    const { context } = createContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid or expired Cognito access token'),
    );
  });

  it('synchronizes a valid Cognito user and attaches it to the request', async () => {
    verifier.verify.mockResolvedValue({
      sub: 'cognito-subject',
      email: 'founder@example.com',
      email_verified: true,
      name: 'Founder',
      'cognito:groups': ['ADMIN'],
    });
    findOrCreateFromCognito.mockResolvedValue({
      id: 'database-user-id',
      email: 'founder@example.com',
      role: Role.USER,
    });
    isAdminMember.mockResolvedValue(true);
    const { context, request } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(verifier.verify).toHaveBeenCalledWith('valid-token');
    expect(findOrCreateFromCognito).toHaveBeenCalledWith({
      cognitoSub: 'cognito-subject',
      email: 'founder@example.com',
      emailVerified: true,
      name: 'Founder',
    });
    expect(syncRoleFromCognito).toHaveBeenCalledWith(
      'database-user-id',
      Role.ADMIN,
    );
    expect(request.user).toEqual({
      userId: 'database-user-id',
      cognitoSub: 'cognito-subject',
      email: 'founder@example.com',
      role: Role.ADMIN,
    });
  });

  it('revokes a stale database ADMIN role when the token has no ADMIN group', async () => {
    verifier.verify.mockResolvedValue({
      sub: 'cognito-subject',
      username: 'former-admin@example.com',
      email_verified: true,
    });
    findOrCreateFromCognito.mockResolvedValue({
      id: 'database-user-id',
      email: 'former-admin@example.com',
      role: Role.ADMIN,
    });
    isAdminMember.mockResolvedValue(false);
    const { context, request } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(syncRoleFromCognito).toHaveBeenCalledWith(
      'database-user-id',
      Role.USER,
    );
    expect(request.user).toMatchObject({ role: Role.USER });
  });

  it('rejects stale ADMIN claims after live Cognito membership is removed', async () => {
    verifier.verify.mockResolvedValue({
      sub: 'former-admin-subject',
      username: 'former-admin',
      'cognito:groups': ['ADMIN'],
    });
    findByCognitoSub.mockResolvedValue({
      id: 'former-admin-id',
      email: 'former-admin@example.com',
      role: Role.ADMIN,
      status: 'ACTIVE',
    });
    isAdminMember.mockResolvedValue(false);
    const { context, request } = createContext('Bearer stale-admin-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(isAdminMember).toHaveBeenCalledWith('former-admin');
    expect(syncRoleFromCognito).toHaveBeenCalledWith(
      'former-admin-id',
      Role.USER,
    );
    expect(request.user).toMatchObject({ role: Role.USER });
  });

  it('rejects a locked ADMIN account even when its token has the ADMIN group', async () => {
    verifier.verify.mockResolvedValue({
      sub: 'locked-admin-subject',
      email: 'locked-admin@example.com',
      email_verified: true,
      'cognito:groups': ['ADMIN'],
    });
    findOrCreateFromCognito.mockResolvedValue({
      id: 'locked-admin-id',
      email: 'locked-admin@example.com',
      role: Role.ADMIN,
      status: 'LOCKED',
    });
    isAdminMember.mockResolvedValue(true);
    const { context } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('User account is locked'),
    );
  });

  it('rejects a verified payload with a non-string identity', async () => {
    verifier.verify.mockResolvedValue({
      sub: 'cognito-subject',
      email: { unexpected: 'object' },
    });
    const { context } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid or expired Cognito access token'),
    );
    expect(findOrCreateFromCognito).not.toHaveBeenCalled();
  });

  it('resolves the real Cognito email when access-token username is a UUID', async () => {
    verifier.verify.mockResolvedValue({
      sub: 'cognito-subject',
      username: '196a550c-8051-7013-example',
      'cognito:groups': ['ADMIN'],
    });
    getProfile.mockResolvedValue({
      email: 'admin@example.com',
      emailVerified: true,
      name: 'Platform Admin',
    });
    findOrCreateFromCognito.mockResolvedValue({
      id: 'database-user-id',
      email: 'admin@example.com',
      role: Role.USER,
      status: 'ACTIVE',
    });
    isAdminMember.mockResolvedValue(true);
    const { context } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(getProfile).toHaveBeenCalledWith('valid-token');
    expect(findOrCreateFromCognito).toHaveBeenCalledWith({
      cognitoSub: 'cognito-subject',
      email: 'admin@example.com',
      emailVerified: true,
      name: 'Platform Admin',
    });
  });
});
