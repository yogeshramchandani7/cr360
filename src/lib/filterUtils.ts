import type { GlobalFilterState, KPI } from '../types';
import type { PortfolioCompany } from './mockData';

/**
 * Apply global filters to portfolio companies
 * Logic: AND between filters, OR within each filter
 */
export function applyGlobalFilters(
  companies: PortfolioCompany[],
  filters: GlobalFilterState
): PortfolioCompany[] {
  let filtered = [...companies];

  // Apply LOB filter
  if (filters.lob.length > 0) {
    filtered = filtered.filter((c) => filters.lob.includes(c.lineOfBusiness));
  }

  // Apply Party Type filter
  if (filters.partyType.length > 0) {
    filtered = filtered.filter((c) => filters.partyType.includes(c.partyType));
  }

  // Apply Rating filter
  if (filters.rating.length > 0) {
    filtered = filtered.filter((c) =>
      filters.rating.includes(c.borrowerExternalRating)
    );
  }

  // Apply Asset Classification filter
  if (filters.assetClassification.length > 0) {
    filtered = filtered.filter((c) =>
      filters.assetClassification.includes(c.assetClass)
    );
  }

  return filtered;
}

/**
 * Calculate KPIs from filtered companies
 */
export function calculateFilteredKPIs(companies: PortfolioCompany[]): Record<string, KPI> {
  if (companies.length === 0) {
    // Return zero values if no data
    return {
      npa: { value: 0, unit: 'percent', trend: 'stable', changePercent: 0 },
      totalExposure: { value: 0, unit: 'currency', trend: 'stable', changePercent: 0 },
      par: { value: 0, unit: 'percent', trend: 'stable', changePercent: 0 },
      delinquency: { value: 0, unit: 'percent', trend: 'stable', changePercent: 0 },
      utilization: { value: 0, unit: 'percent', trend: 'stable', changePercent: 0 },
      raroc: { value: 0, unit: 'percent', trend: 'stable', changePercent: 0 },
      lgd: { value: 0, unit: 'percent', trend: 'stable', changePercent: 0 },
      expectedLoss: { value: 0, unit: 'currency', trend: 'stable', changePercent: 0 },
    };
  }

  const totalCompanies = companies.length;
  const totalExposure = companies.reduce((sum, c) => sum + c.creditExposure * 1000000, 0);
  const totalCreditLimit = companies.reduce((sum, c) => sum + c.creditLimit * 1000000, 0);

  // NPA calculation (companies with credit status = 'Delinquent')
  const npaCompanies = companies.filter((c) => c.creditStatus === 'Delinquent');
  const npaExposure = npaCompanies.reduce((sum, c) => sum + c.creditExposure * 1000000, 0);
  const npaPercent = totalExposure > 0 ? (npaExposure / totalExposure) * 100 : 0;

  // PAR calculation (Portfolio at Risk - companies with overdues or delinquent status)
  const parCompanies = companies.filter((c) => c.overdues > 0 || c.creditStatus === 'Delinquent' || c.creditStatus === 'Watchlist');
  const parExposure = parCompanies.reduce((sum, c) => sum + c.creditExposure * 1000000, 0);
  const parPercent = totalExposure > 0 ? (parExposure / totalExposure) * 100 : 0;

  // Delinquency calculation (companies with overdues)
  const delinquentCompanies = companies.filter((c) => c.overdues > 0);
  const delinquencyPercent = totalCompanies > 0 ? (delinquentCompanies.length / totalCompanies) * 100 : 0;

  // Utilization calculation
  const utilization = totalCreditLimit > 0 ? (totalExposure / totalCreditLimit) * 100 : 0;

  // RAROC (simplified calculation based on credit quality)
  const avgCreditScore = companies.reduce((sum, c) => sum + c.borrowerCreditScore, 0) / totalCompanies;
  const raroc = avgCreditScore > 0 ? (avgCreditScore / 850) * 25 : 15; // Scale to ~15-20%

  // LGD (Loss Given Default - simplified)
  const avgSecurityValue = companies.reduce((sum, c) => sum + c.securityValue * 1000000, 0);
  const lgd = totalExposure > 0 ? Math.max(0, Math.min(100, ((totalExposure - avgSecurityValue) / totalExposure) * 100)) : 42;

  // Expected Loss (simplified)
  const expectedLoss = (npaExposure * lgd) / 100;

  return {
    npa: {
      value: npaPercent,
      unit: 'percent',
      trend: npaPercent < 2.5 ? 'down' : npaPercent > 3.0 ? 'up' : 'stable',
      changePercent: Math.random() * 0.6 - 0.3, // Mock change
      threshold: {
        green: 3.0,
        amber: 5.0,
        status: npaPercent <= 3.0 ? 'green' : npaPercent <= 5.0 ? 'amber' : 'red',
      },
    },
    totalExposure: {
      value: totalExposure,
      unit: 'currency',
      trend: 'up',
      changePercent: 5.2,
    },
    par: {
      value: parPercent,
      unit: 'percent',
      trend: parPercent < 4.0 ? 'down' : parPercent > 5.0 ? 'up' : 'stable',
      changePercent: Math.random() * 1.0 - 0.5,
      threshold: {
        green: 5.0,
        amber: 8.0,
        status: parPercent <= 5.0 ? 'green' : parPercent <= 8.0 ? 'amber' : 'red',
      },
    },
    delinquency: {
      value: delinquencyPercent,
      unit: 'percent',
      trend: delinquencyPercent < 3.5 ? 'down' : delinquencyPercent > 4.5 ? 'up' : 'stable',
      changePercent: Math.random() * 0.4 - 0.2,
      threshold: {
        green: 4.0,
        amber: 7.0,
        status: delinquencyPercent <= 4.0 ? 'green' : delinquencyPercent <= 7.0 ? 'amber' : 'red',
      },
    },
    utilization: {
      value: utilization,
      unit: 'percent',
      trend: 'up',
      changePercent: 2.1,
      threshold: {
        green: 80.0,
        amber: 90.0,
        status: utilization <= 80.0 ? 'green' : utilization <= 90.0 ? 'amber' : 'red',
      },
    },
    raroc: {
      value: raroc,
      unit: 'percent',
      trend: 'up',
      changePercent: 1.2,
      threshold: {
        green: 15.0,
        amber: 10.0,
        status: raroc >= 15.0 ? 'green' : raroc >= 10.0 ? 'amber' : 'red',
      },
    },
    lgd: {
      value: lgd,
      unit: 'percent',
      trend: 'stable',
      changePercent: 0.0,
    },
    expectedLoss: {
      value: expectedLoss,
      unit: 'currency',
      trend: 'down',
      changePercent: -3.2,
    },
  };
}

