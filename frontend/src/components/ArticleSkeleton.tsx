import Skeleton from './Skeleton';
import styles from '../pages/Blogs.module.css';

export const ArticleSkeleton = () => {
  return (
    <div className={styles.articleCard}>
      <div className={styles.articleInfo}>
        <div className={styles.authorRow} style={{marginBottom: '0.5rem'}}>
          <Skeleton variant="circular" width="24px" height="24px" />
          <Skeleton width="100px" />
        </div>
        <Skeleton width="80%" height="24px" className={styles.articleTitle} />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="60%" height="16px" />
        <div className={styles.articleFooter} style={{marginTop: '1rem'}}>
          <Skeleton width="60px" height="24px" borderRadius="12px" />
          <Skeleton width="60px" />
        </div>
      </div>
      <Skeleton variant="rectangular" width="160px" height="120px" className={styles.articleThumb} />
    </div>
  );
};

export const FeaturedArticleSkeleton = () => {
  return (
    <div className={styles.featuredCard}>
      <Skeleton variant="rectangular" height="300px" className={styles.featuredImage} />
      <div className={styles.featuredContent}>
        <div className={styles.featuredMeta}>
          <Skeleton width="60px" height="24px" borderRadius="12px" />
          <Skeleton width="100px" />
        </div>
        <Skeleton width="90%" height="32px" className={styles.featuredTitle} />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" />
        
        <div className={styles.authorRow} style={{marginTop: '2rem'}}>
          <Skeleton variant="circular" width="32px" height="32px" />
          <Skeleton width="120px" />
        </div>
      </div>
    </div>
  );
};
