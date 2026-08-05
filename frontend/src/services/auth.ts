const cognitoRegion = import.meta.env.VITE_COGNITO_REGION;
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
const redirectSignIn = import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN;
const redirectSignOut = import.meta.env.VITE_COGNITO_REDIRECT_SIGN_OUT;
const apiUrl = import.meta.env.VITE_API_URL;

const codeVerifierKey = 'sb_cognito_code_verifier';
const authStateKey = 'sb_cognito_auth_state';
const sessionKey = 'sb_auth_session';

export type AuthSession = {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

type TokenResponse = {
  id_token: string;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
};

function required(value: string | undefined, name: string) {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function getConfig() {
  return {
    cognitoRegion: required(cognitoRegion, 'VITE_COGNITO_REGION'),
    userPoolId: required(userPoolId, 'VITE_COGNITO_USER_POOL_ID'),
    clientId: required(clientId, 'VITE_COGNITO_CLIENT_ID'),
    cognitoDomain: required(cognitoDomain, 'VITE_COGNITO_DOMAIN').replace(/^https?:\/\//, '').replace(/\/$/, ''),
    redirectSignIn: required(redirectSignIn, 'VITE_COGNITO_REDIRECT_SIGN_IN'),
    redirectSignOut: required(redirectSignOut, 'VITE_COGNITO_REDIRECT_SIGN_OUT'),
    apiUrl: required(apiUrl, 'VITE_API_URL').replace(/\/$/, ''),
  };
}

function base64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomString(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes.buffer);
}

async function createCodeChallenge(verifier: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64Url(digest);
}

function buildAuthorizeUrl(screen: 'login' | 'signup', codeChallenge: string, state: string) {
  const config = getConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    scope: 'openid email profile',
    redirect_uri: config.redirectSignIn,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state,
  });

  if (screen === 'signup') {
    params.set('screen_hint', 'signup');
  }

  return `https://${config.cognitoDomain}/oauth2/authorize?${params.toString()}`;
}

export async function startAuth(screen: 'login' | 'signup') {
  const verifier = randomString(64);
  const state = randomString(24);
  const challenge = await createCodeChallenge(verifier);

  sessionStorage.setItem(codeVerifierKey, verifier);
  sessionStorage.setItem(authStateKey, state);
  window.location.assign(buildAuthorizeUrl(screen, challenge, state));
}

export async function handleAuthCallback(code: string, state: string) {
  const config = getConfig();
  const expectedState = sessionStorage.getItem(authStateKey);
  const verifier = sessionStorage.getItem(codeVerifierKey);

  if (!expectedState || expectedState !== state || !verifier) {
    throw new Error('Invalid login state. Please try signing in again.');
  }

  const response = await fetch(`https://${config.cognitoDomain}/oauth2/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      code,
      redirect_uri: config.redirectSignIn,
      code_verifier: verifier,
    }),
  });

  if (!response.ok) {
    throw new Error('Cognito token exchange failed.');
  }

  const tokens = (await response.json()) as TokenResponse;
  const session: AuthSession = {
    idToken: tokens.id_token,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };

  localStorage.setItem(sessionKey, JSON.stringify(session));
  sessionStorage.removeItem(codeVerifierKey);
  sessionStorage.removeItem(authStateKey);

  await syncUser(session.idToken);
  return session;
}

export async function syncUser(idToken: string) {
  const config = getConfig();
  const response = await fetch(`${config.apiUrl}/auth/sync`, {
    method: 'POST',
    headers: { authorization: `Bearer ${idToken}` },
  });

  if (!response.ok) {
    throw new Error('Backend user sync failed. Check backend .env and database.');
  }
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(sessionKey);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (session.expiresAt <= Date.now()) {
      localStorage.removeItem(sessionKey);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(sessionKey);
    return null;
  }
}

export function signOut() {
  const config = getConfig();
  localStorage.removeItem(sessionKey);
  const params = new URLSearchParams({
    client_id: config.clientId,
    logout_uri: config.redirectSignOut,
  });
  window.location.assign(`https://${config.cognitoDomain}/logout?${params.toString()}`);
}
