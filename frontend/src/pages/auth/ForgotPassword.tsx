import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  confirmPasswordReset,
  requestPasswordReset,
} from '../../lib/cognito';
import styles from './Auth.module.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const sendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await requestPasswordReset(email.trim());
      setCodeSent(true);
      setMessage('Cognito sent a verification code to your email.');
    } catch (err: any) {
      setError(err.message || 'Could not send the reset code.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await confirmPasswordReset(email.trim(), code.trim(), newPassword);
      navigate('/login', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Could not reset your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1>Reset password</h1>
          <p>{codeSent ? 'Enter the code from your email.' : 'We will send a verification code to your email.'}</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {message && <div className={styles.successMessage}>{message}</div>}

        {!codeSent ? (
          <form className={styles.authForm} onSubmit={sendCode}>
            <div className={styles.formGroup}>
              <label htmlFor="resetEmail">Email</label>
              <input id="resetEmail" type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" />
            </div>
            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset code'}
            </button>
          </form>
        ) : (
          <form className={styles.authForm} onSubmit={resetPassword}>
            <div className={styles.formGroup}>
              <label htmlFor="resetCode">Verification code</label>
              <input id="resetCode" inputMode="numeric" value={code} onChange={event => setCode(event.target.value)} required autoComplete="one-time-code" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New password</label>
              <input id="newPassword" type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} required minLength={8} autoComplete="new-password" />
            </div>
            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Set new password'}
            </button>
            <button className={styles.secondaryBtn} type="button" disabled={loading} onClick={() => void sendCode({ preventDefault() {} } as React.FormEvent)}>
              Resend code
            </button>
          </form>
        )}

        <div className={styles.authFooter}>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
