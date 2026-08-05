import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, LoaderCircle, TriangleAlert } from 'lucide-react';
import styles from './AuthPage.module.css';
import { handleAuthCallback } from '../../services/auth';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error_description') || searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(error);
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setMessage('Missing Cognito callback parameters.');
      return;
    }

    handleAuthCallback(code, state)
      .then(() => {
        setStatus('success');
        setMessage('Signed in successfully.');
        window.setTimeout(() => navigate('/dashboard', { replace: true }), 600);
      })
      .catch((err: unknown) => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Sign in failed.');
      });
  }, [navigate, searchParams]);

  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.statusIcon}>
          {status === 'loading' && <LoaderCircle className={styles.spin} size={28} />}
          {status === 'success' && <CheckCircle2 size={28} />}
          {status === 'error' && <TriangleAlert size={28} />}
        </div>
        <h1 className={styles.title}>{status === 'error' ? 'Sign in failed' : 'Authenticating'}</h1>
        <p className={styles.subtitle}>{message}</p>
        {status === 'error' && <Link className={styles.secondaryLink} to="/login">Back to login</Link>}
      </section>
    </div>
  );
};

export default AuthCallback;
