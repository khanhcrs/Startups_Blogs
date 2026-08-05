const Contact = () => {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-4)' }}>Liên hệ với chúng tôi</h1>
          <p style={{ color: 'var(--text-body)' }}>Bạn có câu hỏi hoặc cần hỗ trợ? Hãy gửi tin nhắn cho chúng tôi.</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', backgroundColor: 'var(--surface-color)', padding: 'var(--spacing-8)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 500 }}>Họ và tên</label>
            <input type="text" placeholder="Nhập tên của bạn" style={{ width: '100%', padding: 'var(--spacing-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 500 }}>Email</label>
            <input type="email" placeholder="Nhập email của bạn" style={{ width: '100%', padding: 'var(--spacing-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 500 }}>Nội dung tin nhắn</label>
            <textarea rows={5} placeholder="Nhập tin nhắn của bạn..." style={{ width: '100%', padding: 'var(--spacing-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', resize: 'vertical' }}></textarea>
          </div>

          <button type="button" onClick={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.'); }} style={{ marginTop: 'var(--spacing-4)', backgroundColor: 'var(--primary-500)', color: 'white', padding: 'var(--spacing-3)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
            Gửi tin nhắn
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
