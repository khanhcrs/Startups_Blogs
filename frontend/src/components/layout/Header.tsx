import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
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
          <Link to="/investors" className={`${styles.navLink} ${path.includes('/investors') ? styles.active : ''}`}>Investors</Link>
        </nav>

        <div className={styles.actions}>
          <button className={styles.searchBtn} aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/login" className={styles.loginBtn}>Log in</Link>
          <Link to="/raise-capital" className={styles.primaryBtn}>Raise Capital</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
