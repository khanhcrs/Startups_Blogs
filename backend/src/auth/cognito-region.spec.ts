import { resolveCognitoRegion } from './cognito-region';

describe('resolveCognitoRegion', () => {
  const originalRegion = process.env.COGNITO_REGION;
  const originalAwsRegion = process.env.AWS_REGION;

  afterEach(() => {
    if (originalRegion === undefined) delete process.env.COGNITO_REGION;
    else process.env.COGNITO_REGION = originalRegion;
    if (originalAwsRegion === undefined) delete process.env.AWS_REGION;
    else process.env.AWS_REGION = originalAwsRegion;
  });

  it('prefers the explicit Cognito region', () => {
    process.env.COGNITO_REGION = 'eu-west-1';
    process.env.AWS_REGION = 'us-east-1';

    expect(resolveCognitoRegion('ap-southeast-1_example')).toBe('eu-west-1');
  });

  it('derives the region from the user-pool id before AWS_REGION', () => {
    delete process.env.COGNITO_REGION;
    process.env.AWS_REGION = 'us-east-1';

    expect(resolveCognitoRegion('ap-southeast-1_nku3f27HA')).toBe(
      'ap-southeast-1',
    );
  });

  it('falls back safely when the pool id is unavailable', () => {
    delete process.env.COGNITO_REGION;
    process.env.AWS_REGION = 'us-west-2';

    expect(resolveCognitoRegion()).toBe('us-west-2');
  });
});
