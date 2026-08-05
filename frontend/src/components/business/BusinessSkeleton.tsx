import Skeleton from '../Skeleton';
import styles from './BusinessCard.module.css';

const BusinessSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className={styles.titleInfo} style={{ flex: 1, marginLeft: '1rem' }}>
          <Skeleton width="60%" height="24px" style={{ marginBottom: '8px' }} />
          <div className={styles.badges}>
            <Skeleton width="80px" height="24px" borderRadius="12px" />
            <Skeleton width="100px" height="24px" borderRadius="12px" />
          </div>
        </div>
        <Skeleton variant="circular" width="32px" height="32px" />
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <Skeleton width="100%" height="16px" />
        <Skeleton width="90%" height="16px" />
        <Skeleton width="75%" height="16px" />
      </div>

      <div className={styles.metaInfo} style={{ marginTop: '1.5rem' }}>
        <div className={styles.metaItem}>
          <Skeleton width="40px" height="12px" style={{ marginBottom: '4px' }} />
          <Skeleton width="80px" height="16px" />
        </div>
        <div className={styles.metaItem}>
          <Skeleton width="60px" height="12px" style={{ marginBottom: '4px' }} />
          <Skeleton width="60px" height="16px" />
        </div>
        <div className={styles.metaItem}>
          <Skeleton width="50px" height="12px" style={{ marginBottom: '4px' }} />
          <Skeleton width="90px" height="16px" />
        </div>
      </div>

      <div className={styles.cardFooter} style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.stats} style={{ display: 'flex', gap: '12px' }}>
          <Skeleton width="40px" height="20px" />
          <Skeleton width="40px" height="20px" />
        </div>
        <Skeleton width="120px" height="36px" borderRadius="8px" />
      </div>
    </div>
  );
};

export default BusinessSkeleton;
