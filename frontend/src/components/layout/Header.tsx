import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Sun, ChevronDown, User, Settings, LogOut, Edit, Briefcase, Shield, ShieldAlert } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/axios';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications').then(res => {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
      }).catch(err => console.error(err));
    }
  }, [isAuthenticated, showNotif]); // Refresh when opening dropdown

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const location = useLocation();
  const path = location.pathname;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
            </svg>
          </div>
          <span className={styles.logoText}>Startups Blogs</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link to="/" className={`${styles.navLink} ${path === '/' ? styles.active : ''}`}>Home</Link>
          <Link to="/businesses" className={`${styles.navLink} ${path.includes('/businesses') || path.includes('/startups') ? styles.active : ''}`}>Explore Businesses</Link>
          <Link to="/news" className={`${styles.navLink} ${path.includes('/news') ? styles.active : ''}`}>News</Link>
          <Link to="/blogs" className={`${styles.navLink} ${path.includes('/blogs') ? styles.active : ''}`}>Blogs</Link>
          {isAuthenticated && (
            <Link to="/notifications" className={`${styles.navLink} ${path.includes('/notifications') ? styles.active : ''}`}>Notifications</Link>
          )}
          <Link to="/about" className={`${styles.navLink} ${path.includes('/about') ? styles.active : ''}`}>About Us</Link>
        </nav>

        <div className={styles.actions}>
          {!isAuthenticated && (
            <button className={styles.searchBtn} aria-label="Search">
              <Search size={20} />
            </button>
          )}
          
          {isAuthenticated ? (
            <div className={styles.loggedInActions}>
              <button className={styles.iconBtn} aria-label="Theme">
                <Sun size={20} />
              </button>
              
              <div className={styles.relativeBox}>
                <button className={styles.iconBtn} aria-label="Notifications" onClick={() => setShowNotif(!showNotif)}>
                  <Bell size={20} />
                  {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                </button>
                
                {showNotif && (
                  <div className={styles.notifDropdown}>
                    <div className={styles.notifHeader}>
                      <span>Notifications</span>
                      <span className={styles.markRead} onClick={handleMarkAllAsRead} style={{cursor: 'pointer'}}>Mark all as read</span>
                    </div>
                    <div className={styles.notifList}>
                      {notifications.length === 0 ? (
                         <div style={{padding: '1rem', textAlign: 'center', color: '#6b7280'}}>No notifications.</div>
                      ) : (
                        notifications.slice(0, 5).map((notif: any) => (
                          <div className={styles.notifItem} key={notif.id}>
                            <div className={`${styles.notifDot} ${!notif.isRead ? styles.unread : ''}`}></div>
                            <div className={styles.notifContent}>
                              <p className={styles.notifTitle}>{notif.title}</p>
                              <p className={styles.notifDesc}>{notif.message}</p>
                              <p className={styles.notifTime}>{new Date(notif.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Link to="/notifications" className={styles.notifFooter} onClick={() => setShowNotif(false)}>
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>

              <div className={styles.relativeBox} ref={dropdownRef}>
                <div className={styles.userMenu} onClick={() => setShowDropdown(!showDropdown)}>
                  <div className={styles.avatarImg} style={{ 
                    background: 'var(--primary-500)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold' 
                  }}>
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown size={16} className={styles.chevron} />
                </div>

                {showDropdown && (
                  <div className={styles.userDropdown}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>{user?.firstName} {user?.lastName}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
                    </div>
                    <Link to="/user/me" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                      <User size={16} /> Profile & Dashboard
                    </Link>
                    
                    <div className={styles.dropdownDivider}></div>
                    
                    <Link to="/create-blog" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                      <Edit size={16} /> Write Blog
                    </Link>
                    <Link to="/raise-capital" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                      <Briefcase size={16} /> Raise Capital
                    </Link>
                    
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                        <ShieldAlert size={16} /> Admin Panel
                      </Link>
                    )}
                    
                    <div className={styles.dropdownDivider}></div>
                    
                    <div className={`${styles.dropdownItem} ${styles.logoutText}`} onClick={() => { handleLogout(); setShowDropdown(false); }}>
                      <LogOut size={16} /> Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.navLink} style={{marginRight: '0.5rem'}}>Log In</Link>
              <Link to="/register" className={styles.loginBtn}>Sign Up</Link>
              <Link to="/raise-capital" className={styles.primaryBtn}>Raise Capital</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
