import type { 
  Business, 
  FundingOpportunity, 
  BusinessOpportunityRecord, 
  BusinessBrowseState 
} from '../types/business';
export const DEFAULT_BROWSE_STATE: BusinessBrowseState = {
  search: '',
  industry: 'all',
  businessType: 'all',
  businessStage: 'all',
  fundingPurpose: 'all',
  fundingType: 'all',
  fundingRange: 'all',
  location: 'all',
  verified: 'all',
  postedWithin: 'all',
  tab: 'all',
  sort: 'newest',
  page: 1,
};

// Pure lookup helpers
export const getBusinessBySlug = (businesses: Business[], slug: string): Business | undefined => {
  return businesses.find(b => b.slug === slug || b.id === slug);
};

export const getBusinessById = (businesses: Business[], id: string): Business | undefined => {
  return businesses.find(b => b.id === id);
};

export const getFundingOpportunityBySlug = (opportunities: FundingOpportunity[], slug: string): FundingOpportunity | undefined => {
  return opportunities.find(f => f.slug === slug || f.id === slug);
};

export const getFundingOpportunitiesByBusinessId = (opportunities: FundingOpportunity[], businessId: string): FundingOpportunity[] => {
  return opportunities.filter(f => f.businessId === businessId);
};

export const getPublishedFundingOpportunitiesByBusinessId = (opportunities: FundingOpportunity[], businessId: string): FundingOpportunity[] => {
  const allowedStatuses = ['Published', 'Closed', 'Funded', 'Archived'];
  return opportunities.filter(
    f => f.businessId === businessId && allowedStatuses.includes(f.status)
  );
};

export const getRelatedBusinesses = (records: BusinessOpportunityRecord[], currentBusiness: Business, limit: number = 3): BusinessOpportunityRecord[] => {
  return records
    .filter(r => r.business.id !== currentBusiness.id)
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.business.industry === currentBusiness.industry) scoreA += 4;
      if (b.business.industry === currentBusiness.industry) scoreB += 4;
      if (a.business.businessType === currentBusiness.businessType) scoreA += 3;
      if (b.business.businessType === currentBusiness.businessType) scoreB += 3;
      if (a.business.businessStage === currentBusiness.businessStage) scoreA += 2;
      if (b.business.businessStage === currentBusiness.businessStage) scoreB += 2;
      if (a.business.location === currentBusiness.location) scoreA += 1;
      if (b.business.location === currentBusiness.location) scoreB += 1;
      return scoreB - scoreA;
    })
    .slice(0, limit);
};

export const getRelatedFundingOpportunities = (opportunities: FundingOpportunity[], businesses: Business[], currentOpp: FundingOpportunity, limit: number = 3): FundingOpportunity[] => {
  const publicStatuses = ['Published', 'Closed', 'Funded'];
  const currentBusiness = getBusinessById(businesses, currentOpp.businessId);

  return opportunities
    .filter(f => f.id !== currentOpp.id && publicStatuses.includes(f.status))
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.fundingPurpose === currentOpp.fundingPurpose) scoreA += 4;
      if (b.fundingPurpose === currentOpp.fundingPurpose) scoreB += 4;
      
      const bizA = getBusinessById(businesses, a.businessId);
      const bizB = getBusinessById(businesses, b.businessId);
      
      if (currentBusiness && bizA && bizA.industry === currentBusiness.industry) scoreA += 3;
      if (currentBusiness && bizB && bizB.industry === currentBusiness.industry) scoreB += 3;
      if (a.fundingType === currentOpp.fundingType) scoreA += 2;
      if (b.fundingType === currentOpp.fundingType) scoreB += 2;

      return scoreB - scoreA;
    })
    .slice(0, limit);
};

export const matchesFundingRange = (amountMin: number, amountMax: number, currency: string, rangeKey: string): boolean => {
  if (rangeKey === 'all') return true;
  if (currency === 'USD') {
    const avgVND = ((amountMin + amountMax) / 2) * 25000;
    return checkVNDRange(avgVND, rangeKey);
  }
  const avgVND = (amountMin + amountMax) / 2;
  return checkVNDRange(avgVND, rangeKey);
};

const checkVNDRange = (amount: number, rangeKey: string): boolean => {
  switch (rangeKey) {
    case 'under-500m':
      return amount < 500000000;
    case '500m-1b':
      return amount >= 500000000 && amount <= 1000000000;
    case '1b-5b':
      return amount >= 1000000000 && amount <= 5000000000;
    case '5b-20b':
      return amount >= 5000000000 && amount <= 20000000000;
    case 'over-20b':
      return amount > 20000000000;
    default:
      return true;
  }
};

export const matchesTimePosted = (dateString: string, timeKey: string): boolean => {
  if (timeKey === 'all') return true;
  const createdDate = new Date(dateString);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffTime = today.getTime() - createdDate.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);

  switch (timeKey) {
    case 'today':
      return createdDate >= startOfToday;
    case 'this-week':
    case '7-days':
      return diffDays <= 7;
    case 'this-month':
    case '30-days':
      return diffDays <= 30;
    case 'this-year':
    case '365-days':
      return diffDays <= 365;
    default:
      return true;
  }
};

