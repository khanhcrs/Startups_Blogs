

const About = () => {
  return (
    <div className="section">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-6)' }}>Về chúng tôi</h1>
          <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-body)', marginBottom: 'var(--spacing-8)' }}>
            Startups Blogs là nền tảng kết nối cộng đồng khởi nghiệp, nhà đầu tư và những người đam mê công nghệ hàng đầu tại Việt Nam.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-8)', marginTop: 'var(--spacing-12)' }}>
          <div style={{ padding: 'var(--spacing-8)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)', color: 'var(--primary-600)' }}>Sứ mệnh</h3>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.6 }}>
              Chúng tôi cam kết mang đến một không gian chia sẻ kiến thức, kinh nghiệm thực tiễn và tạo ra cơ hội kết nối bền vững cho hệ sinh thái khởi nghiệp Việt Nam.
            </p>
          </div>
          <div style={{ padding: 'var(--spacing-8)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)', color: 'var(--primary-600)' }}>Tầm nhìn</h3>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.6 }}>
              Trở thành nền tảng thông tin và kết nối đầu tư uy tín nhất Đông Nam Á dành riêng cho các startup và doanh nghiệp nhỏ.
            </p>
          </div>
          <div style={{ padding: 'var(--spacing-8)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)', color: 'var(--primary-600)' }}>Giá trị cốt lõi</h3>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.6 }}>
              Minh bạch, Chia sẻ, Đổi mới và Hợp tác - Đây là những kim chỉ nam dẫn lối mọi hoạt động trên nền tảng của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
