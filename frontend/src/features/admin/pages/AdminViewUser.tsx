import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAdminTabsStore } from '../../../store/adminTabsStore';
import { api } from '../../../lib/axios';
import commonStyles from '../AdminCommon.module.css';
import profileStyles from '../../../pages/UserProfile.module.css';
import { 
  LayoutGrid, 
  FileText, 
  Settings as SettingsIcon, 
  Building2,
  Edit3,
  Eye
} from 'lucide-react';

type Tab = 'overview' | 'posts' | 'businesses' | 'settings';

export default function AdminViewUser({ userId: propUserId }: { userId?: string }) {
  const params = useParams();
  const location = useLocation();
  const updateTabTitle = useAdminTabsStore(state => state.updateTabTitle);
  const userId = propUserId || params.id;
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [settingsActiveTab, setSettingsActiveTab] = useState('profile');
  
  // Settings Form State
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    avatarUrl: '',
    role: 'USER',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const res = await api.get(`/users/admin/${userId}`);
      const data = res.data;
      const userData = data.data || data;
        setUser(userData);
        setEditData({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          location: userData.location || '',
          avatarUrl: userData.avatarUrl || '',
          role: userData.role || 'USER',
          status: userData.status || 'ACTIVE'
        });
        updateTabTitle(location.pathname, `User: ${userData.name.length > 15 ? userData.name.substring(0, 15) + '...' : userData.name}`);
    } catch (error) {
      toast.error('Error fetching user details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/admin/${userId}`, editData);
      toast.success('User profile updated successfully');
      fetchUserDetails();
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  if (loading) {
    return <div className={commonStyles.container} style={{ padding: '2rem' }}>Loading user details...</div>;
  }

  if (!user) {
    return <div className={commonStyles.container} style={{ padding: '2rem' }}>User not found.</div>;
  }

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100%' }}>
      <div className={profileStyles.profileBanner} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}></div>
      <div className={profileStyles.container} style={{ padding: '0 2rem', paddingBottom: '4rem' }}>
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              getInitials(user.name)
            )}
          </div>
          
          <div className={profileStyles.userInfo}>
            <div className={profileStyles.nameRow}>
              <h1 className={profileStyles.name}>{user.name}</h1>
              <span style={{
                padding: '2px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: user.status === 'LOCKED' ? '#fef2f2' : '#f0fdf4',
                color: user.status === 'LOCKED' ? '#991b1b' : '#166534',
                border: `1px solid ${user.status === 'LOCKED' ? '#fca5a5' : '#86efac'}`
              }}>
                {user.status}
              </span>
              <span style={{
                padding: '2px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1'
              }}>
                {user.role}
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{user.email}</div>
            
            <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '0.85rem' }}>
              {user.location && <span>📍 {user.location}</span>}
              <span>📅 Joined {formatDate(user.joinedAt || user.createdAt)}</span>
            </div>
            
            <div className={profileStyles.stats} style={{ marginTop: '10px' }}>
              <div className={profileStyles.statItem} style={{ marginBottom: 0 }}>
                <span className={profileStyles.statValue} style={{ fontSize: '1.25rem' }}>
                  <Eye size={18} color="#64748B" style={{marginRight: 6, verticalAlign: 'middle'}}/>
                  {user._count?.followers || 0}
                </span>
                <span className={profileStyles.statLabel} style={{ fontSize: '0.75rem' }}>FOLLOWERS</span>
              </div>
              <div className={profileStyles.statItem} style={{ marginBottom: 0 }}>
                <span className={profileStyles.statValue} style={{ fontSize: '1.25rem' }}>
                  <Edit3 size={18} color="#64748B" style={{marginRight: 6, verticalAlign: 'middle'}}/>
                  {user.articles?.length || 0}
                </span>
                <span className={profileStyles.statLabel} style={{ fontSize: '0.75rem' }}>ARTICLES</span>
              </div>
              <div className={profileStyles.statItem} style={{ marginBottom: 0 }}>
                <span className={profileStyles.statValue} style={{ fontSize: '1.25rem' }}>
                  <Building2 size={18} color="#64748B" style={{marginRight: 6, verticalAlign: 'middle'}}/>
                  {user.ownedBusinesses?.length || 0}
                </span>
                <span className={profileStyles.statLabel} style={{ fontSize: '0.75rem' }}>BUSINESSES</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div 
          className={profileStyles.tabs} 
          style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 20, 
            backgroundColor: '#F8FAFC',
            paddingTop: '16px',
            margin: '0 -2rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            marginBottom: '32px'
          }}
        >
          <button 
            className={`${profileStyles.tab} ${activeTab === 'overview' ? profileStyles.activeTab : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutGrid size={20} /> Overview
          </button>
          <button 
            className={`${profileStyles.tab} ${activeTab === 'posts' ? profileStyles.activeTab : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <FileText size={20} /> Posts Management
          </button>
          <button 
            className={`${profileStyles.tab} ${activeTab === 'businesses' ? profileStyles.activeTab : ''}`}
            onClick={() => setActiveTab('businesses')}
          >
            <Building2 size={20} /> Businesses
          </button>
          <button 
            className={`${profileStyles.tab} ${activeTab === 'settings' ? profileStyles.activeTab : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon size={20} /> Edit Settings
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'overview' && (
          <div className={profileStyles.chartCard}>
            <div className={profileStyles.chartHeader}>
              <h2>Overview Analytics (Coming Soon)</h2>
            </div>
            <div style={{ padding: '20px', color: 'var(--text-muted)' }}>
              Biểu đồ thống kê sẽ được cập nhật khi có API.
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className={profileStyles.tableContainer}>
            <div className={profileStyles.tableScrollWrapper}>
              <table className={profileStyles.postsTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(user.articles || []).map((post: any) => (
                    <tr key={post.id}>
                      <td className={profileStyles.postTitleCell}>
                        <div className={profileStyles.postCellContent}>
                          <div className={profileStyles.postTitleText}>
                            {post.title}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: post.status === 'PUBLISHED' ? '#dcfce7' : post.status === 'PENDING' ? '#fef08a' : post.status === 'PENDING_DELETE' ? '#fee2e2' : '#f3f4f6',
                          color: post.status === 'PUBLISHED' ? '#166534' : post.status === 'PENDING' ? '#854d0e' : post.status === 'PENDING_DELETE' ? '#991b1b' : '#374151',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 600
                        }}>
                          {post.status}
                        </span>
                      </td>
                      <td>{post.viewCount || 0}</td>
                      <td>{formatDate(post.createdAt)}</td>
                      <td>
                        <Link to={`/admin/articles/${post.id}/edit`} className={profileStyles.actionBtn} title="Edit in Admin">
                          <Edit3 size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {(!user.articles || user.articles.length === 0) && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        This user hasn't published any articles yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'businesses' && (
          <div className={profileStyles.tableContainer}>
            <div className={profileStyles.tableScrollWrapper}>
              <table className={profileStyles.postsTable}>
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Industry</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(user.ownedBusinesses || []).map((business: any) => (
                    <tr key={business.id}>
                      <td className={profileStyles.postTitleCell}>
                        <div className={profileStyles.postCellContent}>
                          <div className={profileStyles.postTitleText}>
                            {business.name}
                          </div>
                        </div>
                      </td>
                      <td>{business.industry}</td>
                      <td>
                        <span style={{
                          backgroundColor: business.status === 'VERIFIED' ? '#dcfce7' : business.status === 'PENDING' ? '#fef08a' : business.status === 'REJECTED' ? '#fee2e2' : '#f3f4f6',
                          color: business.status === 'VERIFIED' ? '#166534' : business.status === 'PENDING' ? '#854d0e' : business.status === 'REJECTED' ? '#991b1b' : '#374151',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 600
                        }}>
                          {business.status}
                        </span>
                      </td>
                      <td>{formatDate(business.createdAt)}</td>
                      <td>
                        <Link to={`/admin/businesses/${business.id}/edit`} className={profileStyles.actionBtn} title="Edit in Admin">
                          <Edit3 size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {(!user.ownedBusinesses || user.ownedBusinesses.length === 0) && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        This user doesn't own any businesses.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={profileStyles.settingsLayout}>
            {/* Sidebar */}
            <div className={profileStyles.settingsSidebar}>
              <button 
                className={`${profileStyles.settingsSidebarBtn} ${settingsActiveTab === 'profile' ? profileStyles.settingsSidebarBtnActive : ''}`}
                onClick={() => setSettingsActiveTab('profile')}
              >
                Profile Details
              </button>
              <button 
                className={`${profileStyles.settingsSidebarBtn} ${settingsActiveTab === 'admin' ? profileStyles.settingsSidebarBtnActive : ''}`}
                onClick={() => setSettingsActiveTab('admin')}
              >
                Admin Controls
              </button>
            </div>
            
            {/* Content Area */}
            <div className={profileStyles.settingsContent}>
              {settingsActiveTab === 'profile' && (
                <div className={profileStyles.settingsCard}>
                  <h2 className={profileStyles.settingsTitle}>Profile Details</h2>
                  
                  <form onSubmit={handleSaveProfile}>
                    <div className={profileStyles.formGroup}>
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        className={profileStyles.inputField}
                        value={editData.name} 
                        onChange={e => setEditData({...editData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className={profileStyles.formGroup}>
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        className={profileStyles.inputField}
                        value={editData.email} 
                        onChange={e => setEditData({...editData, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className={profileStyles.formGroup}>
                      <label>Avatar URL</label>
                      <input 
                        type="url" 
                        className={profileStyles.inputField}
                        value={editData.avatarUrl} 
                        onChange={e => setEditData({...editData, avatarUrl: e.target.value})}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    
                    <div className={profileStyles.formGroup}>
                      <label>Location</label>
                      <input 
                        type="text" 
                        className={profileStyles.inputField}
                        value={editData.location} 
                        onChange={e => setEditData({...editData, location: e.target.value})}
                        placeholder="e.g. Hanoi, Vietnam"
                      />
                    </div>
                    
                    <div className={profileStyles.formGroup}>
                      <label>Bio</label>
                      <textarea 
                        className={profileStyles.textareaField}
                        rows={4}
                        value={editData.bio} 
                        onChange={e => setEditData({...editData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <button type="submit" className={profileStyles.primaryBtn}>
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {settingsActiveTab === 'admin' && (
                <div className={profileStyles.settingsCard}>
                  <h2 className={profileStyles.settingsTitle}>Admin Controls</h2>
                  
                  <div className={profileStyles.formGroup}>
                    <label>Account Status</label>
                    <select 
                      className={profileStyles.inputField}
                      value={editData.status} 
                      onChange={e => setEditData({...editData, status: e.target.value})}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="LOCKED">Locked</option>
                      <option value="BANNED">Banned</option>
                    </select>
                  </div>
                  
                  <div className={profileStyles.formGroup}>
                    <label>Account Role</label>
                    <select 
                      className={profileStyles.inputField}
                      value={editData.role} 
                      onChange={e => setEditData({...editData, role: e.target.value})}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  <button 
                    className={profileStyles.primaryBtn} 
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
