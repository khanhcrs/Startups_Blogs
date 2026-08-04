import { Link } from 'react-router-dom';
import styles from './Blogs.module.css';
import { MOCK_ARTICLES } from '../utils/mockData';
import { getInitials } from '../utils/stringUtils';

const Blogs = () => {
  // Get trending tags
  const trendingTags = ['Startup', 'Funding', 'Technology', 'Marketing', 'Leadership'];
  
  // Get featured article (first one for demo)
  const featuredArticle = MOCK_ARTICLES[0];
  
  // Get feed articles
  const feedArticles = MOCK_ARTICLES.slice(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="section">
      <div className="container">
        
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Explore Blogs</h1>
            <p className={styles.subtitle}>Insights, stories, and expertise from the startup community.</p>
          </div>
        </div>

        <div className={styles.mainLayout}>
          <div className={styles.feed}>
            
            {/* Featured Article */}
            {featuredArticle && (
              <Link to={`/blogs/${featuredArticle.slug}`} className={styles.featuredCard}>
                {featuredArticle.coverImage && (
                  <div className={styles.featuredImage} style={{backgroundImage: `url(${featuredArticle.coverImage})`}}></div>
                )}
                <div className={styles.featuredContent}>
                  <div className={styles.featuredMeta}>
                    <span className={styles.tag}>{featuredArticle.category}</span>
                    <span>{formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featuredArticle.title}</h2>
                  <p className={styles.featuredSummary}>{featuredArticle.summary}</p>
                  
                  <div className={styles.authorRow}>
                    <div className={styles.avatarSmall}>{getInitials(featuredArticle.author.name)}</div>
                    <span>{featuredArticle.author.name}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Standard Feed */}
            <div className={styles.articleList}>
              {feedArticles.map(article => (
                <Link to={`/blogs/${article.slug}`} key={article.id} className={styles.articleCard}>
                  <div className={styles.articleInfo}>
                    <div className={styles.authorRow} style={{marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
                      <div className={styles.avatarTiny}>{getInitials(article.author.name)}</div>
                      <span>{article.author.name}</span>
                      <span style={{margin: '0 0.25rem'}}>•</span>
                      <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                    </div>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    <p className={styles.articleSummary}>{article.summary}</p>
                    <div className={styles.articleFooter}>
                      <span className={styles.tagSmall}>{article.category}</span>
                      <span>{article.viewCount} views</span>
                      <span style={{marginLeft: 'auto'}}>{article.likesCount || 0} Likes</span>
                    </div>
                  </div>
                  {article.coverImage && (
                    <div className={styles.articleThumb} style={{backgroundImage: `url(${article.coverImage})`}}></div>
                  )}
                </Link>
              ))}
            </div>

          </div>
          
          <div className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Trending Tags</h3>
              <div className={styles.tagsContainer}>
                {trendingTags.map(tag => (
                  <button key={tag} className={styles.tagPill}>{tag}</button>
                ))}
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Top Authors</h3>
              <div className={styles.authorList}>
                <Link to="/user/u1" className={styles.authorItem}>
                  <div className={styles.avatarSmall}>{getInitials('Lê Hoàng Nam')}</div>
                  <div>
                    <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>Lê Hoàng Nam</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>1,250 followers</div>
                  </div>
                  <button className={styles.followBtnSmall}>Follow</button>
                </Link>
                <Link to="/user/u2" className={styles.authorItem}>
                  <div className={styles.avatarSmall}>{getInitials('Nguyễn Trần An')}</div>
                  <div>
                    <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>Nguyễn Trần An</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>840 followers</div>
                  </div>
                  <button className={styles.followBtnSmall}>Follow</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Blogs;
