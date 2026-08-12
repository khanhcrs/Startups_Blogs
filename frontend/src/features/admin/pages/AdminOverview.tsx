import { useQuery } from '@tanstack/react-query';
import { Users, Building2, FileText, CheckCircle } from 'lucide-react';
import commonStyles from '../AdminCommon.module.css';
import { adminApi, adminQueryKeys } from '../services/adminApi';

export default function AdminOverview() {
  const statsQuery = useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: adminApi.getStats,
    staleTime: 30_000,
  });

  if (statsQuery.isPending) {
    return <div className={commonStyles.loading}>Loading statistics...</div>;
  }

  if (statsQuery.isError) {
    return (
      <div className={commonStyles.emptyState} role="alert">
        <p>Dashboard statistics could not be loaded.</p>
        <button
          type="button"
          className={commonStyles.actionBtn}
          onClick={() => void statsQuery.refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  const stats = statsQuery.data;

  return (
    <div>
      <header className={commonStyles.header}>
        <h1>Dashboard Overview</h1>
        <p>System statistics and quick metrics</p>
      </header>
      
      <div className={commonStyles.statsGrid}>
          <div className={commonStyles.statCard}>
            <div className={commonStyles.statIcon}><Users size={24} /></div>
            <div className={commonStyles.statInfo}>
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
          </div>
          <div className={commonStyles.statCard}>
            <div className={commonStyles.statIcon}><Building2 size={24} /></div>
            <div className={commonStyles.statInfo}>
              <h3>Total Businesses</h3>
              <p>{stats.totalBusinesses}</p>
            </div>
          </div>
          <div className={commonStyles.statCard}>
            <div className={commonStyles.statIcon}><FileText size={24} /></div>
            <div className={commonStyles.statInfo}>
              <h3>Total Articles</h3>
              <p>{stats.totalArticles}</p>
            </div>
          </div>
          <div className={commonStyles.statCard}>
            <div className={commonStyles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
              <CheckCircle size={24} />
            </div>
            <div className={commonStyles.statInfo}>
              <h3>Pending Businesses</h3>
              <p>{stats.pendingBusinesses}</p>
            </div>
          </div>
      </div>
    </div>
  );
}
