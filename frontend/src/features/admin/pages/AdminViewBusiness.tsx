import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAdminTabsStore } from '../../../store/adminTabsStore';
import { api } from '../../../lib/axios';
import commonStyles from '../AdminCommon.module.css';
import styles from '../../../pages/BusinessDetail.module.css';
import { 
  Building2, Globe, MapPin, Calendar, Users, Edit3, CheckCircle2, Bookmark, Heart, Mail, ShieldAlert
} from 'lucide-react';

type Tab = 'overview' | 'updates' | 'team';

export default function AdminViewBusiness({ businessId: propBusinessId }: { businessId?: string }) {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const updateTabTitle = useAdminTabsStore(state => state.updateTabTitle);
  const businessId = propBusinessId || params.id;
  
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    fetchBusinessDetails();
  }, [businessId]);

  const fetchBusinessDetails = async () => {
    try {
      // First get the detailed business which includes relations
      const res = await api.get(`/businesses/admin/${businessId}`);
      const b = res.data;
      if (b) {
        
        // Fetch related articles for the updates tab
        try {
          const artRes = await api.get('/articles');
          const bizArticles = artRes.data.data.filter((a: any) => a.author?.businessId === b.id || a.businessId === b.id);
          b.articles = bizArticles;
        } catch (e) {
          console.error("Could not fetch business articles", e);
          b.articles = [];
        }

        setBusiness(b);
        updateTabTitle(location.pathname, `Business: ${b.name.length > 15 ? b.name.substring(0, 15) + '...' : b.name}`);
      }
    } catch (error) {
      toast.error('Error fetching business details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await api.put(`/businesses/admin/${businessId}/status`, { status });
      toast.success(`Business status updated to ${status}`);
      fetchBusinessDetails();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  if (loading) {
    return <div className={commonStyles.container} style={{ padding: '2rem' }}>Loading business details...</div>;
  }

  if (!business) {
    return <div className={commonStyles.container} style={{ padding: '2rem' }}>Business not found.</div>;
  }

  return (
    <div className={styles.pageWrapper} style={{ margin: '-2rem', minHeight: 'calc(100% + 4rem)' }}>
      {/* Admin Action Bar */}
      <div style={{ backgroundColor: '#fff', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>Admin Actions:</span>
          <span style={{
            padding: '2px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: business.status === 'APPROVED' ? '#f0fdf4' : business.status === 'PENDING' ? '#fffbeb' : '#fef2f2',
            color: business.status === 'APPROVED' ? '#166534' : business.status === 'PENDING' ? '#b45309' : '#991b1b',
            border: `1px solid ${business.status === 'APPROVED' ? '#86efac' : business.status === 'PENDING' ? '#fcd34d' : '#fca5a5'}`
          }}>
            {business.status}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate(`/admin/businesses/${businessId}/edit`)} style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#0f172a', borderRadius: '0.5rem', fontWeight: 600, border: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={16} /> Edit Profile
          </button>
          
          {business.status === 'PENDING' && (
            <>
              <button onClick={() => handleUpdateStatus('APPROVED')} style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Approve</button>
              <button onClick={() => handleUpdateStatus('REJECTED')} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Reject</button>
            </>
          )}
          {business.status === 'APPROVED' && (
            <button onClick={() => handleUpdateStatus('SUSPENDED')} style={{ padding: '0.5rem 1rem', background: '#eab308', color: '#fff', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Suspend</button>
          )}
          {business.status === 'SUSPENDED' && (
            <button onClick={() => handleUpdateStatus('APPROVED')} style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Restore</button>
          )}
          {business.status === 'REJECTED' && (
            <button onClick={() => handleUpdateStatus('APPROVED')} style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Approve</button>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 32px' }}>
        {/* Business Header */}
        <div className={styles.headerCard} style={{ overflow: 'hidden', padding: 0 }}>
          {business.coverUrl ? (
            <div style={{ width: '100%', height: '240px', backgroundImage: `url(${business.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          ) : (
             <div style={{ width: '100%', height: '240px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #8b5cf6, #3b0764)' }}></div>
          )}
          <div style={{ padding: 'var(--spacing-8)' }}>
            <div className={styles.headerTop}>
              <div className={styles.logoBox} style={{ overflow: 'hidden', marginTop: '-64px', border: '4px solid var(--surface-color)', backgroundColor: 'var(--surface-color)' }}>
              {business.logoUrl ? (
                <img src={business.logoUrl} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className={styles.logoInitial}>{business.name.charAt(0)}</span>
              )}
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
            <div className={styles.actionButtons} style={{ opacity: 0.5, pointerEvents: 'none' }}>
              <button type="button" className={styles.actionBtn}>
                <Bookmark size={18} /> Save
              </button>
              <button type="button" className={styles.followBtnPrimary}>
                <Heart size={18} /> Follow
              </button>
              <button type="button" className={styles.contactBtn}>
                <Mail size={18} /> Contact
              </button>
            </div>
          </div>

          <p className={styles.shortDesc}>{business.description}</p>

          <div className={styles.metaRow}>
            {business.location && (
              <span className={styles.metaItem}>
                <MapPin size={16} /> {business.location}
              </span>
            )}
            {business.foundedYear && (
              <span className={styles.metaItem}>
                <Calendar size={16} /> Founded {business.foundedYear}
              </span>
            )}
            {business.employeeRange && (
              <span className={styles.metaItem}>
                <Users size={16} /> {business.employeeRange}
              </span>
            )}
            {business.website && (
              <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                <Globe size={16} /> Website
              </a>
            )}
          </div>
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
              {business.detailedOverview ? (
                <div className={styles.bodyText} dangerouslySetInnerHTML={{ __html: business.detailedOverview }} />
              ) : (
                <p className={styles.bodyText}>
                  {business.description || 'No overview provided.'}
                </p>
              )}
              
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

            {/* Market and Customers */}
            {business.mainMarket && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Market & Customers</h2>
                <p className={styles.bodyText}>
                  <strong>Target Market:</strong> {business.mainMarket}
                </p>
              </section>
            )}

            {/* Public Financial Highlights */}
            {business.financialHighlights && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Public Financial Highlights</h2>
                <div className={styles.financialGrid}>
                  <div className={styles.finCard}>
                    <span className={styles.finLabel}>Revenue Range</span>
                    <span className={styles.finValue}>{business.financialHighlights.revenueRange || 'N/A'}</span>
                  </div>
                  <div className={styles.finCard}>
                    <span className={styles.finLabel}>Growth Rate</span>
                    <span className={styles.finValue}>{business.financialHighlights.growthRange || 'N/A'}</span>
                  </div>
                  <div className={styles.finCard}>
                    <span className={styles.finLabel}>Profitability</span>
                    <span className={styles.finValue}>{business.financialHighlights.profitabilityStatus || 'N/A'}</span>
                  </div>
                  <div className={styles.finCard}>
                    <span className={styles.finLabel}>Reporting Period</span>
                    <span className={styles.finValue}>{business.financialHighlights.reportingPeriod || 'N/A'}</span>
                  </div>
                </div>
                <p className={styles.disclaimerNote} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', marginTop: '1rem' }}>
                   Financial figures are self-reported for preliminary review and should be independently verified.
                </p>
              </section>
            )}

            {/* Funding History */}
            {business.fundingRounds && business.fundingRounds.length > 0 && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Funding History</h2>
                <div className={styles.opportunitiesList}>
                  {business.fundingRounds.map((round: any) => (
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

            {(!business.fundingRounds || business.fundingRounds.length === 0) && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Funding History</h2>
                <p className={styles.mutedText}>This business has not published any funding history.</p>
              </section>
            )}
              </>
            )}

            {/* Updates Tab Content */}
            {activeTab === 'updates' && business.articles && business.articles.length > 0 && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Blogs & Updates</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {business.articles.map((article: any) => (
                    <Link to={`/admin/articles/${article.id}`} key={article.id} style={{
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

            {activeTab === 'updates' && (!business.articles || business.articles.length === 0) && (
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
                    {business.teamMembers.map((member: any) => (
                      <div key={member.id} className={styles.teamCard}>
                        <div className={styles.avatarBox} style={{ overflow: 'hidden' }}>
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            member.name.charAt(0)
                          )}
                        </div>
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

          <div className={styles.sidebar}>
            {/* Engagement Summary */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Engagement Summary</h3>
              <div className={styles.sideStat}>
                <span>Saved by Users</span>
                <strong>{business._count?.savedBy || 0}</strong>
              </div>
              <div className={styles.sideStat}>
                <span>Profile Views</span>
                <strong>{business.viewCount || 0}</strong>
              </div>
              <div className={styles.sideStat}>
                <span>Comments</span>
                <strong>{business._count?.comments || 0}</strong>
              </div>
            </div>

            {/* Legal Disclaimer Box */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Notice</h3>
              <p className={styles.sideDisclaimer}>
                Startups Blogs is an information connection platform. All negotiations occur directly between parties.
              </p>
            </div>
            
            {/* Admin Info */}
            <div className={styles.sideCard} style={{ marginTop: '1rem', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
              <h3 className={styles.sideTitle} style={{ color: '#475569' }}>Admin Info (Hidden from Public)</h3>
              <div className={styles.sideStat}>
                <span>Registration</span>
                <strong>{business.registrationNumber || 'N/A'}</strong>
              </div>
              <div className={styles.sideStat}>
                <span>Created At</span>
                <strong>{formatDate(business.createdAt)}</strong>
              </div>
              <div className={styles.sideStat}>
                <span>Owner</span>
                <strong>{business.owner?.name || 'N/A'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
