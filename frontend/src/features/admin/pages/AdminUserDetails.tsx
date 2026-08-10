import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import commonStyles from '../AdminCommon.module.css';
import styles from './AdminUsers.module.css';

export default function AdminUserDetails({ userId: propUserId }: { userId?: string }) {
  const params = useParams();
  const userId = propUserId || params.id;
  
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId]);

  const fetchUserDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users/admin/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedUserDetails(data);
      } else {
        toast.error('Failed to load user details');
      }
    } catch (error) {
      toast.error('Failed to load user details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateUserRole = async (newRole: string) => {
    if (!selectedUserDetails) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users/admin/${selectedUserDetails.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Failed to update role');
      toast.success(`User role updated to ${newRole}`);
      setSelectedUserDetails({ ...selectedUserDetails, role: newRole });
    } catch (error) {
      toast.error('Error updating role');
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUserDetails) return;
    const newStatus = selectedUserDetails.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users/admin/${selectedUserDetails.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`User account is now ${newStatus}`);
      setSelectedUserDetails({ ...selectedUserDetails, status: newStatus });
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  if (!userId) {
    return <div style={{ padding: '2rem' }}>No user ID provided.</div>;
  }

  if (loadingDetails) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading user details...</div>;
  }

  if (!selectedUserDetails) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>User not found.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <header className={commonStyles.header}>
        <h1>User Details</h1>
        <p>Manage profile, permissions, and status for {selectedUserDetails.name}</p>
      </header>

      <div className={commonStyles.contentCard}>
        {/* Header */}
        <div className={styles.detailsHeader}>
          {selectedUserDetails.avatarUrl ? (
             <img src={selectedUserDetails.avatarUrl} alt="avatar" className={styles.detailsAvatar} />
          ) : (
             <div className={styles.detailsAvatarPlaceholder}>{selectedUserDetails.name.charAt(0).toUpperCase()}</div>
          )}
          <div className={styles.detailsHeaderInfo}>
            <h2>{selectedUserDetails.name}</h2>
            <p>{selectedUserDetails.email}</p>
            <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
              <span className={`${styles.statusBadge} ${selectedUserDetails.status === 'LOCKED' ? styles.statusLocked : styles.statusActive}`}>
                {selectedUserDetails.status || 'ACTIVE'}
              </span>
              <span className={styles.roleBadge}>{selectedUserDetails.role}</span>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className={styles.detailsSection} style={{ marginTop: '2rem' }}>
          <h3>Profile Information</h3>
          <div className={styles.infoGrid}>
            <div><strong>Joined:</strong> {new Date(selectedUserDetails.joinedAt).toLocaleDateString()}</div>
            <div><strong>Location:</strong> {selectedUserDetails.location || 'N/A'}</div>
            <div><strong>Followers:</strong> {selectedUserDetails._count?.followers || 0}</div>
            <div><strong>Following:</strong> {selectedUserDetails._count?.following || 0}</div>
          </div>
          {selectedUserDetails.bio && (
            <div className={styles.bioBox} style={{ marginTop: '1rem' }}>
              <strong>Bio:</strong>
              <p>{selectedUserDetails.bio}</p>
            </div>
          )}
        </div>

        {/* Businesses */}
        <div className={styles.detailsSection} style={{ marginTop: '2rem' }}>
          <h3>Businesses Owned ({selectedUserDetails.ownedBusinesses?.length || 0})</h3>
          {selectedUserDetails.ownedBusinesses?.length > 0 ? (
            <ul className={styles.assetList}>
              {selectedUserDetails.ownedBusinesses.map((b: any) => (
                <li key={b.id} style={{ marginBottom: '0.5rem' }}>
                  <Link to={`/admin/businesses/${b.id}/edit`} className={commonStyles.link}>{b.name}</Link>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}> - {b.industry} ({b.status})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{color: '#6b7280'}}>No businesses created yet.</p>
          )}
        </div>

        {/* Articles */}
        <div className={styles.detailsSection} style={{ marginTop: '2rem' }}>
          <h3>Articles Published ({selectedUserDetails.articles?.length || 0})</h3>
          {selectedUserDetails.articles?.length > 0 ? (
            <ul className={styles.assetList}>
              {selectedUserDetails.articles.map((a: any) => (
                <li key={a.id} style={{ marginBottom: '0.5rem' }}>
                  <Link to={`/admin/articles/${a.id}`} className={commonStyles.link}>{a.title}</Link>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}> - {a.viewCount} views ({a.status})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{color: '#6b7280'}}>No articles published yet.</p>
          )}
        </div>
        
        {/* Actions */}
        <div className={styles.modalActions} style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
            <button 
              className={`${styles.lockBtn} ${selectedUserDetails.status === 'LOCKED' ? styles.unlockBtn : ''}`}
              onClick={handleToggleStatus}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 500, cursor: 'pointer', border: 'none', color: 'white', backgroundColor: selectedUserDetails.status === 'LOCKED' ? '#10b981' : '#ef4444' }}
            >
              {selectedUserDetails.status === 'LOCKED' ? 'Unlock Account' : 'Lock Account'}
            </button>
            <select 
              value={selectedUserDetails.role} 
              onChange={(e) => handleUpdateUserRole(e.target.value)}
              className={commonStyles.selectInput}
              style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
            >
              <option value="USER">Role: USER</option>
              <option value="MODERATOR">Role: MODERATOR</option>
              <option value="ADMIN">Role: ADMIN</option>
            </select>
        </div>
      </div>
    </div>
  );
}
