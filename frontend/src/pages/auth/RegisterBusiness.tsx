import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

const RegisterBusiness = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/pending-verification');
  };

  return (
    <div className={styles.authPage}>
      <div className={`${styles.authContainer} ${styles.authContainerWide}`}>
        <div className={styles.authHeader}>
          <h1>Register your Business</h1>
          <p>List your startup, publish blogs, and connect with partners</p>
        </div>

        <div className={styles.roleSelection}>
          <Link to="/register" className={styles.roleCard}>
            <h3>Reader / User</h3>
            <p>I want to read, comment, and connect.</p>
          </Link>
          <Link to="/register/business" className={styles.roleCard} style={{borderColor: 'var(--primary-500)', background: 'var(--surface-color)'}}>
            <h3>Business / Startup</h3>
            <p>I want to list my company and publish PR blogs.</p>
          </Link>
        </div>
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          
          <h3 style={{marginTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>1. Account Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="repName">Representative Name *</label>
              <input type="text" id="repName" placeholder="Your name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="role">Your Role / Title *</label>
              <input type="text" id="role" placeholder="e.g. CEO, Founder, Marketing Manager" required />
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Business Email *</label>
              <input type="email" id="email" placeholder="name@yourcompany.com" required />
              <span className={styles.hint}>Please use an official company domain.</span>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password *</label>
              <input type="password" id="password" placeholder="Create a strong password" required />
            </div>
          </div>

          <h3 style={{marginTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>2. Business Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="companyName">Legal Company Name *</label>
              <input type="text" id="companyName" placeholder="GreenFlow Tech JSC" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="taxId">Tax ID / Registration Number *</label>
              <input type="text" id="taxId" placeholder="e.g. 0101234567" required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Business Registration Document / Pitch Deck (PDF) *</label>
            <div className={styles.fileUpload}>
              <p>Drag and drop your PDF file here, or click to browse</p>
              <span className={styles.hint}>Max file size: 5MB</span>
            </div>
          </div>

          <div className={styles.formOptions} style={{marginTop: '1rem'}}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" required /> I confirm that the information above is accurate and I am authorized to represent this company.
            </label>
          </div>

          <button type="submit" className={styles.submitBtn}>Submit Application</button>
        </form>
        
        <div className={styles.authFooter}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterBusiness;
