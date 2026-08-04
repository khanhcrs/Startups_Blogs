import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  LayoutGrid, 
  FileText, 
  Settings as SettingsIcon, 
  Eye, 
  Edit3, 
  Trash2,
  User as UserIcon,
  Bell,
  Lock,
  Bookmark,
  Users
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import styles from './UserProfile.module.css';
import { MOCK_ARTICLES } from '../utils/mockData';

type Tab = 'overview' | 'posts' | 'saved' | 'settings';
type SettingsTab = 'profile' | 'security' | 'notifications';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('profile');

  // MOCK DATA
  const CURRENT_USER_ID = 'u1'; // Assume logged in user is u1
  const isOwner = id === CURRENT_USER_ID;

  const authoredArticles = MOCK_ARTICLES.filter(a => a.author.id === id);
  const authorInfo = authoredArticles.length > 0 ? authoredArticles[0].author : {
    id: id || 'u1',
    name: 'Lê Hoàng Nam',
    bio: 'Co-Founder & CTO tại GreenFlow',
    businessId: 'b2',
    businessName: 'GreenFlow',
    followersCount: 1250,
    role: 'BUSINESS' // Testing conditional settings
  };

  const mockChartData = [
    { name: 'Mon', views: 4000, interactions: 2400 },
    { name: 'Tue', views: 3000, interactions: 1398 },
    { name: 'Wed', views: 2000, interactions: 9800 },
    { name: 'Thu', views: 2780, interactions: 3908 },
    { name: 'Fri', views: 1890, interactions: 4800 },
    { name: 'Sat', views: 2390, interactions: 3800 },
    { name: 'Sun', views: 3490, interactions: 4300 },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileBanner}></div>
      <div className={styles.container}>
        {/* HEADER SECTION */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            {getInitials(authorInfo.name)}
          </div>
          
          <div className={styles.userInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{authorInfo.name}</h1>
              {!isOwner && (
                <button 
                  className={following ? styles.followingBtn : styles.followBtn}
                  onClick={() => setFollowing(!following)}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            
            <p className={styles.bio}>{authorInfo.bio}</p>
            {authorInfo.businessId && (
              <Link to={`/business/${authorInfo.businessId}`} className={styles.businessLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                {authorInfo.businessName}
              </Link>
            )}
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{(authorInfo.followersCount || 0) + (following ? 1 : 0)}</span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{authoredArticles.length}</span>
                <span className={styles.statLabel}>Published</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {authoredArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0).toLocaleString()}
                </span>
                <span className={styles.statLabel}>Total Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD / CONTENT SECTION */}
        {isOwner ? (
          <div className={styles.dashboardLayout}>
            {/* SIDEBAR */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarNav}>
                <button 
                  className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <LayoutGrid size={18} /> Overview
                </button>
                <button 
                  className={`${styles.navItem} ${activeTab === 'posts' ? styles.active : ''}`}
                  onClick={() => setActiveTab('posts')}
                >
                  <FileText size={18} /> Posts Management
                </button>
                <button 
                  className={`${styles.navItem} ${activeTab === 'saved' ? styles.active : ''}`}
                  onClick={() => setActiveTab('saved')}
                >
                  <Bookmark size={18} /> Saved Articles
                </button>
                <button 
                  className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <SettingsIcon size={18} /> Account Settings
                </button>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className={styles.mainContent}>
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className={styles.fadeEnter}>
                  <h1 className={styles.pageTitle}>Welcome back, {authorInfo.name}! 👋</h1>
                  <p className={styles.pageSubtitle}>Here's what's happening with your account today.</p>
                  
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                        <Eye size={20} />
                      </div>
                      <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Total Views</p>
                        <p className={styles.statValue}>{authoredArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
                        <Users size={20} />
                      </div>
                      <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Followers</p>
                        <p className={styles.statValue}>{(authorInfo.followersCount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#FFF7ED', color: '#EA580C' }}>
                        <FileText size={20} />
                      </div>
                      <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Published Posts</p>
                        <p className={styles.statValue}>{authoredArticles.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.sectionHeader}>
                    <h2>Analytics Overview</h2>
                  </div>
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="views" fill="#F97316" radius={[4, 4, 0, 0]} name="Views" maxBarSize={40} />
                        <Line yAxisId="right" type="monotone" dataKey="interactions" stroke="#4F46E5" strokeWidth={3} name="Interactions" dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* POSTS MANAGEMENT */}
              {activeTab === 'posts' && (
                <div className={styles.fadeEnter}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h1 className={styles.pageTitle}>Posts Management</h1>
                      <p className={styles.pageSubtitle}>Manage your published articles and drafts.</p>
                    </div>
                    <button className={styles.primaryBtn}>+ Create New Post</button>
                  </div>
                  <div className={styles.tableContainer}>
                    <table className={styles.postsTable}>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Views</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {authoredArticles.map(post => (
                          <tr key={post.id}>
                            <td className={styles.postTitleCell}>{post.title}</td>
                            <td>{post.viewCount > 0 ? post.viewCount.toLocaleString() : '-'}</td>
                            <td className={styles.dateCell}>{formatDate(post.publishedAt || post.createdAt)}</td>
                            <td>
                              <div className={styles.actionBtns}>
                                <button className={styles.iconActionBtn} title="Edit"><Edit3 size={16} /></button>
                                <button className={`${styles.iconActionBtn} ${styles.deleteBtn}`} title="Delete"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className={styles.fadeEnter}>
                  <h1 className={styles.pageTitle}>Account Settings</h1>
                  <p className={styles.pageSubtitle}>Manage your profile, security, and preferences.</p>
                  
                  <div className={styles.settingsContainer}>
                    <div className={styles.settingsSidebar}>
                      <button 
                        className={`${styles.settingsNavItem} ${activeSettingsTab === 'profile' ? styles.active : ''}`}
                        onClick={() => setActiveSettingsTab('profile')}
                      >
                        <UserIcon size={16} /> Profile
                      </button>
                      <button 
                        className={`${styles.settingsNavItem} ${activeSettingsTab === 'security' ? styles.active : ''}`}
                        onClick={() => setActiveSettingsTab('security')}
                      >
                        <Lock size={16} /> Security
                      </button>
                      <button 
                        className={`${styles.settingsNavItem} ${activeSettingsTab === 'notifications' ? styles.active : ''}`}
                        onClick={() => setActiveSettingsTab('notifications')}
                      >
                        <Bell size={16} /> Notifications
                      </button>
                    </div>

                    <div className={styles.settingsContent}>
                      {activeSettingsTab === 'profile' && (
                        <div className={styles.settingsForm}>
                          <div className={styles.avatarUpload}>
                            <div className={styles.avatarCircle}>{getInitials(authorInfo.name)}</div>
                            <button className={styles.secondaryBtn}>Change Avatar</button>
                          </div>

                          {authorInfo.role === 'BUSINESS' ? (
                            <>
                              <h3>Business Profile</h3>
                              <div className={styles.formGroup}>
                                <label>Representative Name</label>
                                <input type="text" className={styles.inputField} defaultValue={authorInfo.name} />
                              </div>
                              <div className={styles.formGroup}>
                                <label>Company Name</label>
                                <input type="text" className={styles.inputField} defaultValue={authorInfo.businessName || ''} />
                              </div>
                              <div className={styles.formGroup}>
                                <label>Tax ID (Mã số thuế)</label>
                                <input type="text" className={styles.inputField} defaultValue="0101234567" />
                              </div>
                            </>
                          ) : (
                            <>
                              <h3>Personal Profile</h3>
                              <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input type="text" className={styles.inputField} defaultValue={authorInfo.name} />
                              </div>
                            </>
                          )}
                          
                          <div className={styles.formGroup}>
                            <label>Bio</label>
                            <textarea className={styles.textareaField} rows={4} defaultValue={authorInfo.bio}></textarea>
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label>LinkedIn URL</label>
                            <input type="text" className={styles.inputField} placeholder="https://linkedin.com/in/yourprofile" />
                          </div>

                          <button className={styles.primaryBtn} style={{marginTop: '1rem'}}>Save Changes</button>
                        </div>
                      )}

                      {activeSettingsTab === 'security' && (
                        <div className={styles.settingsForm}>
                          <h3>Change Password</h3>
                          <div className={styles.formGroup}>
                            <label>Current Password</label>
                            <input type="password" className={styles.inputField} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>New Password</label>
                            <input type="password" className={styles.inputField} />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Confirm New Password</label>
                            <input type="password" className={styles.inputField} />
                          </div>
                          <button className={styles.primaryBtn} style={{marginTop: '1rem'}}>Update Password</button>

                          <hr className={styles.divider} />
                          
                          <h3>Two-Factor Authentication (2FA)</h3>
                          <p className={styles.helperText}>Add an extra layer of security to your account.</p>
                          <button className={styles.secondaryBtn}>Enable 2FA</button>
                        </div>
                      )}

                      {activeSettingsTab === 'notifications' && (
                        <div className={styles.settingsForm}>
                          <h3>Email Notifications</h3>
                          
                          <div className={styles.toggleRow}>
                            <div>
                              <h4>Newsletter</h4>
                              <p className={styles.helperText}>Receive weekly updates and highlights.</p>
                            </div>
                            <label className={styles.toggleSwitch}>
                              <input type="checkbox" defaultChecked />
                              <span className={styles.toggleSlider}></span>
                            </label>
                          </div>

                          <div className={styles.toggleRow}>
                            <div>
                              <h4>New Followers</h4>
                              <p className={styles.helperText}>Get notified when someone follows you.</p>
                            </div>
                            <label className={styles.toggleSwitch}>
                              <input type="checkbox" defaultChecked />
                              <span className={styles.toggleSlider}></span>
                            </label>
                          </div>

                          <div className={styles.toggleRow}>
                            <div>
                              <h4>Comments</h4>
                              <p className={styles.helperText}>Get notified when someone comments on your post.</p>
                            </div>
                            <label className={styles.toggleSwitch}>
                              <input type="checkbox" />
                              <span className={styles.toggleSlider}></span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* SAVED */}
              {activeTab === 'saved' && (
                 <div className={styles.fadeEnter}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <h1 className={styles.pageTitle}>Saved Articles</h1>
                        <p className={styles.pageSubtitle}>Your private reading list.</p>
                      </div>
                    </div>
                    <div className={styles.tableContainer}>
                      <div style={{padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)'}}>
                        <Bookmark size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
                        <p>You haven't saved any articles yet.</p>
                      </div>
                    </div>
                 </div>
              )}
            </main>
          </div>
        ) : (
          /* PUBLIC VIEW */
          <>
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${styles.activeTab}`}>
                Published Blogs
              </button>
            </div>
            
            {authoredArticles.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No articles found in this section.</p>
              </div>
            ) : (
              <div className={styles.articlesGrid}>
                {authoredArticles.map(article => (
                  <div key={article.id} className={styles.articleCard}>
                    {article.coverImage && (
                      <img src={article.coverImage} alt={article.title} className={styles.cardImage} />
                    )}
                    <div className={styles.cardContent}>
                      <span className={styles.cardCategory}>{article.category}</span>
                      <Link to={`/blogs/${article.slug}`} className={styles.cardTitle}>
                        {article.title}
                      </Link>
                      <p className={styles.cardSummary}>{article.summary}</p>
                      <div className={styles.cardFooter}>
                        <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
