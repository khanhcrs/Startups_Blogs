import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { confirmSignUp, resendSignUpCode, signUp } from '../../lib/cognito';

const Register = () => {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signUp(email, password, `${firstName} ${lastName}`.trim());
      if (result.confirmed) navigate('/login');
      else setAwaitingConfirmation(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmSignUp(email, confirmationCode);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Invalid confirmation code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);
    try {
      await resendSignUpCode(email);
    } catch (err: any) {
      setError(err.message || 'Could not resend confirmation code.');
    } finally {
      setLoading(false);
    }
  };

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
        
        {error && <div className={styles.errorMessage}>{error}</div>}

        {awaitingConfirmation ? (
          <form className={styles.authForm} onSubmit={handleConfirmation}>
            <div className={styles.formGroup}>
              <label htmlFor="confirmationCode">Email confirmation code</label>
              <input id="confirmationCode" value={confirmationCode} onChange={e => setConfirmationCode(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>Confirm account</button>
            <button type="button" className={styles.secondaryBtn} disabled={loading} onClick={handleResendCode}>Resend confirmation code</button>
          </form>
        ) : <form className={styles.authForm} onSubmit={handleRegister}>
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
        </form>}
        
        <div className={styles.authFooter}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
