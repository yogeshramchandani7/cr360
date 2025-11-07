import type { NewsItem } from '../types';
import { mockPortfolioCompanies } from './mockData';

/**
 * Get top companies by concentration for news linking
 */
function getTopCompanies(limit: number = 20): string[] {
  return mockPortfolioCompanies
    .sort((a, b) => b.grossCreditExposure - a.grossCreditExposure)
    .slice(0, limit)
    .map(company => company.customerName);
}

const topCompanies = getTopCompanies(20);

/**
 * Mock News Items linked to portfolio companies and macro indicators
 *
 * Categories:
 * - top-exposure: News about companies in the top 20 exposures
 * - macro: Macroeconomic news related to indicators
 * - sector: Industry/sector-specific news
 * - insight-related: News that relates to insights or KPIs
 */

export const mockNewsItems: NewsItem[] = [
  // Top Exposure News
  {
    id: 'news-001',
    title: `${topCompanies[0]} Reports Q3 Earnings Miss`,
    summary: 'Company missed earnings expectations by 12%, citing supply chain disruptions and rising input costs.',
    source: 'Bloomberg',
    timestamp: new Date('2025-10-30T08:30:00Z'),
    category: 'top-exposure',
    relatedCompanies: [topCompanies[0]],
    severity: 'warning'
  },
  {
    id: 'news-002',
    title: `${topCompanies[2]} Announces Major Expansion Plans`,
    summary: 'Company plans $500M capital expenditure for facility expansion, signaling strong growth outlook.',
    source: 'Reuters',
    timestamp: new Date('2025-10-30T10:15:00Z'),
    category: 'top-exposure',
    relatedCompanies: [topCompanies[2]],
    severity: 'info'
  },
  {
    id: 'news-003',
    title: `${topCompanies[4]} Faces Regulatory Investigation`,
    summary: 'Federal authorities launch investigation into compliance issues, stock down 8% in pre-market trading.',
    source: 'Wall Street Journal',
    timestamp: new Date('2025-10-29T16:45:00Z'),
    category: 'top-exposure',
    relatedCompanies: [topCompanies[4]],
    severity: 'critical'
  },
  {
    id: 'news-004',
    title: `${topCompanies[1]} and ${topCompanies[6]} Announce Strategic Partnership`,
    summary: 'Two major portfolio companies form joint venture to expand market reach in emerging sectors.',
    source: 'CNBC',
    timestamp: new Date('2025-10-29T14:20:00Z'),
    category: 'top-exposure',
    relatedCompanies: [topCompanies[1], topCompanies[6]],
    severity: 'info'
  },

  // Macro News
  {
    id: 'news-005',
    title: 'Fed Signals Potential Rate Cuts in Q2 2025',
    summary: 'Federal Reserve minutes indicate officials may consider rate reductions if inflation continues moderating.',
    source: 'Federal Reserve',
    timestamp: new Date('2025-10-30T14:00:00Z'),
    category: 'macro',
    relatedIndicators: ['fed_funds_rate', 'inflation_rate'],
    severity: 'info'
  },
  {
    id: 'news-006',
    title: 'Treasury Yields Drop on Recession Fears',
    summary: '10-year Treasury yields fall 15 basis points amid concerns about economic slowdown and weak job data.',
    source: 'MarketWatch',
    timestamp: new Date('2025-10-30T11:30:00Z'),
    category: 'macro',
    relatedIndicators: ['treasury_10y', 'unemployment_rate'],
    severity: 'warning'
  },
  {
    id: 'news-007',
    title: 'Inflation Remains Sticky Above 3% Target',
    summary: 'CPI data shows inflation at 3.9%, driven by persistent shelter costs and energy prices.',
    source: 'Bureau of Labor Statistics',
    timestamp: new Date('2025-10-29T08:30:00Z'),
    category: 'macro',
    relatedIndicators: ['inflation_rate'],
    severity: 'critical'
  },
  {
    id: 'news-008',
    title: 'Credit Spreads Widen on Market Volatility',
    summary: 'BBB-rated corporate bond spreads increase 20 bps as investors seek higher risk premiums.',
    source: 'Financial Times',
    timestamp: new Date('2025-10-29T13:00:00Z'),
    category: 'macro',
    relatedIndicators: ['bbb_credit_spread'],
    severity: 'warning'
  },

  // Sector News
  {
    id: 'news-009',
    title: 'Real Estate Sector Faces Liquidity Pressures',
    summary: 'Commercial real estate developers report cash flow challenges as refinancing costs surge.',
    source: 'Commercial Observer',
    timestamp: new Date('2025-10-28T15:30:00Z'),
    category: 'sector',
    relatedCompanies: [topCompanies[3], topCompanies[7]],
    severity: 'critical'
  },
  {
    id: 'news-010',
    title: 'Energy Sector Posts Strong Q3 Performance',
    summary: 'Oil and gas companies report robust earnings on increased production and stable prices.',
    source: 'Energy Intelligence',
    timestamp: new Date('2025-10-28T10:00:00Z'),
    category: 'sector',
    relatedCompanies: [topCompanies[5]],
    severity: 'info'
  },
  {
    id: 'news-011',
    title: 'Manufacturing Output Declines for Third Consecutive Month',
    summary: 'Industrial production falls 0.8%, signaling potential slowdown in manufacturing sector.',
    source: 'Manufacturing.net',
    timestamp: new Date('2025-10-27T12:00:00Z'),
    category: 'sector',
    relatedCompanies: [topCompanies[8], topCompanies[9]],
    severity: 'warning'
  },

  // Insight-Related News
  {
    id: 'news-012',
    title: 'Credit Quality Deterioration Accelerates Across Portfolio',
    summary: 'Multiple borrowers downgraded as macroeconomic headwinds intensify, particularly in rate-sensitive sectors.',
    source: 'Internal Credit Research',
    timestamp: new Date('2025-10-30T09:00:00Z'),
    category: 'insight-related',
    relatedIndicators: ['fed_funds_rate', 'bbb_credit_spread'],
    relatedCompanies: [topCompanies[0], topCompanies[3], topCompanies[4]],
    severity: 'critical'
  },
  {
    id: 'news-013',
    title: `${topCompanies[10]} Misses Debt Covenant Ratios`,
    summary: 'Company breaches leverage covenant in Q3, triggering discussions with lenders about waiver.',
    source: 'S&P Global',
    timestamp: new Date('2025-10-27T16:00:00Z'),
    category: 'insight-related',
    relatedCompanies: [topCompanies[10]],
    severity: 'critical'
  },
  {
    id: 'news-014',
    title: 'Rising Delinquencies in Digital Channel Originations',
    summary: 'Internal analysis shows 30-day delinquency rates 40% higher for digital channel vs. branch originations.',
    source: 'Internal Risk Analytics',
    timestamp: new Date('2025-10-26T11:00:00Z'),
    category: 'insight-related',
    severity: 'warning'
  },
  {
    id: 'news-015',
    title: 'New Basel IV Capital Requirements Finalized',
    summary: 'Regulators publish final rules requiring higher capital buffers for credit risk, effective 2026.',
    source: 'Federal Reserve',
    timestamp: new Date('2025-10-25T14:00:00Z'),
    category: 'macro',
    severity: 'warning'
  }
];

/**
 * Get all news items
 */
export function getNewsItems(): NewsItem[] {
  return mockNewsItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Get news items by category
 */
export function getNewsByCategory(category: NewsItem['category']): NewsItem[] {
  return mockNewsItems
    .filter(item => item.category === category)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Get news items by severity
 */
export function getNewsBySeverity(severity: 'critical' | 'warning' | 'info'): NewsItem[] {
  return mockNewsItems
    .filter(item => item.severity === severity)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Get news items related to specific companies
 */
export function getNewsByCompany(companyName: string): NewsItem[] {
  return mockNewsItems
    .filter(item => item.relatedCompanies?.includes(companyName))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Get news items related to specific indicators
 */
export function getNewsByIndicator(indicatorId: string): NewsItem[] {
  return mockNewsItems
    .filter(item => item.relatedIndicators?.includes(indicatorId))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Format relative timestamp (e.g., "2h ago", "1d ago")
 */
export function getRelativeTime(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

/**
 * Get company ID by customer name for navigation
 */
export function getCompanyIdByName(customerName: string): string | undefined {
  const company = mockPortfolioCompanies.find(
    c => c.customerName === customerName
  );
  return company?.id;
}
