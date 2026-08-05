import { Link } from 'react-router-dom';
import styles from './ArticleCard.module.css';
import { getInitials } from '../utils/stringUtils';

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage?: string;
  category: string;
  publishedAt?: string;
  createdAt: string;
  author?: {
    name: string;
  };
};

type ArticleCardProps = {
  article: Article;
  variant?: 'grid' | 'list';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const ArticleCard = ({ article, variant = 'list' }: ArticleCardProps) => {
  if (variant === 'grid') {
    return (
      <Link to={`/blogs/${article.slug}`} className={`${styles.card} ${styles.gridCard}`}>
        {article.coverImage && (
          <img src={article.coverImage} alt={article.title} className={styles.image} />
        )}
        <div className={styles.content}>
          <div className={styles.meta}>
            <span className={styles.category}>{article.category}</span>
            <span className={styles.date}>{formatDate(article.publishedAt || article.createdAt)}</span>
          </div>
          <h3 className={styles.cardTitle}>{article.title}</h3>
          <p className={styles.summary}>{article.summary}</p>
        </div>
      </Link>
    );
  }

  // list variant
  return (
    <Link to={`/blogs/${article.slug}`} className={`${styles.card} ${styles.listCard}`}>
      <div className={styles.articleInfo}>
        <div className={styles.authorRow}>
          <div className={styles.avatarTiny}>{getInitials(article.author?.name || 'A')}</div>
          <span className={styles.authorName}>{article.author?.name || 'Anonymous'}</span>
        </div>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        <p className={styles.articleSummary}>{article.summary}</p>
        <div className={styles.articleFooter}>
          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          <span>•</span>
          <span className={styles.tagSmall}>{article.category}</span>
        </div>
      </div>
      {article.coverImage && (
        <div 
          className={styles.articleThumb} 
          style={{ backgroundImage: `url(${article.coverImage})` }}
          aria-label={article.title}
        />
      )}
    </Link>
  );
};

export default ArticleCard;
