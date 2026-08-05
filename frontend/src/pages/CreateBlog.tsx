import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Image as ImageIcon, Cloud, ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';
import styles from './CreateBlog.module.css';
import { api } from '../lib/axios';
import ImageUploader from '../components/ImageUploader';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [step, setStep] = useState<'write' | 'settings'>('write');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    topic: 'Startup Guide',
    tags: '',
    summary: ''
  });

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const res = await api.get(`/articles/${id}`);
          const articleToEdit = res.data;
          
          // Try to extract topic from tags if possible, or default
          const defaultTopics = ['Startup Guide', 'Funding', 'Growth', 'Product', 'Community'];
          const existingTags = Array.isArray(articleToEdit.tags) ? articleToEdit.tags : [];
          const foundTopic = existingTags.find((t: string) => defaultTopics.includes(t)) || 'Startup Guide';
          const remainingTags = existingTags.filter((t: string) => !defaultTopics.includes(t)).join(', ');

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

  const titleRef = useRef<HTMLTextAreaElement>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image', 'video'
  ];

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [formData.title]);

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
    const customTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    // Include the selected topic as a tag
    if (!customTags.includes(formData.topic)) {
      customTags.unshift(formData.topic);
    }
    return customTags;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        coverImage: formData.coverImage,
        status: 'PENDING',
        category: 'Blog', // Fixed category for user articles
        tags: getProcessedTags(),
      };

      if (id) {
        await api.put(`/articles/${id}`, payload);
        toast.success('Bài viết đã được cập nhật và gửi duyệt lại!');
      } else {
        await api.post('/articles', payload);
        toast.success('Bài viết đã được gửi cho Admin phê duyệt! Bạn có thể theo dõi trạng thái tại trang cá nhân.');
      }
      navigate('/user/me');
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const handleSaveDraft = async () => {
    try {
      const payload = {
        title: formData.title || 'Untitled Draft',
        summary: formData.summary || '',
        content: formData.content,
        coverImage: formData.coverImage,
        status: 'DRAFT',
        category: 'Blog', // Fixed category for user articles
        tags: getProcessedTags(),
      };

      if (id) {
        await api.put(`/articles/${id}`, payload);
        toast.success('Bản nháp đã được cập nhật thành công!');
      } else {
        await api.post('/articles', payload);
        toast.success('Bản nháp đã được lưu thành công!');
      }
      navigate('/user/me');
    } catch (error) {
      console.error('Lỗi khi lưu nháp:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  // ----------------------------------------------------
  // RENDER SETTINGS OVERLAY
  // ----------------------------------------------------
  if (step === 'settings') {
    return (
      <div className={styles.settingsOverlay}>
        <div className={styles.settingsHeader}>
          <button className={styles.btnSecondary} onClick={() => setStep('write')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
            <ArrowLeft size={20} /> Quay lại trình soạn thảo
          </button>
          <div className={styles.logo}>V-Startups</div>
        </div>

        <div className={styles.settingsContent}>
          <h1 className={styles.settingsTitle}>Thông tin bài viết</h1>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Tóm tắt (Summary)</label>
            <p className={styles.helpText}>Một đoạn ngắn gọn (1-2 câu) xuất hiện ở trang chủ và trên thẻ bài viết.</p>
            <textarea 
              name="summary" 
              className={styles.textarea} 
              placeholder="VD: Kinh nghiệm xương máu sau 3 lần gọi vốn thất bại..."
              value={formData.summary}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Chủ đề (Topic)</label>
            <select 
              name="topic" 
              className={styles.select}
              value={formData.topic}
              onChange={handleChange}
            >
              <option value="Startup Guide">Startup Guide</option>
              <option value="Funding">Funding</option>
              <option value="Growth">Growth</option>
              <option value="Product">Product</option>
              <option value="Community">Community</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Thẻ (Tags)</label>
            <p className={styles.helpText}>Thêm thẻ để bài viết dễ được tìm thấy hơn (cách nhau bởi dấu phẩy).</p>
            <input 
              type="text" 
              name="tags" 
              className={styles.input} 
              placeholder="VD: gọi vốn, marketing, kinh nghiệm..."
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div className={styles.submitActions}>
            <button className={styles.btnCancel} onClick={() => setStep('write')}>Hủy</button>
            <button className={styles.btnSubmitOverlay} onClick={handleSubmit}>Gửi duyệt bài</button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER WRITING CANVAS
  // ----------------------------------------------------
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Link to="/" className={styles.logo}>V-Startups</Link>
          <span className={styles.draftStatus}>
            <Cloud size={16} /> Đã lưu tự động
          </span>
        </div>
        <div className={styles.topbarRight}>
          <button className={styles.btnSecondary} onClick={handleSaveDraft}>Lưu Nháp</button>
          <button className={styles.btnPrimary} onClick={handleNext}>Tiếp tục</button>
        </div>
      </header>

      <main className={styles.editorCanvas}>
        {!formData.coverImage ? (
          <ImageUploader 
            label="Thêm ảnh bìa" 
            onUploadSuccess={(url) => setFormData({...formData, coverImage: url})} 
          />
        ) : (
          <div>
            <img src={formData.coverImage} alt="Cover" className={styles.coverImagePreview} />
            <button 
              className={styles.removeCoverBtn}
              onClick={() => setFormData({...formData, coverImage: ''})}
            >
              Gỡ ảnh bìa
            </button>
          </div>
        )}

        <textarea
          ref={titleRef}
          name="title"
          className={styles.titleInput}
          placeholder="Tiêu đề bài viết..."
          value={formData.title}
          onChange={handleChange}
          rows={1}
        />

        <ReactQuill
          theme="snow"
          value={formData.content}
          onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
          modules={modules}
          formats={formats}
          placeholder="Bắt đầu viết câu chuyện của bạn..."
          className={styles.quillEditor}
        />
      </main>
    </div>
  );
};

export default CreateBlog;
