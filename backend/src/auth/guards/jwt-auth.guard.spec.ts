import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { UsersService } from '../../users/users.service';
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
  const syncRoleFromCognito = jest.fn();
  let verifier: TokenVerifier;
  let guard: JwtAuthGuard;

  beforeAll(() => {
    process.env.COGNITO_USER_POOL_ID = 'us-east-1_example';
    process.env.COGNITO_CLIENT_ID = 'test-client-id';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new JwtAuthGuard({
      findOrCreateFromCognito,
      syncRoleFromCognito,
    } as unknown as UsersService);
    verifier = {
      verify: jest.fn(() => Promise.resolve({})),
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
      name: 'Founder',
      'cognito:groups': ['ADMIN'],
    });
    findOrCreateFromCognito.mockResolvedValue({
      id: 'database-user-id',
      email: 'founder@example.com',
      role: Role.USER,
    });
    const { context, request } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(verifier.verify).toHaveBeenCalledWith('valid-token');
    expect(findOrCreateFromCognito).toHaveBeenCalledWith({
      cognitoSub: 'cognito-subject',
      email: 'founder@example.com',
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
    });
    findOrCreateFromCognito.mockResolvedValue({
      id: 'database-user-id',
      email: 'former-admin@example.com',
      role: Role.ADMIN,
    });
    const { context, request } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(syncRoleFromCognito).toHaveBeenCalledWith(
      'database-user-id',
      Role.USER,
    );
    expect(request.user).toMatchObject({ role: Role.USER });
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
});
