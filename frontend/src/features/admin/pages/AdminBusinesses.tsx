import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import commonStyles from '../AdminCommon.module.css';
import { api } from '../../../lib/axios';
import { adminQueryKeys } from '../services/adminApi';

export default function AdminBusinesses() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery, stageFilter, industryFilter, startDate, endDate]);

  const getStageStyle = (stage: string) => {
    switch(stage) {
      case 'Idea': return { bg: '#fef9c3', color: '#854d0e' };
      case 'Early Stage': return { bg: '#dbeafe', color: '#1e40af' };
      case 'Operating': return { bg: '#dcfce3', color: '#166534' };
      case 'Growing': return { bg: '#e0e7ff', color: '#3730a3' };
      case 'Expansion': return { bg: '#f3e8ff', color: '#6b21a8' };
      case 'Mature': return { bg: '#fce7f3', color: '#9d174d' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  const filters = {
    skip: (page - 1) * limit,
    take: limit,
    status: statusFilter,
    search: searchQuery || undefined,
    stage: stageFilter || undefined,
    industry: industryFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };
  const businessesQuery = useQuery({
    queryKey: adminQueryKeys.businessList(filters),
    queryFn: async () => {
      const response = await api.get('/businesses/admin/all', {
        params: filters,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (businessesQuery.isError) {
      toast.error('Failed to load businesses');
    }
  }, [businessesQuery.errorUpdatedAt, businessesQuery.isError]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/businesses/admin/${id}/status`, { status }),
    onSuccess: async (_response, variables) => {
      toast.success(`Business marked as ${variables.status}`);
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.businessLists,
      });
    },
    onError: () => {
      toast.error('Error updating status');
    },
  });

  const handleUpdateBusinessStatus = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const businesses = businessesQuery.data?.data || [];
  const totalPages = businessesQuery.data?.meta?.totalPages || 1;
  const totalItems = businessesQuery.data?.meta?.total || 0;
  const loading = businessesQuery.isPending;
  const statusUpdating = updateStatusMutation.isPending;

  return (
    <div>
      <header className={commonStyles.header}>
        <h1>Business Approvals</h1>
        <p>Manage startup applications and visibility</p>
      </header>
      <div className={commonStyles.contentCard}>
        <div className={commonStyles.tabs}>
          <button 
            className={`${commonStyles.tab} ${statusFilter === 'PENDING' ? commonStyles.activeTab : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            Pending Review
          </button>
          <button 
            className={`${commonStyles.tab} ${statusFilter === 'APPROVED' ? commonStyles.activeTab : ''}`}
            onClick={() => setStatusFilter('APPROVED')}
          >
            Approved
          </button>
          <button 
            className={`${commonStyles.tab} ${statusFilter === 'REJECTED' ? commonStyles.activeTab : ''}`}
            onClick={() => setStatusFilter('REJECTED')}
          >
            Rejected
          </button>
          <button 
            className={`${commonStyles.tab} ${statusFilter === 'SUSPENDED' ? commonStyles.activeTab : ''}`}
            onClick={() => setStatusFilter('SUSPENDED')}
          >
            Suspended
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <input 
            type="text" 
            placeholder="Search startup name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', flex: '1 1 200px' }}
          />
          <select 
            value={stageFilter} 
            onChange={(e) => setStageFilter(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', flex: '1 1 120px' }}
          >
            <option value="">All Stages</option>
            <option value="Idea">Idea</option>
            <option value="Early Stage">Early Stage</option>
            <option value="Operating">Operating</option>
            <option value="Growing">Growing</option>
            <option value="Expansion">Expansion</option>
            <option value="Mature">Mature</option>
          </select>
          <select 
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', flex: '1 1 150px' }}
          >
            <option value="">All Industries</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Logistics">Logistics</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Professional Services">Professional Services</option>
            <option value="SaaS">SaaS</option>
            <option value="FinTech">FinTech</option>
            <option value="E-commerce">E-commerce</option>
            <option value="AI">AI</option>
            <option value="Blockchain">Blockchain</option>
            <option value="PropTech">PropTech</option>
          </select>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '2 1 300px' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap' }}>From:</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', color: startDate ? '#0f172a' : '#94a3b8', flex: 1 }}
            />
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap' }}>To:</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', color: endDate ? '#0f172a' : '#94a3b8', flex: 1 }}
            />
          </div>
        </div>

        <div className={commonStyles.listContainer}>
          {loading ? <div className={commonStyles.loading}>Loading...</div> : 
           businesses.length === 0 ? (
            <p className={commonStyles.emptyState}>No businesses found for this status.</p>
          ) : (
            <div className={commonStyles.tableWrapper}>
              <table className={commonStyles.table}>
                <thead>
                  <tr>
                    <th>Startup Name</th>
                    <th>Industry</th>
                    <th>Stage</th>
                    <th>Owner</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((b: any) => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {b.logoUrl ? (
                            <img src={b.logoUrl} alt={b.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                          ) : (
                            <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b', border: '1px solid #e2e8f0' }}>
                              {b.name.charAt(0)}
                            </div>
                          )}
                          <Link to={`/admin/businesses/${b.id}`} className={commonStyles.link} style={{ fontWeight: 600, color: '#1e293b' }}>
                            {b.name}
                          </Link>
                        </div>
                      </td>
                      <td>
                        <span style={{ padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.875rem', color: '#475569' }}>
                          {b.industry}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          background: getStageStyle(b.businessStage).bg, 
                          borderRadius: '4px', 
                          fontSize: '0.875rem', 
                          color: getStageStyle(b.businessStage).color, 
                          fontWeight: 500 
                        }}>
                          {b.businessStage || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {b.owner?.avatarUrl ? (
                            <img src={b.owner.avatarUrl} alt={b.owner.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                          ) : (
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>
                              {b.owner?.name?.charAt(0) || '?'}
                            </div>
                          )}
                          <span style={{ fontSize: '0.9rem', color: '#334155' }}>{b.owner?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.9rem' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className={commonStyles.actions}>
                          <Link to={`/admin/businesses/${b.id}/edit`} className={commonStyles.actionBtn} style={{ backgroundColor: '#f3f4f6', color: '#374151', textDecoration: 'none' }}>
                            Edit
                          </Link>
                          {b.status === 'PENDING' && (
                            <>
                              <button disabled={statusUpdating} className={`${commonStyles.actionBtn} ${commonStyles.approveBtn}`} onClick={() => handleUpdateBusinessStatus(b.id, 'APPROVED')}>Approve</button>
                              <button disabled={statusUpdating} className={`${commonStyles.actionBtn} ${commonStyles.rejectBtn}`} onClick={() => handleUpdateBusinessStatus(b.id, 'REJECTED')}>Reject</button>
                            </>
                          )}
                          {b.status === 'APPROVED' && (
                            <button disabled={statusUpdating} className={`${commonStyles.actionBtn} ${commonStyles.rejectBtn}`} onClick={() => handleUpdateBusinessStatus(b.id, 'SUSPENDED')}>Suspend</button>
                          )}
                          {b.status === 'SUSPENDED' && (
                            <button disabled={statusUpdating} className={`${commonStyles.actionBtn} ${commonStyles.approveBtn}`} onClick={() => handleUpdateBusinessStatus(b.id, 'APPROVED')}>Restore</button>
                          )}
                          {b.status === 'REJECTED' && (
                            <button disabled={statusUpdating} className={`${commonStyles.actionBtn} ${commonStyles.approveBtn}`} onClick={() => handleUpdateBusinessStatus(b.id, 'APPROVED')}>Approve</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Showing <b>{(page - 1) * limit + 1}</b> to <b>{Math.min(page * limit, totalItems)}</b> of <b>{totalItems}</b> businesses
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ display: 'flex', alignItems: 'center', padding: '0.375rem 0.75rem', background: '#fff', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: page === 1 ? '#9ca3af' : '#374151', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Page {page} of {totalPages}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ display: 'flex', alignItems: 'center', padding: '0.375rem 0.75rem', background: '#fff', border: '1px solid #d1d5db', borderRadius: '0.375rem', color: page === totalPages ? '#9ca3af' : '#374151', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
