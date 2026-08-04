import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Globe, 
  MapPin, 
  Calendar, 
  Users, 
  Bookmark, 
  Heart, 
  Mail, 
  ArrowLeft, 
  Building2,
  ShieldAlert
} from 'lucide-react';
import BusinessCard from '../components/business/BusinessCard';
import styles from './BusinessDetail.module.css';
import { 
  getBusinessBySlug, 
  getRelatedBusinesses 
} from '../utils/filterHelpers';
import { MOCK_ARTICLES } from '../utils/mockData';

const formatCurrency = (min: number, max: number, currency: string) => {
  if (currency === 'USD') {
    return `$${(min / 1000).toLocaleString('en-US')}k – $${(max / 1000).toLocaleString('en-US')}k USD`;
  }
  const minBillion = min / 1000000000;
  const maxBillion = max / 1000000000;
  if (minBillion >= 1) return `${minBillion} – ${maxBillion} tỷ VNĐ`;
  return `${min / 1000000} – ${max / 1000000} triệu VNĐ`;
};

type Tab = 'overview' | 'updates' | 'team';

const BusinessDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [contactNotice, setContactNotice] = useState(false);

  const business = slug ? getBusinessBySlug(slug) : undefined;

  if (!business) {
    return (
      <div className={styles.pageWrapper}>
        <div className="container">
          <div className={styles.notFoundCard}>
            <Building2 size={56} className={styles.notFoundIcon} />
            <h2>Business not found</h2>
            <p>The business may have been removed, archived, or the link is incorrect.</p>
            <Link to="/businesses" className={styles.primaryBtn}>
              <ArrowLeft size={16} /> Explore Businesses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // funding opportunities removed
  const relatedRecords = getRelatedBusinesses(business, 3);
  const businessArticles = MOCK_ARTICLES.filter(a => a.author.businessId === business.id);

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
          <ol className={styles.breadcrumbList}>
            <li><Link to="/">Home</Link></li>
            <li className={styles.separator}>/</li>
            <li><Link to="/businesses">Explore Businesses</Link></li>
            <li className={styles.separator}>/</li>
            <li aria-current="page" className={styles.activeBreadcrumb}>{business.name}</li>
          </ol>
        </nav>

        {/* Business Header */}
        <div className={styles.headerCard}>
          <div className={styles.headerTop}>
            <div className={styles.logoBox}>
              <span className={styles.logoInitial}>{business.name.charAt(0)}</span>
            </div>
            <div className={styles.headerInfo}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{business.name}</h1>
                {business.verified && (
                  <span className={styles.verifiedBadge} title="Verified Business">
                    <CheckCircle2 size={20} /> Verified
                  </span>
                )}
              </div>
              <div className={styles.tagsRow}>
                <span className={styles.tag}>{business.industry}</span>
                <span className={`${styles.tag} ${styles.typeTag}`}>{business.businessType}</span>
                <span className={`${styles.tag} ${styles.stageTag}`}>{business.businessStage}</span>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button 
                type="button"
                className={`${styles.actionBtn} ${isSaved ? styles.savedBtn : ''}`}
                onClick={() => setIsSaved(!isSaved)}
                aria-label={isSaved ? 'Remove from saved' : 'Save business'}
              >
                <Bookmark size={18} /> {isSaved ? 'Saved' : 'Save'}
              </button>
              <button 
                type="button"
                className={isFollowing ? styles.followingBtn : styles.followBtnPrimary}
                onClick={() => setIsFollowing(!isFollowing)}
                aria-label={isFollowing ? 'Unfollow business' : 'Follow business'}
              >
                <Heart size={18} fill={isFollowing ? 'currentColor' : 'none'} /> 
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button 
                type="button"
                className={styles.contactBtn}
                onClick={() => setContactNotice(true)}
              >
                <Mail size={18} /> Contact Business
              </button>
            </div>
          </div>

          {contactNotice && (
            <div className={styles.authNotice}>
              <p>Sign in is required to send direct contact requests to business owners.</p>
              <button type="button" onClick={() => setContactNotice(false)} className={styles.closeNoticeBtn}>Dismiss</button>
            </div>
          )}

          <p className={styles.shortDesc}>{business.description}</p>

          <div className={styles.metaRow}>
            {business.location && (
              <span className={styles.metaItem}>
                <MapPin size={16} /> {business.location}
              </span>
            )}
            {business.foundedYear && (
              <span className={styles.metaItem}>
                <Calendar size={16} /> Founded {business.foundedYear} ({business.yearsInOperation} yrs in operation)
              </span>
            )}
            {business.employeeRange && (
              <span className={styles.metaItem}>
                <Users size={16} /> {business.employeeRange}
              </span>
            )}
            {business.website && (
              <a href={business.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                <Globe size={16} /> Website
              </a>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'updates' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            Updates
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'team' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Team
          </button>
        </div>

        {/* Page Content Grid */}
        <div className={styles.contentLayout}>
          <div className={styles.mainContent}>

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Business Overview */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Business Overview</h2>
              <p className={styles.bodyText}>
                {business.detailedOverview || business.description}
              </p>
              
              <div className={styles.infoGrid}>
                {business.legalName && (
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Legal Name</span>
                    <span className={styles.infoValue}>{business.legalName}</span>
                  </div>
                )}
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Business Type</span>
                  <span className={styles.infoValue}>{business.businessType}</span>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Stage</span>
                  <span className={styles.infoValue}>{business.businessStage}</span>
                </div>
                {business.businessModel && (
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Business Model</span>
                    <span className={styles.infoValue}>{business.businessModel}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Products and Services */}
            {business.productsOrServices && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Products & Services</h2>
                <p className={styles.bodyText}>{business.productsOrServices}</p>
              </section>
            )}

            {/* Business Operations */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Business Operations</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Years Operating</span>
                  <span className={styles.infoValue}>{business.yearsInOperation || 'N/A'} years</span>
                </div>
                {business.employeeRange && (
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Team Size</span>
                    <span className={styles.infoValue}>{business.employeeRange}</span>
                  </div>
                )}
                {business.operatingRegions && (
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Operating Regions</span>
                    <span className={styles.infoValue}>{business.operatingRegions.join(', ')}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Market and Customers */}
            {activeTab === 'overview' && business.mainMarket && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Market & Customers</h2>
                <p className={styles.bodyText}>
                  <strong>Target Market:</strong> {business.mainMarket}
                </p>
              </section>
            )}

            {/* Public Financial Highlights */}
            {activeTab === 'overview' && business.financialHighlights && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Public Financial Highlights</h2>
                <div className={styles.financialGrid}>
                  <div className={styles.finCard}>
                    <span className={styles.finLabel}>Revenue Range</span>
                    <span className={styles.finValue}>{business.financialHighlights.revenueRange}</span>
                  </div>
                  <div className={styles.finCard}>
                    <span className={styles.finLabel}>Growth Rate</span>
                    <span className={styles.finValue}>{business.financialHighlights.growthRange}</span>
                  </div>
                  <div className={styles.finCard}>
                    <span className={styles.finLabel}>Profitability</span>
                    <span className={styles.finValue}>{business.financialHighlights.profitabilityStatus}</span>
                  </div>
                  <div className={styles.finCard}>
                    <span className={styles.finLabel}>Reporting Period</span>
                    <span className={styles.finValue}>{business.financialHighlights.reportingPeriod}</span>
                  </div>
                </div>
                <p className={styles.disclaimerNote}>
                  <ShieldAlert size={16} /> Financial figures are self-reported for preliminary review and should be independently verified.
                </p>
              </section>
            )}

            {/* Funding History */}
            {activeTab === 'overview' && business.fundingRounds && business.fundingRounds.length > 0 && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Funding History</h2>
                <div className={styles.opportunitiesList}>
                  {business.fundingRounds.map(round => (
                    <div key={round.id} className={styles.opportunityItemCard}>
                      <div className={styles.oppHeader}>
                        <div>
                          <h3 className={styles.oppTitle}>{round.roundName} Round</h3>
                          {round.isVerified ? (
                            <span className={`${styles.statusBadge} ${styles.published}`} title="Verified by platform">
                              <CheckCircle2 size={12} style={{marginRight: 4}}/> Verified
                            </span>
                          ) : (
                            <span className={styles.statusBadge} style={{backgroundColor: 'var(--bg-accent)', color: 'var(--text-muted)'}} title="Self-reported, unverified">
                              Unverified
                            </span>
                          )}
                        </div>
                        <div style={{fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-600)'}}>
                          {round.currency === 'USD' ? '$' : ''}{(round.amount).toLocaleString()} {round.currency === 'VND' ? 'VNĐ' : ''}
                        </div>
                      </div>
                      <div className={styles.oppMeta} style={{marginTop: '0.5rem'}}>
                        <span><strong>Date:</strong> {new Date(round.date).toLocaleDateString()}</span>
                        <span><strong>Investors:</strong> {round.investors}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'overview' && (!business.fundingRounds || business.fundingRounds.length === 0) && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Funding History</h2>
                <p className={styles.mutedText}>This business has not published any funding history.</p>
              </section>
            )}
              </>
            )}

            {/* Updates Tab Content */}
            {activeTab === 'updates' && businessArticles.length > 0 && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Blogs & Updates</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {businessArticles.map(article => (
                    <Link to={`/blogs/${article.slug}`} key={article.id} style={{
                      display: 'block', 
                      padding: '1rem', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)', marginBottom: '0.5rem', fontWeight: 600 }}>
                        {article.category}
                      </div>
                      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {article.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'updates' && businessArticles.length === 0 && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Blogs & Updates</h2>
                <p className={styles.mutedText}>This business hasn't posted any updates yet.</p>
              </section>
            )}

            {/* Team Tab Content */}
            {activeTab === 'team' && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Management Team</h2>
                {business.teamMembers && business.teamMembers.length > 0 ? (
                  <div className={styles.teamGrid}>
                    {business.teamMembers.map(member => (
                      <div key={member.id} className={styles.teamCard}>
                        <div className={styles.avatarBox}>{member.name.charAt(0)}</div>
                        <div>
                          <h3 className={styles.memberName}>{member.name}</h3>
                          <span className={styles.memberRole}>{member.role}</span>
                          {member.bio && <p className={styles.memberBio}>{member.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.mutedText}>Management team information has not been published yet.</p>
                )}
              </section>
            )}

            {/* End Overview Content */}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Engagement Summary</h3>
              <div className={styles.sideStat}>
                <span>Saved by Users</span>
                <strong>{business.savedCount}</strong>
              </div>
              <div className={styles.sideStat}>
                <span>Profile Views</span>
                <strong>{business.viewCount}</strong>
              </div>
              <div className={styles.sideStat}>
                <span>Comments</span>
                <strong>{business.commentCount}</strong>
              </div>
            </div>

            {/* Legal Disclaimer Box */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Notice</h3>
              <p className={styles.sideDisclaimer}>
                Startups Blogs is an information connection platform. All negotiations occur directly between parties.
              </p>
            </div>
          </div>
        </div>

        {/* Related Businesses */}
        {relatedRecords.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>Related Businesses</h2>
            <div className={styles.relatedGrid}>
              {relatedRecords.map(record => (
                <BusinessCard key={record.business.id} {...record} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default BusinessDetail;
