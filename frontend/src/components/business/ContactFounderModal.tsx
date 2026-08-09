import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import styles from './ContactFounderModal.module.css';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface ContactFounderModalProps {
  businessId: string;
  businessName: string;
  onClose: () => void;
}

const ContactFounderModal: React.FC<ContactFounderModalProps> = ({ businessId, businessName, onClose }) => {
  const user = useAuthStore(state => state.user);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(`/businesses/${businessId}/contact-requests`, {
        title,
        message
      });
      toast.success('Gửi yêu cầu liên hệ thành công!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi liên hệ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3>Yêu cầu đăng nhập</h3>
            <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
          </div>
          <div className={styles.modalBody}>
            <p>Vui lòng đăng nhập để có thể gửi liên hệ trực tiếp cho Founder của <strong>{businessName}</strong>.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Liên hệ Founder: {businessName}</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <p className={styles.helpText}>Tin nhắn của bạn sẽ được gửi trực tiếp đến Founder của Startup này.</p>
            <div className={styles.formGroup}>
              <label>Tiêu đề</label>
              <input 
                type="text" 
                placeholder="Ví dụ: Đề xuất hợp tác, Thảo luận đầu tư..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nội dung tin nhắn</label>
              <textarea 
                placeholder="Giới thiệu về bạn và lý do bạn muốn liên hệ..." 
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                required
              />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Hủy</button>
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Đang gửi...' : <><Send size={16} style={{marginRight: '6px'}}/> Gửi tin nhắn</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFounderModal;
