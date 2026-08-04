import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  LayoutGrid, 
  FileText, 
  Settings as SettingsIcon, 
  Edit3, 
  Trash2,
  Bookmark,
  MapPin,
  Calendar,
  Globe,
  Link2,
  Mail,
  MessageSquare,
  Users,
  Eye,
  Building2
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
type SubSettingsTab = 'profile' | 'social' | 'notifications';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [settingsActiveTab, setSettingsActiveTab] = useState<SubSettingsTab>('profile');
  const [forceRender, setForceRender] = useState(0);
  const [postSearchTerm, setPostSearchTerm] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState('ALL');
  const [postDateFrom, setPostDateFrom] = useState('');
  const [postDateTo, setPostDateTo] = useState('');
  const [chartTimeRange, setChartTimeRange] = useState('7days');

  // In a real app, this would come from an auth context
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    // Basic mock check: if the requested ID matches the mock logged in user
    // For simplicity, we just assume if they navigate to /user/u1 and they are logged in, it's them.
    const loggedIn = localStorage.getItem('mockLoggedIn') === 'true';
    setIsOwner(loggedIn && (id === 'u1' || !id)); 
    
    if (loggedIn && id === 'u1') {
      setActiveTab('overview');
    }
  }, [id]);

  const targetId = id || 'u1';
  const authoredArticles = MOCK_ARTICLES.filter(a => a.author.id === targetId);
  const authorInfo = authoredArticles.length > 0 ? {
    ...authoredArticles[0].author,
    location: 'Ho Chi Minh City, Vietnam',
    joinedAt: 'August 2026'
  } : {
    id: targetId,
    name: 'Lê Hoàng Nam',
    bio: 'Co-Founder & CTO tại GreenFlow. Xây dựng nền tảng SaaS quản lý năng lượng thông minh cho nhà máy.',
    businessId: 'b2',
    businessName: 'GreenFlow',
    followersCount: 1250,
    location: 'Ho Chi Minh City, Vietnam',
    joinedAt: 'August 2026'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const handleDelete = (postId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không? Bài viết sẽ được chuyển vào trạng thái chờ duyệt xóa.')) {
      const article = MOCK_ARTICLES.find(a => a.id === postId);
      if (article) {
        article.status = 'PENDING_DELETE';
        setForceRender(prev => prev + 1);
        alert('Yêu cầu xóa đã được gửi cho Admin duyệt.');
      }
    }
  };

  const publishedArticles = authoredArticles.filter(a => a.status === 'PUBLISHED');
  
  const filteredPosts = authoredArticles.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(postSearchTerm.toLowerCase());
    const matchesStatus = postStatusFilter === 'ALL' || post.status === postStatusFilter;
    
    let matchesDate = true;
    if (postDateFrom || postDateTo) {
      const postDate = new Date(post.publishedAt || post.createdAt).toISOString().split('T')[0];
      if (postDateFrom && postDate < postDateFrom) matchesDate = false;
      if (postDateTo && postDate > postDateTo) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const mockChartData = [
    { name: 'Mon', views: 4000, interactions: 2400 },
    { name: 'Tue', views: 3000, interactions: 1398 },
    { name: 'Wed', views: 2000, interactions: 9800 },
    { name: 'Thu', views: 2780, interactions: 3908 },
    { name: 'Fri', views: 1890, interactions: 4800 },
    { name: 'Sat', views: 2390, interactions: 3800 },
    { name: 'Sun', views: 3490, interactions: 4300 },
  ];

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
            </div>
            
            <p className={styles.bio}>{authorInfo.bio}</p>
            
            <div className={styles.userMetaRow}>
              {authorInfo.location && (
                <span className={styles.metaItem}>
                  <MapPin size={18} /> {authorInfo.location}
                </span>
              )}
              {authorInfo.joinedAt && (
                <span className={styles.metaItem}>
                  <Calendar size={18} /> Joined {authorInfo.joinedAt}
                </span>
              )}
              {authorInfo.businessId && (
                <Link to={`/businesses/${authorInfo.businessId}`} className={styles.businessLink}>
                  <Building2 size={16} />
                  {authorInfo.businessName}
                </Link>
              )}
            </div>

            <div className={styles.socialLinks}>
              <button className={styles.socialIconBtn} aria-label="Website"><Globe size={18} /></button>
              <button className={styles.socialIconBtn} aria-label="Portfolio"><Link2 size={18} /></button>
              <button className={styles.socialIconBtn} aria-label="Email"><Mail size={18} /></button>
            </div>

            {!isOwner && (
              <div className={styles.actionButtons}>
                <button 
                  className={following ? styles.followingBtn : styles.followBtn}
                  onClick={() => setFollowing(!following)}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
                <button className={styles.messageBtn}>
                  <MessageSquare size={18} /> Message
                </button>
              </div>
            )}
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  <Users size={20} color="#64748B" style={{marginRight: 8, verticalAlign: 'middle'}}/>
                  {(authorInfo.followersCount || 0) + (following ? 1 : 0)}
                </span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  <Edit3 size={20} color="#64748B" style={{marginRight: 8, verticalAlign: 'middle'}}/>
                  {publishedArticles.length}
                </span>
                <span className={styles.statLabel}>Published</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  <Eye size={20} color="#64748B" style={{marginRight: 8, verticalAlign: 'middle'}}/>
                  {publishedArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0).toLocaleString()}
                </span>
                <span className={styles.statLabel}>Total Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className={styles.tabs}>
          {isOwner ? (
            <>
              <button 
                className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <LayoutGrid size={20} /> Overview
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'posts' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                <FileText size={20} /> Posts Management
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'saved' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <Bookmark size={20} /> Saved
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <SettingsIcon size={20} /> Settings
              </button>
            </>
          ) : (
            <button className={`${styles.tab} ${styles.activeTab}`}>
              <FileText size={20} /> Published Blogs
            </button>
          )}
        </div>
        
        {/* TAB CONTENTS */}
        {activeTab === 'overview' && isOwner && (
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2>Engagement Over Time</h2>
              <select 
                className={styles.filterSelect}
                value={chartTimeRange}
                onChange={(e) => setChartTimeRange(e.target.value)}
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="alltime">All Time</option>
              </select>
            </div>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 14}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 14}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 14}} />
                  <Tooltip contentStyle={{borderRadius: '8px', fontSize: '16px'}} />
                  <Legend wrapperStyle={{paddingTop: '20px', fontSize: '16px'}}/>
                  <Bar yAxisId="left" dataKey="views" fill="#F97316" radius={[4, 4, 0, 0]} name="Views" maxBarSize={50} />
                  <Line yAxisId="right" type="monotone" dataKey="interactions" stroke="#4F46E5" strokeWidth={4} name="Interactions" dot={{r: 6}} activeDot={{r: 8}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          isOwner ? (
            <div className={styles.tableContainer}>
              <div className={styles.tableFilters}>
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className={styles.searchInput}
                  value={postSearchTerm}
                  onChange={(e) => setPostSearchTerm(e.target.value)}
                />
                <select 
                  className={styles.filterSelect}
                  value={postStatusFilter}
                  onChange={(e) => setPostStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="PENDING">Pending</option>
                  <option value="PENDING_DELETE">Pending Delete</option>
                </select>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input 
                    type="date"
                    className={styles.filterSelect}
                    value={postDateFrom}
                    onChange={(e) => setPostDateFrom(e.target.value)}
                    title="Từ ngày"
                  />
                  <span style={{color: '#64748B'}}>-</span>
                  <input 
                    type="date"
                    className={styles.filterSelect}
                    value={postDateTo}
                    onChange={(e) => setPostDateTo(e.target.value)}
                    title="Đến ngày"
                  />
                </div>
              </div>
              <div className={styles.tableScrollWrapper}>
                <table className={styles.postsTable}>
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
                  {filteredPosts.map(post => (
                    <tr key={post.id}>
                      <td className={styles.postTitleCell}>
                        <div className={styles.postCellContent}>
                          {post.coverImage ? (
                            <img src={post.coverImage} alt="" className={styles.postThumbnail} />
                          ) : (
                            <div className={styles.postThumbnailPlaceholder}>
                              <FileText size={20} />
                            </div>
                          )}
                          <div className={styles.postTitleText}>
                            {post.status === 'PUBLISHED' ? (
                              <Link to={`/blogs/${post.slug}`} style={{color: 'inherit', textDecoration: 'none'}}>{post.title}</Link>
                            ) : (
                              post.title
                            )}
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
                      <td>{post.viewCount > 0 ? post.viewCount.toLocaleString() : '-'}</td>
                      <td>{formatDate(post.publishedAt || post.createdAt)}</td>
                      <td>
                        <div className={styles.actionBtns}>
                          <Link to={`/edit-blog/${post.id}`} className={styles.iconActionBtn} title="Edit">
                            <Edit3 size={20} />
                          </Link>
                          <button 
                            className={`${styles.iconActionBtn} ${styles.deleteBtn}`} 
                            title="Delete"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {authoredArticles.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{textAlign: 'center', padding: '60px 20px', color: '#64748B', fontSize: '1.2rem'}}>
                        No posts found. Start writing!
                        <br />
                        <Link to="/create-blog" className={styles.primaryBtn} style={{marginTop: 24}}>+ Write New Post</Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {authoredArticles.length > 0 && (
                <div style={{padding: '24px', borderTop: '1px solid #E2E8F0', textAlign: 'right'}}>
                  <Link to="/create-blog" className={styles.primaryBtn}>+ Write New Post</Link>
                </div>
              )}
            </div>
          ) : (
            <>
              {publishedArticles.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No articles found in this section.</p>
                </div>
              ) : (
                <div className={styles.articlesGrid}>
                  {publishedArticles.map(article => (
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
                          <span>{article.viewCount > 0 ? article.viewCount.toLocaleString() : '-'} views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )
        )}

        {activeTab === 'saved' && isOwner && (
           <div className={styles.emptyState}>
             <Bookmark size={48} style={{margin: '0 auto 16px', color: '#CBD5E1'}} />
             <p>Articles you save will appear here.</p>
           </div>
        )}

        {activeTab === 'settings' && isOwner && (
          <div className={styles.settingsLayout}>
            {/* Sidebar */}
            <div className={styles.settingsSidebar}>
              <button 
                className={`${styles.settingsSidebarBtn} ${settingsActiveTab === 'profile' ? styles.settingsSidebarBtnActive : ''}`}
                onClick={() => setSettingsActiveTab('profile')}
              >
                Profile Details
              </button>
              <button 
                className={`${styles.settingsSidebarBtn} ${settingsActiveTab === 'social' ? styles.settingsSidebarBtnActive : ''}`}
                onClick={() => setSettingsActiveTab('social')}
              >
                Social Links
              </button>
              <button 
                className={`${styles.settingsSidebarBtn} ${settingsActiveTab === 'notifications' ? styles.settingsSidebarBtnActive : ''}`}
                onClick={() => setSettingsActiveTab('notifications')}
              >
                Notification Preferences
              </button>
            </div>

            {/* Content Area */}
            <div className={styles.settingsContent}>
              {settingsActiveTab === 'profile' && (
                <div className={styles.settingsCard}>
                  <h2 className={styles.settingsTitle}>Profile Details</h2>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" className={styles.inputField} defaultValue={authorInfo.name} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input type="email" className={styles.inputField} defaultValue="nam.le@greenflow.vn" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Role / Job Title</label>
                    <input type="text" className={styles.inputField} defaultValue="Co-Founder & CTO" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Bio</label>
                    <textarea className={styles.textareaField} rows={4} defaultValue={authorInfo.bio}></textarea>
                  </div>
                  <button className={styles.primaryBtn} style={{marginTop: 16}}>Save Changes</button>
                </div>
              )}

              {settingsActiveTab === 'social' && (
                <div className={styles.settingsCard}>
                  <h2 className={styles.settingsTitle}>Social Links</h2>
                  <div className={styles.formGroup}>
                    <label>LinkedIn URL</label>
                    <input type="url" className={styles.inputField} placeholder="https://linkedin.com/in/username" defaultValue="https://linkedin.com/in/namle" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Twitter URL</label>
                    <input type="url" className={styles.inputField} placeholder="https://twitter.com/username" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Personal Website</label>
                    <input type="url" className={styles.inputField} placeholder="https://yourwebsite.com" />
                  </div>
                  <button className={styles.primaryBtn} style={{marginTop: 16}}>Update Socials</button>
                </div>
              )}

              {settingsActiveTab === 'notifications' && (
                <div className={styles.settingsCard}>
                  <h2 className={styles.settingsTitle}>Notification Preferences</h2>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Email me when my post is approved
                    </label>
                  </div>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Email me when someone follows me
                    </label>
                  </div>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" />
                      Weekly newsletter and platform updates
                    </label>
                  </div>
                  <button className={styles.primaryBtn} style={{marginTop: 16}}>Save Preferences</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
