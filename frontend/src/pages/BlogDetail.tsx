import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import styles from './BlogDetail.module.css';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchComments = (articleId: string) => {
    api.get(`/articles/${articleId}/comments`)
      .then(res => setComments(res.data))
      .catch(err => console.error('Failed to fetch comments', err));
  };

  useEffect(() => {
    api.get(`/articles/${slug}`)
      .then(res => {
        setArticle(res.data);
        fetchComments(res.data.id);
        setIsLoading(false);

        // Fetch bookmark state if user is logged in
        if (user) {
          api.get('/bookmarks').then(bookmarkRes => {
            const isBookmarked = bookmarkRes.data.some((b: any) => b.articleId === res.data.id);
            setBookmarked(isBookmarked);
          });
        }
        
        // LocalStorage fallback for Like state
        if (user) {
          const likedState = localStorage.getItem(`liked_${user.id}_${res.data.id}`);
          if (likedState === 'true') setLiked(true);
        }
      })
      .catch(err => {
        console.error('Failed to fetch article', err);
        setIsLoading(false);
      });
  }, [slug, user]);

  const toggleBookmark = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu bài viết');
      return;
    }
    
    if (bookmarked) {
      api.delete(`/bookmarks/${article.id}`)
        .then(() => setBookmarked(false))
        .catch(() => toast.error('Lỗi khi bỏ lưu bài viết'));
    } else {
      api.post(`/bookmarks/${article.id}`)
        .then(() => setBookmarked(true))
        .catch(() => toast.error('Lỗi khi lưu bài viết'));
    }
  };

  const toggleLike = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thích bài viết');
      return;
    }
    const newLiked = !liked;
    setLiked(newLiked);
    localStorage.setItem(`liked_${user.id}_${article.id}`, newLiked ? 'true' : 'false');
  };

  const isAuthor = user && article?.author?.id === user.id;

  const handlePostComment = () => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để bình luận.');
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    api.post(`/articles/${article.id}/comments`, { content: commentText })
      .then(() => {
        toast.success('Đã gửi bình luận.');
        setCommentText('');
        fetchComments(article.id);
      })
      .catch(err => {
        console.error(err);
        toast.error('Gửi bình luận thất bại.');
      })
      .finally(() => {
        setIsSubmittingComment(false);
      });
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      api.delete(`/articles/${article.id}`)
        .then(() => {
          toast.success('Yêu cầu xóa đã được gửi cho Admin duyệt.');
          navigate('/user/me');
        })
        .catch(err => {
          console.error(err);
          toast.error('Có lỗi xảy ra khi xóa bài viết.');
        });
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Đang tải bài viết...</div>;
  }

  if (!article) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Không tìm thấy bài viết.</div>;
  }

  const mockChartData = [
    { name: 'Mon', views: 120 },
    { name: 'Tue', views: 300 },
    { name: 'Wed', views: 200 },
    { name: 'Thu', views: 278 },
    { name: 'Fri', views: 189 },
    { name: 'Sat', views: 239 },
    { name: 'Sun', views: 349 },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <div className={styles.container}>
      {isAuthor && (
        <div className={styles.authorDashboard}>
          <div className={styles.dashboardHeader}>
            <h3 className={styles.dashboardTitle}>Author Dashboard</h3>
            <div className={styles.dashboardActions}>
              <Link to={`/edit-blog/${article.id}`} className={styles.editBtn}>
                <Edit3 size={16} /> Chỉnh sửa
              </Link>
              <button onClick={handleDelete} className={styles.deleteBtn}>
                <Trash2 size={16} /> Xóa bài
              </button>
            </div>
          </div>
          {article.status === 'PENDING_DELETE' && (
            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 500 }}>
              Bài viết này đang ở trạng thái chờ Admin duyệt xóa.
            </div>
          )}
        </div>
      )}

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
            onClick={toggleLike}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            {(article.likesCount || 0) + (liked ? 1 : 0)}
          </button>
          <button 
            className={`${styles.actionButton} ${bookmarked ? styles.bookmarked : ''}`}
            onClick={toggleBookmark}
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
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      <div className={styles.tags}>
        {article.tags.map((tag: string) => (
          <span key={tag} className={styles.tag}>#{tag}</span>
        ))}
      </div>

      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <h3 className={styles.commentsTitle}>Comments ({comments.length})</h3>
        
        <div className={styles.commentForm}>
          <textarea 
            className={styles.commentInput} 
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button 
            className={styles.submitBtn}
            onClick={handlePostComment}
            disabled={isSubmittingComment}
          >
            {isSubmittingComment ? 'Posting...' : 'Post Comment'}
          </button>
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
