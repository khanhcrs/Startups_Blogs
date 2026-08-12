import { describe, expect, it } from 'vitest';
import {
  getAdminAccessDecision,
  getPostLoginDestination,
} from './adminAccess';

function createToken(payload: Record<string, unknown>): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    'base64url',
  );
  return `test-header.${encodedPayload}.test-signature`;
}

describe('getAdminAccessDecision', () => {
  it('requires login when the session has no access token', () => {
    expect(
      getAdminAccessDecision({ isAuthenticated: false, token: null }),
    ).toBe('LOGIN_REQUIRED');
    expect(
      getAdminAccessDecision({ isAuthenticated: true, token: null }),
    ).toBe('LOGIN_REQUIRED');
  });

  it('denies a signed-in user whose Cognito token lacks ADMIN group', () => {
    const token = createToken({ 'cognito:groups': ['USER'] });

    expect(getAdminAccessDecision({ isAuthenticated: true, token })).toBe(
      'FORBIDDEN',
    );
  });

  it('requires backend verification for Cognito ADMIN group members', () => {
    const token = createToken({ 'cognito:groups': ['USER', 'ADMIN'] });

    expect(getAdminAccessDecision({ isAuthenticated: true, token })).toBe(
      'VERIFY_WITH_BACKEND',
    );
  });

  it('denies a session that the backend has already downgraded', () => {
    const token = createToken({ 'cognito:groups': ['ADMIN'] });

    expect(
      getAdminAccessDecision({
        isAuthenticated: true,
        token,
        role: 'USER',
      }),
    ).toBe('FORBIDDEN');
  });
});

describe('getPostLoginDestination', () => {
  it('sends an ADMIN account to the admin dashboard', () => {
    expect(getPostLoginDestination('ADMIN')).toBe('/admin/overview');
  });

  it('preserves a requested admin URL after ADMIN login', () => {
    expect(
      getPostLoginDestination('ADMIN', '/admin/businesses?status=PENDING'),
    ).toBe('/admin/businesses?status=PENDING');
  });

  it('does not send a normal user into an admin URL', () => {
    expect(getPostLoginDestination('USER', '/admin/users')).toBe('/');
  });
});
