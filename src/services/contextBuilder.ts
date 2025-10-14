/**
 * Context Builder Service
 * Aggregates application data and state to provide context to the AI chatbot
 */

import { mockPortfolioCompanies, mockKPIs, mockInsights } from '../lib/mockData';

/**
 * Get portfolio summary context
 */
export function getPortfolioContext(): string {
  const totalCompanies = mockPortfolioCompanies.length;
  const totalExposure = mockPortfolioCompanies.reduce(
    (sum, company) => sum + company.creditExposure,
    0
  );

  // Calculate key metrics
  const delinquentCompanies = mockPortfolioCompanies.filter(
    (c) => c.creditStatus === 'Delinquent'
  ).length;
  const watchlistCompanies = mockPortfolioCompanies.filter(
    (c) => c.creditStatus === 'Watchlist'
  ).length;

  // Get top 5 companies by exposure
  const top5Companies = [...mockPortfolioCompanies]
    .sort((a, b) => b.creditExposure - a.creditExposure)
    .slice(0, 5)
    .map((c) => `${c.customerName} (₹${c.creditExposure.toFixed(2)} Cr)`)
    .join(', ');

  return `
PORTFOLIO SUMMARY:
- Total Companies: ${totalCompanies}
- Total Credit Exposure: ₹${totalExposure.toFixed(2)} Cr
- Delinquent Companies: ${delinquentCompanies}
- Watchlist Companies: ${watchlistCompanies}
- Top 5 Exposures: ${top5Companies}

KEY KPIs:
- NPA: ${mockKPIs.npa.value}% (${mockKPIs.npa.trend})
- PAR: ${mockKPIs.par.value}% (${mockKPIs.par.trend})
- Total Exposure: ₹${(mockKPIs.totalExposure.value / 10000000).toFixed(0)} Cr
- Delinquency Rate: ${mockKPIs.delinquency.value}%
- Utilization: ${mockKPIs.utilization.value}%
- RAROC: ${mockKPIs.raroc.value}%
`;
}

/**
 * Get current page context based on the URL
 */
export function getCurrentPageContext(pathname: string, filters: any): string {
  let pageContext = '';

  if (pathname === '/' || pathname.includes('/dashboard')) {
    pageContext = 'CURRENT PAGE: Dashboard - Overview of portfolio health, trends, and top exposures';
  } else if (pathname.includes('/portfolio')) {
    pageContext = 'CURRENT PAGE: Portfolio View - Detailed list of all portfolio companies with filters';
  } else if (pathname.includes('/company/')) {
    const companyId = pathname.split('/company/')[1]?.split('/')[0];
    const company = mockPortfolioCompanies.find((c) => c.id === companyId);
    if (company) {
      pageContext = `CURRENT PAGE: Company Profile - ${company.customerName}`;
    }
  } else if (pathname.includes('/risk-details')) {
    pageContext = 'CURRENT PAGE: Risk Details - Credit risk metrics and ratings';
  } else if (pathname.includes('/exposure-details')) {
    pageContext = 'CURRENT PAGE: Exposure Details - Credit limits, drawdowns, and account details';
  } else if (pathname.includes('/group-exposures')) {
    pageContext = 'CURRENT PAGE: Group Exposures - Consolidated group-level exposure data';
  } else if (pathname.includes('/profitability')) {
    pageContext = 'CURRENT PAGE: Profitability - Customer profitability metrics and income statement';
  } else if (pathname.includes('/climate-risk')) {
    pageContext = 'CURRENT PAGE: Climate Risk - Emissions data and climate risk scores';
  } else if (pathname.includes('/approvals')) {
    pageContext = 'CURRENT PAGE: KYC & Compliance - Adverse media scans and compliance summary';
  }

  // Add filter information if any filters are active
  if (filters) {
    const activeFilters = [];
    if (filters.lob && filters.lob.length > 0) {
      activeFilters.push(`Line of Business: ${filters.lob.join(', ')}`);
    }
    if (filters.partyType && filters.partyType.length > 0) {
      activeFilters.push(`Party Type: ${filters.partyType.join(', ')}`);
    }
    if (filters.rating && filters.rating.length > 0) {
      activeFilters.push(`Rating: ${filters.rating.join(', ')}`);
    }
    if (filters.assetClassification && filters.assetClassification.length > 0) {
      activeFilters.push(`Asset Classification: ${filters.assetClassification.join(', ')}`);
    }

    if (activeFilters.length > 0) {
      pageContext += `\nACTIVE FILTERS: ${activeFilters.join(' | ')}`;
    }
  }

  return pageContext;
}

