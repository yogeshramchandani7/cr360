import type { KPIChart, AdvancedKPI } from '../types';
import type { PortfolioCompany } from './mockData';
import {
  generateMock30DayDelinquencyData,
  generateMock12MonthMortalityData,
  generateMockOriginationQualityData,
  generateMockExceptionData,
  generateMockChannelPerformanceData,
  generateDeteriorationIndicators,
  generateCMITrendData,
  generateSectorComparisonData,
  generateHeatmapData,
  generateMigrationMatrixData,
} from './mockCCOData';

/**
 * Chart data generators for KPI drilldown modals
 * Each function returns an array of 3-4 charts specific to that KPI
 *
 * Updated to support dynamic chart generation from filtered company data
 */

// ============================================================================
// Helper Functions for Dynamic Chart Generation
// ============================================================================

/**
 * Group companies by a field and calculate aggregated metrics
 */
function groupCompaniesByField<T extends keyof PortfolioCompany>(
  companies: PortfolioCompany[],
  field: T
): Map<string, { companies: PortfolioCompany[]; exposure: number; count: number }> {
  const groups = new Map<string, { companies: PortfolioCompany[]; exposure: number; count: number }>();

  companies.forEach((company) => {
    const key = String(company[field]);
    const existing = groups.get(key) || { companies: [], exposure: 0, count: 0 };
    existing.companies.push(company);
    existing.exposure += company.creditExposure * 1000000;
    existing.count += 1;
    groups.set(key, existing);
  });

  return groups;
}

/**
 * Calculate total exposure from companies
 */
function getTotalExposure(companies: PortfolioCompany[]): number {
  return companies.reduce((sum, c) => sum + c.creditExposure * 1000000, 0);
}


/**
 * Filter companies by vintage (recent loans, ≤6 months for mortality)
 */
function getEarlyDelinquent(companies: PortfolioCompany[]): PortfolioCompany[] {
  // Simplified: companies with overdues and high utilization (proxy for new loans going bad)
  return companies.filter(c => {
    const utilization = c.creditLimit > 0 ? (c.creditExposure / c.creditLimit) : 0;
    return c.overdues > 0 && utilization > 0.5;
  });
}

// ============================================================================
// Quick Mortality - Additional Helper Functions
// ============================================================================

/**
 * Group data by US state (California, Texas, New York, Florida, Illinois)
 */
function groupByState(companies: PortfolioCompany[]) {
  // Use 5 specific US states
  const usStates = ['California', 'Texas', 'New York', 'Florida', 'Illinois'];

  const stateData: Record<string, {
    companies: PortfolioCompany[];
    exposure: number;
    count: number;
    delinquentCount: number
  }> = {};

  // Initialize all 5 states
  usStates.forEach(state => {
    stateData[state] = { companies: [], exposure: 0, count: 0, delinquentCount: 0 };
  });

  // Distribute companies across states deterministically
  companies.forEach((company, index) => {
    // Use modulo to distribute evenly across 5 states
    const stateIndex = index % 5;
    const state = usStates[stateIndex];

    stateData[state].companies.push(company);
    stateData[state].exposure += company.creditExposure * 1000000;
    stateData[state].count += 1;
    if (company.overdues > 0) {
      stateData[state].delinquentCount += 1;
    }
  });

  return stateData;
}

/**
 * Generate time series metrics for multi-line chart
 */
function generateTimeSeriesMetrics() {
  const months = ['Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025'];
  const originationData = generateMockOriginationQualityData();

  // Group by month and calculate aggregates
  const monthlyData: Record<string, {
    totalExposure: number;
    avgTDS: number;
    avgGDS: number;
    avgCreditScore: number;
    count: number;
  }> = {};

  originationData.forEach(data => {
    if (!monthlyData[data.originationMonth]) {
      monthlyData[data.originationMonth] = {
        totalExposure: 0,
        avgTDS: 0,
        avgGDS: 0,
        avgCreditScore: 0,
        count: 0,
      };
    }

    const monthly = monthlyData[data.originationMonth];
    monthly.totalExposure += data.totalFundedAmount;
    monthly.avgCreditScore += data.weightedAvgCreditScore;
    // Mock TDS/GDS (Total Debt Service / Gross Debt Service ratios)
    monthly.avgTDS += 35 + (Math.random() * 10);
    monthly.avgGDS += 42 + (Math.random() * 10);
    monthly.count += 1;
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    totalExposure: data.totalExposure / 1e9, // Convert to billions
    avgTDS: data.avgTDS / data.count,
    avgGDS: data.avgGDS / data.count,
    avgCreditScore: data.avgCreditScore / data.count,
  }));
}

/**
 * Build vintage mortality curves (cumulative by age)
 */
function buildVintageCurves() {
  const mortalityData = generateMock12MonthMortalityData();

  // Group by vintage and age
  const vintageMap: Record<string, Array<{ age: number; mortality: number }>> = {};

  mortalityData.forEach(data => {
    if (!vintageMap[data.vintage]) {
      vintageMap[data.vintage] = [];
    }
    vintageMap[data.vintage].push({
      age: data.ageInMonths,
      mortality: data.cumulativeMortalityRate,
    });
  });

  // Convert to chart format (one row per age, columns for each vintage)
  const ages = Array.from({ length: 13 }, (_, i) => i); // 0-12 months
  const curves = ages.map(age => {
    const row: any = { ageInMonths: age };
    Object.entries(vintageMap).forEach(([vintage, points]) => {
      const point = points.find(p => p.age === age);
      row[vintage] = point ? point.mortality : 0;
    });
    return row;
  });

  return { curves, vintages: Object.keys(vintageMap) };
}

/**
 * Calculate origination funnel stages
 */
function calculateConversionFunnel(companies: PortfolioCompany[]) {
  const channelFunnel: Record<string, { applications: number; approvals: number; funded: number }> = {};

  // Since mockData doesn't have funnel stages, we'll simulate
  const channels = ['Branch', 'Digital', 'DSA'];

  channels.forEach(channel => {
    const channelCompanies = companies.filter(c =>
      (channel === 'Branch' && c.segment === 'CORPORATE') ||
      (channel === 'Digital' && c.segment === 'RETAIL') ||
      (channel === 'DSA' && c.segment === 'SME')
    );

    const funded = channelCompanies.length;
    const approvals = funded * 1.15; // 15% dropout from approval to funding
    const applications = approvals * 1.4; // 40% rejection rate

    channelFunnel[channel] = {
      applications: Math.round(applications),
      approvals: Math.round(approvals),
      funded,
    };
  });

  return channelFunnel;
}

