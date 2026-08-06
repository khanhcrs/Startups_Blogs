import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line, ResponsiveContainer } from 'recharts';
import commonStyles from '../AdminCommon.module.css';
import { useAdminTabsStore } from '../../../store/adminTabsStore';
import { useLocation } from 'react-router-dom';

export default function AdminViewArticle({ articleId: propArticleId }: { articleId?: string }) {
  const params = useParams();
  const location = useLocation();
  const updateTabTitle = useAdminTabsStore(state => state.updateTabTitle);
  const articleId = propArticleId || params.id;
  
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (articleId) {
      fetchArticleDetails();
    }
  }, [articleId]);

  const fetchArticleDetails = async () => {
    setLoading(true);
    try {
      // Use the public endpoint, or if there's an admin one, use it. Here we use the public one which returns all needed info.
      const res = await fetch(`http://localhost:3000/articles/${articleId}`);
      if (res.ok) {
        const data = await res.json();
        const article = data.data || data;
        setSelectedArticle(article);
        updateTabTitle(location.pathname, `View: ${article.title.length > 20 ? article.title.substring(0, 20) + '...' : article.title}`);
      } else {
        toast.error('Failed to load article details');
      }
    } catch (error) {
      toast.error('Failed to load article details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`http://localhost:3000/comments/admin/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Comment deleted');
      fetchArticleDetails();
    } catch (error) {
      toast.error('Error deleting comment');
    }
  };

  const generateChartDataRange = (start: string, end: string) => {
    const data = [];
    const s = new Date(start);
    const e = new Date(end);
    
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return [];
    
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const maxDays = Math.min(diffDays, 90);

    for (let i = 0; i < maxDays; i++) {
      const d = new Date(s);
      d.setDate(d.getDate() + i);
      const label = maxDays <= 7 ? d.toLocaleDateString('en-US', { weekday: 'short' }) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const seed = d.getTime();
      const views = Math.floor(Math.abs(Math.sin(seed) * 300) + 50);
      const likes = Math.floor(views * 0.15 + Math.abs(Math.cos(seed) * 20));
      data.push({ name: label, views, likes });
    }
    return data;
  };

  const chartData = generateChartDataRange(startDate, endDate);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading article details...</div>;
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Tương tác theo thời gian</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                />
                <span style={{ color: '#64748b' }}>-</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Bar yAxisId="left" dataKey="views" fill="#3b82f6" radius={[4,4,0,0]} name="Lượt xem" maxBarSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="likes" stroke="#f59e0b" strokeWidth={3} name="Lượt thích" dot={{r: 4}} activeDot={{r: 6}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
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

            <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
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
