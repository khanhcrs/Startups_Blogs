import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Blogs.module.css'; // Reuse Blogs layout styles for consistency
import { api } from '../lib/axios';
import toast from 'react-hot-toast';
import ArticleCard from '../components/ArticleCard';
import { ArticleSkeleton, FeaturedArticleSkeleton } from '../components/ArticleSkeleton';

const News = () => {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/articles?category=News&take=20')
      .then(res => {
        setNews(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch news', err);
        toast.error('Failed to load news. Please try again later.');
        setNews([]);
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const featuredPost = news.length > 0 ? news[0] : null;
  const recentNews = news.length > 1 ? news.slice(1) : [];

  const handleLoadMore = () => {
    setIsLoading(true);
    api.get(`/articles?category=News&take=20&skip=${news.length}`)
      .then(res => {
        setNews(prev => [...prev, ...res.data]);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load more news', err);
        toast.error('Failed to load more news.');
        setIsLoading(false);
      });
  };

  return (
    <div className="section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Latest News</h1>
            <p className={styles.subtitle}>Funding announcements, acquisitions, and market updates.</p>
          </div>
        </div>

        <div className={styles.mainLayout}>
          <div className={styles.feed}>
            {isLoading && news.length === 0 ? (
              <FeaturedArticleSkeleton />
            ) : featuredPost ? (
              <Link to={`/blogs/${featuredPost.slug}`} className={styles.featuredCard}>
                <div 
                  className={styles.featuredImage} 
                  style={{ backgroundImage: `url(${featuredPost.coverImage || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80'})` }} 
                />
                <div className={styles.featuredContent}>
                  <div className={styles.featuredMeta}>
                    <span className={styles.tag}>{featuredPost.category || 'NEWS'}</span>
                    <span>{formatDate(featuredPost.publishedAt || featuredPost.createdAt)}</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                  <p className={styles.featuredSummary}>{featuredPost.summary}</p>
                </div>
              </Link>
            ) : null}

            <h3 style={{ marginTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)' }}>Recent Updates</h3>
            
            <div className={styles.articleList}>
              {recentNews.length > 0 ? (
                recentNews.map(item => (
                  <ArticleCard key={item.id} article={item} variant="list" />
                ))
              ) : (
                !isLoading && featuredPost === null && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No news available at the moment.
                  </div>
                )
              )}
              {isLoading && news.length > 0 && (
                Array.from({ length: 4 }).map((_, idx) => (
                  <ArticleSkeleton key={`recent-skel-${idx}`} />
                ))
              )}
            </div>

            {!isLoading && news.length >= 20 && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button 
                  onClick={handleLoadMore} 
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
          
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Trending Tags</h3>
              <div className={styles.tagsContainer}>
                {['Series A', 'M&A', 'IPO', 'AI', 'Fintech', 'SaaS', 'Climate Tech'].map(tag => (
                  <span key={tag} className={styles.tagPill}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Top Sources</h3>
              <div className={styles.authorList}>
                {[
                  { name: 'TechCrunch', role: 'Publisher', initials: 'TC' },
                  { name: 'Bloomberg', role: 'Publisher', initials: 'BB' },
                  { name: 'VentureBeat', role: 'Publisher', initials: 'VB' }
                ].map((author, idx) => (
                  <div key={idx} className={styles.authorItem}>
                    <div className={styles.avatarSmall}>{author.initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{author.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{author.role}</div>
                    </div>
                    <button className={styles.followBtnSmall}>Follow</button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default News;
