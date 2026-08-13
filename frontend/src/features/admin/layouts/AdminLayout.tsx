import { useLayoutEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, FileText, X } from 'lucide-react';
import { useAdminTabsStore } from '../../../store/adminTabsStore';
import styles from './AdminLayout.module.css';

// Import all admin pages
import AdminOverview from '../pages/AdminOverview';
import AdminBusinesses from '../pages/AdminBusinesses';
import AdminUsers from '../pages/AdminUsers';
import AdminArticles from '../pages/AdminArticles';
import AdminEditBusiness from '../pages/AdminEditBusiness';
import AdminViewBusiness from '../pages/AdminViewBusiness';
import AdminEditArticle from '../pages/AdminEditArticle';
import AdminViewArticle from '../pages/AdminViewArticle';
import AdminViewUser from '../pages/AdminViewUser';

const renderTabContent = (path: string) => {
  if (path === '/admin/overview' || path === '/admin' || path === '/admin/dashboard') return <AdminOverview />;
  if (path === '/admin/businesses') return <AdminBusinesses />;
  if (path === '/admin/users') return <AdminUsers />;
  if (path === '/admin/articles') return <AdminArticles />;
  
  const editBusinessMatch = path.match(/^\/admin\/businesses\/(.+)\/edit$/);
  if (editBusinessMatch) return <AdminEditBusiness businessId={editBusinessMatch[1]} />;

  const editArticleMatch = path.match(/^\/admin\/articles\/(.+)\/edit$/);
  if (editArticleMatch) return <AdminEditArticle articleId={editArticleMatch[1]} />;

  const viewArticleMatch = path.match(/^\/admin\/articles\/(.+)$/);
  if (viewArticleMatch && path.split('/').length === 4) return <AdminViewArticle articleId={viewArticleMatch[1]} />;

  const viewUserMatch = path.match(/^\/admin\/users\/(.+)$/);
  if (viewUserMatch && path.split('/').length === 4) return <AdminViewUser userId={viewUserMatch[1]} />;

  const viewBusinessMatch = path.match(/^\/admin\/businesses\/(.+)$/);
  if (viewBusinessMatch && path.split('/').length === 4) return <AdminViewBusiness businessId={viewBusinessMatch[1]} />;

  return <div style={{ padding: '2rem' }}>Page not found for path: {path}</div>;
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, activePath, addTab, removeTab, setActiveTab, setTabs } = useAdminTabsStore();

  useLayoutEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      let title = 'Admin';
      if (location.pathname.includes('/overview') || location.pathname === '/admin') title = 'Overview';
      else if (location.pathname.match(/^\/admin\/businesses\/.+\/edit$/)) title = 'Edit Business';
      else if (location.pathname.match(/^\/admin\/businesses\/.+$/)) title = 'View Business';
      else if (location.pathname === '/admin/businesses') title = 'Businesses';
      else if (location.pathname === '/admin/users') title = 'Users';
      else if (location.pathname.match(/^\/admin\/articles\/.+\/edit$/)) title = 'Edit Article';
      else if (location.pathname.match(/^\/admin\/articles\/.+$/)) title = 'View Article';
      else if (location.pathname === '/admin/articles') title = 'Articles';
      
      addTab({ id: location.pathname, path: location.pathname, title });
    }
  }, [location.pathname, addTab]);

  // When activePath changes from closing a tab, navigate to the new active path
  // to keep the URL in sync. Wait, actually we can just navigate.
  const handleTabClick = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation(); // prevent tab click
    e.preventDefault();
    removeTab(path);
    const newActivePath = useAdminTabsStore.getState().activePath;
    if (newActivePath && newActivePath !== location.pathname) {
      navigate(newActivePath, { replace: true });
    }
  };

  const getMenuClass = (path: string) => {
    return location.pathname.includes(path) ? `${styles.menuItem} ${styles.activeMenuItem}` : styles.menuItem;
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Admin Panel</div>
        <nav>
          <Link to="/admin/overview" className={getMenuClass('overview')}>
            <LayoutDashboard size={20} /> Overview
          </Link>
          <Link to="/admin/businesses" className={getMenuClass('businesses')}>
            <Building2 size={20} /> Businesses
          </Link>
          <Link to="/admin/users" className={getMenuClass('users')}>
            <Users size={20} /> Users
          </Link>
          <Link to="/admin/articles" className={getMenuClass('articles')}>
            <FileText size={20} /> Articles
          </Link>
          
          <div style={{ marginTop: '2rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
            <Link to="/" className={styles.menuItem} target="_blank" rel="noopener noreferrer">
               Back to Public Site
            </Link>
          </div>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {/* Tab Bar */}
        <div className={styles.tabBar} style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
          {tabs.map((tab) => (
            <div
              key={tab.path}
              className={`${styles.tab} ${tab.path === activePath ? styles.activeTab : ''}`}
              onClick={() => handleTabClick(tab.path)}
              style={{ cursor: 'pointer' }}
            >
              <span className={styles.tabTitle}>{tab.title}</span>
              <button 
                className={styles.closeTabBtn} 
                onClick={(e) => handleCloseTab(e, tab.path)}
                title="Close tab"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Render ALL tabs but hide inactive ones */}
        <div className={styles.tabContents}>
          {tabs.map((tab) => (
            <div 
              key={tab.path} 
              style={{ 
                display: tab.path === activePath ? 'flex' : 'none', 
                flexDirection: 'column',
                height: '100%', 
                overflowY: 'auto',
                padding: ((tab.path !== '/admin/users' && tab.path.startsWith('/admin/users/')) || (tab.path !== '/admin/businesses' && tab.path.startsWith('/admin/businesses/') && !tab.path.endsWith('/edit'))) ? '0' : '2rem',
                boxSizing: 'border-box'
              }}
            >
              {renderTabContent(tab.path)}
            </div>
          ))}
          {tabs.length === 0 && (
            <div style={{ padding: '2rem', color: '#64748b' }}>No tabs open. Select an item from the sidebar.</div>
          )}
        </div>
      </main>
    </div>
  );
}
