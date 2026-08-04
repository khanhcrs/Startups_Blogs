import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './BlogDetail.module.css';
import { MOCK_ARTICLES, MOCK_COMMENTS } from '../utils/mockData';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);

  // In a real app, fetch by slug. Here we mock it.
  const article = MOCK_ARTICLES.find(a => a.slug === slug) || MOCK_ARTICLES[0];
  const comments = MOCK_COMMENTS.filter(c => c.articleId === article.id);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };

  // Basic markdown to HTML (just for demo purposes)
  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return <h3 key={index}>{paragraph.replace(/\*\*/g, '')}</h3>;
      }
      if (paragraph.match(/^\d\.\s\*\*(.*?)\*\*(.*)/)) {
        const match = paragraph.match(/^\d\.\s\*\*(.*?)\*\*(.*)/);
        return <p key={index}><strong>{match?.[1]}</strong>{match?.[2]}</p>;
      }
      if (paragraph.trim() === '') return null;
      return <p key={index}>{paragraph}</p>;
    });
  };

  if (!article) return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Article not found</div>;

  return (
    <div className={styles.container}>
      <span className={styles.category}>{article.category}</span>
      <h1 className={styles.title}>{article.title}</h1>
      
      <div className={styles.meta}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>{getInitials(article.author.name)}</div>
          <div className={styles.authorDetails}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Link to={`/user/${article.author.id}`} className={styles.authorName}>{article.author.name}</Link>
              <button 
                className={`${styles.followBtn} ${following ? styles.followingBtn : ''}`}
                onClick={() => setFollowing(!following)}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            </div>
            <span className={styles.authorBio}>{article.author.bio}</span>
            <span className={styles.date}>{formatDate(article.publishedAt || article.createdAt)} • {article.viewCount} views</span>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${liked ? styles.liked : ''}`}
            onClick={() => setLiked(!liked)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            {article.likesCount + (liked ? 1 : 0)}
          </button>
          <button 
            className={`${styles.actionButton} ${bookmarked ? styles.bookmarked : ''}`}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            {bookmarked ? 'Saved' : 'Save'}
          </button>
          <button className={styles.actionButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share
          </button>
        </div>
      </div>

      {article.coverImage && (
        <img src={article.coverImage} alt={article.title} className={styles.coverImage} />
      )}

      <div className={styles.content}>
        <p><em>{article.summary}</em></p>
        <br/>
        {renderContent(article.content)}
      </div>

      <div className={styles.tags}>
        {article.tags.map(tag => (
          <span key={tag} className={styles.tag}>#{tag}</span>
        ))}
      </div>

      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <h3 className={styles.commentsTitle}>Comments ({article.commentsCount})</h3>
        
        <div className={styles.commentForm}>
          <textarea 
            className={styles.commentInput} 
            placeholder="Share your thoughts..."
          ></textarea>
          <button className={styles.submitBtn}>Post Comment</button>
        </div>

        <div className={styles.commentList}>
          {comments.map(comment => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentAvatar}>{getInitials(comment.author.name)}</div>
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{comment.author.name}</span>
                  <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                </div>
                <div className={styles.commentText}>{comment.content}</div>
                <div className={styles.commentActions}>
                  <button className={styles.replyBtn}>Reply</button>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className={styles.replies}>
                    {comment.replies.map(reply => (
                      <div key={reply.id} className={styles.comment}>
                        <div className={styles.commentAvatar}>{getInitials(reply.author.name)}</div>
                        <div className={styles.commentContent}>
                          <div className={styles.commentHeader}>
                            <span className={styles.commentAuthor}>{reply.author.name}</span>
                            <span className={styles.commentDate}>{formatDate(reply.createdAt)}</span>
                          </div>
                          <div className={styles.commentText}>{reply.content}</div>
                          <div className={styles.commentActions}>
                            <button className={styles.replyBtn}>Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
