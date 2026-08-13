import { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useAdminTabsStore } from '../../../store/adminTabsStore';
import { api } from '../../../lib/axios';
import { sanitizeRichText } from '../../../utils/sanitizeRichText';
import { adminQueryKeys } from '../services/adminApi';

export default function AdminViewArticle({ articleId: propArticleId }: { articleId?: string }) {
  const queryClient = useQueryClient();
  const params = useParams();
  const location = useLocation();
  const updateTabTitle = useAdminTabsStore(state => state.updateTabTitle);
  const articleId = propArticleId || params.id;
  
  const articleQuery = useQuery({
    queryKey: adminQueryKeys.article(articleId),
    enabled: Boolean(articleId),
    queryFn: async () => {
      const response = await api.get(`/articles/admin/${articleId}`);
      return response.data.data ?? response.data;
    },
  });

  useEffect(() => {
    const article = articleQuery.data;
    if (article) {
      updateTabTitle(location.pathname, `View: ${article.title.length > 20 ? article.title.substring(0, 20) + '...' : article.title}`);
    }
  }, [articleQuery.data, location.pathname, updateTabTitle]);

  useEffect(() => {
    if (articleQuery.isError) {
      toast.error('Failed to load article details');
    }
  }, [articleQuery.errorUpdatedAt, articleQuery.isError]);

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      api.delete(`/comments/admin/${commentId}`),
    onSuccess: async () => {
      toast.success('Comment deleted');
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.article(articleId),
      });
    },
    onError: () => toast.error('Error deleting comment'),
  });

  const handleDeleteComment = (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    deleteCommentMutation.mutate(commentId);
  };

  const selectedArticle = articleQuery.data;
  const sanitizedContent = useMemo(
    () => sanitizeRichText(selectedArticle?.content),
    [selectedArticle?.content],
  );

  if (!articleId) return <div style={{ padding: '2rem', textAlign: 'center' }}>Article not found.</div>;
  if (articleQuery.isPending) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading article details...</div>;
  if (!selectedArticle) return <div style={{ padding: '2rem', textAlign: 'center' }}>Article not found.</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{selectedArticle.title}</h2>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
            <span>{selectedArticle.author?.name}</span>
            <span>•</span>
            <span>{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span style={{ color: '#3b82f6', fontWeight: 500 }}>{selectedArticle.category}</span>
          </div>
        </div>
        <Link
          to={`/admin/articles/${selectedArticle.id}/edit`}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', borderRadius: '0.375rem', color: '#fff', textDecoration: 'none', fontWeight: 500 }}
        >
          Edit Article
        </Link>
      </div>

      <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Analytics Dashboard */}
        <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#0f172a' }}>Article Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{selectedArticle.viewCount || 0}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Views</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{selectedArticle.likesCount || 0}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Likes</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{selectedArticle.comments?.length || 0}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Comments</div>
            </div>
          </div>

          <div style={{ width: '100%', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#0f172a' }}>Tương tác theo thời gian</h4>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
              Chưa có API analytics theo thời gian. Các số liệu phía trên là tổng hợp thực tế hiện có của bài viết.
            </p>
          </div>
        </div>

        {/* Content Preview */}
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#0f172a' }}>Content Preview</h3>
          <div className="ql-editor" style={{ padding: 0 }}>
            {selectedArticle.coverImage && (
              <img 
                src={selectedArticle.coverImage} 
                alt="Cover" 
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1.5rem' }} 
              />
            )}
            
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#f8fafc', 
              borderLeft: '4px solid #3b82f6',
              borderRadius: '0 0.5rem 0.5rem 0',
              marginBottom: '2rem',
              fontSize: '1.125rem',
              color: '#334155',
              fontStyle: 'italic',
              lineHeight: 1.6
            }}>
              {selectedArticle.summary}
            </div>

            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </div>
        </div>

        {/* Comments Section */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#0f172a' }}>Comments ({selectedArticle.comments?.length || 0})</h3>
          {selectedArticle.comments && selectedArticle.comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedArticle.comments.map((comment: any) => (
                <div key={comment.id} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.875rem' }}>{comment.author?.name || 'Unknown User'}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deleteCommentMutation.isPending}
                        style={{ background: 'none', border: 'none', padding: '0.25rem', color: '#ef4444', cursor: 'pointer', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', transition: 'background 0.2s' }}
                        title="Delete comment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem', lineHeight: 1.5 }}>{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              No comments yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
