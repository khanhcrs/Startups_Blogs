import { useState, useEffect, useMemo, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import commonStyles from '../AdminCommon.module.css';
import ImageUploader from '../../../components/ImageUploader';
import TagInput from '../../../components/TagInput';
import detailStyles from '../../../pages/BlogDetail.module.css';
import { useAdminTabsStore } from '../../../store/adminTabsStore';
import { api } from '../../../lib/axios';
import { sanitizeRichText } from '../../../utils/sanitizeRichText';
import { adminQueryKeys } from '../services/adminApi';
import { createProposalDiff } from '../utils/proposalDiff';

const DEFAULT_TOPICS = [
  'Startup Guide',
  'Funding',
  'Growth',
  'Product',
  'Community',
] as const;

const ARTICLE_PROPOSAL_FIELDS = [
  'title',
  'summary',
  'content',
  'category',
  'tags',
  'coverImage',
] as const;

function getProcessedTags(form: Record<string, any>): string[] {
  const customTags = [...form.tags];
  if (!customTags.includes(form.topic)) customTags.unshift(form.topic);
  return customTags;
}

function toArticleProposal(form: Record<string, any>) {
  return {
    title: form.title,
    summary: form.summary,
    content: sanitizeRichText(form.content),
    category: form.category,
    tags: getProcessedTags(form),
    coverImage: form.coverImage,
  };
}

const customScrollbarStyle = `
  .custom-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  .premium-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font-family: inherit;
    color: #1e293b;
  }
  .premium-input::placeholder {
    color: #94a3b8;
  }
  .word-document {
    background: #fff;
    max-width: 850px;
    margin: 2rem auto;
    padding: 4rem 3rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    min-height: 1056px; /* Approx A4 height */
  }
  .quill-premium .ql-toolbar {
    border: 1px solid #e2e8f0 !important;
    background: #f8fafc;
    border-radius: 0.5rem 0.5rem 0 0;
    position: sticky;
    top: 64px;
    z-index: 5;
  }
  .quill-premium .ql-container {
    border: 1px solid #e2e8f0 !important;
    border-top: none !important;
    border-radius: 0 0 0.5rem 0.5rem;
    font-size: 1.125rem;
    font-family: inherit;
  }
  .quill-premium .ql-editor {
    min-height: 500px;
    padding: 1.5rem !important;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }
  .modal-content {
    background: #fff;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    border-radius: 0.75rem;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .modal-header {
    position: sticky;
    top: 0;
    background: #fff;
    padding: 1rem 2rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }
`;

export default function AdminEditArticle({ articleId }: { articleId?: string }) {
  const params = useParams();
  const id = articleId || params.id;
  const navigate = useNavigate();
  const location = useLocation();
  const updateTabTitle = useAdminTabsStore(state => state.updateTabTitle);
  const initializedArticleIdRef = useRef<string | undefined>(undefined);
  const originalProposalRef = useRef<Record<string, unknown> | null>(null);
  const [step, setStep] = useState<'write' | 'settings'>('write');
  const [showPreview, setShowPreview] = useState(location.state?.showPreview || false);
  
  const [formData, setFormData] = useState<any>({
    title: '',
    summary: '',
    content: '',
    category: 'BLOG',
    tags: [] as string[],
    coverImage: '',
    topic: 'Startup Guide',
    authorName: '',
    authorBio: '',
    createdAt: new Date().toISOString(),
    viewCount: 0
  });

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [formData.title]);

  useEffect(() => {
    if (summaryRef.current) {
      summaryRef.current.style.height = 'auto';
      summaryRef.current.style.height = `${summaryRef.current.scrollHeight}px`;
    }
  }, [formData.summary]);

  const articleQuery = useQuery({
    queryKey: adminQueryKeys.article(id),
    enabled: Boolean(id),
    refetchOnMount: 'always',
    queryFn: async () => {
      const response = await api.get(`/articles/admin/${id}`);
      return response.data.data ?? response.data;
    },
  });

  useEffect(() => {
    const article = articleQuery.data;
    if (
      !article ||
      !articleQuery.isFetchedAfterMount ||
      initializedArticleIdRef.current === id
    ) return;

    const existingTags = Array.isArray(article.tags) ? article.tags : [];
    const foundTopic =
      existingTags.find((tag: string) =>
        DEFAULT_TOPICS.includes(tag as (typeof DEFAULT_TOPICS)[number]),
      ) || 'Startup Guide';
    const remainingTags = existingTags.filter(
      (tag: string) =>
        !DEFAULT_TOPICS.includes(tag as (typeof DEFAULT_TOPICS)[number]),
    );
    const nextFormData = {
      title: article.title,
      summary: article.summary || '',
      content: sanitizeRichText(article.content),
      category: article.category || 'BLOG',
      topic: foundTopic,
      tags: remainingTags,
      coverImage: article.coverImage || '',
      authorName: article.author?.name || 'Unknown Author',
      authorBio: article.author?.bio || '',
      createdAt: article.createdAt || new Date().toISOString(),
      viewCount: article.viewCount || 0
    };
    setFormData(nextFormData);
    originalProposalRef.current = toArticleProposal(nextFormData);
    initializedArticleIdRef.current = id;
    updateTabTitle(location.pathname, `Edit: ${article.title.length > 20 ? article.title.substring(0, 20) + '...' : article.title}`);
  }, [
    articleQuery.data,
    articleQuery.isFetchedAfterMount,
    id,
    location.pathname,
    updateTabTitle,
  ]);

  useEffect(() => {
    if (articleQuery.isError) {
      toast.error('Failed to load article');
    }
  }, [articleQuery.errorUpdatedAt, articleQuery.isError]);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = customScrollbarStyle;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung bài viết!');
      return;
    }
    setStep('settings');
  };

  const proposalMutation = useMutation({
    mutationFn: (proposal: Record<string, unknown>) =>
      api.post(`/admin/proposals/article/${id}`, proposal),
    onSuccess: () => {
      toast.success('Change proposal created and sent to author for review!');
      navigate('/admin/articles');
    },
    onError: () => toast.error('Error creating proposal'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleQuery.isSuccess || !originalProposalRef.current) {
      toast.error('Load the current article before proposing changes');
      return;
    }

    const changes = createProposalDiff(
      originalProposalRef.current,
      toArticleProposal(formData),
      ARTICLE_PROPOSAL_FIELDS,
    );
    if (Object.keys(changes).length === 0) {
      toast.error('No changes to propose');
      return;
    }

    proposalMutation.mutate(changes);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };

  const sanitizedPreviewContent = useMemo(
    () => sanitizeRichText(formData.content),
    [formData.content],
  );

  if (!id) return <div className={commonStyles.loading}>Article not found.</div>;
  if (articleQuery.isPending) return <div className={commonStyles.loading}>Loading...</div>;
  if (articleQuery.isError || !articleQuery.data) {
    return (
      <div className={commonStyles.emptyState} role="alert">
        <p>The current article could not be loaded. No proposal can be submitted.</p>
        <button
          type="button"
          className={commonStyles.actionBtn}
          onClick={() => void articleQuery.refetch()}
        >
          Try again
        </button>
      </div>
    );
  }
  if (
    !articleQuery.isFetchedAfterMount ||
    initializedArticleIdRef.current !== id ||
    !originalProposalRef.current
  ) {
    return <div className={commonStyles.loading}>Loading current article data...</div>;
  }

  const submitting = proposalMutation.isPending;

  if (step === 'settings') {
    return (
      <div style={{ padding: '2rem' }}>
        <header className={commonStyles.header}>
          <h1>Settings & Propose Edits</h1>
          <p>Review the article metadata before proposing changes.</p>
        </header>

        <div className={commonStyles.contentCard}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              >
                <option value="NEWS">News</option>
                <option value="BLOG">Blog</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Topic</label>
              <select 
                name="topic" 
                value={formData.topic} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              >
                <option value="Startup Guide">Startup Guide</option>
                <option value="Funding">Funding</option>
                <option value="Growth">Growth</option>
                <option value="Product">Product</option>
                <option value="Community">Community</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Tags (Enter to add)</label>
              <TagInput 
                tags={formData.tags} 
                onChange={(newTags) => setFormData({...formData, tags: newTags})} 
                placeholder="e.g. AI, Fintech, Startup"
              />
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button 
                type="submit" 
                className={`${commonStyles.actionBtn} ${commonStyles.approveBtn}`} 
                disabled={submitting}
                style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
              >
                {submitting ? 'Submitting...' : 'Propose Changes'}
              </button>
              <button 
                type="button" 
                onClick={() => setStep('write')}
                className={commonStyles.actionBtn}
                style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', background: '#f3f4f6' }}
              >
                Back to Editor
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      
      {/* Sticky top action bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
        <div>
          <h1 style={{ marginBottom: '0', fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Editing Article</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => setShowPreview(true)}
            style={{ padding: '0.5rem 1.25rem', background: '#e0e7ff', border: 'none', borderRadius: '0.5rem', color: '#4338ca', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#c7d2fe'}
            onMouseOut={e => e.currentTarget.style.background = '#e0e7ff'}
          >
            Preview Article
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/articles')}
            style={{ padding: '0.5rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', color: '#475569', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleNext}
            style={{ padding: '0.5rem 1.25rem', background: '#3b82f6', border: 'none', borderRadius: '0.5rem', color: 'white', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={e => e.currentTarget.style.background = '#3b82f6'}
          >
            Next: Settings & Propose
          </button>
        </div>
      </header>

      {/* Main Document Editing Area */}
      <main className="custom-scroll" style={{ flex: 1, overflowY: 'auto', background: '#f1f5f9' }}>
        <div className="word-document">
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Article Title</label>
            <textarea
              ref={titleRef}
              name="title"
              placeholder="Enter an engaging title..."
              value={formData.title}
              onChange={handleChange}
              rows={1}
              className="premium-input custom-scroll"
              style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Summary</label>
            <textarea
              ref={summaryRef}
              name="summary"
              placeholder="Write a brief, compelling summary..."
              value={formData.summary}
              onChange={handleChange}
              rows={2}
              className="premium-input custom-scroll"
              style={{ fontSize: '1.125rem', fontWeight: 400, color: '#475569', lineHeight: 1.5, borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Cover Image</label>
            {!formData.coverImage ? (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
                <ImageUploader 
                  label="Click to upload cover image" 
                  onUploadSuccess={(url) => setFormData({...formData, coverImage: url})} 
                />
              </div>
            ) : (
              <div style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src={formData.coverImage} alt="Cover" style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
                <button 
                  onClick={() => setFormData({...formData, coverImage: ''})}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(15, 23, 42, 0.7)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, backdropFilter: 'blur(4px)' }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Content Editor</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(val) => setFormData((prev: any) => ({ ...prev, content: val }))}
              modules={modules}
              formats={formats}
              placeholder="Start writing your amazing story here..."
              className="quill-premium"
            />
          </div>

        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content custom-scroll" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Preview mode</h2>
              <button 
                onClick={() => setShowPreview(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '1.25rem', lineHeight: 1 }}
                title="Close"
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '3rem 4rem' }}>
              <div className={detailStyles.container} style={{ margin: '0 auto', padding: 0 }}>
                <span className={detailStyles.category}>{formData.category || 'Category'}</span>
                
                <h1 className={detailStyles.title} style={{ padding: 0, margin: 0, marginBottom: '1rem', wordBreak: 'break-word', fontSize: '2.5rem', fontWeight: 800 }}>
                  {formData.title || 'Untitled Article'}
                </h1>
                
                <div className={detailStyles.meta} style={{ paddingBottom: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div className={detailStyles.authorInfo}>
                    <div className={detailStyles.avatar} style={{ width: '48px', height: '48px', fontSize: '1.125rem' }}>
                      {getInitials(formData.authorName || 'UA')}
                    </div>
                    <div className={detailStyles.authorDetails}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <span className={detailStyles.authorName} style={{ color: '#0f172a', fontWeight: 600, fontSize: '1.125rem' }}>
                          {formData.authorName || 'Unknown Author'}
                        </span>
                      </div>
                      <span className={detailStyles.date} style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {formatDate(formData.createdAt)} • {formData.viewCount} views
                      </span>
                    </div>
                  </div>
                </div>

                {formData.coverImage && (
                  <img 
                    src={formData.coverImage} 
                    alt="Cover" 
                    className={detailStyles.coverImage}
                    style={{ marginBottom: '2.5rem', width: '100%', borderRadius: '0.75rem', objectFit: 'cover', maxHeight: '450px' }}
                  />
                )}

                <div className={detailStyles.content}>
                  {formData.summary && (
                    <p style={{ fontStyle: 'italic', color: '#475569', fontSize: '1.25rem', lineHeight: 1.6, borderLeft: '4px solid #cbd5e1', paddingLeft: '1rem', marginBottom: '2.5rem', wordBreak: 'break-word' }}>
                      {formData.summary}
                    </p>
                  )}
                  
                  {sanitizedPreviewContent ? (
                    <div className="ql-editor" style={{ padding: 0, color: '#1e293b', fontSize: '1.125rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: sanitizedPreviewContent }} />
                  ) : (
                    <p style={{ color: '#94a3b8' }}>Start typing to see the content here...</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
