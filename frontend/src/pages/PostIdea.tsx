import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './PostIdea.module.css';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';

const PostIdea = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState('');

  const [taxonomy, setTaxonomy] = useState<{
    industries: string[];
    stages: string[];
    businessTypes: string[];
  }>({
    industries: ['Fintech', 'EdTech', 'HealthTech', 'Thương mại điện tử', 'Logistics', 'PropTech', 'SaaS', 'Nông nghiệp sạch', 'Blockchain', 'Công nghệ AI'],
    stages: ['Idea', 'Early Stage', 'Operating', 'Growing', 'Expansion', 'Mature'],
    businessTypes: ['Startup', 'Small Business', 'Family Business', 'Online Business', 'Franchise', 'Cooperative', 'Social Enterprise'],
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    businessStage: '',
    businessType: 'Startup',
    location: '',
    website: '',
    detailedOverview: '',
    businessModel: '',
    productsOrServices: '',
    employeeRange: '1-10',
    teamMemberName: '',
    teamMemberRole: '',
    teamMemberBio: '',
    teamMembers: [] as Array<{ name: string; role: string; bio?: string }>,
    fundingPurpose: 'Kinh doanh & Phát triển',
    fundingAmountMin: 100000000,
    fundingAmountMax: 1000000000,
    currency: 'VND',
  });

  useEffect(() => {
    api.get('/businesses/taxonomy')
      .then(res => {
        setTaxonomy(res.data);
        if (res.data.industries?.length > 0 && !formData.industry) {
          setFormData(prev => ({
            ...prev,
            industry: res.data.industries[0],
            businessStage: res.data.stages?.[0] || 'Idea',
            businessType: res.data.businessTypes?.[0] || 'Startup',
          }));
        }
      })
      .catch(err => console.error('Failed to load taxonomy', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTeamMember = () => {
    if (!formData.teamMemberName.trim() || !formData.teamMemberRole.trim()) {
      toast.error('Vui lòng nhập tên và chức danh thành viên.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          name: prev.teamMemberName.trim(),
          role: prev.teamMemberRole.trim(),
          bio: prev.teamMemberBio.trim() || undefined,
        },
      ],
      teamMemberName: '',
      teamMemberRole: '',
      teamMemberBio: '',
    }));
  };

  const handleRemoveTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error('Vui lòng nhập tên doanh nghiệp / dự án.');
        return false;
      }
      if (!formData.description.trim()) {
        toast.error('Vui lòng nhập mô tả ngắn.');
        return false;
      }
      if (!formData.industry) {
        toast.error('Vui lòng chọn ngành nghề.');
        return false;
      }
      if (!formData.businessStage) {
        toast.error('Vui lòng chọn giai đoạn phát triển.');
        return false;
      }
      if (!formData.location.trim()) {
        toast.error('Vui lòng nhập địa điểm.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(6, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để gửi hồ sơ gọi vốn.');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/businesses/raise-capital', {
        name: formData.name,
        description: formData.description,
        industry: formData.industry,
        businessStage: formData.businessStage,
        businessType: formData.businessType,
        location: formData.location,
        website: formData.website || undefined,
        detailedOverview: formData.detailedOverview || undefined,
        businessModel: formData.businessModel || undefined,
        productsOrServices: formData.productsOrServices || undefined,
        employeeRange: formData.employeeRange || undefined,
        teamMembers: formData.teamMembers,
        fundingPurpose: formData.fundingPurpose,
        fundingAmountMin: Number(formData.fundingAmountMin),
        fundingAmountMax: Number(formData.fundingAmountMax),
        currency: formData.currency,
      });

      toast.success('Gửi hồ sơ gọi vốn thành công!');
      setSubmittedSlug(res.data.slug);
      setIsSubmittedSuccess(true);
    } catch (err: any) {
      console.error('Lỗi khi gửi hồ sơ gọi vốn:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu hồ sơ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmittedSuccess) {
    return (
      <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center', padding: '3rem 2rem', background: '#fff', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success-color, #10b981)', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Hồ sơ gọi vốn đã được gửi!</h2>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Hồ sơ của dự án <strong>{formData.name}</strong> đang được xem xét bởi ban quản trị. Bạn sẽ nhận được thông báo ngay khi hồ sơ được phê duyệt.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn" style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#334155', borderRadius: '0.5rem', fontWeight: 600 }}>
              Về trang chủ
            </Link>
            <Link to={`/user/${user?.id}`} className="btn" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-600, #2563eb)', color: '#fff', borderRadius: '0.5rem', fontWeight: 600 }}>
              Xem hồ sơ cá nhân
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className={styles.title}>Raise Capital & Post Business</h1>
        <p className={styles.subtitle}>Kết nối dự án của bạn với mạng lưới nhà đầu tư và đối tác.</p>

        <div className={styles.layout}>
          {/* Left Sidebar Steps */}
          <div className={styles.sidebar}>
            <ul className={styles.stepList}>
              <li className={`${styles.stepItem} ${currentStep === 1 ? styles.activeStep : ''}`}>
                <div className={styles.stepCircle}>1</div>
                <span>Basic Information</span>
              </li>
              <li className={`${styles.stepItem} ${currentStep === 2 ? styles.activeStep : ''}`}>
                <div className={styles.stepCircle}>2</div>
                <span>Problem & Solution</span>
              </li>
              <li className={`${styles.stepItem} ${currentStep === 3 ? styles.activeStep : ''}`}>
                <div className={styles.stepCircle}>3</div>
                <span>Product & Market</span>
              </li>
              <li className={`${styles.stepItem} ${currentStep === 4 ? styles.activeStep : ''}`}>
                <div className={styles.stepCircle}>4</div>
                <span>Team Members</span>
              </li>
              <li className={`${styles.stepItem} ${currentStep === 5 ? styles.activeStep : ''}`}>
                <div className={styles.stepCircle}>5</div>
                <span>Funding & Goals</span>
              </li>
              <li className={`${styles.stepItem} ${currentStep === 6 ? styles.activeStep : ''}`}>
                <div className={styles.stepCircle}>6</div>
                <span>Review & Submit</span>
              </li>
            </ul>
          </div>

          {/* Form Container */}
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              
              {currentStep === 1 && (
                <>
                  <h2 className={styles.formTitle}>1. Basic Information</h2>
                  <p className={styles.formDesc}>Thông tin cơ bản về doanh nghiệp hoặc dự án gọi vốn.</p>

                  <div className={styles.formGroup}>
                    <label>Tên dự án / Startup <span>*</span></label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Ví dụ: AgriConnect, VietAI..." 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Mô tả ngắn <span>*</span></label>
                    <input 
                      type="text" 
                      name="description" 
                      placeholder="Một câu giới thiệu tổng quan ấn tượng..." 
                      value={formData.description} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div className={styles.rowGroup}>
                    <div className={styles.formGroup}>
                      <label>Ngành nghề (Category) <span>*</span></label>
                      <select name="industry" value={formData.industry} onChange={handleChange} required>
                        {taxonomy.industries.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Giai đoạn (Stage) <span>*</span></label>
                      <select name="businessStage" value={formData.businessStage} onChange={handleChange} required>
                        {taxonomy.stages.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.rowGroup}>
                    <div className={styles.formGroup}>
                      <label>Loại hình doanh nghiệp <span>*</span></label>
                      <select name="businessType" value={formData.businessType} onChange={handleChange} required>
                        {taxonomy.businessTypes.map(bt => (
                          <option key={bt} value={bt}>{bt}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Địa điểm <span>*</span></label>
                      <input 
                        type="text" 
                        name="location" 
                        placeholder="Ví dụ: TP. Hồ Chí Minh, Hà Nội..." 
                        value={formData.location} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Website (Không bắt buộc)</label>
                    <input 
                      type="url" 
                      name="website" 
                      placeholder="https://yourstartup.com" 
                      value={formData.website} 
                      onChange={handleChange} 
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2 className={styles.formTitle}>2. Problem & Solution</h2>
                  <p className={styles.formDesc}>Bài toán thị trường và giải pháp vượt trội của bạn.</p>

                  <div className={styles.formGroup}>
                    <label>Tổng quan chi tiết (Detailed Overview)</label>
                    <textarea 
                      name="detailedOverview" 
                      rows={6} 
                      placeholder="Trình bày chi tiết vướng mắc thị trường và lý do dự án xuất hiện..." 
                      value={formData.detailedOverview} 
                      onChange={handleChange} 
                    />
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <h2 className={styles.formTitle}>3. Product & Market</h2>
                  <p className={styles.formDesc}>Mô hình kinh doanh và quy mô nhân sự.</p>

                  <div className={styles.formGroup}>
                    <label>Sản phẩm & Dịch vụ chính</label>
                    <input 
                      type="text" 
                      name="productsOrServices" 
                      placeholder="Mô tả sản phẩm dịch vụ chính..." 
                      value={formData.productsOrServices} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Mô hình doanh thu (Business Model)</label>
                    <input 
                      type="text" 
                      name="businessModel" 
                      placeholder="B2B Subscription, Marketplace Commission..." 
                      value={formData.businessModel} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Quy mô đội ngũ (Team Size)</label>
                    <select name="employeeRange" value={formData.employeeRange} onChange={handleChange}>
                      <option value="1-10">1 - 10 nhân sự</option>
                      <option value="11-50">11 - 50 nhân sự</option>
                      <option value="51-200">51 - 200 nhân sự</option>
                      <option value="200+">Trên 200 nhân sự</option>
                    </select>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <h2 className={styles.formTitle}>4. Team Members</h2>
                  <p className={styles.formDesc}>Giới thiệu các thành viên sáng lập và chủ chốt.</p>

                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                    <div className={styles.rowGroup}>
                      <div className={styles.formGroup}>
                        <label>Họ tên thành viên</label>
                        <input 
                          type="text" 
                          name="teamMemberName" 
                          placeholder="Ví dụ: Nguyễn Văn A" 
                          value={formData.teamMemberName} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Chức danh</label>
                        <input 
                          type="text" 
                          name="teamMemberRole" 
                          placeholder="CEO & Co-founder" 
                          value={formData.teamMemberRole} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                    <button type="button" onClick={handleAddTeamMember} className={styles.nextBtn} style={{ background: '#475569', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                      + Thêm thành viên
                    </button>
                  </div>

                  {formData.teamMembers.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Danh sách thành viên ({formData.teamMembers.length})</label>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {formData.teamMembers.map((tm, idx) => (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', marginBottom: '0.5rem', background: '#fff' }}>
                            <div>
                              <strong>{tm.name}</strong> — <span style={{ color: '#64748b' }}>{tm.role}</span>
                            </div>
                            <button type="button" onClick={() => handleRemoveTeamMember(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                              Xóa
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {currentStep === 5 && (
                <>
                  <h2 className={styles.formTitle}>5. Funding & Goals</h2>
                  <p className={styles.formDesc}>Mục tiêu và khoảng số tiền cần huy động vốn.</p>

                  <div className={styles.formGroup}>
                    <label>Mục đích huy động vốn</label>
                    <input 
                      type="text" 
                      name="fundingPurpose" 
                      placeholder="Mở rộng thị trường, R&D sản phẩm..." 
                      value={formData.fundingPurpose} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className={styles.rowGroup}>
                    <div className={styles.formGroup}>
                      <label>Số tiền tối thiểu ({formData.currency})</label>
                      <input 
                        type="number" 
                        name="fundingAmountMin" 
                        value={formData.fundingAmountMin} 
                        onChange={handleChange} 
                        min={0}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Số tiền tối đa ({formData.currency})</label>
                      <input 
                        type="number" 
                        name="fundingAmountMax" 
                        value={formData.fundingAmountMax} 
                        onChange={handleChange} 
                        min={0}
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 6 && (
                <>
                  <h2 className={styles.formTitle}>6. Review & Submit</h2>
                  <p className={styles.formDesc}>Kiểm tra lại toàn bộ thông tin trước khi xác nhận gửi.</p>

                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Tên dự án:</strong> {formData.name}</p>
                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Mô tả:</strong> {formData.description}</p>
                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Ngành nghề / Giai đoạn:</strong> {formData.industry} • {formData.businessStage}</p>
                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Mục tiêu vốn:</strong> {formData.fundingAmountMin.toLocaleString()} - {formData.fundingAmountMax.toLocaleString()} {formData.currency}</p>
                    <p style={{ margin: 0 }}><strong>Thành viên:</strong> {formData.teamMembers.length} người</p>
                  </div>
                </>
              )}

              {/* Form Navigation Actions */}
              <div className={styles.formActions} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                {currentStep > 1 ? (
                  <button type="button" onClick={handlePrev} className={styles.cancelBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={16} /> Quay lại
                  </button>
                ) : <div />}

                {currentStep < 6 ? (
                  <button type="button" onClick={handleNext} className={styles.nextBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Tiếp tục <ArrowRight size={16} />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className={styles.nextBtn} style={{ background: 'var(--primary-600, #2563eb)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={16} /> {isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi hồ sơ gọi vốn'}
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Right Tips */}
          <div className={styles.tipsContainer}>
            <h3>Tips gọi vốn thành công</h3>
            <ul className={styles.tipsList}>
              <li>Nêu bật bài toán thị trường và điểm khác biệt sản phẩm.</li>
              <li>Điền đầy đủ thông tin đội ngũ sáng lập.</li>
              <li>Đặt mục tiêu tài chính rõ ràng, minh bạch.</li>
            </ul>
            <div className={styles.illustration}>
              <img src="/images/post_idea_illustration.jpg" alt="Rocket launching" className={styles.tipsImg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostIdea;
