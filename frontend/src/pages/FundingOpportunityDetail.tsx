import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Bookmark, 
  Mail, 
  ArrowLeft, 
  FileText, 
  Lock, 
  Clock
} from 'lucide-react';
import BusinessCard from '../components/business/BusinessCard';
import styles from './FundingOpportunityDetail.module.css';
import { 
  getFundingOpportunityBySlug, 
  getBusinessById, 
  getRelatedFundingOpportunities
} from '../utils/filterHelpers';

const formatCurrency = (min: number, max: number, currency: string) => {
  if (currency === 'USD') {
    return `$${(min / 1000).toLocaleString('en-US')}k – $${(max / 1000).toLocaleString('en-US')}k USD`;
  }
  const minBillion = min / 1000000000;
  const maxBillion = max / 1000000000;
  if (minBillion >= 1) return `${minBillion} – ${maxBillion} tỷ VNĐ`;
  return `${min / 1000000} – ${max / 1000000} triệu VNĐ`;
};

const FundingOpportunityDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isSaved, setIsSaved] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const opportunity = slug ? getFundingOpportunityBySlug(slug) : undefined;
  const business = opportunity ? getBusinessById(opportunity.businessId) : undefined;

  // Section 25 Status Rules: Draft, Pending Review, Rejected, Hidden must return public not found state
  const allowedPublicStatuses = ['Published', 'Closed', 'Funded', 'Archived'];
  const isPublicStatus = opportunity && allowedPublicStatuses.includes(opportunity.status);

  if (!opportunity || !business || !isPublicStatus) {
    return (
      <div className={styles.pageWrapper}>
        <div className="container">
          <div className={styles.notFoundCard}>
            <FileText size={56} className={styles.notFoundIcon} />
            <h2>Funding opportunity not found</h2>
            <p>The opportunity may no longer be public, or the link is incorrect.</p>
            <Link to="/businesses" className={styles.primaryBtn}>
              <ArrowLeft size={16} /> Explore Businesses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isClosed = opportunity.status === 'Closed';
  const isFunded = opportunity.status === 'Funded';
  const isArchived = opportunity.status === 'Archived';
  const isInteractive = opportunity.status === 'Published';

  const relatedOpps = getRelatedFundingOpportunities(opportunity, 3);
  const relatedRecords = relatedOpps.map(opp => {
    const b = getBusinessById(opp.businessId) || business;
    return { business: b, opportunity: opp };
  });

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
            <li><Link to={`/businesses/${business.slug}`}>{business.name}</Link></li>
            <li className={styles.separator}>/</li>
            <li aria-current="page" className={styles.activeBreadcrumb}>{opportunity.title}</li>
          </ol>
        </nav>

        {/* Opportunity Header */}
        <div className={styles.headerCard}>
          <div className={styles.headerTop}>
            <Link to={`/businesses/${business.slug}`} className={styles.logoBox} title={`View ${business.name} profile`}>
              <span className={styles.logoInitial}>{business.name.charAt(0)}</span>
            </Link>
            <div className={styles.headerInfo}>
              <div className={styles.businessLinkRow}>
                <Link to={`/businesses/${business.slug}`} className={styles.businessName}>
                  {business.name}
                </Link>
                {business.verified && (
                  <span className={styles.verifiedBadge} title="Verified Business">
                    <CheckCircle2 size={16} /> Verified
                  </span>
                )}
              </div>
              <h1 className={styles.title}>{opportunity.title}</h1>
              <div className={styles.tagsRow}>
                <span className={`${styles.statusBadge} ${styles[opportunity.status.toLowerCase()]}`}>
                  {isFunded ? 'Successfully Funded' : opportunity.status}
                </span>
                <span className={styles.tag}>{business.industry}</span>
                <span className={styles.tag}>{opportunity.fundingPurpose}</span>
                <span className={styles.tag}>{opportunity.fundingType}</span>
              </div>
            </div>
          </div>
          <p className={styles.shortDesc}>{opportunity.shortDescription}</p>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className={styles.authNotice}>
            <p>{actionNotice}</p>
            <button type="button" onClick={() => setActionNotice(null)} className={styles.closeNoticeBtn}>Dismiss</button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className={styles.contentLayout}>
          <div className={styles.mainContent}>

            {/* Opportunity Overview */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Opportunity Overview</h2>
              <p className={styles.bodyText}>
                {opportunity.detailedOverview || opportunity.shortDescription}
              </p>
              {opportunity.timelineDescription && (
                <div className={styles.timelineBox}>
                  <Clock size={18} className={styles.timelineIcon} />
                  <div>
                    <strong>Timeline & Schedule:</strong> {opportunity.timelineDescription}
                  </div>
                </div>
              )}
            </section>

            {/* Business Summary */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Business Summary</h2>
              <p className={styles.bodyText}>{business.description}</p>
              <div className={styles.infoGrid}>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Business</span>
                  <Link to={`/businesses/${business.slug}`} className={styles.infoLink}>{business.name}</Link>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Type</span>
                  <span className={styles.infoValue}>{business.businessType}</span>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Stage</span>
                  <span className={styles.infoValue}>{business.businessStage}</span>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Location</span>
                  <span className={styles.infoValue}>{business.location}</span>
                </div>
              </div>
            </section>

            {/* Funding Request */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Funding Request</h2>
              <div className={styles.requestGrid}>
                <div className={styles.requestCard}>
                  <span className={styles.requestLabel}>Target Funding Amount</span>
                  <span className={styles.requestValue}>{formatCurrency(opportunity.fundingAmountMin, opportunity.fundingAmountMax, opportunity.currency)}</span>
                </div>
                <div className={styles.requestCard}>
                  <span className={styles.requestLabel}>Funding Purpose</span>
                  <span className={styles.requestValue}>{opportunity.fundingPurpose}</span>
                </div>
                <div className={styles.requestCard}>
                  <span className={styles.requestLabel}>Funding Structure</span>
                  <span className={styles.requestValue}>{opportunity.fundingType}</span>
                </div>
              </div>
            </section>

            {/* Use of Funds */}
            {opportunity.useOfFunds && opportunity.useOfFunds.length > 0 && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Use of Funds</h2>
                <div className={styles.useOfFundsList}>
                  {opportunity.useOfFunds.map((item, idx) => (
                    <div key={idx} className={styles.fundItem}>
                      <div className={styles.fundHeader}>
                        <span className={styles.fundCategory}>{item.category}</span>
                        <span className={styles.fundPercent}>{item.percentage}%</span>
                      </div>
                      <div className={styles.barBg}>
                        <div className={styles.barFill} style={{ width: `${item.percentage}%` }}></div>
                      </div>
                      <p className={styles.fundDesc}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Growth Plan */}
            {opportunity.growthPlan && (
              <section className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Growth Plan</h2>
                <div className={styles.growthGrid}>
                  <div className={styles.growthBox}>
                    <strong>Market Context:</strong> {opportunity.growthPlan.context}
                  </div>
                  <div className={styles.growthBox}>
                    <strong>Opportunity:</strong> {opportunity.growthPlan.opportunity}
                  </div>
                  <div className={styles.growthBox}>
                    <strong>Planned Activities:</strong> {opportunity.growthPlan.plannedActivities}
                  </div>
                  <div className={styles.growthBox}>
                    <strong>Main Risks:</strong> {opportunity.growthPlan.mainRisks}
                  </div>
                </div>
              </section>
            )}

            {/* Public Financial Highlights */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Public Financial Highlights</h2>
              {business.financialHighlights ? (
                <div className={styles.infoGrid}>
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Revenue Range</span>
                    <span className={styles.infoValue}>{business.financialHighlights.revenueRange}</span>
                  </div>
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Growth Rate</span>
                    <span className={styles.infoValue}>{business.financialHighlights.growthRange}</span>
                  </div>
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Profitability</span>
                    <span className={styles.infoValue}>{business.financialHighlights.profitabilityStatus}</span>
                  </div>
                </div>
              ) : null}

              {/* Restricted Financial Data Note */}
              <div className={styles.restrictedBox}>
                <Lock size={18} className={styles.restrictedIcon} />
                <span>Additional detailed financial statements and audit records are available to approved investors upon request.</span>
              </div>
            </section>

            {/* Public Documents */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Public Documents</h2>
              {opportunity.publicDocuments && opportunity.publicDocuments.length > 0 ? (
                <div className={styles.docsList}>
                  {opportunity.publicDocuments.map(doc => (
                    <div key={doc.id} className={styles.docCard}>
                      <FileText size={24} className={styles.docIcon} />
                      <div className={styles.docInfo}>
                        <span className={styles.docTitle}>{doc.title}</span>
                        <span className={styles.docMeta}>{doc.type} • {doc.fileSize || 'Public PDF'}</span>
                      </div>
                      <button 
                        type="button"
                        className={styles.docBtn}
                        onClick={() => setActionNotice('Document download requires user authentication.')}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.mutedText}>No public documents have been attached to this opportunity.</p>
              )}
            </section>

          </div>

          {/* Sticky Summary Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <div className={styles.amountBox}>
                <span className={styles.amountLabel}>Seeking Capital</span>
                <span className={styles.amountValue}>
                  {formatCurrency(opportunity.fundingAmountMin, opportunity.fundingAmountMax, opportunity.currency)}
                </span>
              </div>

              <div className={styles.summaryList}>
                <div className={styles.summaryRow}>
                  <span>Funding Purpose</span>
                  <strong>{opportunity.fundingPurpose}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Structure</span>
                  <strong>{opportunity.fundingType}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Status</span>
                  <strong className={`${styles.statusText} ${styles[opportunity.status.toLowerCase()]}`}>
                    {isFunded ? 'Successfully Funded' : opportunity.status}
                  </strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Location</span>
                  <strong>{business.location}</strong>
                </div>
              </div>

              <div className={styles.sidebarActions}>
                <button 
                  type="button"
                  className={`${styles.primaryActionBtn} ${(isClosed || isFunded || isArchived) ? styles.disabledBtn : ''}`}
                  disabled={!isInteractive}
                  onClick={() => {
                    if (isClosed) setActionNotice('This funding opportunity is closed to new contact requests.');
                    else if (isFunded) setActionNotice('This opportunity has been successfully funded.');
                    else if (isArchived) setActionNotice('This opportunity is archived.');
                    else setActionNotice('Sign in is required to send direct contact requests.');
                  }}
                >
                  <Mail size={18} /> {isFunded ? 'Successfully Funded' : isClosed ? 'Opportunity Closed' : isArchived ? 'Archived' : 'Contact Business'}
                </button>

                <button 
                  type="button"
                  className={`${styles.secondaryActionBtn} ${isSaved ? styles.savedBtn : ''}`}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Bookmark size={18} /> {isSaved ? 'Opportunity Saved' : 'Save Opportunity'}
                </button>

                <button 
                  type="button"
                  className={styles.secondaryActionBtn}
                  onClick={() => setActionNotice('Document access request is restricted to verified investors.')}
                >
                  <Lock size={16} /> Request Document Access
                </button>
              </div>
            </div>

            {/* Disclaimer Sidebar Note */}
            <div className={styles.summaryCard}>
              <h3 className={styles.sideTitle}>Investment Notice</h3>
              <p className={styles.sideDisclaimer}>
                Startups Blogs is an information connection platform. All investments and agreements are negotiated directly between parties.
              </p>
              <Link to="/investment-disclaimer" className={styles.disclaimerLink}>
                Read full Investment Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Related Funding Opportunities */}
        {relatedRecords.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>Related Opportunities</h2>
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

export default FundingOpportunityDetail;
