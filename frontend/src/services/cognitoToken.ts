export type ApplicationRole = 'USER' | 'ADMIN';

interface CognitoTokenPayload {
  'cognito:groups'?: unknown;
}

function decodePayload(token: string): CognitoTokenPayload | null {
  const encodedPayload = token.split('.')[1];
  if (!encodedPayload) return null;

  try {
    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );
    const bytes = Uint8Array.from(atob(paddedBase64), (character) =>
      character.charCodeAt(0),
    );
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return payload && typeof payload === 'object'
      ? (payload as CognitoTokenPayload)
      : null;
  } catch {
    return null;
  }
}

export function getApplicationRole(token: string): ApplicationRole {
  const groups = decodePayload(token)?.['cognito:groups'];
  return Array.isArray(groups) && groups.includes('ADMIN') ? 'ADMIN' : 'USER';
}
