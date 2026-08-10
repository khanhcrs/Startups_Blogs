import { UnauthorizedException } from '@nestjs/common';
import { CognitoStrategy } from './cognito.strategy';

jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn(() => jest.fn()),
}));

describe('CognitoStrategy', () => {
  let strategy: CognitoStrategy;

  beforeEach(() => {
    strategy = new CognitoStrategy();
  });

  it('maps a valid Cognito payload to the application user shape', async () => {
    await expect(
      strategy.validate({
        sub: 'cognito-subject',
        email: 'founder@example.com',
        name: 'Founder',
        'custom:role': 'ADMIN',
      }),
    ).resolves.toEqual({
      userId: 'cognito-subject',
      email: 'founder@example.com',
      name: 'Founder',
      role: 'ADMIN',
    });
  });

  it('uses safe defaults when optional name and role claims are absent', async () => {
    await expect(
      strategy.validate({
        sub: 'cognito-subject',
        email: 'founder@example.com',
      }),
    ).resolves.toEqual({
      userId: 'cognito-subject',
      email: 'founder@example.com',
      name: 'founder@example.com',
      role: 'USER',
    });
  });

  it('does not trust an unsupported custom role claim', async () => {
    await expect(
      strategy.validate({
        sub: 'cognito-subject',
        email: 'founder@example.com',
        'custom:role': 'SUPER_ADMIN',
      }),
    ).resolves.toMatchObject({ role: 'USER' });
  });

  it('rejects a payload without an email claim', async () => {
    await expect(strategy.validate({ sub: 'cognito-subject' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
