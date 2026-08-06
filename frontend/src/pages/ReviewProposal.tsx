import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, X, ArrowLeft } from 'lucide-react';
import { api } from '../lib/axios';
import styles from './ReviewProposal.module.css';

export default function ReviewProposal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<{ proposal: any; currentData: any } | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await api.get(`/proposals/${id}`);
        setData(res.data.data);
      } catch (error) {
        toast.error('Failed to load proposal details.');
        navigate('/user/me'); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [id, navigate]);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!window.confirm(`Are you sure you want to ${action} this proposal?`)) return;
    setSubmitting(true);
    try {
      await api.post(`/proposals/${id}/${action}`);
      toast.success(`Proposal ${action}d successfully!`);
      navigate('/user/me');
    } catch (error) {
      toast.error(`Failed to ${action} proposal.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loadingState}>Loading proposal details...</div>;
  if (!data) return <div className={styles.loadingState}>Proposal not found.</div>;

  const { proposal, currentData } = data;
  const proposedChanges = proposal.proposedChanges || {};

  // Extract keys to show diffs for
  const allKeys = Array.from(new Set([...Object.keys(currentData || {}), ...Object.keys(proposedChanges)]));
  
  // Filter out system fields like id, createdAt, updatedAt, ownerId, etc.
  const displayKeys = allKeys.filter(k => 
    !['id', 'ownerId', 'authorId', 'createdAt', 'updatedAt', 'slug', 'businessId'].includes(k) &&
    proposedChanges[k] !== undefined
  );

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontWeight: 500 }}
        >
          <ArrowLeft size={20} /> Back to Profile
        </button>

        <header className={styles.header}>
          <h1>Review Proposed Changes</h1>
          <p>
            An administrator ({proposal.proposer?.name || 'Admin'}) has proposed updates to your {proposal.entityType.toLowerCase()}. 
            Please review the changes below and approve or reject them.
          </p>
        </header>

        <div className={styles.diffContainer}>
          <div className={`${styles.diffRow} ${styles.diffHeaderRow}`}>
            <div className={styles.diffCol}>Current Information</div>
            <div className={styles.diffCol}>Proposed Updates</div>
          </div>
          
          {displayKeys.map(key => {
            const oldVal = currentData ? currentData[key] : null;
            const newVal = proposedChanges[key];
            const isChanged = oldVal !== newVal;

            return (
              <div key={key} className={styles.diffRow}>
                <div className={styles.diffCol}>
                  <div className={styles.fieldLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className={isChanged ? styles.oldValue : styles.unchangedValue}>
                    {typeof oldVal === 'object' ? JSON.stringify(oldVal, null, 2) : String(oldVal || '-')}
                  </div>
                </div>
                <div className={styles.diffCol}>
                  <div className={styles.fieldLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className={isChanged ? styles.newValue : styles.unchangedValue}>
                    {typeof newVal === 'object' ? JSON.stringify(newVal, null, 2) : String(newVal || '-')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.rejectBtn} 
            onClick={() => handleAction('reject')}
            disabled={submitting || proposal.status !== 'PENDING'}
          >
            <X size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Reject Changes
          </button>
          <button 
            className={styles.approveBtn} 
            onClick={() => handleAction('approve')}
            disabled={submitting || proposal.status !== 'PENDING'}
          >
            <Check size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Approve & Merge
          </button>
        </div>
      </div>
    </div>
  );
}
