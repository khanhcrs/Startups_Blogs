import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Sun, ChevronDown, User, Settings, LogOut, Edit, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    // Check if user is mock logged in
    const status = localStorage.getItem('mockLoggedIn');
    if (status === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mockLoggedIn');
    setIsLoggedIn(false);
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
          
        </nav>

        <div className={styles.actions}>
          {!isLoggedIn && (
            <button className={styles.searchBtn} aria-label="Search">
              <Search size={20} />
            </button>
          )}
          
          {isLoggedIn ? (
            <div className={styles.loggedInActions}>
              <button className={styles.iconBtn} aria-label="Theme">
                <Sun size={20} />
              </button>
              
              <div className={styles.relativeBox}>
                <button className={styles.iconBtn} aria-label="Notifications" onClick={() => setShowNotif(!showNotif)}>
                  <Bell size={20} />
                  <span className={styles.badge}>4</span>
                </button>
                
                {showNotif && (
                  <div className={styles.notifDropdown}>
                    <div className={styles.notifHeader}>
                      <span>Notifications</span>
                      <span className={styles.markRead}>Mark all as read</span>
                    </div>
                    <div className={styles.notifList}>
                      <div className={styles.notifItem}>
                        <div className={`${styles.notifDot} ${styles.unread}`}></div>
                        <div className={styles.notifContent}>
                          <p className={styles.notifTitle}>THÔNG BÁO NGHỈ</p>
                          <p className={styles.notifDesc}>Tất cả các bạn sinh viên được nghỉ (không lên văn phòng)...</p>
                          <p className={styles.notifTime}>5 days ago</p>
                        </div>
                      </div>
                      <div className={styles.notifItem}>
                        <div className={styles.notifDot}></div>
                        <div className={styles.notifContent}>
                          <p className={styles.notifTitle}>Swinburne Cloud Mastery</p>
                          <p className={styles.notifDesc}>Sẽ diễn ra vào thứ 7 tuần này...</p>
                          <p className={styles.notifTime}>6/29/2026</p>
                        </div>
                      </div>
                    </div>
                    <Link to="/notifications" className={styles.notifFooter} onClick={() => setShowNotif(false)}>
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>

              <div className={styles.relativeBox}>
                <div className={styles.userMenu} onClick={() => setShowDropdown(!showDropdown)}>
                  <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className={styles.avatarImg} />
                  <ChevronDown size={16} className={styles.chevron} />
                </div>

                {showDropdown && (
                  <div className={styles.userDropdown}>
                    <Link to="/user/u1" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                      <User size={16} /> Profile & Dashboard
                    </Link>
                    
                    <div className={styles.dropdownDivider}></div>
                    
                    <Link to="/create-blog" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                      <Edit size={16} /> Write Blog
                    </Link>
                    <Link to="/raise-capital" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                      <Briefcase size={16} /> Raise Capital
                    </Link>
                    
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
