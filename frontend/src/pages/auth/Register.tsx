import { Link } from 'react-router-dom';
import styles from './Auth.module.css';

const Register = () => {
  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1>Create an account</h1>
          <p>Join the community to read, write, and connect</p>
        </div>

        <div className={styles.roleSelection}>
          <Link to="/register" className={styles.roleCard} style={{borderColor: 'var(--primary-500)', background: 'var(--surface-color)'}}>
            <h3>Reader / User</h3>
            <p>I want to read, comment, and connect.</p>
          </Link>
          <Link to="/register/business" className={styles.roleCard}>
            <h3>Business / Startup</h3>
            <p>I want to list my company and publish PR blogs.</p>
          </Link>
        </div>
        
        <form className={styles.authForm} onSubmit={e => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="John Doe" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="john@example.com" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" required />
          </div>
          <button type="submit" className={styles.submitBtn}>Sign Up</button>
        </form>
        
        <div className={styles.authFooter}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
