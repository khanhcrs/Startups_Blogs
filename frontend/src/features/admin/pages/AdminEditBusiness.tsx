import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import commonStyles from '../AdminCommon.module.css';
import ImageUploader from '../../../components/ImageUploader';
import { useAdminTabsStore } from '../../../store/adminTabsStore';
import { useLocation } from 'react-router-dom';

export default function AdminEditBusiness({ businessId }: { businessId?: string }) {
  const params = useParams();
  const location = useLocation();
  const updateTabTitle = useAdminTabsStore(state => state.updateTabTitle);
  const id = businessId || params.id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: '',
    legalName: '',
    description: '',
    detailedOverview: '',
    industry: '',
    businessStage: '',
    businessType: '',
    location: '',
    website: '',
    logoUrl: '',
    coverUrl: '',
    foundedYear: '',
    employeeRange: '',
    businessModel: '',
    productsOrServices: '',
    mainMarket: ''
  });

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  const fetchBusiness = async () => {
    try {
      const token = localStorage.getItem('token');
      // For now, we fetch all businesses and find the one with the correct ID.
      // This is a workaround since there's no single business admin endpoint yet.
      const res = await fetch(`http://localhost:3000/businesses/admin/all?status=`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const b = data.data ? data.data.find((x: any) => x.id === id) : data.find((x: any) => x.id === id);
        if (b) {
          setFormData({
            name: b.name || '',
            legalName: b.legalName || '',
            description: b.description || '',
            detailedOverview: b.detailedOverview || '',
            industry: b.industry || '',
            businessStage: b.businessStage || 'Idea',
            businessType: b.businessType || 'B2B',
            location: b.location || '',
            website: b.website || '',
            logoUrl: b.logoUrl || '',
            coverUrl: b.coverUrl || '',
            foundedYear: b.foundedYear || '',
            employeeRange: b.employeeRange || '',
            businessModel: b.businessModel || '',
            productsOrServices: b.productsOrServices || '',
            mainMarket: b.mainMarket || ''
          });
          
          updateTabTitle(location.pathname, `Edit: ${b.name.length > 20 ? b.name.substring(0, 20) + '...' : b.name}`);
        }
      }
    } catch (error) {
      toast.error('Failed to load business');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3000/businesses/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update business');
      toast.success('Business updated successfully! (Direct Force Update)');
      navigate('/admin/businesses');
    } catch (error) {
      toast.error('Error updating business');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (field: 'logoUrl' | 'coverUrl', url: string) => {
    setFormData({ ...formData, [field]: url });
  };

  if (loading) return <div className={commonStyles.loading}>Loading...</div>;

  return (
    <div>
      <header className={commonStyles.header}>
        <h1>Directly Edit Business</h1>
        <p>You have Supreme Admin Authority. Your changes will be saved directly and overwrite existing data.</p>
      </header>
      
      <div className={commonStyles.contentCard}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Business Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Legal Name</label>
              <input type="text" name="legalName" value={formData.legalName} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Short Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={{...inputStyle, minHeight: '80px'}} required />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Detailed Overview</label>
            <textarea name="detailedOverview" value={formData.detailedOverview} onChange={handleChange} style={{...inputStyle, minHeight: '120px'}} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Industry</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} style={inputStyle} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Business Type</label>
              <select name="businessType" value={formData.businessType} onChange={handleChange} style={inputStyle}>
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
                <option value="B2B2C">B2B2C</option>
                <option value="C2C">C2C</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Stage</label>
              <select name="businessStage" value={formData.businessStage} onChange={handleChange} style={inputStyle}>
                <option value="Idea">Idea</option>
                <option value="Early Stage">Early Stage</option>
                <option value="Operating">Operating</option>
                <option value="Growing">Growing</option>
                <option value="Expansion">Expansion</option>
                <option value="Mature">Mature</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Founded Year</label>
              <input type="number" name="foundedYear" value={formData.foundedYear} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Employee Range</label>
              <input type="text" name="employeeRange" value={formData.employeeRange} onChange={handleChange} placeholder="e.g. 10-50" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Main Market</label>
              <input type="text" name="mainMarket" value={formData.mainMarket} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Business Model</label>
              <input type="text" name="businessModel" value={formData.businessModel} onChange={handleChange} placeholder="e.g. SaaS" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Products Or Services</label>
              <input type="text" name="productsOrServices" value={formData.productsOrServices} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Logo</label>
              <ImageUploader 
                onUploadSuccess={(url) => handleImageUpload('logoUrl', url)} 
                defaultImage={formData.logoUrl} 
                label="Upload Logo"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Cover Image</label>
              <ImageUploader 
                onUploadSuccess={(url) => handleImageUpload('coverUrl', url)} 
                defaultImage={formData.coverUrl} 
                label="Upload Cover"
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className={`${commonStyles.actionBtn} ${commonStyles.approveBtn}`} 
              disabled={submitting}
              style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', background: '#e11d48' }}
            >
              {submitting ? 'Saving...' : 'Save Changes (Force Update)'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin/businesses')}
              className={commonStyles.actionBtn}
              style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', background: '#f3f4f6' }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', 
  padding: '0.5rem', 
  border: '1px solid #ccc', 
  borderRadius: '4px'
};
