import { Heart, MessageSquare, Bookmark, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './BusinessCard.module.css';
import type { Business } from '../../types/business';

export type BusinessCardProps = {
  business: Business;
  isSaved?: boolean;
  onSave?: (id: string) => void;
};

const BusinessCard = ({ business, isSaved = false, onSave }: BusinessCardProps) => {
  const { id, name, industry, businessType, businessStage, location, description, verified, savedCount, commentCount, employeeRange } = business;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.logoContainer}>
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={name} className={styles.logoImg} />
          ) : (
            <span className={styles.logoInitial}>{name.charAt(0)}</span>
          )}
        </div>
        <div className={styles.titleInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{name}</h3>
            {verified && (
              <span className={styles.verifiedBadge} title="Verified Business">
                <CheckCircle2 size={16} className={styles.verifiedIcon} />
              </span>
            )}
          </div>
          <div className={styles.badges}>
            <span className={styles.badge}>{industry}</span>
            <span className={`${styles.badge} ${styles.typeBadge}`}>{businessType}</span>
          </div>
        </div>
        <button 
          className={`${styles.saveBtn} ${isSaved ? styles.savedActive : ''}`} 
          aria-label={isSaved ? `Unsave ${name}` : `Save ${name}`}
          onClick={(e) => {
            e.preventDefault();
            if (onSave) onSave(id);
          }}
        >
          <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      
      <p className={styles.description}>{description}</p>

      <div className={styles.metaInfo}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Stage</span>
          <span className={styles.metaValue}>{businessStage}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Team Size</span>
          <span className={styles.metaValue}>{employeeRange || 'N/A'}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Location</span>
          <span className={styles.metaValue}>{location}</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.stats}>
          <span className={styles.stat} title="Saves">
            <Heart size={16} /> {savedCount}
          </span>
          <span className={styles.stat} title="Comments">
            <MessageSquare size={16} /> {commentCount}
          </span>
        </div>
        <Link to={`/businesses/${business.slug || id}`} className={styles.viewProfileBtn}>
          View Business
        </Link>
      </div>
    </div>
  );
};

export default BusinessCard;
