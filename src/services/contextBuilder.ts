/**
 * Context Builder Service
 * Aggregates application data and state to provide context to the AI chatbot
 */

import { mockPortfolioCompanies, mockKPIs, mockInsights } from '../lib/mockData';
import type { EvidenceChart } from '../types';

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
    .map((c) => `${c.customerName} ($${(c.creditExposure * 0.12).toFixed(2)}M)`)
    .join(', ');

  return `
PORTFOLIO SUMMARY:
- Total Companies: ${totalCompanies}
- Total Credit Exposure: $${(totalExposure * 0.12).toFixed(2)}M
- Delinquent Companies: ${delinquentCompanies}
- Watchlist Companies: ${watchlistCompanies}
- Top 5 Exposures: ${top5Companies}

KEY KPIs:
- NPA: ${mockKPIs.npa.value}% (${mockKPIs.npa.trend})
- PAR: ${mockKPIs.par.value}% (${mockKPIs.par.trend})
- Total Exposure: $${(mockKPIs.totalExposure.value / 1000000).toFixed(0)}M
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
  } else if (pathname.includes('/customer')) {
    pageContext = 'CURRENT PAGE: Customer View - Detailed list of all customers with filters';
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
- Credit Limit: $${(company.creditLimit * 0.12).toFixed(2)}M
- Credit Exposure: $${(company.creditExposure * 0.12).toFixed(2)}M
- Gross Credit Exposure: $${(company.grossCreditExposure * 0.12).toFixed(2)}M
- Undrawn Exposure: $${(company.undrawnExposure * 0.12).toFixed(2)}M
- Overdues: $${(company.overdues * 0.12).toFixed(2)}M

RISK PROFILE:
- Credit Status: ${company.creditStatus}
- Asset Classification: ${company.assetClass}
- External Rating: ${company.borrowerExternalRating}
- Internal Rating: ${company.borrowerInternalRating}
- Credit Score: ${company.borrowerCreditScore}
- Stage Classification: ${company.stageClassification}
- Security Status: ${company.securityStatus}
- Security Value: $${(company.securityValue * 0.12).toFixed(2)}M
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
 * Format evidence chart data for AI context
 */
export function formatEvidenceContext(evidenceCharts: EvidenceChart[], reportTitle?: string): string {
  if (!evidenceCharts || evidenceCharts.length === 0) {
    return '';
  }

  let context = '\n\n=== EVIDENCE REPORT CONTEXT ===\n\n';

  if (reportTitle) {
    context += `REPORT: ${reportTitle}\n\n`;
  }

  context += 'KEY INSIGHTS FROM DISPLAYED CHARTS:\n\n';

  evidenceCharts.forEach((chart, index) => {
    context += `Chart ${index + 1} - ${chart.title}:\n`;
    context += `Key Finding: ${chart.keyHighlight}\n`;

    // Add selective data points for critical charts
    if (chart.chartType === 'geo-map' && chart.data.length > 0) {
      // For geographic data, include top 3 critical locations
      const criticalCities = chart.data
        .filter((d: any) => d.riskLevel === 'critical')
        .slice(0, 3);

      if (criticalCities.length > 0) {
        context += 'Critical Locations:\n';
        criticalCities.forEach((city: any) => {
          context += `- ${city.city}: ${city.utilizationVelocity}% utilization velocity, $${city.exposureM}M exposure, ${city.avgCLTV}% avg CLTV, ${city.hpiChange}% HPI change\n`;
        });
      }
    } else if (chart.chartType === 'dual-axis' && chart.data.length > 0) {
      // For trend data, show current and projected values
      const recentData = chart.data.slice(-3); // Last 3 data points
      context += 'Recent Trend:\n';
      recentData.forEach((point: any) => {
        const keys = Object.keys(point).filter(k => k !== 'month' && k !== 'quarter');
        const values = keys.map(k => `${k}: ${point[k]}`).join(', ');
        context += `- ${point.month || point.quarter}: ${values}\n`;
      });
    } else if (chart.chartType === 'bar' && chart.config.series && chart.data.length > 0) {
      // For bar charts with multiple series, show latest values
      const latestData = chart.data[chart.data.length - 1];
      context += 'Latest Values:\n';
      chart.config.series.forEach((series: any) => {
        if (latestData[series.key] !== undefined) {
          context += `- ${series.name}: ${latestData[series.key]}\n`;
        }
      });
    }

    context += '\n';
  });

  context += 'IMPORTANT: Use this evidence data to provide specific, data-driven insights when answering questions. Reference specific numbers, locations, and trends from the charts above.\n';
  context += '\n=== END EVIDENCE REPORT CONTEXT ===';

  return context;
}

/**
 * Build complete application context for AI
 */
export function buildAppContext(
  pathname: string,
  filters: any,
  companyId?: string,
  evidenceCharts?: EvidenceChart[],
  evidenceTitle?: string
): string {
  let context = '=== CR360 APPLICATION CONTEXT ===\n\n';

  context += getCurrentPageContext(pathname, filters);
  context += '\n\n';
  context += getPortfolioContext();

  if (companyId) {
    context += '\n';
    context += getCompanyContext(companyId);
  }

  context += getTopInsights();

  // Add evidence context if provided
  if (evidenceCharts && evidenceCharts.length > 0) {
    context += formatEvidenceContext(evidenceCharts, evidenceTitle);
  }

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
