import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import commonStyles from '../AdminCommon.module.css';
import type { Business } from '../../../types/business';

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');

  useEffect(() => {
    fetchBusinesses();
  }, [statusFilter]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/businesses/admin/all?status=${statusFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBusinesses(await res.json());
      }
    } catch (error) {
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBusinessStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3000/businesses/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`Business marked as ${newStatus}`);
      fetchBusinesses();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  return (
    <div>
      <header className={commonStyles.header}>
        <h1>Business Approvals</h1>
        <p>Manage startup applications and visibility</p>
      </header>
      <div className={commonStyles.contentCard}>
        <div className={commonStyles.tabs}>
          <button 
            className={statusFilter === 'PENDING' ? commonStyles.activeTab : commonStyles.tab}
            onClick={() => setStatusFilter('PENDING')}
          >Pending Approvals</button>
          <button 
            className={statusFilter === 'APPROVED' ? commonStyles.activeTab : commonStyles.tab}
            onClick={() => setStatusFilter('APPROVED')}
          >Approved Startups</button>
          <button 
            className={statusFilter === 'REJECTED' ? commonStyles.activeTab : commonStyles.tab}
            onClick={() => setStatusFilter('REJECTED')}
          >Rejected</button>
        </div>
        <div className={commonStyles.listContainer}>
          {loading ? <div className={commonStyles.loading}>Loading...</div> : 
           businesses.length === 0 ? (
            <p className={commonStyles.emptyState}>No businesses found for this status.</p>
          ) : (
            <div className={commonStyles.tableWrapper}>
              <table className={commonStyles.table}>
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
                      <td><Link to={`/businesses/${b.slug}`} className={commonStyles.link}>{b.name}</Link></td>
                      <td>{b.industry}</td>
                      <td>{b.owner?.name || 'Unknown'}</td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className={commonStyles.actions}>
                          <Link to={`/admin/businesses/${b.id}/edit`} className={commonStyles.actionBtn} style={{ backgroundColor: '#f3f4f6', color: '#374151', textDecoration: 'none' }}>
                            Edit
                          </Link>
                          {b.status !== 'APPROVED' && (
                            <button className={`${commonStyles.actionBtn} ${commonStyles.approveBtn}`} onClick={() => handleUpdateBusinessStatus(b.id, 'APPROVED')}>Approve</button>
                          )}
                          {b.status !== 'REJECTED' && (
                            <button className={`${commonStyles.actionBtn} ${commonStyles.rejectBtn}`} onClick={() => handleUpdateBusinessStatus(b.id, 'REJECTED')}>Reject</button>
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
