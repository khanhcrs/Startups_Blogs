import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, Image as ImageIcon, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import commonStyles from '../AdminCommon.module.css';
import { api } from '../../../lib/axios';
import { adminQueryKeys } from '../services/adminApi';

type ArticleCategoryFilter = 'ALL' | 'BLOG' | 'NEWS';

const categoryTabs: Array<{ value: ArticleCategoryFilter; label: string }> = [
  { value: 'ALL', label: 'All Articles' },
  { value: 'BLOG', label: 'Blogs' },
  { value: 'NEWS', label: 'News' },
];

export default function AdminArticles() {
  const queryClient = useQueryClient();
  
  // Filters & Pagination
  const [category, setCategory] = useState<ArticleCategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const tagsQuery = useQuery({
    queryKey: adminQueryKeys.articleTags,
    queryFn: async () => {
      const response = await api.get('/articles/tags');
      return response.data as string[];
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filters = {
    page,
    limit,
    category: category === 'ALL' ? undefined : category,
    search: debouncedSearch || undefined,
    tag: selectedTag || undefined,
    startDate: startDateFilter || undefined,
    endDate: endDateFilter || undefined,
  };
  const articlesQuery = useQuery({
    queryKey: adminQueryKeys.articleList(filters),
    queryFn: async () => {
      const response = await api.get('/articles/admin/all', {
        params: filters,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (articlesQuery.isError) {
      toast.error('Failed to load articles');
    }
  }, [articlesQuery.errorUpdatedAt, articlesQuery.isError]);

  useEffect(() => {
    if (tagsQuery.isError) {
      console.error('Failed to fetch tags', tagsQuery.error);
    }
  }, [tagsQuery.error, tagsQuery.errorUpdatedAt, tagsQuery.isError]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/articles/admin/${id}/status`, { status }),
    onSuccess: async () => {
      toast.success('Article status updated');
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.articleLists,
      });
    },
    onError: () => toast.error('Error updating article'),
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/articles/admin/${id}`),
    onSuccess: async () => {
      toast.success('Article deleted');
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.articleLists,
      });
    },
    onError: () => toast.error('Error deleting article'),
  });

  const handleUpdateArticleStatus = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDeleteArticle = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    deleteArticleMutation.mutate(id);
  };

  const availableTags = tagsQuery.data || [];
  const articles = articlesQuery.data?.data || [];
  const totalPages = articlesQuery.data?.meta?.totalPages || 1;
  const totalItems = articlesQuery.data?.meta?.total || 0;
  const loading = articlesQuery.isPending;
  const articleMutating =
    updateStatusMutation.isPending || deleteArticleMutation.isPending;

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
            {categoryTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setCategory(tab.value); setPage(1); }}
                style={{
                  padding: '0.5rem 1.25rem',
                  border: 'none',
                  background: category === tab.value ? '#fff' : 'transparent',
                  color: category === tab.value ? '#0f172a' : '#64748b',
                  fontWeight: category === tab.value ? 600 : 500,
                  borderRadius: '0.375rem',
                  boxShadow: category === tab.value ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
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
                {articles.map((a: any) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    
                    {/* Article Info & Image */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                        <Link to={`/admin/articles/${a.id}`} className={commonStyles.link} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                          <div style={{ width: '60px', height: '40px', borderRadius: '0.375rem', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {a.coverImage ? (
                              <img src={a.coverImage} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <ImageIcon size={20} color="#cbd5e1" />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>{a.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.5rem' }}>
                              <span style={{ backgroundColor: '#f1f5f9', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>{a.category}</span>
                              {a.tags?.slice(0, 2).map((t: string) => (
                                <span key={t} style={{ color: '#94a3b8' }}>#{t}</span>
                              ))}
                            </div>
                          </div>
                        </Link>
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
                        disabled={articleMutating}
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
                          disabled={articleMutating}
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
    </div>
  );
}
