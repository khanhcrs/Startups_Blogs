const DEFAULT_COGNITO_REGION = 'ap-southeast-1';

export function resolveCognitoRegion(
  userPoolId = process.env.COGNITO_USER_POOL_ID,
) {
  const configuredRegion = process.env.COGNITO_REGION?.trim();
  if (configuredRegion) return configuredRegion;

  const separatorIndex = userPoolId?.indexOf('_') ?? -1;
  if (separatorIndex > 0) return userPoolId!.slice(0, separatorIndex);

  return process.env.AWS_REGION?.trim() || DEFAULT_COGNITO_REGION;
}
