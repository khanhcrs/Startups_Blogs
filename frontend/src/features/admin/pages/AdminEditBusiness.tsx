import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import commonStyles from '../AdminCommon.module.css';

export default function AdminEditBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    industry: '',
    businessStage: '',
    businessType: '',
  });

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  const fetchBusiness = async () => {
    try {
      const token = localStorage.getItem('token');
      // We need to fetch the business details. The public endpoint is /businesses/:slug, 
      // but we might only have ID. Let's use /businesses/admin/all and filter, or a new admin endpoint.
      // Wait, there is no GET /businesses/:id for admin yet? Let's assume we can fetch by slug if we know it.
      // For now, let's just fetch all and find it, since it's a quick fix.
      const res = await fetch(`http://localhost:3000/businesses/admin/all?status=`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const b = data.find((x: any) => x.id === id);
        if (b) {
          setFormData({
            name: b.name,
            description: b.description,
            industry: b.industry,
            businessStage: b.businessStage,
            businessType: b.businessType,
          });
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
      const res = await fetch(`http://localhost:3000/admin/proposals/business/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to propose changes');
      toast.success('Change proposal created and sent to owner for review!');
      navigate('/admin/businesses');
    } catch (error) {
      toast.error('Error creating proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className={commonStyles.loading}>Loading...</div>;

  return (
    <div>
      <header className={commonStyles.header}>
        <h1>Propose Edits to Business</h1>
        <p>Your changes will be submitted as a proposal for the owner to review.</p>
      </header>
      
      <div className={commonStyles.contentCard}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Business Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Industry</label>
            <input 
              type="text" 
              name="industry" 
              value={formData.industry} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Business Type</label>
            <select 
              name="businessType" 
              value={formData.businessType} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
              <option value="B2B2C">B2B2C</option>
              <option value="C2C">C2C</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Stage</label>
            <select 
              name="businessStage" 
              value={formData.businessStage} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="IDEA">Idea Stage</option>
              <option value="MVP">MVP</option>
              <option value="EARLY_TRACTION">Early Traction</option>
              <option value="SCALING">Scaling</option>
            </select>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className={`${commonStyles.actionBtn} ${commonStyles.approveBtn}`} 
              disabled={submitting}
              style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
            >
              {submitting ? 'Submitting...' : 'Propose Changes'}
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
