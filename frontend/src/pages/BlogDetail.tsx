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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

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

  const handlePostReply = (parentId: string) => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để phản hồi.');
      return;
    }
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    api.post(`/articles/${article.id}/comments`, { content: replyText, parentId })
      .then(() => {
        toast.success('Đã gửi phản hồi.');
        setReplyText('');
        setReplyingTo(null);
        fetchComments(article.id);
      })
      .catch(err => {
        console.error(err);
        toast.error('Gửi phản hồi thất bại.');
      })
      .finally(() => {
        setIsSubmittingReply(false);
      });
  };

  const handleEditComment = (commentId: string) => {
    if (!editCommentText.trim()) return;
    
    api.put(`/comments/${commentId}`, { content: editCommentText })
      .then(() => {
        toast.success('Đã cập nhật bình luận.');
        setEditingComment(null);
        fetchComments(article.id);
      })
      .catch(err => {
        console.error(err);
        toast.error('Cập nhật bình luận thất bại.');
      });
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      api.delete(`/comments/${commentId}`)
        .then(() => {
          toast.success('Đã xóa bình luận.');
          fetchComments(article.id);
        })
        .catch(err => {
          console.error(err);
          toast.error('Xóa bình luận thất bại.');
        });
    }
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

  const generateChartDataRange = (start: string, end: string) => {
    const data = [];
    const s = new Date(start);
    const e = new Date(end);
    
    // Validate dates
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return [];
    
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Cap at 90 days to prevent browser freezing with too much mock data
    const maxDays = Math.min(diffDays, 90);

    for (let i = 0; i < maxDays; i++) {
      const d = new Date(s);
      d.setDate(d.getDate() + i);
      const label = maxDays <= 7 
        ? d.toLocaleDateString('en-US', { weekday: 'short' }) 
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const seed = d.getTime();
      const views = Math.floor(Math.abs(Math.sin(seed) * 300) + 50);
      const likes = Math.floor(views * 0.15 + Math.abs(Math.cos(seed) * 20));
      
      data.push({ name: label, views, likes });
    }
    return data;
  };

  const chartData = generateChartDataRange(startDate, endDate);

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
          
          <div className={styles.dashboardStats} style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
            <div className={styles.statItem} style={{ flex: 1, backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div className={styles.statValue} style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{article.viewCount || 0}</div>
              <div className={styles.statLabel} style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Lượt xem</div>
            </div>
            <div className={styles.statItem} style={{ flex: 1, backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div className={styles.statValue} style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{article.likesCount || 0}</div>
              <div className={styles.statLabel} style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Lượt thích</div>
            </div>
            <div className={styles.statItem} style={{ flex: 1, backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div className={styles.statValue} style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{comments.length}</div>
              <div className={styles.statLabel} style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Bình luận</div>
            </div>
          </div>

          <div style={{ marginTop: '30px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Thống kê tương tác</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
                <span style={{ color: '#64748b' }}>-</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>
            
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '8px', fontSize: '14px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                  <Bar yAxisId="left" dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Lượt xem" maxBarSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="likes" stroke="#f59e0b" strokeWidth={3} name="Lượt thích" dot={{r: 4}} activeDot={{r: 6}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
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
          {comments.map(comment => {
            const isCommentOwner = user?.id === comment.author.id;
            const canDeleteComment = isCommentOwner || isAuthor;

            return (
              <div key={comment.id} className={styles.comment}>
                <Link to={`/user/${comment.author.id}`} className={styles.commentAvatar} style={{ textDecoration: 'none' }}>
                  {getInitials(comment.author.name)}
                </Link>
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <Link to={`/user/${comment.author.id}`} className={styles.commentAuthor} style={{ textDecoration: 'none' }}>
                      {comment.author.name}
                    </Link>
                    <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className={styles.commentForm} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                      <textarea 
                        className={styles.commentInput} 
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        style={{ minHeight: '60px', padding: '8px' }}
                      ></textarea>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button className={styles.submitBtn} onClick={() => handleEditComment(comment.id)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>Save</button>
                        <button className={styles.replyBtn} onClick={() => setEditingComment(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.commentText}>{comment.content}</div>
                  )}

                  <div className={styles.commentActions}>
                    <button className={styles.replyBtn} onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>Reply</button>
                    {isCommentOwner && (
                      <button className={styles.replyBtn} onClick={() => { setEditingComment(comment.id); setEditCommentText(comment.content); }}>Edit</button>
                    )}
                    {canDeleteComment && (
                      <button className={styles.replyBtn} style={{ color: '#ef4444' }} onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    )}
                  </div>
                  
                  {replyingTo === comment.id && (
                    <div className={styles.commentForm} style={{ marginTop: '1rem' }}>
                      <textarea 
                        className={styles.commentInput} 
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ minHeight: '60px' }}
                      ></textarea>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className={styles.submitBtn}
                          onClick={() => handlePostReply(comment.id)}
                          disabled={isSubmittingReply}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                          {isSubmittingReply ? 'Posting...' : 'Reply'}
                        </button>
                        <button 
                          className={styles.replyBtn}
                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.replies}>
                      {comment.replies.map((reply: any) => {
                        const isReplyOwner = user?.id === reply.author.id;
                        const canDeleteReply = isReplyOwner || isAuthor;
                        
                        return (
                          <div key={reply.id} className={styles.comment}>
                            <Link to={`/user/${reply.author.id}`} className={styles.commentAvatar} style={{ textDecoration: 'none' }}>
                              {getInitials(reply.author.name)}
                            </Link>
                            <div className={styles.commentContent}>
                              <div className={styles.commentHeader}>
                                <Link to={`/user/${reply.author.id}`} className={styles.commentAuthor} style={{ textDecoration: 'none' }}>
                                  {reply.author.name}
                                </Link>
                                <span className={styles.commentDate}>{formatDate(reply.createdAt)}</span>
                              </div>
                              
                              {editingComment === reply.id ? (
                                <div className={styles.commentForm} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                                  <textarea 
                                    className={styles.commentInput} 
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    style={{ minHeight: '60px', padding: '8px' }}
                                  ></textarea>
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                    <button className={styles.submitBtn} onClick={() => handleEditComment(reply.id)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>Save</button>
                                    <button className={styles.replyBtn} onClick={() => setEditingComment(null)}>Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div className={styles.commentText}>{reply.content}</div>
                              )}
                              
                              <div className={styles.commentActions}>
                                {/* We don't support level 3 nesting yet, so no reply button here */}
                                {isReplyOwner && (
                                  <button className={styles.replyBtn} onClick={() => { setEditingComment(reply.id); setEditCommentText(reply.content); }}>Edit</button>
                                )}
                                {canDeleteReply && (
                                  <button className={styles.replyBtn} style={{ color: '#ef4444' }} onClick={() => handleDeleteComment(reply.id)}>Delete</button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
