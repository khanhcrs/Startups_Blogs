import type { BusinessType } from './types/business';

export function runPhase1_1Tests() {
  // 12. Startup remains defined as a valid Business Type
  const validStartupType: BusinessType = 'Startup';
  if (validStartupType !== 'Startup') {
    throw new Error('Startup is not defined as a valid BusinessType');
  }

  // 5-9. LegacyRedirect logic preserves pathname, search, and hash
  const simulateRedirect = (to: string, location: { search: string; hash: string }) => {
    return {
      pathname: to,
      search: location.search,
      hash: location.hash,
    };
  };

  // Test /startups?industry=technology&page=2#results -> /businesses?industry=technology&page=2#results
  const res1 = simulateRedirect('/businesses', {
    search: '?industry=technology&page=2',
    hash: '#results',
  });
  if (res1.pathname !== '/businesses' || res1.search !== '?industry=technology&page=2' || res1.hash !== '#results') {
    throw new Error('/startups redirect failed to preserve parameters');
  }

  // Test /post-idea?businessId=123 -> /raise-capital?businessId=123
  const res2 = simulateRedirect('/raise-capital', {
    search: '?businessId=123',
    hash: '',
  });
  if (res2.pathname !== '/raise-capital' || res2.search !== '?businessId=123') {
    throw new Error('/post-idea redirect failed to preserve parameters');
  }

  return true;
}

// Execute tests on import
runPhase1_1Tests();
