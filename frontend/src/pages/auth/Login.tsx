import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('mockLoggedIn', 'true');
    // Force a tiny delay so the localStorage is saved before redirecting, 
    // although it's synchronous, we do this so the page feels natural.
    navigate('/');
    // Refresh to let Header pick up the change if we want it instantly, 
    // but React Router navigate works with our Header effect if it mounts, 
    // actually Header is outside Routes so we should just force a window reload for this mock.
    window.location.href = '/'; 
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1>Welcome back</h1>
          <p>Log in to your account to continue</p>
        </div>
        
        <form className={styles.authForm} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>
          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>
          <button type="submit" className={styles.submitBtn}>Log In</button>
        </form>
        
        <div className={styles.authFooter}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
