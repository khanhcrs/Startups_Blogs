import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Image as ImageIcon, Cloud, ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';
import styles from './CreateBlog.module.css';
import detailStyles from './BlogDetail.module.css';
import { api } from '../lib/axios';
import ImageUploader from '../components/ImageUploader';
import TagInput from '../components/TagInput';

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

const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [step, setStep] = useState<'write' | 'settings'>('write');
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    topic: 'Startup Guide',
    tags: [] as string[],
    summary: ''
  });

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = customScrollbarStyle;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const res = await api.get(`/articles/${id}`);
          const articleToEdit = res.data;
          
          const defaultTopics = ['Startup Guide', 'Funding', 'Growth', 'Product', 'Community'];
          const existingTags = Array.isArray(articleToEdit.tags) ? articleToEdit.tags : [];
          const foundTopic = existingTags.find((t: string) => defaultTopics.includes(t)) || 'Startup Guide';
          const remainingTags = existingTags.filter((t: string) => !defaultTopics.includes(t));

          setFormData({
            title: articleToEdit.title,
            content: articleToEdit.content,
            summary: articleToEdit.summary || '',
            topic: foundTopic,
            tags: remainingTags,
            coverImage: articleToEdit.coverImage || ''
          });
        } catch (error) {
          console.error("Lỗi khi tải bài viết", error);
          toast.error("Không thể tải dữ liệu bài viết.");
        }
      };
      fetchArticle();
    }
  }, [id]);

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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image', 'video'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.warning('Vui lòng nhập tiêu đề và nội dung bài viết trước khi tiếp tục!');
      return;
    }
    setStep('settings');
  };

  const getProcessedTags = () => {
    const customTags = [...formData.tags];
    if (!customTags.includes(formData.topic)) {
      customTags.unshift(formData.topic);
    }
    return customTags;
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    const payload = {
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      coverImage: formData.coverImage,
      category: 'BLOG',
      tags: getProcessedTags(),
    };

    try {
      if (id) {
        await api.put(`/articles/${id}`, payload);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await api.post('/articles', payload);
        toast.success("Xuất bản bài viết thành công! Đang chờ admin duyệt.");
      }
      navigate('/');
    } catch (error) {
      console.error("Lỗi xuất bản", error);
      toast.error("Có lỗi xảy ra khi lưu bài viết.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (step === 'settings') {
    return (
      <div className={styles.publishContainer}>
        <div className={styles.publishHeader}>
          <button className={styles.backBtn} onClick={() => setStep('write')}>
            <ArrowLeft size={20} /> Quay lại
          </button>
          <h2>Tùy chỉnh trước khi xuất bản</h2>
        </div>

        <div className={styles.publishContent}>
          <div className={styles.publishSection}>
            <div className={styles.fieldGroup}>
              <label>Chủ đề chính</label>
              <select name="topic" value={formData.topic} onChange={handleChange} className={styles.select}>
                <option value="Startup Guide">Startup Guide</option>
                <option value="Funding">Funding</option>
                <option value="Growth">Growth</option>
                <option value="Product">Product</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label>Thẻ phụ (Bấm Enter hoặc phẩy để thêm)</label>
              <TagInput 
                tags={formData.tags} 
                onChange={(newTags) => setFormData({...formData, tags: newTags})} 
                placeholder="Ví dụ: AI, Fintech, B2B..." 
              />
            </div>
            
            <div className={styles.infoBox}>
              <p>Bài viết của bạn sẽ được gán danh mục <strong>Blog</strong> và được hiển thị trong mục tương ứng sau khi Admin phê duyệt.</p>
            </div>

            <button 
              className={styles.publishSubmitBtn} 
              onClick={handlePublish}
              disabled={isPublishing}
            >
              <Cloud size={18} /> {isPublishing ? 'Đang lưu...' : (id ? 'Lưu thay đổi' : 'Xuất bản bài viết')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Sticky top action bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
        <div>
          <h1 style={{ marginBottom: '0', fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
            {id ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => setShowPreview(true)}
            style={{ padding: '0.5rem 1.25rem', background: '#e0e7ff', border: 'none', borderRadius: '0.5rem', color: '#4338ca', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#c7d2fe'}
            onMouseOut={e => e.currentTarget.style.background = '#e0e7ff'}
          >
            Xem trước
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            style={{ padding: '0.5rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', color: '#475569', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
          >
            Hủy
          </button>
          <button 
            type="button" 
            onClick={handleNext}
            style={{ padding: '0.5rem 1.25rem', background: '#3b82f6', border: 'none', borderRadius: '0.5rem', color: 'white', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={e => e.currentTarget.style.background = '#3b82f6'}
          >
            Tiếp tục
          </button>
        </div>
      </header>

      {/* Main Document Editing Area */}
      <main className="custom-scroll" style={{ flex: 1, overflowY: 'auto', background: '#f1f5f9' }}>
        <div className="word-document">
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Tiêu đề bài viết</label>
            <textarea
              ref={titleRef}
              name="title"
              placeholder="Nhập tiêu đề thật hấp dẫn..."
              value={formData.title}
              onChange={handleChange}
              rows={1}
              className="premium-input custom-scroll"
              style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Tóm tắt (Summary)</label>
            <textarea
              ref={summaryRef}
              name="summary"
              placeholder="Viết một đoạn tóm tắt ngắn gọn..."
              value={formData.summary}
              onChange={handleChange}
              rows={2}
              className="premium-input custom-scroll"
              style={{ fontSize: '1.125rem', fontWeight: 400, color: '#475569', lineHeight: 1.5, borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Ảnh bìa (Cover Image)</label>
            {!formData.coverImage ? (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
                <ImageUploader 
                  label="Nhấp để tải ảnh bìa lên" 
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
                  Xóa ảnh
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Nội dung bài viết</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(val) => setFormData((prev: any) => ({ ...prev, content: val }))}
              modules={modules}
              formats={formats}
              placeholder="Bắt đầu viết câu chuyện của bạn..."
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
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Chế độ xem trước</h2>
              <button 
                onClick={() => setShowPreview(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '1.25rem', lineHeight: 1 }}
                title="Đóng"
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '3rem 4rem' }}>
              <div className={detailStyles.container} style={{ margin: '0 auto', padding: 0 }}>
                <span className={detailStyles.category}>BLOG</span>
                
                <h1 className={detailStyles.title} style={{ padding: 0, margin: 0, marginBottom: '1rem', wordBreak: 'break-word', fontSize: '2.5rem', fontWeight: 800 }}>
                  {formData.title || 'Tiêu đề chưa đặt'}
                </h1>
                
                <div className={detailStyles.meta} style={{ paddingBottom: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div className={detailStyles.authorInfo}>
                    <div className={detailStyles.avatar} style={{ width: '48px', height: '48px', fontSize: '1.125rem' }}>
                      Bạn
                    </div>
                    <div className={detailStyles.authorDetails}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <span className={detailStyles.authorName} style={{ color: '#0f172a', fontWeight: 600, fontSize: '1.125rem' }}>
                          Bạn (Tác giả)
                        </span>
                      </div>
                      <span className={detailStyles.date} style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Ngày hôm nay • 0 lượt xem
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
                  
                  <div className="ql-editor" style={{ padding: 0, color: '#1e293b', fontSize: '1.125rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: formData.content || '<p style="color: #94a3b8;">Nội dung sẽ hiển thị ở đây...</p>' }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default CreateBlog;
