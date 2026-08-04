import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, SlidersHorizontal, Lock } from 'lucide-react';
import BusinessCard from '../components/business/BusinessCard';
import styles from './ExploreBusinesses.module.css';
import { MOCK_RECORDS } from '../utils/mockData';
import { 
  filterBusinessRecords, 
  sortBusinessRecords, 
  paginateRecords, 
  getUniqueIndustries, 
  getUniqueLocations 
} from '../utils/filterHelpers';
import type { BusinessBrowseState } from '../types/business';
import { api } from '../lib/axios';

// Accessible Dropdown Component
type DropdownProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

const Dropdown = ({ label, value, options, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);
  
  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = value === 'all' ? label : selectedOption?.label || label;

  return (
    <div className={styles.dropdownContainer} ref={containerRef}>
      <button 
        type="button"
        className={`${styles.filterDropdown} ${value !== 'all' ? styles.activeFilterButton : ''}`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {displayLabel} <ChevronDown size={16}/>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={value === opt.value}
              className={`${styles.dropdownItem} ${value === opt.value ? styles.activeDropdownItem : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ExploreBusinesses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [businesses, setBusinesses] = useState<any[]>([]);

  // Parse central state from URL search params
  const filters: BusinessBrowseState = useMemo(() => ({
    search: searchParams.get('search') || '',
    industry: searchParams.get('industry') || 'all',
    businessType: searchParams.get('businessType') || 'all',
    businessStage: searchParams.get('businessStage') || 'all',
    fundingPurpose: searchParams.get('fundingPurpose') || 'all',
    fundingType: searchParams.get('fundingType') || 'all',
    fundingRange: searchParams.get('fundingRange') || 'all',
    location: searchParams.get('location') || 'all',
    verified: searchParams.get('verified') || 'all',
    postedWithin: searchParams.get('postedWithin') || searchParams.get('posted') || 'all',
    tab: (searchParams.get('tab') as BusinessBrowseState['tab']) || 'all',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  }), [searchParams]);

  useEffect(() => {
    api.get('/businesses?take=100').then((res) => {
      // Map backend Prisma structure to BusinessOpportunityRecord structure
      const mapped = res.data.map((b: any) => ({
        business: b,
        opportunity: b.fundingOpportunities?.[0] // If they have an active funding opportunity
      }));
      // Merge with MOCK_RECORDS to keep UI rich for MVP if DB is empty
      setBusinesses([...mapped, ...MOCK_RECORDS]);
      setIsLoading(false);
    }).catch(err => {
      console.error('Failed to fetch businesses', err);
      setBusinesses(MOCK_RECORDS);
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
      newParams.set(key, String(value));
    }
    
    // Reset page to 1 on filter change
    if (key !== 'page') newParams.delete('page');
    
    setSearchParams(newParams, { replace: true });
  };

  const handleClearAll = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams(), { replace: true });
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

  // Pure logic calculations
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

  // Derive filter dropdown options
  const industryOptions = [
    { label: 'All Industries', value: 'all' },
    ...getUniqueIndustries(MOCK_RECORDS).map(ind => ({ label: ind, value: ind }))
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
    { label: 'Export Expansion', value: 'Export Expansion' },
  ];

  const rangeOptions = [
    { label: 'All Funding Amounts', value: 'all' },
    { label: 'Dưới 500 triệu VNĐ', value: 'under-500m' },
    { label: '500 triệu – 1 tỷ VNĐ', value: '500m-1b' },
    { label: '1 – 5 tỷ VNĐ', value: '1b-5b' },
    { label: '5 – 20 tỷ VNĐ', value: '5b-20b' },
    { label: 'Trên 20 tỷ VNĐ', value: 'over-20b' },
  ];

  const locationOptions = [
    { label: 'All Locations', value: 'all' },
    ...getUniqueLocations(MOCK_RECORDS).map(loc => ({ label: loc, value: loc }))
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
              src="/images/browse_hero_rocket.jpg" 
              alt="Businesses seeking investment" 
              className={styles.heroImage} 
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.filtersGroup}>
            <Dropdown label="Industry" value={filters.industry} options={industryOptions} onChange={(v) => updateFilter('industry', v)} />
            <Dropdown label="Business Type" value={filters.businessType} options={typeOptions} onChange={(v) => updateFilter('businessType', v)} />
            <Dropdown label="Business Stage" value={filters.businessStage} options={stageOptions} onChange={(v) => updateFilter('businessStage', v)} />
            <Dropdown label="Funding Purpose" value={filters.fundingPurpose} options={purposeOptions} onChange={(v) => updateFilter('fundingPurpose', v)} />
            <Dropdown label="Funding Amount" value={filters.fundingRange} options={rangeOptions} onChange={(v) => updateFilter('fundingRange', v)} />
            <Dropdown label="Location" value={filters.location} options={locationOptions} onChange={(v) => updateFilter('location', v)} />
            
            <button 
              type="button" 
              className={`${styles.filterDropdown} ${showMoreFilters ? styles.activeFilterButton : ''}`}
              onClick={() => setShowMoreFilters(!showMoreFilters)}
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
            <Dropdown label="Sort" value={filters.sort} options={sortOptions} onChange={(v) => updateFilter('sort', v)} />
          </div>
        </div>

        {/* Secondary Filter Row */}
        {showMoreFilters && (
          <div className={styles.secondaryToolbar} style={{ display: 'flex', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-4)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
            <Dropdown label="Funding Type" value={filters.fundingType} options={fundingTypeOptions} onChange={(v) => updateFilter('fundingType', v)} />
            <Dropdown label="Verified Status" value={filters.verified} options={verifiedOptions} onChange={(v) => updateFilter('verified', v)} />
            <Dropdown label="Time Posted" value={filters.postedWithin} options={timeOptions} onChange={(v) => updateFilter('postedWithin', v)} />
          </div>
        )}

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
                onClick={() => updateFilter('tab', tab.value)}
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
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading businesses...</p>
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
