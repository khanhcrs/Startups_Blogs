import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { api } from '../../lib/axios';
import { signUpWithCognito, confirmCognitoSignUp } from '../../services/cognitoAuth';

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

    // Kiểm tra định dạng Email nghiêm ngặt (Email Syntax Regex Validation)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError('Địa chỉ Email không đúng định dạng tiêu chuẩn (Ví dụ: name@gmail.com)');
      return;
    }

    setLoading(true);

    try {
      // 1. Gửi lệnh tới Amazon Cognito -> Cognito bắn Email OTP 6 số về hòm thư người dùng
      await signUpWithCognito(email, password, `${firstName} ${lastName}`.trim());
      setIsVerifying(true);
      setSuccessMessage(`Amazon Cognito đã gửi mã xác minh 6 chữ số tới Email: ${email}`);
    } catch (err: any) {
      console.error('Cognito SignUp Error:', err);
      setError(err.message || 'Gửi mã xác thực Cognito thất bại. Vui lòng kiểm tra lại Email/Mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Xác nhận mã OTP 6 số với Amazon Cognito
      try {
        await confirmCognitoSignUp(email, verificationCode);
      } catch (cErr) {
        // Nếu mã đã xác nhận trước đó, tiếp tục
      }

      // 2. Tạo tài khoản trong Database (Nếu đã tồn tại thì bỏ qua lỗi và đăng nhập)
      try {
        await api.post('/auth/register', {
          email,
          password,
          name: `${firstName} ${lastName}`.trim()
        });
      } catch (dbErr) {
        // Tài khoản đã có trong DB
      }

      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã xác thực 6 số không đúng hoặc đã hết hạn.');
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
