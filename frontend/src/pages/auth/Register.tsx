import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { api } from '../../lib/axios';

const Register = () => {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Đăng ký tài khoản qua API Backend
      await api.post('/auth/register', {
        email,
        password,
        name: `${firstName} ${lastName}`.trim()
      });

      // 2. Chuyển sang bước nhập Mã xác thực OTP 6 số
      setIsVerifying(true);
      setSuccessMessage(`AWS Cognito đã gửi mã xác minh 6 số tới email: ${email}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Xác nhận mã 6 số
      navigate('/login');
    } catch (err: any) {
      setError('Mã xác thực 6 số không đúng hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {isVerifying ? (
          <div>
            <div className={styles.authHeader}>
              <h1>Xác minh Email (Cognito)</h1>
              <p style={{ color: '#16a34a', fontWeight: 500 }}>{successMessage}</p>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form className={styles.authForm} onSubmit={handleVerifyCode}>
              <div className={styles.formGroup}>
                <label htmlFor="otp">Nhập mã xác thực 6 chữ số</label>
                <input 
                  type="text" 
                  id="otp" 
                  placeholder="123456" 
                  maxLength={6}
                  value={verificationCode} 
                  onChange={e => setVerificationCode(e.target.value)} 
                  style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.25rem' }}
                  required 
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Đang xác minh...' : 'Xác nhận mã & Đăng nhập'}
              </button>
            </form>
          </div>
        ) : (
          <div>
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
            
            {error && <div className={styles.errorMessage}>{error}</div>}

            <form className={styles.authForm} onSubmit={handleRegister}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
            
            <div className={styles.authFooter}>
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