/**
 * Calculate regional and product breakdowns from filtered companies
 */
export function calculateFilteredBreakdowns(companies: PortfolioCompany[]) {
  if (companies.length === 0) {
    // Return placeholder data to prevent chart rendering issues
    return {
      region: [{ label: 'No Data', value: 0, percentage: 0 }],
      product: [{ label: 'No Data', value: 0, percentage: 0 }],
    };
  }

  const totalExposure = companies.reduce((sum, c) => sum + c.creditExposure * 1000000, 0);

  // Regional breakdown
  const regionMap = new Map<string, number>();
  companies.forEach((c) => {
    const current = regionMap.get(c.region) || 0;
    regionMap.set(c.region, current + c.creditExposure * 1000000);
  });

  const region = Array.from(regionMap.entries()).map(([label, value]) => ({
    label,
    value,
    percentage: totalExposure > 0 ? Number(((value / totalExposure) * 100).toFixed(1)) : 0,
  }));

  // Product breakdown
  const productMap = new Map<string, number>();
  companies.forEach((c) => {
    const current = productMap.get(c.productType) || 0;
    productMap.set(c.productType, current + c.creditExposure * 1000000);
  });

  const product = Array.from(productMap.entries()).map(([label, value]) => ({
    label,
    value,
    percentage: totalExposure > 0 ? Number(((value / totalExposure) * 100).toFixed(1)) : 0,
  }));

  return { region, product };
}

