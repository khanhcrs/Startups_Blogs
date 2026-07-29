import BusinessCard from '../business/BusinessCard';
export type { BusinessCardProps as StartupCardProps } from '../business/BusinessCard';

// Legacy adapter for StartupCard
const StartupCard = (props: any) => {
  // If passed legacy flat props, convert to BusinessOpportunityRecord shape
  const record = props.business ? props : {
    business: {
      id: props.id || '1',
      slug: props.id || '1',
      name: props.name || '',
      description: props.description || '',
      industry: props.category || props.industry || 'Technology',
      businessType: (props.businessType || 'Startup') as any,
      businessStage: (props.stage || 'Operating') as any,
      location: props.location || '',
      verified: props.verified ?? true,
      createdAt: props.createdAt || new Date().toISOString(),
      savedCount: props.likes || 0,
      commentCount: props.comments || 0,
      viewCount: 100,
    },
    opportunity: props.funding ? {
      id: `fo-${props.id}`,
      slug: `fo-${props.id}`,
      businessId: props.id || '1',
      businessName: props.name || '',
      title: props.description || '',
      shortDescription: props.description || '',
      fundingAmountMin: 1000000000,
      fundingAmountMax: 3000000000,
      currency: 'VND' as const,
      fundingPurpose: 'Business Expansion' as any,
      fundingType: 'Equity Investment' as any,
      status: 'Published' as const,
      publishedAt: props.createdAt || new Date().toISOString(),
    } : undefined
  };

  return <BusinessCard {...record} />;
};

export default StartupCard;