/**
 * Calculate exception rates by dimension
 * Simulates policy exception rates based on approval amounts
 */
function calculateExceptionsByDimension<T extends keyof PortfolioCompany>(
  companies: PortfolioCompany[],
  dimension: T
): Array<{ label: string; approvalAmount: number; approvalPercent: number; exceptionRate: number }> {
  const groups = groupCompaniesByField(companies, dimension);
  const totalExposure = getTotalExposure(companies);

  return Array.from(groups.entries()).map(([label, data]) => {
    const approvalAmount = data.exposure / 1e9; // Convert to billions
    const approvalPercent = totalExposure > 0 ? (data.exposure / totalExposure) * 100 : 0;

    // Simulate exception rate based on characteristics
    // Higher-risk segments tend to have more exceptions
    let baseRate = 15; // Base 15% exception rate

    // Adjust based on dimension value (simplified logic)
    if (String(label).includes('SOUTH') || String(label).includes('Real Estate')) {
      baseRate += 8; // Higher risk regions/sectors
    } else if (String(label).includes('Technology') || String(label).includes('AAA')) {
      baseRate -= 5; // Lower risk
    }

    const exceptionRate = Math.max(5, Math.min(30, baseRate + (Math.random() * 6 - 3)));

    return {
      label: String(label),
      approvalAmount: Number(approvalAmount.toFixed(2)),
      approvalPercent: Number(approvalPercent.toFixed(1)),
      exceptionRate: Number(exceptionRate.toFixed(1)),
    };
  });
}

