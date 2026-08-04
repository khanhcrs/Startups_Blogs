import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandInfo}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
              </svg>
            </div>
            <span className={styles.logoText}>Startups Blogs</span>
          </Link>
          <p className={styles.description}>
            Connecting innovative startups with opportunities to build a better future.
          </p>
          <div className={styles.social}>
            <a href="#" className={styles.socialIcon} aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Youtube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 7.1 2 9.5 2 12s.5 4.9.5 4.9c.3 1 .9 1.7 1.8 1.9C6.8 19 12 19 12 19s5.2 0 7.7-.2c.9-.2 1.5-.9 1.8-1.9.5 0 .5-2.4.5-4.9s-.5-4.9-.5-4.9C21.2 6.1 20.6 5.4 19.7 5.2 17.2 5 12 5 12 5s-5.2 0-7.7.2C3.4 5.4 2.8 6.1 2.5 7.1z"/><path d="M9.8 15.5L15.5 12 9.8 8.5v7z"/></svg>
            </a>
          </div>
        </div>

        <div className={styles.column}>
          <h4>Platform</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/businesses">Explore Businesses</Link></li>
            
            <li><Link to="/raise-capital">Raise Capital</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Resources</h4>
          <ul>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Support</h4>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/support">Support Center</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/investment-disclaimer">Investment Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Startups Blogs. All rights reserved.</p>
          <p>Made with ♥ for the startup community</p>
        </div>
        <button className={styles.langSelect}>
          English
          <ChevronDown size={16} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