/**
 * Get context for a specific company
 */
export function getCompanyContext(companyId: string): string {
  const company = mockPortfolioCompanies.find((c) => c.id === companyId);

  if (!company) {
    return 'No company selected';
  }

  return `
SELECTED COMPANY: ${company.customerName}
- Customer ID: ${company.custId}
- Party Type: ${company.partyType}
- Group: ${company.group}
- Industry: ${company.industry}
- Line of Business: ${company.lineOfBusiness}
- Organization Structure: ${company.orgStructure}
- Region: ${company.region}

FINANCIAL DETAILS:
- Credit Limit: ₹${company.creditLimit.toFixed(2)} Cr
- Credit Exposure: ₹${company.creditExposure.toFixed(2)} Cr
- Gross Credit Exposure: ₹${company.grossCreditExposure.toFixed(2)} Cr
- Undrawn Exposure: ₹${company.undrawnExposure.toFixed(2)} Cr
- Overdues: ₹${company.overdues.toFixed(2)} Cr

RISK PROFILE:
- Credit Status: ${company.creditStatus}
- Asset Classification: ${company.assetClass}
- External Rating: ${company.borrowerExternalRating}
- Internal Rating: ${company.borrowerInternalRating}
- Credit Score: ${company.borrowerCreditScore}
- Stage Classification: ${company.stageClassification}
- Security Status: ${company.securityStatus}
- Security Value: ₹${company.securityValue.toFixed(2)} Cr
`;
}

/**
 * Get top insights from the current view
 */
export function getTopInsights(limit: number = 3): string {
  const recentInsights = mockInsights
    .filter((i) => i.severity === 'critical' || i.severity === 'warning')
    .slice(0, limit);

  if (recentInsights.length === 0) {
    return '';
  }

  const insightTexts = recentInsights.map(
    (insight, idx) => `${idx + 1}. [${insight.severity.toUpperCase()}] ${insight.title}: ${insight.description}`
  );

  return `\nTOP INSIGHTS:\n${insightTexts.join('\n')}`;
}

/**
 * Build complete application context for AI
 */
export function buildAppContext(pathname: string, filters: any, companyId?: string): string {
  let context = '=== CR360 APPLICATION CONTEXT ===\n\n';

  context += getCurrentPageContext(pathname, filters);
  context += '\n\n';
  context += getPortfolioContext();

  if (companyId) {
    context += '\n';
    context += getCompanyContext(companyId);
  }

  context += getTopInsights();

  context += '\n\n=== END CONTEXT ===';

  return context;
}

/**
 * Get available data categories for the AI to reference
 */
export function getDataCategories(): string {
  return `
AVAILABLE DATA IN CR360 APPLICATION:

1. PORTFOLIO DATA:
   - 50 companies with complete financial profiles
   - Credit exposures, limits, and utilization
   - Risk grades and classifications
   - Geographic and segment distribution

2. RISK METRICS:
   - Credit ratings (external and internal)
   - Credit scores and risk classifications
   - Probability of Default (PD), Loss Given Default (LGD)
   - Expected Credit Loss (ECL)
   - Risk Weight Assets (RWA)

3. EXPOSURE DETAILS:
   - Account-level details
   - Hierarchical exposure breakdown (Banking Book, Trading Book)
   - Trends over 18 months
   - Contract summaries

4. GROUP EXPOSURES:
   - Group-level aggregations
   - Member company details
   - Parent entity relationships

5. KYC & COMPLIANCE:
   - Adverse media scans
   - Watch list screening
   - Risk score history
   - Compliance case tracking

6. PROFITABILITY:
   - Customer profitability metrics
   - Income statements
   - Banking profile details

7. CLIMATE RISK:
   - Emissions data (Scope 1, 2, 3)
   - Climate risk scores and ratings
   - Peer comparisons
   - Industry benchmarks

8. KEY INSIGHTS:
   - AI-generated insights across all metrics
   - Trend analysis and anomaly detection
   - Risk alerts and opportunities
`;
}
