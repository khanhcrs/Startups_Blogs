import styles from './News.module.css';

const News = () => {
  return (
    <div className="section">
      <div className="container">
        <h1 className={styles.title}>Latest News</h1>
        <p className={styles.subtitle}>Stay updated with the latest startup ecosystem news and announcements.</p>

        <div className={styles.heroSection}>
          <div className={styles.mainNews}>
            <div className={styles.mainNewsImage} style={{backgroundImage: 'url(/images/news_main_cityscape.jpg)'}}></div>
            <div className={styles.mainNewsContent}>
              <span className={styles.tag}>FUNDING NEWS</span>
              <h2>Vietnamese AI startup raises $2M in seed funding round</h2>
              <p>The funding will be used to expand the team and develop its AI-powered platform...</p>
              <div className={styles.meta}>May 12, 2024 &bull; 5 min read</div>
            </div>
          </div>
          
          <div className={styles.popularNews}>
            <h3 className={styles.popularTitle}>Popular News</h3>
            {[
              { title: 'TechCrunch Disrupt 2024: What to expect', date: 'May 10, 2024', img: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=200&q=80' },
              { title: 'Government launches new startup support program', date: 'May 9, 2024', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80' },
              { title: 'Fintech startups to watch in 2024', date: 'May 8, 2024', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&q=80' },
              { title: 'Global VC funding drops 10% in Q1 2024', date: 'May 8, 2024', img: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=200&q=80' },
            ].map((news, i) => (
              <div key={i} className={styles.popularItem}>
                <div className={styles.popularImg} style={{backgroundImage: `url(${news.img})`}}></div>
                <div className={styles.popularContent}>
                  <h4>{news.title}</h4>
                  <span>{news.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.activeTab}`}>All News</button>
          <button className={styles.tab}>Funding</button>
          <button className={styles.tab}>Partnerships</button>
          <button className={styles.tab}>Events</button>
          <button className={styles.tab}>Policy</button>
          <button className={styles.tab}>Product Updates</button>
        </div>

        <div className={styles.newsList}>
          {[
            { tag: 'FUNDING', title: 'HealthTech startup Medix AI raises $3.5M Series A', desc: 'Medix AI will use the funding to expand its product and enter new markets across Southeast Asia.', date: 'May 11, 2024', readTime: '4 min read', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80' },
            { tag: 'EVENTS', title: 'Startup Vietnam Summit 2024 announced', desc: 'The largest startup event in Vietnam will return this August in Ho Chi Minh City with 100+ speakers.', date: 'May 9, 2024', readTime: '3 min read', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80' },
            { tag: 'POLICY', title: 'New tax incentives for innovative startups', desc: 'The government introduces new tax policies to encourage innovation and research in early-stage startups.', date: 'May 7, 2024', readTime: '2 min read', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80' }
          ].map((item, i) => (
            <div key={i} className={styles.listItem}>
              <div className={styles.listImg} style={{backgroundImage: `url(${item.img})`}}></div>
              <div className={styles.listContent}>
                <span className={styles.listTag}>{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className={styles.meta}>{item.date} &bull; {item.readTime}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.loadMore}>
          <button className={styles.loadMoreBtn}>See more news</button>
        </div>
      </div>
    </div>
  );
};

export default News;
