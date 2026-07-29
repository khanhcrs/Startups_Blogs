import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Utensils, 
  ShoppingBag, 
  Factory, 
  Sprout, 
  Cpu, 
  GraduationCap, 
  Activity, 
  Truck, 
  Hotel, 
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import BusinessCard from '../components/business/BusinessCard';
import styles from './Home.module.css';
import { MOCK_RECORDS } from '../utils/mockData';

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/businesses?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/businesses');
    }
  };

  const handleIndustryClick = (industryName: string) => {
    navigate(`/businesses?industry=${encodeURIComponent(industryName)}`);
  };

  const featuredRecord = MOCK_RECORDS[0]; // An Nam Culinary
  const latestRecords = MOCK_RECORDS.slice(0, 6);

  const industries = [
    { name: 'Food & Beverage', icon: <Utensils size={28} />, color: 'var(--cat-food)' },
    { name: 'Retail', icon: <ShoppingBag size={28} />, color: 'var(--cat-eco)' },
    { name: 'Manufacturing', icon: <Factory size={28} />, color: 'var(--cat-tech)' },
    { name: 'Agriculture', icon: <Sprout size={28} />, color: 'var(--cat-green)' },
    { name: 'Technology', icon: <Cpu size={28} />, color: 'var(--primary-500)' },
    { name: 'Education', icon: <GraduationCap size={28} />, color: 'var(--cat-edtech)' },
    { name: 'Healthcare', icon: <Activity size={28} />, color: 'var(--cat-health)' },
    { name: 'Logistics', icon: <Truck size={28} />, color: 'var(--cat-ai)' },
    { name: 'Hospitality', icon: <Hotel size={28} />, color: 'var(--cat-fintech)' },
    { name: 'Professional Services', icon: <Briefcase size={28} />, color: 'var(--text-dark)' },
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.heroTitle}>Grow Your Business with the Right Investment</h1>
          <p className={styles.heroDesc}>
            Connect small businesses, startups and investors to create sustainable growth opportunities.
          </p>
          <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search businesses, opportunities, industries or locations..." 
              className={styles.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>
          <div className={styles.heroActions}>
            <Link to="/businesses" className={styles.primaryBtn}>Explore Businesses</Link>
            <Link to="/raise-capital" className={styles.secondaryBtn}>Raise Capital</Link>
          </div>
        </div>
      </section>

      {/* Featured Investment Opportunity Banner */}
      {featuredRecord && featuredRecord.opportunity && (
        <section className="section bg-secondary">
          <div className="container">
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-6)' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Investment Opportunity</h2>
              <Link to="/businesses" style={{ color: 'var(--primary-500)', fontWeight: 600 }}>Explore all opportunities &rarr;</Link>
            </div>

            <div className={styles.featuredCard} style={{ backgroundColor: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-8)', border: '1px solid var(--border-color)', display: 'flex', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-50)', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {featuredRecord.business.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      {featuredRecord.business.name}
                      {featuredRecord.business.verified && <CheckCircle2 size={18} color="var(--primary-500)" />}
                    </h3>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{featuredRecord.business.industry} • {featuredRecord.business.businessType}</span>
                  </div>
                </div>
                <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--primary-600)', marginBottom: 'var(--spacing-2)' }}>
                  {featuredRecord.opportunity.title}
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: 'var(--spacing-4)' }}>
                  {featuredRecord.opportunity.shortDescription}
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>Seeking</span>
                    <strong>2 – 3.5 tỷ VNĐ</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>Purpose</span>
                    <strong>{featuredRecord.opportunity.fundingPurpose}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>Location</span>
                    <strong>{featuredRecord.business.location}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <Link to={`/businesses/${featuredRecord.business.slug}`} className={styles.primaryBtn} style={{ padding: 'var(--spacing-2) var(--spacing-6)', fontSize: 'var(--font-size-sm)' }}>
                    View Opportunity
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Businesses Seeking Investment */}
      <section className="section">
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-8)' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Latest Businesses Seeking Investment</h2>
            <Link to="/businesses" style={{ color: 'var(--primary-500)', fontWeight: 500 }}>View all businesses &rarr;</Link>
          </div>
          <div className={styles.grid}>
            {latestRecords.map((record) => (
              <BusinessCard key={record.business.id} {...record} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Industry */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-8)' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Browse by Industry</h2>
            <Link to="/businesses" style={{ color: 'var(--primary-500)', fontWeight: 500 }}>View all industries &rarr;</Link>
          </div>
          <div className={styles.categoryGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {industries.map((ind) => (
              <div 
                key={ind.name} 
                className={styles.categoryCard} 
                onClick={() => handleIndustryClick(ind.name)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.categoryIcon} style={{ color: ind.color }}>
                  {ind.icon}
                </div>
                <span className={styles.categoryName}>{ind.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className={styles.howItWorks}>
            <div className={styles.stepBox}>
              <h3>For Businesses</h3>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <div className={styles.stepNum}>1</div>
                  <div className={styles.stepTitle}>Create a Business Profile</div>
                  <div className={styles.stepDesc}>Tạo hồ sơ chuyên nghiệp đại diện cho doanh nghiệp của bạn.</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum}>2</div>
                  <div className={styles.stepTitle}>Publish a Funding Opportunity</div>
                  <div className={styles.stepDesc}>Công bố nhu cầu gọi vốn hoặc tìm kiếm đối tác hợp tác.</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum}>3</div>
                  <div className={styles.stepTitle}>Connect with Investors</div>
                  <div className={styles.stepDesc}>Nhận yêu cầu liên hệ trực tiếp từ các nhà đầu tư quan tâm.</div>
                </div>
              </div>
            </div>
            <div className={styles.stepBox} style={{ backgroundColor: 'var(--primary-50)' }}>
              <h3 style={{ color: 'var(--primary-600)' }}>For Investors</h3>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <div className={styles.stepNum} style={{ backgroundColor: 'var(--primary-600)' }}>1</div>
                  <div className={styles.stepTitle}>Explore Businesses</div>
                  <div className={styles.stepDesc}>Tìm kiếm cơ hội đầu tư theo ngành nghề, loại hình và địa điểm.</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum} style={{ backgroundColor: 'var(--primary-600)' }}>2</div>
                  <div className={styles.stepTitle}>Save & Evaluate</div>
                  <div className={styles.stepDesc}>Lưu lại và đánh giá các hồ sơ doanh nghiệp tiềm năng.</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum} style={{ backgroundColor: 'var(--primary-600)' }}>3</div>
                  <div className={styles.stepTitle}>Contact Business Owners</div>
                  <div className={styles.stepDesc}>Gửi yêu cầu liên hệ trực tiếp tới chủ doanh nghiệp.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="container">
        <div className={styles.ctaBanner}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-2)' }}>Ready to expand your business?</h2>
            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-body)' }}>Giới thiệu cơ hội đầu tư và mở rộng hợp tác cùng cộng đồng nhà đầu tư.</p>
          </div>
          <Link to="/raise-capital" className={styles.primaryBtn} style={{ padding: 'var(--spacing-4) var(--spacing-8)', fontSize: 'var(--font-size-lg)', textDecoration: 'none' }}>
            Raise Capital Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
