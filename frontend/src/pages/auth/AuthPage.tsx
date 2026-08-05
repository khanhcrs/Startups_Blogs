import { LogIn, UserPlus } from 'lucide-react';
import styles from './AuthPage.module.css';
import { startAuth } from '../../services/auth';

type AuthPageProps = {
  mode: 'login' | 'signup';
};

const AuthPage = ({ mode }: AuthPageProps) => {
  const isSignup = mode === 'signup';

  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <span className={styles.kicker}>Startups Blogs account</span>
        <h1 className={styles.title}>{isSignup ? 'Create your account' : 'Log in to your account'}</h1>
        <p className={styles.subtitle}>
          {isSignup
            ? 'Use Cognito to create a secure account, verify your email, and continue as a business owner or investor.'
            : 'Continue with your Cognito account to manage businesses, save opportunities, and contact owners.'}
        </p>

        <button className={styles.primaryButton} type="button" onClick={() => startAuth(mode)}>
          {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
          {isSignup ? 'Sign up with Cognito' : 'Log in with Cognito'}
        </button>
      </section>
    </div>
  );
};

export default AuthPage;
