import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { api } from '../../lib/axios';
import { loginWithCognito } from '../../services/cognitoAuth';
import { useAuthStore } from '../../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Đăng nhập bắt buộc 100% qua Amazon Cognito User Pool
      const cognitoResult = await loginWithCognito(email, password);
      
      if (!cognitoResult?.accessToken) {
        throw new Error('User not found or invalid password.');
      }

      const token = cognitoResult.accessToken;
      localStorage.setItem('token', token);

      // 2. Khởi tạo thông tin User Profile
      const userProfile = {
        id: email,
        email: email,
        firstName: email.split('@')[0],
        lastName: 'User',
        role: 'USER' as const,
      };
      
      login(userProfile, token);
      navigate('/');
    } catch (err: any) {
      const msg = String(err.message || err.response?.data?.message || '');
      if (msg.includes('UserNotFound') || msg.includes('User does not exist')) {
        setError('Account not registered. Please sign up first.');
      } else if (msg.includes('NotAuthorized') || msg.includes('Incorrect') || msg.includes('400')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1>Welcome back</h1>
          <p>Log in to your account to continue</p>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form className={styles.authForm} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
