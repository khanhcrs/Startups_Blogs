import { Link } from 'react-router-dom';
import styles from './Blogs.module.css';
import { getInitials } from '../utils/stringUtils';
import { api } from '../lib/axios';
import { useState, useEffect } from 'react';
import { ArticleSkeleton, FeaturedArticleSkeleton } from '../components/ArticleSkeleton';
import toast from 'react-hot-toast';
import ArticleCard from '../components/ArticleCard';

const Blogs = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/articles?category=Blog&take=20')
      .then(res => {
        setArticles(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch blogs', err);
        toast.error('Failed to load blogs. Please try again later.');
        setArticles([]);
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

  const featuredPost = articles.length > 0 ? articles[0] : null;
  const recentPosts = articles.length > 1 ? articles.slice(1) : [];

  const handleLoadMore = () => {
    setIsLoading(true);
    api.get(`/articles?category=Blog&take=20&skip=${articles.length}`)
      .then(res => {
        setArticles(prev => [...prev, ...res.data]);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load more blogs', err);
        toast.error('Failed to load more blogs.');
        setIsLoading(false);
      });
  };

  return (
    <div className="section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Startup Blogs & Insights</h1>
            <p className={styles.subtitle}>Founder stories, growth strategies, and industry trends.</p>
          </div>
        </div>

        <div className={styles.mainLayout}>
          <div className={styles.feed}>
            {isLoading && articles.length === 0 ? (
              <FeaturedArticleSkeleton />
            ) : featuredPost ? (
              <Link to={`/blogs/${featuredPost.slug}`} className={styles.featuredCard}>
                <div 
                  className={styles.featuredImage} 
                  style={{ backgroundImage: `url(${featuredPost.coverImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'})` }} 
                />
                <div className={styles.featuredContent}>
                  <div className={styles.featuredMeta}>
                    <span className={styles.tag}>{featuredPost.category}</span>
                    <span>{formatDate(featuredPost.publishedAt || featuredPost.createdAt)}</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                  <p className={styles.featuredSummary}>{featuredPost.summary}</p>
                  
                  <div className={styles.authorRow}>
                    <div className={styles.avatarSmall}>{getInitials(featuredPost.author?.name || 'A')}</div>
                    <span style={{ fontWeight: 500 }}>{featuredPost.author?.name || 'Anonymous'}</span>
                  </div>
                </div>
              </Link>
            ) : null}

            <h3 style={{ marginTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)' }}>Recent Articles</h3>
            
            <div className={styles.articleList}>
              {recentPosts.length > 0 ? (
                recentPosts.map(article => (
                  <ArticleCard key={article.id} article={article} variant="list" />
                ))
              ) : (
                !isLoading && featuredPost === null && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No blogs available at the moment.
                  </div>
                )
              )}
              {isLoading && articles.length > 0 && (
                Array.from({ length: 4 }).map((_, idx) => (
                  <ArticleSkeleton key={`recent-skel-${idx}`} />
                ))
              )}
            </div>
            
            {!isLoading && articles.length >= 20 && (
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
              <h3 className={styles.sidebarTitle}>Popular Topics</h3>
              <div className={styles.tagsContainer}>
                {['Fundraising', 'Growth', 'Product', 'Leadership', 'Marketing', 'Culture', 'Sales'].map(tag => (
                  <span key={tag} className={styles.tagPill}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Top Authors</h3>
              <div className={styles.authorList}>
                {[
                  { name: 'Sarah Chen', role: 'VC @ NexTech', initials: 'SC' },
                  { name: 'Marcus Johnson', role: 'Founder, DataSync', initials: 'MJ' },
                  { name: 'Elena Rodriguez', role: 'Product Lead', initials: 'ER' }
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

export default Blogs;
