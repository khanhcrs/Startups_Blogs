import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Users, Building2, FileText, CheckCircle } from 'lucide-react';
import commonStyles from '../AdminCommon.module.css';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.data);
      }
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={commonStyles.loading}>Loading statistics...</div>;
  }

  return (
    <div>
      <header className={commonStyles.header}>
        <h1>Dashboard Overview</h1>
        <p>System statistics and quick metrics</p>
      </header>
      
      {stats && (
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
      )}
    </div>
  );
}