// ============================================================================
// 1. Quick Mortality Ratio Charts (Dynamic)
// ============================================================================
export const generateQuickMortalityCharts = (companies: PortfolioCompany[]): KPIChart[] => {
  // Get early delinquent companies (proxy for quick mortality)
  const earlyDelinquent = getEarlyDelinquent(companies);
  const totalEarlyExposure = getTotalExposure(earlyDelinquent);

  // ========== Chart #1: Early Delinquency by State ==========
  const stateGroups = groupCompaniesByField(earlyDelinquent, 'state');
  const stateChartData = Array.from(stateGroups.entries()).map(([state, data]) => {
    const delinquentCount = data.companies.filter(c => c.overdues > 0).length;
    return {
      label: state,
      value: delinquentCount,
      exposure: data.exposure / 1000000, // Convert to millions
      delinquencyRate: data.count > 0 ? (delinquentCount / data.count) * 100 : 0,
    };
  });

  // ========== Chart #2: Multi-Metric Time Series ==========
  const timeSeriesData = generateTimeSeriesMetrics();

  // ========== Chart #3: Exception Rate Time Series ==========
  const exceptionData = generateMockExceptionData();
  const exceptionByMonth: Record<string, { exceptionRate: number; manualReviewRate: number; count: number }> = {};

  exceptionData.forEach(data => {
    if (!exceptionByMonth[data.measurementPeriod]) {
      exceptionByMonth[data.measurementPeriod] = { exceptionRate: 0, manualReviewRate: 0, count: 0 };
    }
    exceptionByMonth[data.measurementPeriod].exceptionRate += data.exceptionRate;
    exceptionByMonth[data.measurementPeriod].manualReviewRate += data.manualReviewRate;
    exceptionByMonth[data.measurementPeriod].count += 1;
  });

  const exceptionChartData = Object.entries(exceptionByMonth).map(([month, data]) => ({
    month,
    exceptionRate: data.exceptionRate / data.count,
    manualReviewRate: data.manualReviewRate / data.count,
  }));

  // ========== Chart #4: Geography Heatmap (Bar Chart Workaround) ==========
  const regionGroups = groupCompaniesByField(earlyDelinquent, 'region');
  const geoHeatmapData = Array.from(regionGroups.entries()).map(([label, data]) => {
    const delinquentCount = data.companies.filter(c => c.overdues > 0).length;
    return {
      label,
      value: delinquentCount,
      mortalityRate: data.count > 0 ? (delinquentCount / data.count) * 100 : 0,
      exposure: data.exposure / 1000000,
    };
  });

  // ========== Chart #5: Origination Funnel ==========
  const funnelData = calculateConversionFunnel(companies);
  const funnelChartData = Object.entries(funnelData).map(([channel, stages]) => ({
    channel,
    applications: stages.applications,
    approvals: stages.approvals,
    funded: stages.funded,
    conversionRate: ((stages.funded / stages.applications) * 100).toFixed(1),
  }));

  // ========== Chart #6: Vintage Cohort Curve ==========
  const { curves, vintages } = buildVintageCurves();

  // ========== Chart #7: 30-Day Delinquency Time Series ==========
  const delinquency30DData = generateMock30DayDelinquencyData();
  const delinq30ByMonth: Record<string, { Branch: number; Digital: number; DSA: number; counts: Record<string, number> }> = {};

  delinquency30DData.forEach(data => {
    if (!delinq30ByMonth[data.originationMonth]) {
      delinq30ByMonth[data.originationMonth] = {
        Branch: 0,
        Digital: 0,
        DSA: 0,
        counts: { Branch: 0, Digital: 0, DSA: 0 },
      };
    }
    const month = delinq30ByMonth[data.originationMonth];
    month[data.channel as 'Branch' | 'Digital' | 'DSA'] += data.delinquency30DPDRate;
    month.counts[data.channel] += 1;
  });

  const delinq30ChartData = Object.entries(delinq30ByMonth).map(([month, data]) => ({
    month,
    Branch: data.counts.Branch > 0 ? data.Branch / data.counts.Branch : 0,
    Digital: data.counts.Digital > 0 ? data.Digital / data.counts.Digital : 0,
    DSA: data.counts.DSA > 0 ? data.DSA / data.counts.DSA : 0,
  }));

  // ========== Chart #8: Early Delinquency by Segment (Keep existing) ==========
  const segmentGroups = groupCompaniesByField(earlyDelinquent, 'segment');
  const segmentData = Array.from(segmentGroups.entries()).map(([label, data]) => ({
    label,
    value: data.exposure,
    count: data.count,
    percentage: totalEarlyExposure > 0 ? Math.round((data.exposure / totalEarlyExposure) * 100) : 0,
  }));

  // ========== Chart #9: Mortality Rate by Product Type (Keep existing) ==========
  const productGroups = groupCompaniesByField(companies, 'productType');
  const productData = Array.from(productGroups.entries()).map(([label, data]) => {
    const delinquentInProduct = data.companies.filter(c => c.overdues > 0).length;
    const mortalityRate = data.count > 0 ? (delinquentInProduct / data.count) * 100 : 0;
    return {
      label,
      value: Number(mortalityRate.toFixed(2)),
      count: delinquentInProduct,
    };
  });

  // ========== Exception Rate Charts Data ==========
  const productExceptionData = calculateExceptionsByDimension(companies, 'productType');
  const regionExceptionData = calculateExceptionsByDimension(companies, 'region');
  const stateExceptionData = calculateExceptionsByDimension(companies, 'state');
  const industryExceptionData = calculateExceptionsByDimension(companies, 'industry')
    .sort((a, b) => b.approvalAmount - a.approvalAmount)
    .slice(0, 8); // Top 8 industries

  return [
    // Chart #1: State Delinquency
    {
      id: 'mortality-by-state',
      title: 'Originations by State',
      description: 'State-level distribution of new loan originations',
      type: 'bar',
      data: stateChartData,
      dataKeys: [{ key: 'value', name: 'Delinquent Count', color: '#ef4444' }],
      xAxisKey: 'label',
      yAxisKey: 'value',
      filterField: 'state',
      filterLabel: 'State: {value}',
    },
    // Chart #2: 30-Day Delinquency Time Series (moved up from #7)
    {
      id: 'delinquency-30d-timeseries',
      title: 'Originations by Channel',
      description: 'Distribution of new loan originations across acquisition channels',
      type: 'area',
      data: delinq30ChartData,
      dataKeys: [
        { key: 'Branch', name: 'Branch', color: '#3b82f6' },
        { key: 'Digital', name: 'Digital', color: '#ef4444' },
        { key: 'DSA', name: 'DSA', color: '#f59e0b' },
      ],
      xAxisKey: 'month',
      filterField: 'channel',
      filterLabel: 'Channel: {value}',
    },
    // Chart #3: Segment Pie (moved up from #8)
    {
      id: 'mortality-by-segment',
      title: 'Originations by Portfolio Segment',
      description: 'Distribution of new loan originations across portfolio segments',
      type: 'pie',
      data: segmentData.length > 0 ? segmentData : [],
      dataKeys: [{ key: 'value', name: 'Exposure', color: '#3b82f6' }],
      filterField: 'segment',
      filterLabel: '{value}',
    },
    // Chart #4: Product Bar (moved up from #9)
    {
      id: 'mortality-by-product',
      title: 'Originations by Product Type',
      description: 'Distribution of new loan originations by product type',
      type: 'bar',
      data: productData.length > 0 ? productData : [],
      dataKeys: [{ key: 'value', name: 'Mortality Rate (%)', color: '#ef4444' }],
      xAxisKey: 'label',
      yAxisKey: 'value',
      filterField: 'productType',
      filterLabel: '{value}',
    },
    // Chart #5: Geography Heatmap (moved up)
    {
      id: 'mortality-geography-heatmap',
      title: 'Originations by Region',
      description: 'Distribution of new loan originations across regions',
      type: 'bar',
      data: geoHeatmapData,
      dataKeys: [{ key: 'mortalityRate', name: 'Mortality Rate (%)', color: '#ef4444' }],
      xAxisKey: 'label',
      filterField: 'region',
      filterLabel: 'Region: {value}',
    },
    // Chart #6: Origination Funnel (moved up)
    {
      id: 'origination-funnel',
      title: 'Origination Volume & Conversion Funnel',
      description: 'Applications → Approvals → Funded by channel',
      type: 'bar',
      data: funnelChartData,
      dataKeys: [
        { key: 'applications', name: 'Applications', color: '#60a5fa' },
        { key: 'approvals', name: 'Approvals', color: '#34d399' },
        { key: 'funded', name: 'Funded', color: '#10b981' },
      ],
      xAxisKey: 'channel',
      filterField: 'channel',
      filterLabel: 'Channel: {value}',
    },
    // Chart #7: Multi-Metric Time Series (moved down)
    {
      id: 'mortality-metrics-timeseries',
      title: 'Portfolio Metrics Over Time',
      description: 'Total exposure, TDS, GDS, and credit score trends',
      type: 'line',
      data: timeSeriesData,
      dataKeys: [
        { key: 'totalExposure', name: 'Total Exposure ($B)', color: '#3b82f6' },
        { key: 'avgTDS', name: 'Avg TDS (%)', color: '#10b981' },
        { key: 'avgGDS', name: 'Avg GDS (%)', color: '#f59e0b' },
        { key: 'avgCreditScore', name: 'Avg Credit Score', color: '#8b5cf6' },
      ],
      xAxisKey: 'month',
      filterField: 'originationMonth',
      filterLabel: 'Month: {value}',
    },
    // Chart #8: Exception Rate (moved down)
    {
      id: 'exception-rate-trend',
      title: 'Manual Review / Exception Rate Over Time',
      description: 'Rising exceptions or poor exception performance signals control breakdown',
      type: 'line',
      data: exceptionChartData,
      dataKeys: [
        { key: 'exceptionRate', name: 'Exception Rate (%)', color: '#ef4444' },
        { key: 'manualReviewRate', name: 'Manual Review Rate (%)', color: '#f59e0b' },
      ],
      xAxisKey: 'month',
      filterField: 'channel',
      filterLabel: 'Channel: {value}',
    },
    // Chart #10: Exception Rate by Product
    {
      id: 'exception-rate-by-product',
      title: 'Exception Rate by Product',
      description: 'Distribution of approval amounts and exception rates by product type',
      type: 'bar',
      data: productExceptionData,
      dataKeys: [{ key: 'exceptionRate', name: 'Exception Rate (%)', color: '#ef4444' }],
      xAxisKey: 'label',
      yAxisKey: 'exceptionRate',
      filterField: 'productType',
      filterLabel: '{value}',
    },
    // Chart #11: Exception Rate by Region
    {
      id: 'exception-rate-by-region',
      title: 'Exception Rate by Region',
      description: 'Distribution of approval amounts and exception rates by geographic region',
      type: 'bar',
      data: regionExceptionData,
      dataKeys: [{ key: 'exceptionRate', name: 'Exception Rate (%)', color: '#f59e0b' }],
      xAxisKey: 'label',
      yAxisKey: 'exceptionRate',
      filterField: 'region',
      filterLabel: 'Region: {value}',
    },
    // Chart #12: Exception Rate by State
    {
      id: 'exception-rate-by-state',
      title: 'Exception Rate by State',
      description: 'Distribution of approval amounts and exception rates by state',
      type: 'bar',
      data: stateExceptionData,
      dataKeys: [{ key: 'exceptionRate', name: 'Exception Rate (%)', color: '#8b5cf6' }],
      xAxisKey: 'label',
      yAxisKey: 'exceptionRate',
      filterField: 'state',
      filterLabel: 'State: {value}',
    },
    // Chart #13: Exception Rate by Industry
    {
      id: 'exception-rate-by-industry',
      title: 'Exception Rate by Industry',
      description: 'Distribution of approval amounts and exception rates by industry sector',
      type: 'bar',
      data: industryExceptionData,
      dataKeys: [{ key: 'exceptionRate', name: 'Exception Rate (%)', color: '#10b981' }],
      xAxisKey: 'label',
      yAxisKey: 'exceptionRate',
      filterField: 'industry',
      filterLabel: '{value}',
    },
    // Chart #14: Vintage Cohort Curve (moved down from #9)
    {
      id: 'vintage-cohort-curves',
      title: 'Vintage Cohort Mortality Curves',
      description: 'Cumulative mortality by age for each origination vintage',
      type: 'line',
      data: curves,
      dataKeys: vintages.slice(0, 6).map((vintage, idx) => ({
        key: vintage,
        name: vintage,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][idx],
      })),
      xAxisKey: 'ageInMonths',
      filterField: 'vintage',
      filterLabel: 'Vintage: {value}',
    },
  ];
};

