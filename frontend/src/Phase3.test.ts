import { 
  getBusinessBySlug, 
  getFundingOpportunityBySlug, 
  getPublishedFundingOpportunitiesByBusinessId,
  getRelatedBusinesses,
  getRelatedFundingOpportunities
} from './utils/filterHelpers';
import { MOCK_FUNDING_OPPORTUNITIES } from './utils/mockData';

export function runPhase3Tests() {
  // 1. /businesses/:slug renders a valid Business
  const biz = getBusinessBySlug('nha-hang-an-nam');
  if (!biz || biz.name !== 'An Nam Culinary') throw new Error('Business by slug failed');

  // 2. Invalid Business slug returns undefined
  const invalidBiz = getBusinessBySlug('non-existent-slug');
  if (invalidBiz !== undefined) throw new Error('Invalid business slug failed');

  // 4 & 5. Business page displays valid published opportunities, excluding Draft/Rejected
  const pubOpps = getPublishedFundingOpportunitiesByBusinessId(biz.id);
  if (pubOpps.some(o => o.status === 'Draft' || o.status === 'Rejected')) {
    throw new Error('Draft or Rejected opportunities included in public listing');
  }

  // 6. Related businesses exclude current business
  const relatedBiz = getRelatedBusinesses(biz, 3);
  if (relatedBiz.some(r => r.business.id === biz.id)) {
    throw new Error('Related businesses included current business');
  }

  // 7. /funding-opportunities/:slug renders Published opportunity
  const opp = getFundingOpportunityBySlug('greenflow-seed-round');
  if (!opp || opp.status !== 'Published') throw new Error('Published opportunity lookup failed');

  // 8. Closed opportunity displays Closed status
  const closedOpp = getFundingOpportunityBySlug('an-nam-closed-deal');
  if (!closedOpp || closedOpp.status !== 'Closed') throw new Error('Closed opportunity lookup failed');

  // 9. Funded opportunity displays Funded status
  const fundedOpp = getFundingOpportunityBySlug('greenflow-funded-round');
  if (!fundedOpp || fundedOpp.status !== 'Funded') throw new Error('Funded opportunity lookup failed');

  // 10. Archived opportunity status
  const archivedOpp = getFundingOpportunityBySlug('may-mac-archived');
  if (!archivedOpp || archivedOpp.status !== 'Archived') throw new Error('Archived opportunity lookup failed');

  // 11 & 12. Draft / Rejected opportunities exist in DB but must not be public
  const draftOpp = getFundingOpportunityBySlug('draft-opportunity-private');
  const rejectedOpp = getFundingOpportunityBySlug('rejected-opportunity-private');
  const allowedPublic = ['Published', 'Closed', 'Funded', 'Archived'];
  if (draftOpp && allowedPublic.includes(draftOpp.status)) {
    throw new Error('Draft opportunity marked as public');
  }
  if (rejectedOpp && allowedPublic.includes(rejectedOpp.status)) {
    throw new Error('Rejected opportunity marked as public');
  }

  // 16. Use-of-funds percentages total 100 when supplied
  const oppWithFunds = MOCK_FUNDING_OPPORTUNITIES.find(o => o.useOfFunds && o.useOfFunds.length > 0);
  if (oppWithFunds && oppWithFunds.useOfFunds) {
    const total = oppWithFunds.useOfFunds.reduce((sum, item) => sum + item.percentage, 0);
    if (total !== 100) throw new Error(`Use of funds total is ${total}, expected 100`);
  }

  // 19 & 20. Related opportunities exclude current and private statuses
  const relatedOpps = getRelatedFundingOpportunities(opp, 3);
  if (relatedOpps.some(r => r.id === opp.id || !allowedPublic.includes(r.status))) {
    throw new Error('Related opportunities included invalid or private item');
  }

  return true;
}

// Execute on import
runPhase3Tests();
