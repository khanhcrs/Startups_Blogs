import { useState, useEffect, useMemo } from 'react';
import type { BusinessOpportunityRecord } from '../types/business';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Lock } from 'lucide-react';
import BusinessCard from '../components/business/BusinessCard';
import BusinessSkeleton from '../components/business/BusinessSkeleton';
import styles from './ExploreBusinesses.module.css';
import { 
  filterBusinessRecords, 
  sortBusinessRecords, 
  paginateRecords, 
  getUniqueIndustries, 
  getUniqueLocations 
} from '../utils/filterHelpers';
import type { BusinessBrowseState } from '../types/business';
import { api } from '../lib/axios';
import toast from 'react-hot-toast';
import FilterDropdown from '../components/FilterDropdown';

const ExploreBusinesses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [businesses, setBusinesses] = useState<BusinessOpportunityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  
  // Single active open dropdown management
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const handleToggleDropdown = (id: string) => {
    setActiveDropdownId((prev) => (prev === id ? null : id));
  };

  const filters = useMemo<BusinessBrowseState>(() => ({
    search: searchParams.get('search') || '',
    industry: searchParams.get('industry') || 'all',
    businessType: searchParams.get('businessType') || 'all',
    businessStage: searchParams.get('businessStage') || 'all',
    fundingPurpose: searchParams.get('fundingPurpose') || 'all',
    fundingType: searchParams.get('fundingType') || 'all',
    fundingRange: searchParams.get('fundingRange') || 'all',
    location: searchParams.get('location') || 'all',
    verified: searchParams.get('verified') || 'all',
    postedWithin: searchParams.get('postedWithin') || 'all',
    tab: (searchParams.get('tab') as BusinessBrowseState['tab']) || 'all',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  }), [searchParams]);

  useEffect(() => {
    api.get('/businesses?take=100').then((res) => {
      const mapped = res.data.map((b: any) => ({
        business: b,
        opportunity: b.fundingOpportunities?.[0]
      }));
      setBusinesses(mapped);
      setIsLoading(false);
    }).catch(err => {
      console.error('Failed to fetch businesses', err);
      toast.error('Failed to load businesses. Please try again later.');
      setBusinesses([]);
      setIsLoading(false);
    });
  }, []);

  // Sync Search Input to URL with 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter('search', searchInput);
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const updateFilter = (key: keyof BusinessBrowseState, value: string | number) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === 'all' || value === '' || value === 1) {
      newParams.delete(key);
    } else {
      newParams.set(key, value.toString());
    }
    
    if (key !== 'page' && key !== 'tab' && key !== 'sort') {
      newParams.delete('page');
    }
    
    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    const newParams = new URLSearchParams();
    if (searchParams.has('tab')) newParams.set('tab', searchParams.get('tab')!);
    if (searchParams.has('sort')) newParams.set('sort', searchParams.get('sort')!);
    setSearchParams(newParams);
    setSearchInput('');
    setActiveDropdownId(null);
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.industry !== 'all' ||
    filters.businessType !== 'all' ||
    filters.businessStage !== 'all' ||
    filters.fundingPurpose !== 'all' ||
    filters.fundingType !== 'all' ||
    filters.fundingRange !== 'all' ||
    filters.location !== 'all' ||
    filters.verified !== 'all' ||
    filters.postedWithin !== 'all' ||
    filters.tab !== 'all' ||
    filters.sort !== 'newest';

  const filteredData = useMemo(() => filterBusinessRecords(businesses, filters), [businesses, filters]);
  const sortedData = useMemo(() => sortBusinessRecords(filteredData, filters.sort, filters.tab), [filteredData, filters.sort, filters.tab]);
  
  const LIMIT = 9;
  const totalResults = sortedData.length;
  const totalPages = Math.ceil(totalResults / LIMIT) || 1;
  const safePage = Math.min(Math.max(1, filters.page), totalPages);

  const paginatedData = useMemo(() => paginateRecords(sortedData, safePage, LIMIT), [sortedData, safePage]);

  const handlePageChange = (newPage: number) => {
    updateFilter('page', newPage);
    document.querySelector('.gridHeading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const industryOptions = [
    { label: 'All Industries', value: 'all' },
    ...getUniqueIndustries(businesses).map(ind => ({ label: ind, value: ind }))
  ];

  const typeOptions = [
    { label: 'All Business Types', value: 'all' },
    { label: 'Small Business', value: 'Small Business' },
    { label: 'Startup', value: 'Startup' },
    { label: 'Family Business', value: 'Family Business' },
    { label: 'Online Business', value: 'Online Business' },
    { label: 'Franchise', value: 'Franchise' },
    { label: 'Cooperative', value: 'Cooperative' },
    { label: 'Social Enterprise', value: 'Social Enterprise' },
  ];

  const stageOptions = [
    { label: 'All Stages', value: 'all' },
    { label: 'Idea', value: 'Idea' },
    { label: 'Early Stage', value: 'Early Stage' },
    { label: 'Operating', value: 'Operating' },
    { label: 'Growing', value: 'Growing' },
    { label: 'Expansion', value: 'Expansion' },
    { label: 'Mature', value: 'Mature' },
  ];

  const purposeOptions = [
    { label: 'All Purposes', value: 'all' },
    { label: 'Start Operations', value: 'Start Operations' },
    { label: 'Working Capital', value: 'Working Capital' },
    { label: 'Business Expansion', value: 'Business Expansion' },
    { label: 'Open New Location', value: 'Open New Location' },
    { label: 'Purchase Equipment', value: 'Purchase Equipment' },
    { label: 'Product Development', value: 'Product Development' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Digital Transformation', value: 'Digital Transformation' },
  ];

  const fundingTypeOptions = [
    { label: 'All Funding Types', value: 'all' },
    { label: 'Equity Investment', value: 'Equity Investment' },
    { label: 'Business Loan', value: 'Business Loan' },
    { label: 'Revenue Sharing', value: 'Revenue Sharing' },
    { label: 'Strategic Partnership', value: 'Strategic Partnership' },
    { label: 'Joint Venture', value: 'Joint Venture' },
    { label: 'Convertible Investment', value: 'Convertible Investment' },
    { label: 'Asset Financing', value: 'Asset Financing' },
  ];

  const verifiedOptions = [
    { label: 'All Verification', value: 'all' },
    { label: 'Verified Only', value: 'verified' },
  ];

  const rangeOptions = [
    { label: 'Any Amount', value: 'all' },
    { label: 'Under 1B VND', value: 'under-1b' },
    { label: '1B - 5B VND', value: '1b-5b' },
    { label: '5B - 10B VND', value: '5b-10b' },
    { label: 'Over 10B VND', value: 'over-10b' },
  ];

  const locationOptions = [
    { label: 'All Locations', value: 'all' },
    ...getUniqueLocations(businesses).map(loc => ({ label: loc, value: loc }))
  ];

  const timeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7-days' },
    { label: 'Last 30 Days', value: '30-days' },
    { label: 'Last 365 Days', value: '365-days' },
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Most Saved', value: 'mostSaved' },
    { label: 'Most Viewed', value: 'mostViewed' },
    { label: 'Most Discussed', value: 'mostDiscussed' },
    { label: 'Funding: Low to High', value: 'fundingLowHigh' },
    { label: 'Funding: High to Low', value: 'fundingHighLow' },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Explore Businesses</h1>
            <p className={styles.subtitle}>Discover small businesses, startups and growing companies seeking investment or strategic partnerships.</p>
            
            <form 
              className={styles.searchBox} 
              onSubmit={(e) => { e.preventDefault(); updateFilter('search', searchInput); }}
            >
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input 
                  type="text" 
                  placeholder="Search businesses, opportunities, industries or locations..." 
                  className={styles.searchInput} 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.searchBtn}>Search</button>
            </form>
          </div>
          <div className={styles.heroImageWrapper}>
            <img 
              translate="no"
              className={`${styles.heroImage} notranslate`}
              src="/images/browse_hero_rocket.jpg" 
              alt="Businesses seeking investment" 
            />
          </div>
        </div>

        {/* Filter Area Wrapper */}
        <div className={styles.filterAreaWrapper}>
          {/* Main Filter Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.filtersGroup}>
              <FilterDropdown 
                id="industry"
                label="Industry" 
                value={filters.industry} 
                options={industryOptions} 
                onChange={(v) => updateFilter('industry', v)} 
                isOpen={activeDropdownId === 'industry'}
                onToggle={handleToggleDropdown}
              />
              <FilterDropdown 
                id="businessType"
                label="Business Type" 
                value={filters.businessType} 
                options={typeOptions} 
                onChange={(v) => updateFilter('businessType', v)} 
                isOpen={activeDropdownId === 'businessType'}
                onToggle={handleToggleDropdown}
              />
              <FilterDropdown 
                id="businessStage"
                label="Business Stage" 
                value={filters.businessStage} 
                options={stageOptions} 
                onChange={(v) => updateFilter('businessStage', v)} 
                isOpen={activeDropdownId === 'businessStage'}
                onToggle={handleToggleDropdown}
              />
              <FilterDropdown 
                id="fundingPurpose"
                label="Funding Purpose" 
                value={filters.fundingPurpose} 
                options={purposeOptions} 
                onChange={(v) => updateFilter('fundingPurpose', v)} 
                isOpen={activeDropdownId === 'fundingPurpose'}
                onToggle={handleToggleDropdown}
              />
              <FilterDropdown 
                id="fundingRange"
                label="Funding Amount" 
                value={filters.fundingRange} 
                options={rangeOptions} 
                onChange={(v) => updateFilter('fundingRange', v)} 
                isOpen={activeDropdownId === 'fundingRange'}
                onToggle={handleToggleDropdown}
              />
              <FilterDropdown 
                id="location"
                label="Location" 
                value={filters.location} 
                options={locationOptions} 
                onChange={(v) => updateFilter('location', v)} 
                isOpen={activeDropdownId === 'location'}
                onToggle={handleToggleDropdown}
              />
              
              <button 
                type="button" 
                className={`${styles.filterDropdown} ${showMoreFilters ? styles.activeFilterButton : ''}`}
                onClick={() => {
                  setActiveDropdownId(null);
                  setShowMoreFilters(!showMoreFilters);
                }}
              >
                <SlidersHorizontal size={16} /> More Filters
              </button>

              {hasActiveFilters && (
                <button 
                  type="button" 
                  className={styles.clearBtn} 
                  onClick={handleClearAll}
                  style={{ background: 'transparent', color: 'var(--text-muted)' }}
                >
                  Clear all
                </button>
              )}
            </div>
            <div className={styles.sortGroup}>
              <span className={styles.sortLabel}>Sort by:</span>
              <FilterDropdown 
                id="sort"
                label="Sort" 
                value={filters.sort} 
                options={sortOptions} 
                onChange={(v) => updateFilter('sort', v)} 
                isOpen={activeDropdownId === 'sort'}
                onToggle={handleToggleDropdown}
                alignRight
              />
            </div>
          </div>

          {/* Secondary Filter Row */}
          {showMoreFilters && (
            <div className={styles.secondaryToolbar} style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)', padding: 'var(--spacing-4)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
              <FilterDropdown 
                id="fundingType"
                label="Funding Type" 
                value={filters.fundingType} 
                options={fundingTypeOptions} 
                onChange={(v) => updateFilter('fundingType', v)} 
                isOpen={activeDropdownId === 'fundingType'}
                onToggle={handleToggleDropdown}
              />
              <FilterDropdown 
                id="verified"
                label="Verified Status" 
                value={filters.verified} 
                options={verifiedOptions} 
                onChange={(v) => updateFilter('verified', v)} 
                isOpen={activeDropdownId === 'verified'}
                onToggle={handleToggleDropdown}
              />
              <FilterDropdown 
                id="postedWithin"
                label="Time Posted" 
                value={filters.postedWithin} 
                options={timeOptions} 
                onChange={(v) => updateFilter('postedWithin', v)} 
                isOpen={activeDropdownId === 'postedWithin'}
                onToggle={handleToggleDropdown}
              />
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            {[
              { label: 'All', value: 'all' },
              { label: 'Trending', value: 'trending' },
              { label: 'Recently Added', value: 'recent' },
              { label: 'Following', value: 'following' }
            ].map(tab => (
              <button 
                key={tab.value}
                type="button"
                className={`${styles.tabBtn} ${filters.tab === tab.value ? styles.activeTab : ''}`}
                onClick={() => {
                  setActiveDropdownId(null);
                  updateFilter('tab', tab.value);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        {!isLoading && filters.tab !== 'following' && (
          <div className={styles.resultsInfo + " gridHeading"}>
            <p><strong>{totalResults}</strong> {totalResults === 1 ? 'business' : 'businesses'} found</p>
          </div>
        )}

        {/* Grid & States */}
        <div className={styles.gridContainer}>
          {isLoading ? (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <BusinessSkeleton key={idx} />
              ))}
            </div>
          ) : filters.tab === 'following' ? (
            <div className={styles.emptyState}>
              <Lock size={48} className={styles.emptyIcon} />
              <h3>Sign in to view businesses you follow.</h3>
              <p>Create an account or log in to track businesses and receive updates.</p>
              <button className={styles.clearBtn} onClick={() => updateFilter('tab', 'all')} style={{ backgroundColor: 'var(--primary-500)', color: 'white', padding: 'var(--spacing-2) var(--spacing-6)' }}>
                Explore All Businesses
              </button>
            </div>
          ) : totalResults === 0 ? (
            <div className={styles.emptyState}>
              <Search size={48} className={styles.emptyIcon} />
              <h3>No businesses match your current filters.</h3>
              <p>Try adjusting your search terms or clearing some filters.</p>
              <button className={styles.clearBtn} onClick={handleClearAll} style={{ backgroundColor: 'var(--bg-accent)', padding: 'var(--spacing-2) var(--spacing-6)' }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {paginatedData.map(record => (
                  <BusinessCard key={record.business.id} {...record} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    type="button"
                    className={styles.pageBtn} 
                    disabled={safePage === 1}
                    onClick={() => handlePageChange(safePage - 1)}
                    style={{ opacity: safePage === 1 ? 0.5 : 1, cursor: safePage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    Previous
                  </button>
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1;
                      if (p === 1 || p === totalPages || (p >= safePage - 1 && p <= safePage + 1)) {
                        return (
                          <button 
                            key={p}
                            type="button"
                            className={`${styles.pageNum} ${p === safePage ? styles.activePage : ''}`}
                            onClick={() => handlePageChange(p)}
                          >
                            {p}
                          </button>
                        );
                      }
                      if (p === safePage - 2 || p === safePage + 2) {
                        return <span key={p} className={styles.pageEllipsis}>...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button 
                    type="button"
                    className={styles.pageBtn}
                    disabled={safePage === totalPages}
                    onClick={() => handlePageChange(safePage + 1)}
                    style={{ opacity: safePage === totalPages ? 0.5 : 1, cursor: safePage === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExploreBusinesses;
