import {
  getApplicationRole,
  type ApplicationRole,
} from '../../../services/cognitoToken';

export type AdminAccessDecision =
  | 'LOGIN_REQUIRED'
  | 'FORBIDDEN'
  | 'VERIFY_WITH_BACKEND';

interface AdminSession {
  isAuthenticated: boolean;
  token: string | null;
  role?: string | null;
}

export function getAdminAccessDecision({
  isAuthenticated,
  token,
  role,
}: AdminSession): AdminAccessDecision {
  if (!isAuthenticated || !token) return 'LOGIN_REQUIRED';

  if (role && role !== 'ADMIN') return 'FORBIDDEN';

  return getApplicationRole(token) === 'ADMIN'
    ? 'VERIFY_WITH_BACKEND'
    : 'FORBIDDEN';
}

export function getPostLoginDestination(
  role: ApplicationRole,
  requestedPath?: string,
): string {
  if (role !== 'ADMIN') return '/';

  return requestedPath?.startsWith('/admin')
    ? requestedPath
    : '/admin/overview';
}
