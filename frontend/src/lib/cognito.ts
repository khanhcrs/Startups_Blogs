import { api } from './axios';

export const signIn = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.accessToken as string;
};

export const signUp = async (email: string, password: string, name: string) => {
  const response = await api.post('/auth/sign-up', { email, password, name });
  return { confirmed: Boolean(response.data.confirmed) };
};

export const confirmSignUp = async (email: string, code: string) => {
  await api.post('/auth/confirm-sign-up', { email, code });
};

export const resendSignUpCode = async (email: string) => {
  await api.post('/auth/resend-confirmation-code', { email });
};

export const requestPasswordReset = async (email: string) => {
  await api.post('/auth/forgot-password', { email });
};

export const confirmPasswordReset = (
  email: string,
  code: string,
  newPassword: string,
) => {
  return api.post('/auth/confirm-forgot-password', { email, code, newPassword }).then(() => undefined);
};
