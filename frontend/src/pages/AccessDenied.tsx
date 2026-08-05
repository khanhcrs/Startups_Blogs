import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import styles from './AccessDenied.module.css';

export default function AccessDenied() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <ShieldAlert size={64} className={styles.icon} />
        </div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.description}>
          You do not have permission to view this page. If you believe this is a mistake, please contact support.
        </p>
        <Link to="/" className={styles.homeBtn}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}
