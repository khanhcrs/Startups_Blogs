import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { getAdminAccessDecision } from '../auth/adminAccess';
import { adminApi, adminQueryKeys } from '../services/adminApi';
import styles from './RequireAdmin.module.css';

function getStatusCode(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

export default function RequireAdmin() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const accessDecision = getAdminAccessDecision({
    isAuthenticated,
    token,
    role,
  });
  const requestedPath = `${location.pathname}${location.search}${location.hash}`;

  const statsQuery = useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: adminApi.getStats,
    enabled: accessDecision === 'VERIFY_WITH_BACKEND',
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });

  const statusCode = getStatusCode(statsQuery.error);

  useEffect(() => {
    if (statsQuery.isSuccess) updateUser({ role: 'ADMIN' });
  }, [statsQuery.isSuccess, updateUser]);

  useEffect(() => {
    if (statusCode === 401) logout();
    if (statusCode === 403) {
      updateUser({ role: 'USER' });
      queryClient.removeQueries({ queryKey: adminQueryKeys.all });
    }
  }, [logout, queryClient, statusCode, updateUser]);

  if (accessDecision === 'LOGIN_REQUIRED' || statusCode === 401) {
    return <Navigate to="/login" replace state={{ from: requestedPath }} />;
  }

  if (accessDecision === 'FORBIDDEN' || statusCode === 403) {
    return <Navigate to="/403" replace />;
  }

  if (statsQuery.isPending || !statsQuery.isFetchedAfterMount) {
    return (
      <div className={styles.statePage} role="status" aria-live="polite">
        <div className={styles.stateCard}>
          <ShieldCheck className={styles.stateIcon} size={38} />
          <h1>Verifying administrator access</h1>
          <p>Cognito and the backend are checking your ADMIN membership.</p>
          <div className={styles.progress} aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (statsQuery.isError) {
    return (
      <div className={styles.statePage} role="alert">
        <div className={styles.stateCard}>
          <h1>Admin service is unavailable</h1>
          <p>
            Your session could not be verified through API Gateway. No admin
            data has been displayed.
          </p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => void statsQuery.refetch()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
