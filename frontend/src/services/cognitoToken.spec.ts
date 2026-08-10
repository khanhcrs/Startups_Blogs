import { describe, expect, it } from 'vitest';
import { getApplicationRole } from './cognitoToken';

function createToken(payload: Record<string, unknown>): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    'base64url',
  );
  return `test-header.${encodedPayload}.test-signature`;
}

describe('getApplicationRole', () => {
  it('returns ADMIN for a member of the Cognito ADMIN group', () => {
    const token = createToken({ 'cognito:groups': ['USER', 'ADMIN'] });

    expect(getApplicationRole(token)).toBe('ADMIN');
  });

  it('returns USER when the token has no ADMIN group', () => {
    expect(getApplicationRole(createToken({}))).toBe('USER');
    expect(
      getApplicationRole(createToken({ 'cognito:groups': ['EDITOR'] })),
    ).toBe('USER');
  });

  it('fails closed for malformed tokens and claims', () => {
    expect(getApplicationRole('not-a-jwt')).toBe('USER');
    expect(
      getApplicationRole(createToken({ 'cognito:groups': 'ADMIN' })),
    ).toBe('USER');
  });
});
