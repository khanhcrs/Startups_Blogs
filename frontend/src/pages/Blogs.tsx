import styles from './Blogs.module.css';
import newsStyles from './News.module.css';

const Blogs = () => {
  return (
    <div className="section">
      <div className="container">
        <h1 className={styles.title}>Blogs & Insights</h1>
        <p className={styles.subtitle}>Learn, grow and get inspired by our collection of startup stories and guides.</p>

        <div className={styles.searchBar}>
          <input type="text" placeholder="Search blogs..." className={styles.searchInput} />
        </div>

        <div className={newsStyles.tabs} style={{marginBottom: 'var(--spacing-8)'}}>
          <button className={`${newsStyles.tab} ${newsStyles.activeTab}`}>All</button>
          <button className={newsStyles.tab}>Startup Guide</button>
          <button className={newsStyles.tab}>Funding</button>
          <button className={newsStyles.tab}>Growth</button>
          <button className={newsStyles.tab}>Product</button>
          <button className={newsStyles.tab}>Founder Story</button>
        </div>

        <div className={newsStyles.heroSection} style={{marginBottom: 'var(--spacing-12)'}}>
          <div className={newsStyles.mainNews}>
            <div className={newsStyles.mainNewsImage} style={{backgroundColor: '#1f2937', backgroundImage: 'url(/images/blog_main_presentation.jpg)'}}></div>
            <div className={newsStyles.mainNewsContent}>
              <span className={newsStyles.tag}>STARTUP GUIDE</span>
              <h2>How to build a pitch deck that investors love</h2>
              <p>A complete guide to creating a compelling pitch deck that gets you funded.</p>
              <div className={newsStyles.meta}>May 10, 2024 &bull; 7 min read</div>
            </div>
          </div>
          
          <div className={styles.sideBlogs}>
            {[
              { tag: 'FOUNDER STORY', title: 'From zero to seed: Our journey building GreenFlow', date: 'May 8, 2024', read: '6 min read', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80' },
              { tag: 'FUNDING', title: 'What investors look for in pre-seed startups', date: 'May 6, 2024', read: '5 min read', img: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&q=80' },
              { tag: 'GROWTH', title: '10 growth strategies for early-stage startups', date: 'May 5, 2024', read: '8 min read', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&q=80' }
            ].map((blog, i) => (
              <div key={i} className={styles.sideBlogItem}>
                <div className={styles.sideBlogImg} style={{backgroundImage: `url(${blog.img})`}}></div>
                <div className={styles.sideBlogContent}>
                  <span className={styles.sideBlogTag}>{blog.tag}</span>
                  <h4>{blog.title}</h4>
                  <div className={styles.meta}>{blog.date} &bull; {blog.read}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.mostPopular}>
            <h3>Most Popular</h3>
            <div className={styles.popularList}>
              {[
                { id: 1, title: 'Common mistakes startups make when raising funds', date: 'Apr 30, 2024', read: '6 min read' },
                { id: 2, title: 'How to validate your startup idea the right way', date: 'Apr 28, 2024', read: '5 min read' },
                { id: 3, title: 'The ultimate guide to finding your first 100 users', date: 'Apr 25, 2024', read: '7 min read' }
              ].map(item => (
                <div key={item.id} className={styles.popularListItem}>
                  <div className={styles.rankBadge}>{item.id}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <div className={styles.meta}>{item.date} &bull; {item.read}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.newsletterBox}>
            <h3>Subscribe to our newsletter</h3>
            <p>Get the latest insights and resources straight to your inbox.</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email" className={styles.newsletterInput} />
              <button type="submit" className={styles.newsletterBtn}>Subscribe</button>
            </form>
            <div className={styles.newsletterIllustration}>
              <img src="/images/newsletter_illustration.jpg" alt="Newsletter" className={styles.newsletterImg} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Blogs;
