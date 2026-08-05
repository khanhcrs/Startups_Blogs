import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, Image as ImageIcon, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import commonStyles from '../AdminCommon.module.css';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line, ResponsiveContainer } from 'recharts';
export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [category, setCategory] = useState<'All' | 'Blog' | 'News'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('http://localhost:3000/articles/tags');
        if (res.ok) {
          const tags = await res.json();
          setAvailableTags(tags);
        }
      } catch (err) {
        console.error('Failed to fetch tags', err);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchArticles();
  }, [category, debouncedSearch, selectedTag, startDateFilter, endDateFilter, page]);

  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `http://localhost:3000/articles/admin/all?page=${page}&limit=${limit}`;
      if (category !== 'All') url += `&category=${category}`;
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (selectedTag) url += `&tag=${encodeURIComponent(selectedTag)}`;
      if (startDateFilter) url += `&startDate=${encodeURIComponent(startDateFilter)}`;
      if (endDateFilter) url += `&endDate=${encodeURIComponent(endDateFilter)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Assuming API returns { data, meta: { totalPages, total, ... } }
        setArticles(data.data || []);
        if (data.meta) {
          setTotalPages(data.meta.totalPages || 1);
          setTotalItems(data.meta.total || 0);
        }
      }
    } catch (error) {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateArticleStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3000/articles/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`Article status updated`);
      fetchArticles();
    } catch (error) {
      toast.error('Error updating article');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`http://localhost:3000/articles/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Article deleted');
      fetchArticles();
    } catch (error) {
      toast.error('Error deleting article');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`http://localhost:3000/comments/admin/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      toast.success('Comment deleted');
      
      // Update local state to remove the comment immediately
      if (selectedArticle) {
        setSelectedArticle({
          ...selectedArticle,
          comments: selectedArticle.comments.filter((c: any) => c.id !== commentId)
        });
      }
      
      // Also fetch articles again so the table row is up to date when modal closes
      fetchArticles();
    } catch (error) {
      toast.error('Error deleting comment');
    }
  };

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', minHeight: 0 }}>
      <header className={commonStyles.header} style={{ flexShrink: 0, marginBottom: 0 }}>
        <h1>Article Management</h1>
        <p>Manage blogs and news content</p>
      </header>

      {/* Top Filter Bar */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#fff', padding: '1rem 1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        
        {/* Row 1: Tabs & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.5rem' }}>
            {['All', 'Blog', 'News'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setCategory(tab as any); setPage(1); }}
                style={{
                  padding: '0.5rem 1.25rem',
                  border: 'none',
                  background: category === tab ? '#fff' : 'transparent',
                  color: category === tab ? '#0f172a' : '#64748b',
                  fontWeight: category === tab ? 600 : 500,
                  borderRadius: '0.375rem',
                  boxShadow: category === tab ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'All' ? 'All Articles' : tab === 'Blog' ? 'Blogs' : 'News'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>

        {/* Row 2: Advanced Filters */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Tag:</label>
            <select 
              value={selectedTag}
              onChange={(e) => { setSelectedTag(e.target.value); setPage(1); }}
              style={{ padding: '0.4rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', minWidth: '150px' }}
            >
              <option value="">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>From:</label>
            <input 
              type="date" 
              value={startDateFilter}
              onChange={(e) => { setStartDateFilter(e.target.value); setPage(1); }}
              style={{ padding: '0.4rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>To:</label>
            <input 
              type="date" 
              value={endDateFilter}
              onChange={(e) => { setEndDateFilter(e.target.value); setPage(1); }}
              style={{ padding: '0.4rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className={commonStyles.contentCard} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className={commonStyles.loading} style={{ padding: '3rem' }}>Loading articles...</div>
        ) : articles.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No articles found.</div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Article</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Author</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    
                    {/* Article Info & Image */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '60px', height: '40px', borderRadius: '0.375rem', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {a.coverImage ? (
                            <img src={a.coverImage} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <ImageIcon size={20} color="#cbd5e1" />
                          )}
                        </div>
                        <div>
                          <button 
                            onClick={() => setSelectedArticle(a)}
                            style={{ background: 'none', border: 'none', padding: 0, color: '#0f172a', fontWeight: 600, textDecoration: 'none', display: 'block', marginBottom: '0.25rem', cursor: 'pointer', textAlign: 'left' }}
                          >
                            {a.title.length > 50 ? `${a.title.substring(0, 50)}...` : a.title}
                          </button>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: 500 }}>
                            {a.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td style={{ padding: '1rem 1.5rem', color: '#475569', fontSize: '0.875rem' }}>
                      {a.author?.name || 'Unknown'}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <select 
                        value={a.status} 
                        onChange={(e) => handleUpdateArticleStatus(a.id, e.target.value)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: '9999px',
                          border: `1px solid ${a.status === 'PUBLISHED' ? '#86efac' : a.status === 'DRAFT' ? '#cbd5e1' : '#fca5a5'}`,
                          backgroundColor: a.status === 'PUBLISHED' ? '#f0fdf4' : a.status === 'DRAFT' ? '#f8fafc' : '#fef2f2',
                          color: a.status === 'PUBLISHED' ? '#166534' : a.status === 'DRAFT' ? '#475569' : '#991b1b',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                      {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link 
                          to={`/admin/articles/${a.id}/edit`}
                          style={{ padding: '0.5rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '0.375rem', display: 'inline-flex', transition: 'background 0.2s' }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteArticle(a.id)}
                          style={{ padding: '0.5rem', background: '#fef2f2', color: '#ef4444', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Showing <b>{(page - 1) * limit + 1}</b> to <b>{Math.min(page * limit, totalItems)}</b> of <b>{totalItems}</b> articles
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ display: 'flex', alignItems: 'center', padding: '0.375rem 0.75rem', background: '#fff', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: page === 1 ? '#9ca3af' : '#374151', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Page {page} of {totalPages}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ display: 'flex', alignItems: 'center', padding: '0.375rem 0.75rem', background: '#fff', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: page === totalPages ? '#9ca3af' : '#374151', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Article Preview Modal */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          padding: '2rem'
        }} onClick={() => setSelectedArticle(null)}>
          <div 
            style={{
              backgroundColor: '#fff',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              borderRadius: '1rem',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }} 
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{selectedArticle.title}</h2>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  <span>{selectedArticle.author?.name}</span>
                  <span>•</span>
                  <span>{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span style={{ color: '#3b82f6', fontWeight: 500 }}>{selectedArticle.category}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Analytics Dashboard (Like Author Dashboard) */}
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

                {/* Recharts Chart for Views */}
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
                      style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1.5rem' }} 
                    />
                  )}
                  
                  <div style={{ 
                    padding: '1rem', 
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
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Link
                to={`/admin/articles/${selectedArticle.id}/edit`}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
              >
                Edit Article
              </Link>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ padding: '0.5rem 1.5rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 500 }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
