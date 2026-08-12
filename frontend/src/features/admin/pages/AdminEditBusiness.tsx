import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import commonStyles from '../AdminCommon.module.css';
import ImageUploader from '../../../components/ImageUploader';
import { useAdminTabsStore } from '../../../store/adminTabsStore';
import { useLocation } from 'react-router-dom';
import { api } from '../../../lib/axios';
import { adminQueryKeys } from '../services/adminApi';
import { createProposalDiff } from '../utils/proposalDiff';

const BUSINESS_PROPOSAL_FIELDS = [
  'name',
  'legalName',
  'description',
  'detailedOverview',
  'industry',
  'businessStage',
  'businessType',
  'location',
  'website',
  'logoUrl',
  'coverUrl',
  'foundedYear',
  'employeeRange',
  'businessModel',
  'productsOrServices',
  'mainMarket',
] as const;

function toBusinessProposal(form: Record<string, any>) {
  return {
    name: form.name,
    legalName: form.legalName,
    description: form.description,
    detailedOverview: form.detailedOverview,
    industry: form.industry,
    businessStage: form.businessStage,
    businessType: form.businessType,
    location: form.location,
    website: form.website || undefined,
    logoUrl: form.logoUrl || undefined,
    coverUrl: form.coverUrl || undefined,
    foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
    employeeRange: form.employeeRange,
    businessModel: form.businessModel,
    productsOrServices: form.productsOrServices,
    mainMarket: form.mainMarket,
  };
}

export default function AdminEditBusiness({ businessId }: { businessId?: string }) {
  const params = useParams();
  const location = useLocation();
  const updateTabTitle = useAdminTabsStore(state => state.updateTabTitle);
  const id = businessId || params.id;
  const navigate = useNavigate();
  const initializedBusinessIdRef = useRef<string | undefined>(undefined);
  const originalProposalRef = useRef<Record<string, unknown> | null>(null);
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

  const businessQuery = useQuery({
    queryKey: adminQueryKeys.business(id),
    enabled: Boolean(id),
    refetchOnMount: 'always',
    queryFn: async () => {
      const response = await api.get(`/businesses/admin/${id}`);
      return response.data;
    },
  });

  useEffect(() => {
    const business = businessQuery.data;
    if (
      !business ||
      !businessQuery.isFetchedAfterMount ||
      initializedBusinessIdRef.current === id
    ) return;

    const nextFormData = {
      name: business.name || '',
      legalName: business.legalName || '',
      description: business.description || '',
      detailedOverview: business.detailedOverview || '',
      industry: business.industry || '',
      businessStage: business.businessStage || 'Idea',
      businessType: business.businessType || 'B2B',
      location: business.location || '',
      website: business.website || '',
      logoUrl: business.logoUrl || '',
      coverUrl: business.coverUrl || '',
      foundedYear: business.foundedYear || '',
      employeeRange: business.employeeRange || '',
      businessModel: business.businessModel || '',
      productsOrServices: business.productsOrServices || '',
      mainMarket: business.mainMarket || ''
    };
    setFormData(nextFormData);
    originalProposalRef.current = toBusinessProposal(nextFormData);
    initializedBusinessIdRef.current = id;
    updateTabTitle(location.pathname, `Edit: ${business.name.length > 20 ? business.name.substring(0, 20) + '...' : business.name}`);
  }, [
    businessQuery.data,
    businessQuery.isFetchedAfterMount,
    id,
    location.pathname,
    updateTabTitle,
  ]);

  useEffect(() => {
    if (businessQuery.isError) {
      toast.error('Failed to load business');
    }
  }, [businessQuery.errorUpdatedAt, businessQuery.isError]);

  const proposalMutation = useMutation({
    mutationFn: (proposal: Record<string, unknown>) =>
      api.post(`/admin/proposals/business/${id}`, proposal),
    onSuccess: () => {
      toast.success('Change proposal sent to the business owner for review');
      navigate('/admin/businesses');
    },
    onError: () => toast.error('Error updating business'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessQuery.isSuccess || !originalProposalRef.current) {
      toast.error('Load the current business before proposing changes');
      return;
    }

    const changes = createProposalDiff(
      originalProposalRef.current,
      toBusinessProposal(formData),
      BUSINESS_PROPOSAL_FIELDS,
    );
    if (Object.keys(changes).length === 0) {
      toast.error('No changes to propose');
      return;
    }

    proposalMutation.mutate(changes);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (field: 'logoUrl' | 'coverUrl', url: string) => {
    setFormData({ ...formData, [field]: url });
  };

  if (!id) return <div className={commonStyles.loading}>Business not found.</div>;
  if (businessQuery.isPending) return <div className={commonStyles.loading}>Loading...</div>;
  if (businessQuery.isError || !businessQuery.data) {
    return (
      <div className={commonStyles.emptyState} role="alert">
        <p>The current business could not be loaded. No proposal can be submitted.</p>
        <button
          type="button"
          className={commonStyles.actionBtn}
          onClick={() => void businessQuery.refetch()}
        >
          Try again
        </button>
      </div>
    );
  }
  if (
    !businessQuery.isFetchedAfterMount ||
    initializedBusinessIdRef.current !== id ||
    !originalProposalRef.current
  ) {
    return <div className={commonStyles.loading}>Loading current business data...</div>;
  }

  const submitting = proposalMutation.isPending;

  return (
    <div>
      <header className={commonStyles.header}>
        <h1>Propose Business Changes</h1>
        <p>The current public profile stays unchanged until the owner reviews this proposal.</p>
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
              {submitting ? 'Submitting...' : 'Send Change Proposal'}
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
