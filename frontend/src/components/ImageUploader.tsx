import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/axios';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  defaultImage?: string;
  className?: string;
}

const ImageUploader = ({ onUploadSuccess, label = 'Upload Image', defaultImage, className = '' }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');
    setIsLoading(true);

    // Create local preview immediately for better UX
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data && res.data.url) {
        onUploadSuccess(res.data.url);
        // Replace local objectUrl with real URL if needed
        setPreview(res.data.url);
      }
    } catch (err: any) {
      console.error('Upload failed', err);
      setError('Failed to upload image. Please try again.');
      setPreview(defaultImage || null);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploadSuccess(''); // empty URL means removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${styles.uploaderContainer} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${preview ? styles.hasImage : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          accept="image/*" 
          className={styles.hiddenInput}
        />
        
        {isLoading ? (
          <div className={styles.loadingState}>
            <Loader2 className={styles.spinner} size={24} />
            <span>Uploading...</span>
          </div>
        ) : preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <div className={styles.previewOverlay}>
              <button type="button" className={styles.removeBtn} onClick={handleRemove}>
                <X size={16} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.iconCircle}>
              <Upload size={24} />
            </div>
            <p className={styles.mainText}>
              <span className={styles.highlightText}>Click to upload</span> or drag and drop
            </p>
            <p className={styles.subText}>SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        )}
      </div>
      
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default ImageUploader;
