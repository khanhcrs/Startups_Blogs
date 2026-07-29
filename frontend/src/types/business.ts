export type BusinessType = 
  | 'Small Business'
  | 'Startup'
  | 'Family Business'
  | 'Online Business'
  | 'Franchise'
  | 'Cooperative'
  | 'Social Enterprise'
  | 'Other';

export type BusinessStage = 
  | 'Idea'
  | 'Early Stage'
  | 'Operating'
  | 'Growing'
  | 'Expansion'
  | 'Mature';

export type FundingPurpose = 
  | 'Start Operations'
  | 'Working Capital'
  | 'Business Expansion'
  | 'Open New Location'
  | 'Purchase Equipment'
  | 'Product Development'
  | 'Marketing'
  | 'Digital Transformation'
  | 'Export Expansion'
  | 'Debt Refinancing';

export type FundingType = 
  | 'Equity Investment'
  | 'Business Loan'
  | 'Revenue Sharing'
  | 'Strategic Partnership'
  | 'Joint Venture'
  | 'Convertible Investment'
  | 'Asset Financing';

export type FundingOpportunityStatus = 
  | 'Draft'
  | 'Pending Review'
  | 'Changes Requested'
  | 'Rejected'
  | 'Published'
  | 'Closed'
  | 'Funded'
  | 'Archived'
  | 'Hidden';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
};

export type PublicFinancialHighlights = {
  revenueRange: string;
  growthRange: string;
  profitabilityStatus: string;
  reportingPeriod: string;
  currency: 'VND' | 'USD';
  selfReported: boolean;
};

export type Business = {
  id: string;
  slug: string;
  name: string;
  legalName?: string;
  logoUrl?: string;
  coverUrl?: string;
  description: string;
  detailedOverview?: string;
  industry: string;
  businessType: BusinessType;
  businessStage: BusinessStage;
  foundedYear?: number;
  yearsInOperation?: number;
  employeeRange?: string;
  location: string;
  operatingRegions?: string[];
  mainMarket?: string;
  businessModel?: string;
  verified: boolean;
  website?: string;
  productsOrServices?: string;
  createdAt: string;
  savedCount: number;
  commentCount: number;
  viewCount: number;
  teamMembers?: TeamMember[];
  financialHighlights?: PublicFinancialHighlights;
};

export type UseOfFundsItem = {
  category: string;
  percentage: number;
  description: string;
};

export type PublicDocument = {
  id: string;
  title: string;
  type: string;
  fileSize?: string;
  publicUrl?: string;
};

export type FundingOpportunity = {
  id: string;
  slug: string;
  businessId: string;
  businessName: string;
  businessLogo?: string;
  title: string;
  shortDescription: string;
  detailedOverview?: string;
  fundingAmountMin: number;
  fundingAmountMax: number;
  currency: 'VND' | 'USD';
  fundingPurpose: FundingPurpose;
  fundingType: FundingType;
  status: FundingOpportunityStatus;
  publishedAt: string;
  deadline?: string;
  timelineDescription?: string;
  useOfFunds?: UseOfFundsItem[];
  growthPlan?: {
    context: string;
    opportunity: string;
    plannedActivities: string;
    timeline: string;
    mainRisks: string;
  };
  publicDocuments?: PublicDocument[];
};

// Joined record for display in BusinessCard
export type BusinessOpportunityRecord = {
  business: Business;
  opportunity?: FundingOpportunity;
};

export type BusinessBrowseState = {
  search: string;
  industry: string;
  businessType: string;
  businessStage: string;
  fundingPurpose: string;
  fundingType: string;
  fundingRange: string;
  location: string;
  verified: string;
  postedWithin: string;
  tab: 'all' | 'trending' | 'recent' | 'following';
  sort: string;
  page: number;
};
