import { Heart, MessageSquare, Bookmark, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './BusinessCard.module.css';
import type { BusinessOpportunityRecord } from '../../types/business';

export type BusinessCardProps = BusinessOpportunityRecord & {
  onSave?: (id: string) => void;
};

const formatCurrency = (min: number, max: number, currency: string) => {
  if (currency === 'USD') {
    return `$${(min / 1000).toLocaleString('en-US')}k – $${(max / 1000).toLocaleString('en-US')}k USD`;
  }
  
  // VND formatting
  const minBillion = min / 1000000000;
  const maxBillion = max / 1000000000;
  
  if (minBillion >= 1) {
    return `${minBillion} – ${maxBillion} tỷ VNĐ`;
  }
  
  const minMillion = min / 1000000;
  const maxMillion = max / 1000000;
  return `${minMillion} – ${maxMillion} triệu VNĐ`;
};

const BusinessCard = ({ business, opportunity, onSave }: BusinessCardProps) => {
  const { id, name, industry, businessType, businessStage, location, description, verified, savedCount, commentCount } = business;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.logoContainer}>
          <span className={styles.logoInitial}>{name.charAt(0)}</span>
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
          className={styles.saveBtn} 
          aria-label={`Save ${name}`}
          onClick={() => onSave && onSave(id)}
        >
          <Bookmark size={20} />
        </button>
      </div>
      
      <p className={styles.description}>{description}</p>

      <div className={styles.metaInfo}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Stage</span>
          <span className={styles.metaValue}>{businessStage}</span>
        </div>
        {opportunity && (
          <>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Seeking</span>
              <span className={styles.metaValue}>{formatCurrency(opportunity.fundingAmountMin, opportunity.fundingAmountMax, opportunity.currency)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Purpose</span>
              <span className={styles.metaValue}>{opportunity.fundingPurpose}</span>
            </div>
          </>
        )}
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
          View Opportunity
        </Link>
      </div>
    </div>
  );
};

export default BusinessCard;
