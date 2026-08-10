/**
 * Amazon Cognito Authentication Helper cho React Frontend
 */
export interface CognitoAuthConfig {
  userPoolId: string;
  clientId: string;
  region: string;
}

export const getCognitoConfig = (): CognitoAuthConfig => {
  return {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  };
};

/**
 * Đăng nhập qua Cognito User Pool ID Token
 */
export const loginWithCognito = async (email: string, password: string) => {
  const config = getCognitoConfig();
  
  if (!config.userPoolId || !config.clientId) {
    console.warn('Amazon Cognito chưa được cấu hình biến môi trường VITE_COGNITO_USER_POOL_ID');
    return null;
  }

  const endpoint = `https://cognito-idp.${config.region}.amazonaws.com/`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    },
    body: JSON.stringify({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: config.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Đăng nhập Cognito thất bại');
  }

  return {
    idToken: data.AuthenticationResult.IdToken,
    accessToken: data.AuthenticationResult.AccessToken,
    refreshToken: data.AuthenticationResult.RefreshToken,
  };
};

/**
 * Đăng ký tài khoản mới trên Cognito User Pool (Sẽ tự động gửi Email OTP 6 số)
 */
export const signUpWithCognito = async (email: string, password: string, name: string) => {
  const config = getCognitoConfig();
  if (!config.clientId) return null;

  const endpoint = `https://cognito-idp.${config.region}.amazonaws.com/`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
    },
    body: JSON.stringify({
      ClientId: config.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Đăng ký Cognito thất bại');
  }

  return data;
};

/**
 * Xác minh mã OTP 6 chữ số gửi qua Email từ Cognito
 */
export const confirmCognitoSignUp = async (email: string, code: string) => {
  const config = getCognitoConfig();
  if (!config.clientId) return null;

  const endpoint = `https://cognito-idp.${config.region}.amazonaws.com/`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp',
    },
    body: JSON.stringify({
      ClientId: config.clientId,
      Username: email,
      ConfirmationCode: code,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Mã xác nhận 6 số không đúng');
  }

  return data;
};
