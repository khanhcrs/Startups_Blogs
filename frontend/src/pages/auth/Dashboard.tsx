import { Link } from 'react-router-dom';
import { BriefcaseBusiness, LogOut } from 'lucide-react';
import styles from './AuthPage.module.css';
import { getSession, signOut } from '../../services/auth';

const Dashboard = () => {
  const session = getSession();

  if (!session) {
    return (
      <div className={styles.page}>
        <section className={styles.panel}>
          <h1 className={styles.title}>Login required</h1>
          <p className={styles.subtitle}>Please log in before opening your dashboard.</p>
          <Link className={styles.secondaryLink} to="/login">Go to login</Link>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <BriefcaseBusiness size={28} className={styles.statusIcon} />
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Your Cognito session is active. Business and investor workflows can now use the API access token.</p>
        <button className={styles.primaryButton} type="button" onClick={signOut}>
          <LogOut size={18} />
          Log out
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
