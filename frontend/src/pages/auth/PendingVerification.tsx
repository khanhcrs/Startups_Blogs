import { Link } from 'react-router-dom';
import styles from './Auth.module.css';
import { Clock } from 'lucide-react';

const PendingVerification = () => {
  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer} style={{textAlign: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary-600)'}}>
          <Clock size={64} />
        </div>
        <h1 style={{fontSize: '2rem', marginBottom: '1rem'}}>Application Submitted</h1>
        <p style={{color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6}}>
          Thank you for registering your business with us. Your application is currently under review to ensure the authenticity and quality of our platform.
        </p>
        <div style={{background: 'var(--surface-hover)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.875rem'}}>
          <p style={{fontWeight: 600, marginBottom: '0.5rem'}}>What happens next?</p>
          <ul style={{paddingLeft: '1.25rem', color: 'var(--text-secondary)'}}>
            <li style={{marginBottom: '0.5rem'}}>Our team will verify your business documents.</li>
            <li style={{marginBottom: '0.5rem'}}>This process typically takes 1-2 business days.</li>
            <li>You will receive an email notification once your account is approved.</li>
          </ul>
        </div>
        <Link to="/" className={styles.submitBtn} style={{display: 'inline-block', textDecoration: 'none'}}>Return to Home</Link>
      </div>
    </div>
  );
};

export default PendingVerification;