export const calculateTrendingScore = (record: BusinessOpportunityRecord): number => {
  const { savedCount, commentCount, viewCount } = record.business;
  return savedCount * 3 + commentCount * 2 + Math.floor(viewCount / 10);
};

export const normalizeIndustry = (ind: string): string => {
  if (!ind) return '';
  try {
    return decodeURIComponent(ind).trim().toLowerCase();
  } catch {
    return ind.trim().toLowerCase();
  }
};

export const filterBusinessRecords = (
  records: BusinessOpportunityRecord[],
  filters: BusinessBrowseState
): BusinessOpportunityRecord[] => {
  return records.filter(({ business, opportunity }) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const matchName = business.name.toLowerCase().includes(q);
      const matchDesc = business.description.toLowerCase().includes(q);
      const matchInd = business.industry.toLowerCase().includes(q);
      const matchProd = business.productsOrServices ? business.productsOrServices.toLowerCase().includes(q) : false;
      const matchLoc = business.location.toLowerCase().includes(q);
      const matchOppTitle = opportunity ? opportunity.title.toLowerCase().includes(q) : false;
      
      if (!matchName && !matchDesc && !matchInd && !matchProd && !matchLoc && !matchOppTitle) {
        return false;
      }
    }

    // Industry
    if (filters.industry !== 'all') {
      const targetInd = normalizeIndustry(filters.industry);
      const businessInd = normalizeIndustry(business.industry);
      if (business.industry !== filters.industry && businessInd !== targetInd) {
        return false;
      }
    }

    // Business Type
    if (filters.businessType !== 'all' && business.businessType !== filters.businessType) {
      return false;
    }

    // Business Stage
    if (filters.businessStage !== 'all' && business.businessStage !== filters.businessStage) {
      return false;
    }

    // Verified Status
    if (filters.verified !== 'all') {
      const isVerified = filters.verified === 'true' || filters.verified === 'verified';
      if (business.verified !== isVerified) return false;
    }

    // Location
    if (filters.location !== 'all' && business.location !== filters.location) {
      return false;
    }

    // Opportunity-level filters
    if (opportunity) {
      if (filters.fundingPurpose !== 'all' && opportunity.fundingPurpose !== filters.fundingPurpose) {
        return false;
      }

      if (filters.fundingType !== 'all' && opportunity.fundingType !== filters.fundingType) {
        return false;
      }

      if (filters.fundingRange !== 'all') {
        if (!matchesFundingRange(opportunity.fundingAmountMin, opportunity.fundingAmountMax, opportunity.currency, filters.fundingRange)) {
          return false;
        }
      }

      if (filters.postedWithin !== 'all') {
        if (!matchesTimePosted(opportunity.publishedAt || business.createdAt, filters.postedWithin)) {
          return false;
        }
      }
    } else {
      if (filters.fundingPurpose !== 'all' || filters.fundingType !== 'all' || filters.fundingRange !== 'all') {
        return false;
      }
    }

    return true;
  });
};

export const sortBusinessRecords = (
  records: BusinessOpportunityRecord[],
  sortOption: string,
  tab: BusinessBrowseState['tab']
): BusinessOpportunityRecord[] => {
  const results = [...records];

  if (tab === 'following') {
    return [];
  }

  if (tab === 'trending') {
    return results.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
  }

  if (tab === 'recent') {
    return results.sort((a, b) => new Date(b.business.createdAt).getTime() - new Date(a.business.createdAt).getTime());
  }

  return results.sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.business.createdAt).getTime() - new Date(a.business.createdAt).getTime();
      case 'oldest':
        return new Date(a.business.createdAt).getTime() - new Date(b.business.createdAt).getTime();
      case 'mostSaved':
        return b.business.savedCount - a.business.savedCount;
      case 'mostViewed':
        return b.business.viewCount - a.business.viewCount;
      case 'mostDiscussed':
      case 'mostCommented':
        return b.business.commentCount - a.business.commentCount;
      case 'fundingLowHigh':
        return (a.opportunity?.fundingAmountMin || 0) - (b.opportunity?.fundingAmountMin || 0);
      case 'fundingHighLow':
        return (b.opportunity?.fundingAmountMax || 0) - (a.opportunity?.fundingAmountMax || 0);
      default:
        return 0;
    }
  });
};

export const paginateRecords = <T>(items: T[], page: number, limit: number): T[] => {
  const startIndex = (page - 1) * limit;
  return items.slice(startIndex, startIndex + limit);
};

export const getUniqueIndustries = (records: BusinessOpportunityRecord[]): string[] => {
  return Array.from(new Set(records.map(r => r.business.industry))).sort();
};

export const getUniqueLocations = (records: BusinessOpportunityRecord[]): string[] => {
  return Array.from(new Set(records.map(r => r.business.location))).sort();
};
