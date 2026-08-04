import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

const RegisterBusiness = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const [repName, setRepName] = useState('');
  const [roleTitle, setRoleTitle] = useState(''); // Just keeping for UI, maybe unused in BE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState(''); // Just keeping for UI
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Split repName into first and last
    const nameParts = repName.trim().split(' ');
    const firstName = nameParts[0] || 'Business';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Rep';

    try {
      // 1. Register Account
      await api.post('/auth/register', {
        email,
        password,
        name: `${firstName} ${lastName}`.trim()
      });
      
      // 2. Login to get token
      const loginRes = await api.post('/auth/login', { email, password });
      const { user, access_token } = loginRes.data;
      
      // Save to store temporarily so we can call the next API
      localStorage.setItem('token', access_token);
      
      // 3. Create basic Business Profile
      await api.post('/businesses', {
        name: companyName,
        industry: 'Other',
        businessType: 'Startup',
        businessStage: 'Idea',
        description: `${companyName} is a new startup represented by ${repName} (${roleTitle}).`,
        location: 'Unknown'
      }, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      login(user, access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={`${styles.authContainer} ${styles.authContainerWide}`}>
        <div className={styles.authHeader}>
          <h1>Register your Business</h1>
          <p>List your startup, publish blogs, and connect with partners</p>
        </div>

        <div className={styles.roleSelection}>
          <Link to="/register" className={styles.roleCard}>
            <h3>Reader / User</h3>
            <p>I want to read, comment, and connect.</p>
          </Link>
          <Link to="/register/business" className={styles.roleCard} style={{borderColor: 'var(--primary-500)', background: 'var(--surface-color)'}}>
            <h3>Business / Startup</h3>
            <p>I want to list my company and publish PR blogs.</p>
          </Link>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          
          <h3 style={{marginTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>1. Account Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="repName">Representative Name *</label>
              <input type="text" id="repName" placeholder="Your name" value={repName} onChange={e => setRepName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="role">Your Role / Title *</label>
              <input type="text" id="role" placeholder="e.g. CEO, Founder, Marketing Manager" value={roleTitle} onChange={e => setRoleTitle(e.target.value)} required />
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Business Email *</label>
              <input type="email" id="email" placeholder="name@yourcompany.com" value={email} onChange={e => setEmail(e.target.value)} required />
              <span className={styles.hint}>Please use an official company domain.</span>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password *</label>
              <input type="password" id="password" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>

          <h3 style={{marginTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>2. Business Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="companyName">Legal Company Name *</label>
              <input type="text" id="companyName" placeholder="GreenFlow Tech JSC" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="taxId">Tax ID / Registration Number *</label>
              <input type="text" id="taxId" placeholder="e.g. 0101234567" value={taxId} onChange={e => setTaxId(e.target.value)} required />
            </div>
          </div>

          <div className={styles.formOptions} style={{marginTop: '1rem'}}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" required /> I confirm that the information above is accurate and I am authorized to represent this company.
            </label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterBusiness;
