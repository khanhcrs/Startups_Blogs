import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateBlog.module.css';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Startup Guide',
    tags: '',
    summary: '',
    content: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    // Simulate API call
    console.log('Submitting:', { ...formData, isDraft });
    alert(isDraft ? 'Draft saved successfully!' : 'Blog submitted for review!');
    navigate('/blogs');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Write a Blog</h1>
        <p className={styles.subtitle}>Share your startup journey, insights, or industry knowledge with the community.</p>
      </div>

      <form className={styles.form} onSubmit={(e) => handleSubmit(e, false)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Cover Image</label>
          <div className={styles.coverUpload}>
            <div className={styles.uploadIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p className={styles.uploadText}>Click or drag to upload a high-quality cover image</p>
            <p className={styles.hint}>Recommended size: 1200x600px. Max size: 5MB.</p>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title *</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            className={styles.input} 
            placeholder="E.g. 5 lessons learned from failing my first startup"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{display: 'flex', gap: '1rem'}}>
          <div className={styles.formGroup} style={{flex: 1}}>
            <label htmlFor="category" className={styles.label}>Category *</label>
            <select 
              id="category" 
              name="category" 
              className={styles.select}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Startup Guide">Startup Guide</option>
              <option value="Funding">Funding</option>
              <option value="Growth">Growth</option>
              <option value="Product">Product</option>
            </select>
          </div>
          
          <div className={styles.formGroup} style={{flex: 2}}>
            <label htmlFor="tags" className={styles.label}>Tags</label>
            <input 
              type="text" 
              id="tags" 
              name="tags" 
              className={styles.input} 
              placeholder="E.g. fundraising, marketing (comma separated)"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="summary" className={styles.label}>Short Summary *</label>
          <textarea 
            id="summary" 
            name="summary" 
            className={styles.input} 
            placeholder="A brief 1-2 sentence description that appears on blog cards..."
            rows={2}
            value={formData.summary}
            onChange={handleChange}
            required
            style={{minHeight: 'auto'}}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>Content *</label>
          <div className={styles.editorContainer}>
            <div className={styles.editorToolbar}>
              <button type="button" className={styles.toolbarBtn} title="Bold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
              </button>
              <button type="button" className={styles.toolbarBtn} title="Italic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
              </button>
              <div className={styles.toolbarDivider}></div>
              <button type="button" className={styles.toolbarBtn} title="Link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              </button>
              <button type="button" className={styles.toolbarBtn} title="Image">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </button>
              <button type="button" className={styles.toolbarBtn} title="Quote">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h1c0 1 0 1 0 2-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>
              </button>
            </div>
            <textarea 
              id="content" 
              name="content" 
              className={styles.textarea} 
              placeholder="Start writing your story here..."
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.btnDraft}
            onClick={(e) => handleSubmit(e, true)}
          >
            Save Draft
          </button>
          <button type="submit" className={styles.btnSubmit}>
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
