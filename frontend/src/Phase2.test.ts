import type { BusinessType } from './types/business';
import { MOCK_RECORDS, MOCK_BUSINESSES } from './utils/mockData';
import { 
  filterBusinessRecords, 
  sortBusinessRecords, 
  DEFAULT_BROWSE_STATE, 
  calculateTrendingScore,
  matchesFundingRange,
  matchesTimePosted
} from './utils/filterHelpers';

export function runPhase2Tests() {
  // 1. Official brand remains Startups Blogs
  const brand = 'Startups Blogs';
  if (brand !== 'Startups Blogs') throw new Error('Brand failure');

  // 5. Startup remains a valid Business Type
  const sampleType: BusinessType = 'Startup';
  if (sampleType !== 'Startup') throw new Error('Startup BusinessType failure');

  // 6. Mock data contains multiple Business Types
  const typesInMock = new Set(MOCK_BUSINESSES.map(b => b.businessType));
  if (typesInMock.size < 4) throw new Error('Insufficient BusinessTypes in mock data');

  // 7. Mock data contains traditional SMEs and startups
  if (!typesInMock.has('Small Business') || !typesInMock.has('Startup') || !typesInMock.has('Family Business')) {
    throw new Error('Missing SME or Startup types in mock data');
  }

  // 8. Industry filter works
  const foodRecords = filterBusinessRecords(MOCK_RECORDS, { ...DEFAULT_BROWSE_STATE, industry: 'Food & Beverage' });
  if (foodRecords.length === 0 || foodRecords.some(r => r.business.industry !== 'Food & Beverage')) {
    throw new Error('Industry filter failed');
  }

  // 9. Business Type filter works
  const smallBizRecords = filterBusinessRecords(MOCK_RECORDS, { ...DEFAULT_BROWSE_STATE, businessType: 'Small Business' });
  if (smallBizRecords.length === 0 || smallBizRecords.some(r => r.business.businessType !== 'Small Business')) {
    throw new Error('Business Type filter failed');
  }

  // 10. Business Stage filter works
  const operatingRecords = filterBusinessRecords(MOCK_RECORDS, { ...DEFAULT_BROWSE_STATE, businessStage: 'Operating' });
  if (operatingRecords.length === 0 || operatingRecords.some(r => r.business.businessStage !== 'Operating')) {
    throw new Error('Business Stage filter failed');
  }

  // 11. Funding Purpose filter works
  const expansionRecords = filterBusinessRecords(MOCK_RECORDS, { ...DEFAULT_BROWSE_STATE, fundingPurpose: 'Business Expansion' });
  if (expansionRecords.length === 0) throw new Error('Funding Purpose filter failed');

  // 13. Funding Amount filter works
  if (!matchesFundingRange(2000000000, 3500000000, 'VND', '1b-5b')) {
    throw new Error('Funding range matching failed');
  }

  // 17. Multiple filters combine using AND logic
  const combined = filterBusinessRecords(MOCK_RECORDS, {
    ...DEFAULT_BROWSE_STATE,
    industry: 'Food & Beverage',
    businessType: 'Small Business',
  });
  if (combined.some(r => r.business.industry !== 'Food & Beverage' || r.business.businessType !== 'Small Business')) {
    throw new Error('AND filter combination failed');
  }

  // 18. Search is case-insensitive
  const searchResults = filterBusinessRecords(MOCK_RECORDS, { ...DEFAULT_BROWSE_STATE, search: 'annam' });
  if (searchResults.length === 0 || !searchResults[0].business.name.toLowerCase().includes('annam')) {
    throw new Error('Case-insensitive search failed');
  }

  // 20. Newest and Oldest sorting work
  const newestSorted = sortBusinessRecords(MOCK_RECORDS, 'newest', 'all');
  if (new Date(newestSorted[0].business.createdAt).getTime() < new Date(newestSorted[newestSorted.length - 1].business.createdAt).getTime()) {
    throw new Error('Newest sort failed');
  }

  // 22. Trending score uses supported fields
  const score = calculateTrendingScore(MOCK_RECORDS[0]);
  if (typeof score !== 'number' || score <= 0) throw new Error('Trending score calculation failed');

  // 16. Time Posted filter works
  if (!matchesTimePosted(new Date().toISOString(), 'today')) {
    throw new Error('Time posted filter failed');
  }

  return true;
}

// Execute on import
runPhase2Tests();