// ============================================================================
// 2. Forward Delinquency Forecast Charts (Dynamic)
// ============================================================================
export const generateForwardDelinquencyCharts = (companies: PortfolioCompany[]): KPIChart[] => {
  // Chart 1: Forecast by Segment
  const segmentGroups = groupCompaniesByField(companies, 'segment');
  const segmentData = Array.from(segmentGroups.entries()).map(([label, data]) => {
    const delinquentCount = data.companies.filter(c => c.overdues > 90).length;
    const currentRate = data.count > 0 ? (delinquentCount / data.count) * 100 : 0;
    const forecastRate = currentRate * 1.25; // 25% increase forecast
    return {
      label,
      current: Number(currentRate.toFixed(2)),
      forecast: Number(forecastRate.toFixed(2)),
    };
  });

  // Chart 2: Forecast by Industry
  const industryGroups = groupCompaniesByField(companies, 'industry');
  const industryData = Array.from(industryGroups.entries())
    .map(([label, data]) => {
      const delinquentCount = data.companies.filter(c => c.overdues > 0).length;
      const delinquencyRate = data.count > 0 ? (delinquentCount / data.count) * 100 : 0;
      return {
        label,
        value: Number((delinquencyRate * 1.2).toFixed(2)), // 20% forecast increase
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 industries

  // Chart 3: Current Watchlist Accounts
  const statusGroups = groupCompaniesByField(companies, 'creditStatus');
  const totalExposure = getTotalExposure(companies);
  const statusData = Array.from(statusGroups.entries()).map(([label, data]) => ({
    label,
    value: data.exposure,
    percentage: totalExposure > 0 ? Math.round((data.exposure / totalExposure) * 100) : 0,
  }));

  return [
    {
      id: 'forecast-by-segment',
      title: 'Delinquency Forecast by Segment',
      description: 'Projected 90+ DPD rate by portfolio segment over next 6 months',
      type: 'bar',
      data: segmentData.length > 0 ? segmentData : [],
      dataKeys: [
        { key: 'current', name: 'Current Rate (%)', color: '#3b82f6' },
        { key: 'forecast', name: 'Forecast Rate (%)', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'segment',
      filterLabel: '{value}',
    },
    {
      id: 'forecast-by-industry',
      title: 'Delinquency Forecast by Industry',
      description: 'Industries with highest projected delinquency rates',
      type: 'bar',
      data: industryData.length > 0 ? industryData : [],
      dataKeys: [{ key: 'value', name: 'Forecast Rate (%)', color: '#ef4444' }],
      xAxisKey: 'label',
      filterField: 'industry',
      filterLabel: '{value}',
    },
    {
      id: 'watchlist-distribution',
      title: 'Watchlist Accounts Distribution',
      description: 'Accounts showing early warning signals by credit status',
      type: 'pie',
      data: statusData.length > 0 ? statusData : [],
      dataKeys: [{ key: 'value', name: 'Exposure', color: '#3b82f6' }],
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 3. Pre-Delinquency Behavior Index (PBI) Charts (Dynamic)
// ============================================================================
export const generatePBICharts = (companies: PortfolioCompany[]): KPIChart[] => {
  // Chart 1: Behavior Risk by Credit Status
  const statusGroups = groupCompaniesByField(companies, 'creditStatus');
  const statusData = Array.from(statusGroups.entries()).map(([label, data]) => ({
    label,
    count: data.count,
    exposure: data.exposure,
  }));

  // Chart 2: High-Risk Behavior by Segment (Watchlist + Delinquent)
  const highRiskCompanies = companies.filter(c => c.creditStatus === 'Watchlist' || c.creditStatus === 'Delinquent');
  const segmentGroups = groupCompaniesByField(highRiskCompanies, 'segment');
  const totalHighRiskExposure = getTotalExposure(highRiskCompanies);
  const segmentData = Array.from(segmentGroups.entries()).map(([label, data]) => ({
    label,
    value: data.exposure,
    percentage: totalHighRiskExposure > 0 ? Math.round((data.exposure / totalHighRiskExposure) * 100) : 0,
  }));

  // Chart 3: PBI by Product (High utilization accounts)
  const highUtilCompanies = companies.filter(c => {
    const util = c.creditLimit > 0 ? (c.creditExposure / c.creditLimit) : 0;
    return util > 0.75; // >75% utilization as proxy for high-risk behavior
  });
  const productGroups = groupCompaniesByField(highUtilCompanies, 'productType');
  const productData = Array.from(productGroups.entries()).map(([label, data]) => ({
    label,
    value: data.count,
  }));

  return [
    {
      id: 'pbi-credit-status',
      title: 'Behavior Risk by Credit Status',
      description: 'Distribution of accounts across credit status categories',
      type: 'bar',
      data: statusData.length > 0 ? statusData : [],
      dataKeys: [{ key: 'count', name: 'Account Count', color: '#3b82f6' }],
      xAxisKey: 'label',
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
    {
      id: 'pbi-by-segment',
      title: 'Early Warning Signals by Segment',
      description: 'Distribution of accounts showing behavior stress',
      type: 'pie',
      data: segmentData.length > 0 ? segmentData : [],
      dataKeys: [{ key: 'value', name: 'Exposure', color: '#3b82f6' }],
      filterField: 'segment',
      filterLabel: '{value}',
    },
    {
      id: 'pbi-by-product',
      title: 'Behavior Risk by Product Type',
      description: 'Product-wise early warning signal distribution',
      type: 'bar',
      data: productData.length > 0 ? productData : [],
      dataKeys: [{ key: 'value', name: 'High-Risk Accounts', color: '#ef4444' }],
      xAxisKey: 'label',
      filterField: 'productType',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 4. Vintage Deterioration Index (VDI) Charts (Dynamic)
// ============================================================================
export const generateVDICharts = (companies: PortfolioCompany[]): KPIChart[] => {
  // Chart 1: Deterioration by Segment
  const segmentGroups = groupCompaniesByField(companies, 'segment');
  const segmentData = Array.from(segmentGroups.entries()).map(([label, data]) => {
    const delinquentCount = data.companies.filter(c => c.overdues > 0).length;
    const vdi = data.count > 0 ? (delinquentCount / data.count) * 100 : 0;
    return {
      label,
      vdi: Number(vdi.toFixed(2)),
      baseline: 10.0, // Static baseline
    };
  });

  // Chart 2: Deterioration by Org Structure
  const orgGroups = groupCompaniesByField(companies, 'orgStructure');
  const orgData = Array.from(orgGroups.entries())
    .map(([label, data]) => {
      const delinquentCount = data.companies.filter(c => c.overdues > 0).length;
      const vdi = data.count > 0 ? (delinquentCount / data.count) * 100 : 0;
      return {
        label,
        value: Number(vdi.toFixed(2)),
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Chart 3: Credit Status Distribution
  const statusGroups = groupCompaniesByField(companies, 'creditStatus');
  const totalExposure = getTotalExposure(companies);
  const statusData = Array.from(statusGroups.entries()).map(([label, data]) => ({
    label,
    value: data.exposure,
    percentage: totalExposure > 0 ? Math.round((data.exposure / totalExposure) * 100) : 0,
  }));

  return [
    {
      id: 'vdi-by-segment',
      title: 'Vintage Deterioration by Segment',
      description: 'Recent vintage performance across portfolio segments',
      type: 'bar',
      data: segmentData.length > 0 ? segmentData : [],
      dataKeys: [
        { key: 'vdi', name: 'Current VDI', color: '#ef4444' },
        { key: 'baseline', name: 'Baseline VDI', color: '#10b981' },
      ],
      xAxisKey: 'label',
      filterField: 'segment',
      filterLabel: '{value}',
    },
    {
      id: 'vdi-by-org',
      title: 'VDI by Origination Structure',
      description: 'Vintage performance by organizational unit',
      type: 'bar',
      data: orgData.length > 0 ? orgData : [],
      dataKeys: [{ key: 'value', name: 'VDI Score', color: '#ef4444' }],
      xAxisKey: 'label',
      filterField: 'orgStructure',
      filterLabel: '{value}',
    },
    {
      id: 'vdi-status-split',
      title: 'Recent Vintage Credit Status',
      description: 'Credit status of loans originated in last 6 months',
      type: 'pie',
      data: statusData.length > 0 ? statusData : [],
      dataKeys: [{ key: 'value', name: 'Exposure', color: '#3b82f6' }],
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 5. Net PD Migration Charts (Dynamic)
// ============================================================================
export const generatePDMigrationCharts = (companies: PortfolioCompany[]): KPIChart[] => {
  // Chart 1: Rating Migration by External Rating
  const ratingGroups = groupCompaniesByField(companies, 'borrowerExternalRating');
  const ratingData = Array.from(ratingGroups.entries()).map(([label, data]) => {
    // Simulate upgrades/downgrades based on credit score variance
    const avgScore = data.companies.reduce((sum, c) => sum + c.borrowerCreditScore, 0) / data.count;
    const upgrades = data.companies.filter(c => c.borrowerCreditScore > avgScore + 50).length;
    const downgrades = data.companies.filter(c => c.borrowerCreditScore < avgScore - 50).length;
    return { label, upgrades, downgrades };
  });

  // Chart 2: Downgrade Exposure by Segment (companies with low scores)
  const downgradedCompanies = companies.filter(c => c.borrowerCreditScore < 700 || c.creditStatus === 'Watchlist' || c.creditStatus === 'Delinquent');
  const segmentGroups = groupCompaniesByField(downgradedCompanies, 'segment');
  const totalDowngradeExposure = getTotalExposure(downgradedCompanies);
  const segmentData = Array.from(segmentGroups.entries()).map(([label, data]) => ({
    label,
    value: data.exposure,
    percentage: totalDowngradeExposure > 0 ? Math.round((data.exposure / totalDowngradeExposure) * 100) : 0,
  }));

  // Chart 3: Credit Status Changes
  const statusGroups = groupCompaniesByField(companies, 'creditStatus');
  const statusData = Array.from(statusGroups.entries()).map(([label, data]) => {
    // Simulate migrations based on overdues
    const improved = data.companies.filter(c => c.overdues === 0).length;
    const deteriorated = data.companies.filter(c => c.overdues > 60).length;
    const stable = data.count - improved - deteriorated;
    return { label, stable: Math.max(0, stable), improved, deteriorated };
  });

  return [
    {
      id: 'migration-by-rating',
      title: 'Credit Rating Downgrades',
      description: 'Accounts experiencing rating downgrades by current rating',
      type: 'bar',
      data: ratingData.length > 0 ? ratingData : [],
      dataKeys: [
        { key: 'upgrades', name: 'Upgrades', color: '#10b981' },
        { key: 'downgrades', name: 'Downgrades', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'borrowerExternalRating',
      filterLabel: '{value} Rating',
    },
    {
      id: 'migration-by-segment',
      title: 'Downgrade Exposure by Segment',
      description: 'Distribution of downgraded account exposure across segments',
      type: 'pie',
      data: segmentData.length > 0 ? segmentData : [],
      dataKeys: [{ key: 'value', name: 'Exposure', color: '#3b82f6' }],
      filterField: 'segment',
      filterLabel: '{value}',
    },
    {
      id: 'status-migration',
      title: 'Credit Status Migrations',
      description: 'Accounts moving between credit status categories',
      type: 'bar',
      data: statusData.length > 0 ? statusData : [],
      dataKeys: [
        { key: 'stable', name: 'Stable', color: '#10b981' },
        { key: 'deteriorated', name: 'Deteriorated', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 6. Concentration & Contagion Index Charts (Dynamic)
// ============================================================================
export const generateConcentrationCharts = (companies: PortfolioCompany[]): KPIChart[] => {
  const totalExposure = getTotalExposure(companies);

  // Chart 1: Concentration by Industry
  const industryGroups = groupCompaniesByField(companies, 'industry');
  const industryData = Array.from(industryGroups.entries())
    .map(([label, data]) => ({
      label,
      value: data.exposure,
      percentage: totalExposure > 0 ? Math.round((data.exposure / totalExposure) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Chart 2: Group Exposure Risk
  const groupGroups = groupCompaniesByField(companies, 'group');
  const groupData = Array.from(groupGroups.entries())
    .map(([label, data]) => ({
      label,
      value: data.exposure,
      percentage: totalExposure > 0 ? Math.round((data.exposure / totalExposure) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Chart 3: Party Type Concentration
  const partyTypeGroups = groupCompaniesByField(companies, 'partyType');
  const partyTypeData = Array.from(partyTypeGroups.entries()).map(([label, data]) => ({
    label,
    value: data.exposure,
  }));

  return [
    {
      id: 'concentration-by-industry',
      title: 'Industry Concentration Risk',
      description: 'Top industry exposures contributing to concentration risk',
      type: 'bar',
      data: industryData.length > 0 ? industryData : [],
      dataKeys: [{ key: 'value', name: 'Exposure ($M)', color: '#ef4444' }],
      xAxisKey: 'label',
      filterField: 'industry',
      filterLabel: '{value}',
    },
    {
      id: 'group-exposure',
      title: 'Group Contagion Exposure',
      description: 'Connected exposure through corporate groups',
      type: 'pie',
      data: groupData.length > 0 ? groupData : [],
      dataKeys: [{ key: 'value', name: 'Group Exposure', color: '#3b82f6' }],
      filterField: 'group',
      filterLabel: '{value}',
    },
    {
      id: 'party-type-concentration',
      title: 'Concentration by Party Type',
      description: 'Exposure concentration across borrower categories',
      type: 'bar',
      data: partyTypeData.length > 0 ? partyTypeData : [],
      dataKeys: [{ key: 'value', name: 'Exposure ($M)', color: '#3b82f6' }],
      xAxisKey: 'label',
      filterField: 'partyType',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 7. Utilization & Liquidity Stress Charts (Dynamic)
// ============================================================================
export const generateUtilizationStressCharts = (companies: PortfolioCompany[]): KPIChart[] => {
  // Chart 1: Utilization by LOB
  const lobGroups = groupCompaniesByField(companies, 'lineOfBusiness');
  const lobData = Array.from(lobGroups.entries()).map(([label, data]) => {
    const avgUtilization = data.companies.reduce((sum, c) => {
      const util = c.creditLimit > 0 ? (c.creditExposure / c.creditLimit) * 100 : 0;
      return sum + util;
    }, 0) / data.count;
    const highUtilCount = data.companies.filter(c => {
      const util = c.creditLimit > 0 ? (c.creditExposure / c.creditLimit) : 0;
      return util > 0.75;
    }).length;
    return {
      label,
      average: Number(avgUtilization.toFixed(2)),
      high: highUtilCount,
    };
  });

  // Chart 2: Stress by Product Type (high utilization)
  const highUtilCompanies = companies.filter(c => {
    const util = c.creditLimit > 0 ? (c.creditExposure / c.creditLimit) : 0;
    return util > 0.75;
  });
  const productGroups = groupCompaniesByField(highUtilCompanies, 'productType');
  const totalHighUtilExposure = getTotalExposure(highUtilCompanies);
  const productData = Array.from(productGroups.entries()).map(([label, data]) => ({
    label,
    value: data.exposure,
    percentage: totalHighUtilExposure > 0 ? Math.round((data.exposure / totalHighUtilExposure) * 100) : 0,
  }));

  // Chart 3: Credit Status of High Utilization Accounts
  const statusGroups = groupCompaniesByField(highUtilCompanies, 'creditStatus');
  const statusData = Array.from(statusGroups.entries()).map(([label, data]) => ({
    label,
    count: data.count,
  }));

  return [
    {
      id: 'utilization-by-lob',
      title: 'Credit Line Utilization by LOB',
      description: 'Average utilization rates across lines of business',
      type: 'bar',
      data: lobData.length > 0 ? lobData : [],
      dataKeys: [
        { key: 'average', name: 'Avg Utilization (%)', color: '#3b82f6' },
        { key: 'high', name: 'High Util Count', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'lineOfBusiness',
      filterLabel: '{value}',
    },
    {
      id: 'stress-by-product',
      title: 'Liquidity Stress by Product',
      description: 'High utilization accounts by product type',
      type: 'pie',
      data: productData.length > 0 ? productData : [],
      dataKeys: [{ key: 'value', name: 'High Util Exposure', color: '#3b82f6' }],
      filterField: 'productType',
      filterLabel: '{value}',
    },
    {
      id: 'utilization-credit-status',
      title: 'Credit Status - High Utilization',
      description: 'Credit status of accounts with >75% utilization',
      type: 'bar',
      data: statusData.length > 0 ? statusData : [],
      dataKeys: [{ key: 'count', name: 'Account Count', color: '#ef4444' }],
      xAxisKey: 'label',
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 8. Restructure / Forbearance Reversion Rate Charts (Dynamic)
// ============================================================================
export const generateReversionRateCharts = (companies: PortfolioCompany[]): KPIChart[] => {
  // Chart 1: Reversion by Asset Class
  const assetClassGroups = groupCompaniesByField(companies, 'assetClass');
  const assetClassData = Array.from(assetClassGroups.entries()).map(([label, data]) => {
    // Reversion rate: % of companies with overdues (proxy for reversion)
    const revertedCount = data.companies.filter(c => c.overdues > 30).length;
    const reversionRate = data.count > 0 ? (revertedCount / data.count) * 100 : 0;
    return {
      label,
      reversionRate: Number(reversionRate.toFixed(2)),
      count: data.count,
      exposure: data.exposure,
    };
  });

  // Chart 2: Reversion by Product Type
  const productGroups = groupCompaniesByField(companies, 'productType');
  const productData = Array.from(productGroups.entries()).map(([label, data]) => {
    const revertedCount = data.companies.filter(c => c.overdues > 30).length;
    const rate = data.count > 0 ? (revertedCount / data.count) * 100 : 0;
    return {
      label,
      rate: Number(rate.toFixed(2)),
      count: revertedCount,
    };
  });

  // Chart 3: Credit Status Distribution
  const statusGroups = groupCompaniesByField(companies, 'creditStatus');
  const totalExposure = getTotalExposure(companies);
  const statusData = Array.from(statusGroups.entries()).map(([label, data]) => ({
    label,
    value: data.exposure,
    percentage: totalExposure > 0 ? Math.round((data.exposure / totalExposure) * 100) : 0,
  }));

  return [
    {
      id: 'reversion-by-asset-class',
      title: 'Reversion Risk by Asset Class',
      description: 'Risk of delinquency reoccurrence by asset classification',
      type: 'bar',
      data: assetClassData.length > 0 ? assetClassData : [],
      dataKeys: [{ key: 'reversionRate', name: 'Reversion Rate (%)', color: '#ef4444' }],
      xAxisKey: 'label',
      filterField: 'assetClass',
      filterLabel: '{value}',
    },
    {
      id: 'reversion-by-product',
      title: 'Reversion Rate by Product Type',
      description: 'Product-wise restructure success rates',
      type: 'bar',
      data: productData.length > 0 ? productData : [],
      dataKeys: [{ key: 'rate', name: 'Reversion Rate (%)', color: '#f59e0b' }],
      xAxisKey: 'label',
      filterField: 'productType',
      filterLabel: '{value}',
    },
    {
      id: 'reversion-status',
      title: 'Current Credit Status Distribution',
      description: 'Status of previously restructured accounts',
      type: 'pie',
      data: statusData.length > 0 ? statusData : [],
      dataKeys: [{ key: 'value', name: 'Exposure', color: '#3b82f6' }],
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 9. Forward ECL / Provision Sensitivity Charts (Dynamic)
// ============================================================================
export const generateECLSensitivityCharts = (companies: PortfolioCompany[]): KPIChart[] => {
  // Calculate ECL as a simplified function of exposure and risk
  const calculateECL = (company: PortfolioCompany): number => {
    const exposure = company.creditExposure * 1000000;
    let eclRate = 0.01; // 1% base
    if (company.creditStatus === 'Watchlist') eclRate = 0.05;
    if (company.creditStatus === 'Delinquent') eclRate = 0.15;
    return exposure * eclRate;
  };

  // Chart 1: ECL Exposure by Segment
  const segmentGroups = groupCompaniesByField(companies, 'segment');
  const segmentData = Array.from(segmentGroups.entries()).map(([label, data]) => {
    const ecl = data.companies.reduce((sum, c) => sum + calculateECL(c), 0);
    const coverage = data.exposure > 0 ? (ecl / data.exposure) * 100 : 0;
    return {
      label,
      ecl: ecl,
      coverage: Number(coverage.toFixed(1)),
    };
  });

  // Chart 2: ECL by Credit Status
  const statusGroups = groupCompaniesByField(companies, 'creditStatus');
  const totalECL = companies.reduce((sum, c) => sum + calculateECL(c), 0);
  const statusData = Array.from(statusGroups.entries()).map(([label, data]) => {
    const ecl = data.companies.reduce((sum, c) => sum + calculateECL(c), 0);
    return {
      label,
      value: ecl,
      percentage: totalECL > 0 ? Math.round((ecl / totalECL) * 100) : 0,
    };
  });

  // Chart 3: ECL Sensitivity by Industry
  const industryGroups = groupCompaniesByField(companies, 'industry');
  const industryData = Array.from(industryGroups.entries())
    .map(([label, data]) => {
      const ecl = data.companies.reduce((sum, c) => sum + calculateECL(c), 0);
      return { label, value: ecl };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return [
    {
      id: 'ecl-by-segment',
      title: 'ECL Exposure by Portfolio Segment',
      description: 'Expected credit loss distribution across segments',
      type: 'bar',
      data: segmentData.length > 0 ? segmentData : [],
      dataKeys: [{ key: 'ecl', name: 'ECL Exposure ($M)', color: '#ef4444' }],
      xAxisKey: 'label',
      filterField: 'segment',
      filterLabel: '{value}',
    },
    {
      id: 'ecl-by-status',
      title: 'ECL Provisioning by Credit Status',
      description: 'Expected credit loss by credit status stages',
      type: 'pie',
      data: statusData.length > 0 ? statusData : [],
      dataKeys: [{ key: 'value', name: 'ECL Amount', color: '#3b82f6' }],
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
    {
      id: 'ecl-by-industry',
      title: 'ECL Sensitivity by Industry',
      description: 'Industry-wise expected credit loss exposure',
      type: 'bar',
      data: industryData.length > 0 ? industryData : [],
      dataKeys: [{ key: 'value', name: 'ECL Amount ($M)', color: '#ef4444' }],
      xAxisKey: 'label',
      filterField: 'industry',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 10. Portfolio Health Score (PPHS) Charts (Dynamic)
// ============================================================================
export const generatePPHSCharts = (companies: PortfolioCompany[]): KPIChart[] => {
  // Calculate health score based on credit score and delinquency
  const calculateHealthScore = (company: PortfolioCompany): number => {
    let score = (company.borrowerCreditScore / 850) * 100; // Normalize to 100
    if (company.overdues > 0) score -= 20;
    if (company.creditStatus === 'Watchlist') score -= 10;
    if (company.creditStatus === 'Delinquent') score -= 30;
    return Math.max(0, Math.min(100, score));
  };

  // Chart 1: Health Score by Segment
  const segmentGroups = groupCompaniesByField(companies, 'segment');
  const segmentData = Array.from(segmentGroups.entries()).map(([label, data]) => {
    const avgScore = data.companies.reduce((sum, c) => sum + calculateHealthScore(c), 0) / data.count;
    return {
      label,
      current: Math.round(avgScore),
      benchmark: 75, // Static benchmark
    };
  });

  // Chart 2: Health Score by Credit Status
  const statusGroups = groupCompaniesByField(companies, 'creditStatus');
  const statusData = Array.from(statusGroups.entries()).map(([label, data]) => {
    const avgScore = data.companies.reduce((sum, c) => sum + calculateHealthScore(c), 0) / data.count;
    return {
      label,
      score: Math.round(avgScore),
      count: data.count,
    };
  });

  // Chart 3: Health Distribution by External Rating
  const ratingGroups = groupCompaniesByField(companies, 'borrowerExternalRating');
  const totalExposure = getTotalExposure(companies);
  const ratingData = Array.from(ratingGroups.entries()).map(([label, data]) => ({
    label,
    value: data.exposure,
    percentage: totalExposure > 0 ? Math.round((data.exposure / totalExposure) * 100) : 0,
  }));

  return [
    {
      id: 'pphs-by-segment',
      title: 'Portfolio Health Score by Segment',
      description: 'Health score distribution across portfolio segments',
      type: 'bar',
      data: segmentData.length > 0 ? segmentData : [],
      dataKeys: [
        { key: 'current', name: 'Current Score', color: '#3b82f6' },
        { key: 'benchmark', name: 'Benchmark', color: '#10b981' },
      ],
      xAxisKey: 'label',
      filterField: 'segment',
      filterLabel: '{value}',
    },
    {
      id: 'pphs-by-status',
      title: 'Portfolio Health by Credit Status',
      description: 'Health score distribution across credit status categories',
      type: 'bar',
      data: statusData.length > 0 ? statusData : [],
      dataKeys: [{ key: 'score', name: 'Health Score', color: '#3b82f6' }],
      xAxisKey: 'label',
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
    {
      id: 'pphs-by-rating',
      title: 'Portfolio Health by External Rating',
      description: 'Distribution of portfolio exposure by credit rating bands',
      type: 'pie',
      data: ratingData.length > 0 ? ratingData : [],
      dataKeys: [{ key: 'value', name: 'Exposure', color: '#3b82f6' }],
      filterField: 'borrowerExternalRating',
      filterLabel: '{value} Rating',
    },
  ];
};

// ============================================================================
// Chart Mapper Function (Updated for Dynamic Generation)
// ============================================================================

/**
 * Returns dynamically generated chart configurations for a given KPI ID
 * Charts are calculated from the provided filtered company data
 *
 * @param kpiId - The KPI identifier (e.g., 'quick_mortality', 'pphs')
 * @param companies - Filtered portfolio companies to generate charts from
 * @returns Array of KPIChart configurations with dynamic data
 */
export const getChartsForKPI = (kpiId: string, companies: PortfolioCompany[]): KPIChart[] => {
  // Handle empty company list
  if (companies.length === 0) {
    // Return empty charts with appropriate message
    return [];
  }

  const chartMap: Record<string, (companies: PortfolioCompany[]) => KPIChart[]> = {
    'quick_mortality': generateQuickMortalityCharts,
    'qm_model_auc': generateQuickMortalityCharts, // Same charts as Quick Mortality
    'forward_delinquency': generateForwardDelinquencyCharts,
    'pbi': generatePBICharts,
    'vdi': generateVDICharts,
    'net_pd_migration': generatePDMigrationCharts,
    'concentration_contagion': generateConcentrationCharts,
    'utilization_stress': generateUtilizationStressCharts,
    'reversion_rate': generateReversionRateCharts,
    'ecl_sensitivity': generateECLSensitivityCharts,
    'pphs': generatePPHSCharts,
  };

  const chartGenerator = chartMap[kpiId];
  return chartGenerator ? chartGenerator(companies) : [];
};

// ============================================================================
// Indicator-Based Drilldowns (CMI & Net Deterioration)
// ============================================================================

/**
 * Returns indicator-based KPIs for drill-downs that use indicator cards instead of charts
 * Currently used for CMI (qm_12m_mortality) and Net Deterioration (qm_credit_score)
 *
 * @param kpiId - The KPI identifier
 * @returns Array of AdvancedKPI indicators, or null if this KPI uses charts instead
 */
export const getIndicatorsForKPI = (kpiId: string): AdvancedKPI[] | null => {
  // Both CMI and Net Deterioration use the same deterioration indicators
  const kpisWithIndicators = ['qm_12m_mortality', 'qm_credit_score'];

  if (kpisWithIndicators.includes(kpiId)) {
    return generateDeteriorationIndicators();
  }

  return null;
};

// ============================================================================
// CMI & Net Deterioration Charts (Indicator-based KPIs with additional charts)
// ============================================================================

/**
 * Generate CMI-specific charts - 4 visualizations for CMI and Net Deterioration pages
 * These pages show 4 indicator cards at top, then these 4 charts below
 */
export const generateCMICharts = (): KPIChart[] => {
  // Chart #1: Line Chart - Bank CMI vs CRISIL Migration Index
  const trendData = generateCMITrendData();

  // Chart #2: Sector Comparison Table
  const sectorData = generateSectorComparisonData();

  // Chart #3: Heatmap - Deterioration by Sector + Region + Product
  const heatmapData = generateHeatmapData();

  // Chart #4: Migration Matrix - Downgrade ladder
  const migrationData = generateMigrationMatrixData();

  return [
    // Chart #1: CMI Trend Line Chart
    {
      id: 'cmi-trend-comparison',
      title: 'Bank CMI vs CRISIL Migration Index (6-Month Trend)',
      description: 'Comparing bank portfolio deterioration trend against market benchmark',
      type: 'line',
      data: trendData,
      dataKeys: [
        { key: 'bankCMI', name: 'Bank CMI', color: '#ef4444' },
        { key: 'crisilIndex', name: 'CRISIL Index', color: '#3b82f6' },
      ],
      xAxisKey: 'month',
      filterField: 'originationMonth',
      filterLabel: 'Month: {value}',
    },
    // Chart #2: Sector Comparison Table (custom component)
    {
      id: 'cmi-sector-comparison',
      title: 'Sector-wise CMI Analysis',
      description: 'Detailed sector performance vs market benchmarks with sentiment indicators',
      type: 'sector-table',
      data: sectorData,
      dataKeys: [], // Not used for custom component
      filterField: 'industry',
      filterLabel: 'Sector: {value}',
    },
    // Chart #3: Deterioration Heatmap (custom component)
    {
      id: 'cmi-deterioration-heatmap',
      title: 'Deterioration Heatmap: Sector × Region × Product',
      description: 'Color-coded deterioration rates across multiple dimensions',
      type: 'heatmap',
      data: heatmapData,
      dataKeys: [], // Not used for custom component
      filterField: 'industry',
      filterLabel: '{value}',
    },
    // Chart #4: Migration Matrix (custom component)
    {
      id: 'cmi-migration-matrix',
      title: 'Credit Migration Matrix: Downgrade Ladder',
      description: 'Exposure-weighted account downgrades by segment, industry, and rating',
      type: 'migration-matrix',
      data: migrationData,
      dataKeys: [], // Not used for custom component
      filterField: 'segment',
      filterLabel: '{value}',
    },
    // Chart #5: Top Exposures with Rating Migration (custom table component)
    {
      id: 'cmi-top-exposures-migration',
      title: 'Top Exposures with Rating Migration',
      description: 'Largest exposures ranked by size, showing recent rating changes and migration severity',
      type: 'migration-table',
      data: [], // Data will be generated in KPIDrilldownPage from filtered companies
      dataKeys: [], // Not used for custom component
      filterField: 'customerName',
      filterLabel: 'Company: {value}',
    },
  ];
};