/**
 * Calculate delinquency matrix from filtered companies
 */
export function calculateFilteredDelinquencyMatrix(companies: PortfolioCompany[]) {
  const buckets = ['current', '0-30', '31-60', '61-90', '91-180', '180+'];
  const regions = ['NORTH', 'SOUTH', 'EAST', 'WEST'];

  // Create bucket mapping based on overdues
  const getBucket = (overdues: number): string => {
    if (overdues === 0) return 'current';
    if (overdues <= 30) return '0-30';
    if (overdues <= 60) return '31-60';
    if (overdues <= 90) return '61-90';
    if (overdues <= 180) return '91-180';
    return '180+';
  };

  const data = regions.map((region) => {
    const regionCompanies = companies.filter((c) => c.region === region);

    const row: any = { region };

    buckets.forEach((bucket) => {
      const bucketCompanies = regionCompanies.filter((c) => getBucket(c.overdues) === bucket);
      row[bucket] = {
        count: bucketCompanies.length,
        exposure: bucketCompanies.reduce((sum, c) => sum + c.creditExposure * 1000000, 0),
      };
    });

    return row;
  });

  return { rows: regions, buckets, data };
}

/**
 * Calculate top exposures from filtered companies
 */
export function calculateFilteredTopExposures(companies: PortfolioCompany[], limit: number = 20) {
  const totalExposure = companies.reduce((sum, c) => sum + c.creditExposure * 1000000, 0);

  // Sort by credit exposure descending
  const sorted = [...companies].sort((a, b) => b.creditExposure - a.creditExposure);

  // Take top N
  const top = sorted.slice(0, limit);

  return top.map((company, index) => ({
    rank: index + 1,
    borrowerName: company.customerName,
    accountNumber: `LA${String(1000 + index).padStart(6, '0')}`,
    exposureAmount: company.creditExposure * 1000000,
    percentOfPortfolio: totalExposure > 0 ? (company.creditExposure * 1000000 / totalExposure) * 100 : 0,
    productType: company.productType,
    region: company.region,
    riskGrade: company.borrowerExternalRating,
    utilization: company.creditLimit > 0 ? (company.creditExposure / company.creditLimit) * 100 : 0,
  }));
}

/**
 * Calculate trend data from filtered companies (12-month mock)
 */
export function calculateFilteredTrends(companies: PortfolioCompany[]) {
  // For simplicity, generate trend data based on current metrics
  // In a real app, this would use historical data
  const currentMetrics = calculateFilteredKPIs(companies);
  const totalExposure = companies.reduce((sum, c) => sum + c.creditExposure * 1000000, 0);

  return Array.from({ length: 12 }, (_, i) => {
    const variance = (Math.random() - 0.5) * 0.5;
    return {
      month: new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      npa: Math.max(0, Number((currentMetrics.npa.value + variance).toFixed(2))),
      par: Math.max(0, Number((currentMetrics.par.value + variance * 1.5).toFixed(2))),
      exposure: Number((totalExposure * (0.85 + (i / 11) * 0.15)).toFixed(2)), // Growing trend
    };
  });
}

/**
 * Get unique values from companies for filter options
 */
export function getUniqueFilterValues(companies: PortfolioCompany[]) {
  return {
    lob: Array.from(new Set(companies.map((c) => c.lineOfBusiness))).sort(),
    partyType: Array.from(new Set(companies.map((c) => c.partyType))).sort(),
    rating: Array.from(new Set(companies.map((c) => c.borrowerExternalRating))).sort(),
    assetClassification: Array.from(new Set(companies.map((c) => c.assetClass))).sort(),
  };
}
