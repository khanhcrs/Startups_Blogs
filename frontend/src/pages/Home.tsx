import { useState, useEffect } from 'react';
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
import { api } from '../lib/axios';

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  
  const [featuredBusiness, setFeaturedBusiness] = useState<any>(null);
  const [latestBusinesses, setLatestBusinesses] = useState<any[]>([]);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);

  useEffect(() => {
    // Fetch businesses
    api.get('/businesses?take=7').then(res => {
      if (res.data && res.data.length > 0) {
        setFeaturedBusiness(res.data[0]); 
        setLatestBusinesses(res.data.slice(1, 7));
      }
    }).catch(err => console.error(err));

    // Fetch articles
    api.get('/articles').then(res => {
      setLatestArticles(res.data.data.slice(0, 3));
    }).catch(err => console.error(err));
  }, []);

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
          <h1 className={styles.heroTitle}>Kết nối Startup, Xây dựng Cộng đồng & Kiến tạo Tương lai</h1>
          <p className={styles.heroDesc}>
            Nền tảng kết nối các doanh nghiệp và những người đam mê khởi nghiệp. Khám phá cơ hội hợp tác và chia sẻ câu chuyện của bạn.
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
            <Link to="/create-blog" className={styles.secondaryBtn}>Viết Blog Ngay</Link>
          </div>
        </div>
      </section>

      {/* Featured Business Banner */}
      {featuredBusiness && (
        <section className="section bg-secondary">
          <div className="container">
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-6)' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Startup</h2>
              <Link to="/businesses" style={{ color: 'var(--primary-500)', fontWeight: 600 }}>Explore all startups &rarr;</Link>
            </div>

            <div className={styles.featuredCard} style={{ backgroundColor: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-8)', border: '1px solid var(--border-color)', display: 'flex', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-50)', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, overflow: 'hidden' }}>
                    {featuredBusiness.logoUrl ? (
                      <img src={featuredBusiness.logoUrl} alt={featuredBusiness.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      featuredBusiness.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      {featuredBusiness.name}
                      {featuredBusiness.verified && <CheckCircle2 size={18} color="var(--primary-500)" />}
                    </h3>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{featuredBusiness.industry} • {featuredBusiness.businessType}</span>
                  </div>
                </div>
                <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--primary-600)', marginBottom: 'var(--spacing-2)' }}>
                  {featuredBusiness.description}
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: 'var(--spacing-4)' }}>
                  {featuredBusiness.detailedOverview}
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>Stage</span>
                    <strong>{featuredBusiness.businessStage}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>Location</span>
                    <strong>{featuredBusiness.location}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>Team Size</span>
                    <strong>{featuredBusiness.employeeRange || 'N/A'}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <Link to={`/businesses/${featuredBusiness.slug}`} className={styles.primaryBtn} style={{ padding: 'var(--spacing-2) var(--spacing-6)', fontSize: 'var(--font-size-sm)' }}>
                    View Business
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Businesses Seeking Partners */}
      <section className="section">
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-8)' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Latest Businesses Seeking Partners</h2>
            <Link to="/businesses" style={{ color: 'var(--primary-500)', fontWeight: 500 }}>View all businesses &rarr;</Link>
          </div>
          <div className={styles.grid}>
            {latestBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
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
          <h2 className="section-title text-center" style={{ marginBottom: 'var(--spacing-10)' }}>How It Works</h2>
          <div className={styles.howItWorks}>
            <div className={styles.stepBox}>
              <h3 style={{ textAlign: 'center' }}>For Businesses</h3>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <div className={styles.stepNum}>1</div>
                  <div className={styles.stepTitle}>Create a Business Profile</div>
                  <div className={styles.stepDesc}>Tạo hồ sơ chuyên nghiệp đại diện cho doanh nghiệp của bạn.</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum}>2</div>
                  <div className={styles.stepTitle}>Manage Funding History</div>
                  <div className={styles.stepDesc}>Cập nhật các vòng gọi vốn để gia tăng uy tín cho startup.</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum}>3</div>
                  <div className={styles.stepTitle}>Connect with Partners</div>
                  <div className={styles.stepDesc}>Nhận yêu cầu liên hệ trực tiếp từ các đối tác quan tâm.</div>
                </div>
              </div>
            </div>

            <div className={styles.stepBox} style={{ backgroundColor: '#f0fdf4' }}>
              <h3 style={{ textAlign: 'center', color: '#166534' }}>For the Community</h3>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <div className={styles.stepNum} style={{ backgroundColor: '#22c55e' }}>1</div>
                  <div className={styles.stepTitle}>Read Startup News</div>
                  <div className={styles.stepDesc}>Cập nhật tin tức và xu hướng mới nhất từ các startup.</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum} style={{ backgroundColor: '#22c55e' }}>2</div>
                  <div className={styles.stepTitle}>Share Your Insights</div>
                  <div className={styles.stepDesc}>Viết blog chia sẻ kiến thức, kinh nghiệm về thị trường.</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum} style={{ backgroundColor: '#22c55e' }}>3</div>
                  <div className={styles.stepTitle}>Engage & Discuss</div>
                  <div className={styles.stepDesc}>Tương tác, bình luận và xây dựng cộng đồng khởi nghiệp.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Blogs */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-8)' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Latest News & Insights</h2>
            <Link to="/blogs" style={{ color: 'var(--primary-500)', fontWeight: 500 }}>View all articles &rarr;</Link>
          </div>
          <div className={styles.newsGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {latestArticles.map(article => (
              <div key={article.id} className={styles.newsCard} style={{ backgroundColor: 'white' }}>
                <div className={styles.newsImg} style={{ backgroundImage: `url(${article.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className={styles.newsContent}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--primary-600)', backgroundColor: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>{article.category}</span>
                  </div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-2)' }}>
                    <Link to={`/blogs/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{article.title}</Link>
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-body)', marginBottom: 'var(--spacing-4)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.summary}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    <span style={{ fontWeight: 500 }}>{article.author.name}</span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="container">
        <div className={styles.ctaBanner}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-2)' }}>Bạn có câu chuyện khởi nghiệp muốn chia sẻ?</h2>
            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-body)' }}>Trở thành một phần của cộng đồng, lan tỏa kiến thức và nâng cao uy tín cho bản thân và startup của bạn.</p>
          </div>
          <Link to="/create-blog" className={styles.primaryBtn} style={{ padding: 'var(--spacing-4) var(--spacing-8)', fontSize: 'var(--font-size-lg)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Bắt đầu viết
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
