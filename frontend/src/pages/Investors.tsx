import { ChevronDown } from 'lucide-react';
import styles from './Investors.module.css';

const MOCK_INVESTORS = [
  {
    name: 'Alpha Ventures',
    type: 'Early stage VC',
    focus: 'AI, FinTech, SaaS',
    stage: 'Pre-Seed, Seed',
    location: 'Singapore',
    logo: 'A',
    color: '#1d4ed8'
  },
  {
    name: 'NextGen Capital',
    type: 'Seed to Series A',
    focus: 'HealthTech, EdTech',
    stage: 'Seed, Series A',
    location: 'Vietnam',
    logo: 'N',
    color: '#3b82f6'
  },
  {
    name: 'Green Future Fund',
    type: 'Impact Investing',
    focus: 'CleanTech, AgriTech',
    stage: 'Seed, Series A',
    location: 'Asia',
    logo: 'G',
    color: '#10b981'
  },
  {
    name: 'Skyline Partners',
    type: 'Growth Stage VC',
    focus: 'E-commerce, SaaS',
    stage: 'Series A, Series B',
    location: 'US',
    logo: 'S',
    color: '#3b82f6'
  },
  {
    name: 'InnovateX',
    type: 'Corporate VC',
    focus: 'DeepTech, AI',
    stage: 'Seed, Series A',
    location: 'Global',
    logo: 'X',
    color: '#111827'
  },
  {
    name: 'BlueOcean Capital',
    type: 'Early Stage VC',
    focus: 'FinTech, InsurTech',
    stage: 'Pre-Seed, Seed',
    location: 'Singapore',
    logo: 'B',
    color: '#2563eb'
  }
];

const Investors = () => {
  return (
    <div className="section">
      <div className="container">
        <h1 className={styles.title}>Investors</h1>
        <p className={styles.subtitle}>Connect with investors and funding partners<br/>who are looking for great startups.</p>
        
        <div className={styles.filtersBar}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search investors, VC firms..." className={styles.searchInput} />
          </div>
          <div className={styles.filters}>
            <button className={styles.filterBtn}>All Types <ChevronDown size={16}/></button>
            <button className={styles.filterBtn}>Investment Stage <ChevronDown size={16}/></button>
            <button className={styles.filterBtn}>Industry Focus <ChevronDown size={16}/></button>
            <button className={styles.filterBtn}>Location <ChevronDown size={16}/></button>
          </div>
        </div>

        <div className={styles.grid}>
          {MOCK_INVESTORS.map((inv, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.logo} style={{backgroundColor: inv.color}}>{inv.logo}</div>
                <div>
                  <h3 className={styles.name}>{inv.name}</h3>
                  <p className={styles.type}>{inv.type}</p>
                </div>
              </div>
              <div className={styles.details}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Focus:</span>
                  <span className={styles.detailValue}>{inv.focus}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Stage:</span>
                  <span className={styles.detailValue}>{inv.stage}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Location:</span>
                  <span className={styles.detailValue}>{inv.location}</span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.viewProfileBtn}>View Profile</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button className={styles.pageBtn}>&lt;</button>
          <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
          <button className={styles.pageBtn}>4</button>
          <button className={styles.pageBtn}>5</button>
          <span className={styles.pageDots}>...</span>
          <button className={styles.pageBtn}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Investors;
