import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import styles from './AdminDashboard.module.css';
import type { Business } from '../types/business';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.role !== 'ADMIN') {
      toast.error('You do not have permission to view this page');
      navigate('/');
      return;
    }
    
    fetchBusinesses();
  }, [isAuthenticated, user, statusFilter]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/businesses/admin/all?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch businesses');
      const data = await res.json();
      setBusinesses(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/businesses/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error('Failed to update status');
      
      toast.success(`Business marked as ${newStatus}`);
      fetchBusinesses();
    } catch (error) {
      console.error(error);
      toast.error('Error updating status');
    }
  };

  if (loading && businesses.length === 0) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Manage platform content and approvals</p>
      </header>

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button 
            className={statusFilter === 'PENDING' ? styles.activeTab : styles.tab}
            onClick={() => setStatusFilter('PENDING')}
          >
            Pending Approvals
          </button>
          <button 
            className={statusFilter === 'APPROVED' ? styles.activeTab : styles.tab}
            onClick={() => setStatusFilter('APPROVED')}
          >
            Approved Startups
          </button>
          <button 
            className={statusFilter === 'REJECTED' ? styles.activeTab : styles.tab}
            onClick={() => setStatusFilter('REJECTED')}
          >
            Rejected
          </button>
        </div>

        <div className={styles.listContainer}>
          {businesses.length === 0 ? (
            <p className={styles.emptyState}>No businesses found for this status.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Startup Name</th>
                    <th>Industry</th>
                    <th>Owner</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map(b => (
                    <tr key={b.id}>
                      <td>
                        <Link to={`/businesses/${b.slug}`} className={styles.businessLink}>
                          {b.name}
                        </Link>
                      </td>
                      <td>{b.industry}</td>
                      <td>{b.owner?.name || 'Unknown'}</td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className={styles.actions}>
                          {b.status !== 'APPROVED' && (
                            <button 
                              className={styles.approveBtn}
                              onClick={() => handleUpdateStatus(b.id, 'APPROVED')}
                            >
                              Approve
                            </button>
                          )}
                          {b.status !== 'REJECTED' && (
                            <button 
                              className={styles.rejectBtn}
                              onClick={() => handleUpdateStatus(b.id, 'REJECTED')}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
