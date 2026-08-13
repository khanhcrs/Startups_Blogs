import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import commonStyles from '../AdminCommon.module.css';
import styles from './AdminUsers.module.css';
import { api } from '../../../lib/axios';
import { adminQueryKeys } from '../services/adminApi';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'USER' | 'MODERATOR' | 'ADMIN'>('USER');

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const filters = { page, limit, role: activeTab };
  const usersQuery = useQuery({
    queryKey: adminQueryKeys.userList(filters),
    queryFn: async () => {
      const response = await api.get('/users/admin/all', {
        params: filters,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (usersQuery.isError) {
      toast.error('Failed to load users');
    }
  }, [usersQuery.errorUpdatedAt, usersQuery.isError]);

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.put(`/users/admin/${id}/role`, { role }),
    onSuccess: async (_response, variables) => {
      toast.success(`User role updated to ${variables.role}`);
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.userLists,
      });
    },
    onError: () => toast.error('Error updating role'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/users/admin/${id}/status`, { status }),
    onSuccess: async (_response, variables) => {
      toast.success(`User account is now ${variables.status}`);
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.userLists,
      });
    },
    onError: () => toast.error('Error updating status'),
  });

  const handleUpdateUserRole = (id: string, role: string) => {
    updateRoleMutation.mutate({ id, role });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const status = currentStatus === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    updateStatusMutation.mutate({ id, status });
  };

  const users = usersQuery.data?.data || [];
  const totalPages = usersQuery.data?.meta?.totalPages || 1;
  const totalItems = usersQuery.data?.meta?.total || 0;
  const loading = usersQuery.isPending;
  const userMutating =
    updateRoleMutation.isPending || updateStatusMutation.isPending;

  return (
    <div>
      <header className={commonStyles.header}>
        <div>
          <h1>User Management</h1>
          <p>Manage {activeTab.toLowerCase()} accounts, permissions, and status</p>
        </div>
      </header>
      
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'USER' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('USER')}
        >
          Users
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'MODERATOR' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('MODERATOR')}
        >
          Moderators
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'ADMIN' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('ADMIN')}
        >
          Admins
        </button>
      </div>

      <div className={commonStyles.contentCard}>
        <div className={commonStyles.listContainer}>
          {loading ? <div className={commonStyles.loading}>Loading...</div> : (
            <div className={commonStyles.tableWrapper}>
              <table className={commonStyles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Stats</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                     <tr>
                       <td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>No users found for this role.</td>
                     </tr>
                  ) : users.map((u: any) => (
                    <tr key={u.id} style={{ opacity: u.status === 'LOCKED' ? 0.6 : 1 }}>
                      <td>
                        <Link to={`/admin/users/${u.id}`} className={styles.userInfo} style={{textDecoration: 'none'}}>
                          {u.avatarUrl ? (
                             <img src={u.avatarUrl} alt="avatar" className={styles.avatar} />
                          ) : (
                             <div className={styles.avatarPlaceholder}>{u.name.charAt(0).toUpperCase()}</div>
                          )}
                          <div>
                            <div className={styles.userName} style={{ color: '#2563eb' }}>{u.name}</div>
                            <div className={styles.userEmail}>{u.email}</div>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${u.status === 'LOCKED' ? styles.statusLocked : styles.statusActive}`}>
                          {u.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.statsList}>
                          <div>📝 Articles: {u._count?.articles || 0}</div>
                          <div>🏢 Businesses: {u._count?.ownedBusinesses || 0}</div>
                        </div>
                      </td>
                      <td>{new Date(u.joinedAt || u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <select 
                            value={u.role} 
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            disabled={userMutating}
                            className={commonStyles.selectInput}
                            style={{ padding: '0.25rem', fontSize: '0.85rem' }}
                          >
                            <option value="USER">Make User</option>
                            <option value="MODERATOR">Make Moderator</option>
                            <option value="ADMIN">Make Admin</option>
                          </select>
                          <button 
                            className={`${styles.lockBtn} ${u.status === 'LOCKED' ? styles.unlockBtn : ''}`}
                            onClick={() => handleToggleStatus(u.id, u.status || 'ACTIVE')}
                            disabled={userMutating}
                          >
                            {u.status === 'LOCKED' ? 'Unlock' : 'Lock'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Showing <b>{(page - 1) * limit + 1}</b> to <b>{Math.min(page * limit, totalItems)}</b> of <b>{totalItems}</b> users
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ display: 'flex', alignItems: 'center', padding: '0.375rem 0.75rem', background: '#fff', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: page === 1 ? '#9ca3af' : '#374151', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Page {page} of {totalPages}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ display: 'flex', alignItems: 'center', padding: '0.375rem 0.75rem', background: '#fff', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: page === totalPages ? '#9ca3af' : '#374151', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
