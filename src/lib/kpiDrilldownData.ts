import type { KPIChart } from '../types';

/**
 * Chart data generators for KPI drilldown modals
 * Each function returns an array of 3-4 charts specific to that KPI
 */

// ============================================================================
// 1. Quick Mortality Ratio Charts
// ============================================================================
export const getQuickMortalityCharts = (): KPIChart[] => {
  return [
    // Chart 1: Early Delinquency by Segment (Pie Chart)
    {
      id: 'mortality-by-segment',
      title: 'Early Delinquency by Portfolio Segment',
      description: 'Distribution of early delinquent loans (≤6 months vintage) across segments',
      type: 'pie',
      data: [
        { label: 'RETAIL', value: 45000000, count: 6, percentage: 42 },
        { label: 'SME', value: 38000000, count: 7, percentage: 36 },
        { label: 'CORPORATE', value: 24000000, count: 4, percentage: 22 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure', color: '#3b82f6' },
      ],
      filterField: 'segment',
      filterLabel: '{value}',
    },

    // Chart 2: Mortality Rate by Product Type (Bar Chart)
    {
      id: 'mortality-by-product',
      title: 'Mortality Rate by Product Type',
      description: '% of new loans entering early delinquency within 6 months',
      type: 'bar',
      data: [
        { label: 'Personal Loan', value: 4.8, count: 4 },
        { label: 'Auto Loan', value: 3.2, count: 4 },
        { label: 'Business Loan', value: 5.5, count: 5 },
        { label: 'Home Loan', value: 2.1, count: 4 },
      ],
      dataKeys: [
        { key: 'value', name: 'Mortality Rate (%)', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      yAxisKey: 'value',
      filterField: 'productType',
      filterLabel: '{value}',
    },

    // Chart 3: Early Delinquency by Region (Bar Chart)
    {
      id: 'mortality-by-region',
      title: 'Early Delinquency by Region',
      description: 'Regional distribution of new loans entering delinquency',
      type: 'bar',
      data: [
        { label: 'NORTH', value: 32000000, count: 5 },
        { label: 'SOUTH', value: 28000000, count: 4 },
        { label: 'EAST', value: 24000000, count: 4 },
        { label: 'WEST', value: 23000000, count: 4 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure ($M)', color: '#3b82f6' },
      ],
      xAxisKey: 'label',
      filterField: 'region',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 2. Forward Delinquency Forecast Charts
// ============================================================================
export const getForwardDelinquencyCharts = (): KPIChart[] => {
  return [
    // Chart 1: Forecast by Segment (Bar Chart)
    {
      id: 'forecast-by-segment',
      title: 'Delinquency Forecast by Segment',
      description: 'Projected 90+ DPD rate by portfolio segment over next 6 months',
      type: 'bar',
      data: [
        { label: 'RETAIL', current: 2.8, forecast: 3.5 },
        { label: 'SME', current: 4.2, forecast: 5.1 },
        { label: 'CORPORATE', current: 1.9, forecast: 2.3 },
      ],
      dataKeys: [
        { key: 'current', name: 'Current Rate (%)', color: '#3b82f6' },
        { key: 'forecast', name: 'Forecast Rate (%)', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'segment',
      filterLabel: '{value}',
    },

    // Chart 2: Forecast by Industry (Bar Chart)
    {
      id: 'forecast-by-industry',
      title: 'Delinquency Forecast by Industry',
      description: 'Industries with highest projected delinquency rates',
      type: 'bar',
      data: [
        { label: 'Logistics', value: 5.2 },
        { label: 'Infrastructure', value: 4.8 },
        { label: 'Steel', value: 4.5 },
        { label: 'Telecom', value: 4.2 },
        { label: 'FMCG', value: 2.1 },
      ],
      dataKeys: [
        { key: 'value', name: 'Forecast Rate (%)', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'industry',
      filterLabel: '{value}',
    },

    // Chart 3: Current Watchlist Accounts (Pie Chart)
    {
      id: 'watchlist-distribution',
      title: 'Watchlist Accounts Distribution',
      description: 'Accounts showing early warning signals by credit status',
      type: 'pie',
      data: [
        { label: 'Standard', value: 70000000, percentage: 75 },
        { label: 'Watchlist', value: 18000000, percentage: 19 },
        { label: 'Delinquent', value: 6000000, percentage: 6 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure', color: '#3b82f6' },
      ],
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 3. Pre-Delinquency Behavior Index (PBI) Charts
// ============================================================================
export const getPBICharts = (): KPIChart[] => {
  return [
    // Chart 1: Behavior Risk by Credit Status (Bar Chart)
    {
      id: 'pbi-credit-status',
      title: 'Behavior Risk by Credit Status',
      description: 'Distribution of accounts across credit status categories',
      type: 'bar',
      data: [
        { label: 'Standard', count: 35, exposure: 850000000 },
        { label: 'Watchlist', count: 9, exposure: 180000000 },
        { label: 'Delinquent', count: 6, exposure: 120000000 },
      ],
      dataKeys: [
        { key: 'count', name: 'Account Count', color: '#3b82f6' },
      ],
      xAxisKey: 'label',
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },

    // Chart 2: High-Risk Behavior by Segment (Pie Chart)
    {
      id: 'pbi-by-segment',
      title: 'Early Warning Signals by Segment',
      description: 'Distribution of accounts showing behavior stress',
      type: 'pie',
      data: [
        { label: 'RETAIL', value: 38000000, percentage: 38 },
        { label: 'SME', value: 35000000, percentage: 35 },
        { label: 'CORPORATE', value: 27000000, percentage: 27 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure', color: '#3b82f6' },
      ],
      filterField: 'segment',
      filterLabel: '{value}',
    },

    // Chart 3: PBI by Product (Bar Chart)
    {
      id: 'pbi-by-product',
      title: 'Behavior Risk by Product Type',
      description: 'Product-wise early warning signal distribution',
      type: 'bar',
      data: [
        { label: 'Personal Loan', value: 5200 },
        { label: 'Business Loan', value: 3800 },
        { label: 'Auto Loan', value: 2600 },
        { label: 'Home Loan', value: 1400 },
      ],
      dataKeys: [
        { key: 'value', name: 'High-Risk Accounts', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'productType',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 4. Vintage Deterioration Index (VDI) Charts
// ============================================================================
export const getVDICharts = (): KPIChart[] => {
  return [
    // Chart 1: Deterioration by Segment (Bar Chart)
    {
      id: 'vdi-by-segment',
      title: 'Vintage Deterioration by Segment',
      description: 'Recent vintage performance across portfolio segments',
      type: 'bar',
      data: [
        { label: 'RETAIL', vdi: 15.2, baseline: 10.0 },
        { label: 'SME', vdi: 18.5, baseline: 10.0 },
        { label: 'CORPORATE', vdi: 12.8, baseline: 10.0 },
      ],
      dataKeys: [
        { key: 'vdi', name: 'Current VDI', color: '#ef4444' },
        { key: 'baseline', name: 'Baseline VDI', color: '#10b981' },
      ],
      xAxisKey: 'label',
      filterField: 'segment',
      filterLabel: '{value}',
    },

    // Chart 2: Deterioration by Org Structure (Bar Chart)
    {
      id: 'vdi-by-org',
      title: 'VDI by Origination Structure',
      description: 'Vintage performance by organizational unit',
      type: 'bar',
      data: [
        { label: 'Bangalore LCB', value: 15.2 },
        { label: 'Chennai MCB', value: 12.8 },
        { label: 'Mumbai LCB', value: 18.5 },
        { label: 'Delhi LCB', value: 14.1 },
        { label: 'Kolkata MCB', value: 16.3 },
      ],
      dataKeys: [
        { key: 'value', name: 'VDI Score', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'orgStructure',
      filterLabel: '{value}',
    },

    // Chart 3: Credit Status Distribution (Pie Chart)
    {
      id: 'vdi-status-split',
      title: 'Recent Vintage Credit Status',
      description: 'Credit status of loans originated in last 6 months',
      type: 'pie',
      data: [
        { label: 'Standard', value: 35000000, percentage: 70 },
        { label: 'Watchlist', value: 10000000, percentage: 20 },
        { label: 'Delinquent', value: 5000000, percentage: 10 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure', color: '#3b82f6' },
      ],
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 5. Net PD Migration Charts
// ============================================================================
export const getPDMigrationCharts = (): KPIChart[] => {
  return [
    // Chart 1: Rating Migration by External Rating (Bar Chart)
    {
      id: 'migration-by-rating',
      title: 'Credit Rating Downgrades',
      description: 'Accounts experiencing rating downgrades by current rating',
      type: 'bar',
      data: [
        { label: 'AAA', upgrades: 2, downgrades: 0 },
        { label: 'AA', upgrades: 3, downgrades: 2 },
        { label: 'A', upgrades: 2, downgrades: 4 },
        { label: 'BBB', upgrades: 1, downgrades: 5 },
        { label: 'BB', upgrades: 0, downgrades: 3 },
      ],
      dataKeys: [
        { key: 'upgrades', name: 'Upgrades', color: '#10b981' },
        { key: 'downgrades', name: 'Downgrades', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'borrowerExternalRating',
      filterLabel: '{value} Rating',
    },

    // Chart 2: Downgrade Exposure by Segment (Pie Chart)
    {
      id: 'migration-by-segment',
      title: 'Downgrade Exposure by Segment',
      description: 'Distribution of downgraded account exposure across segments',
      type: 'pie',
      data: [
        { label: 'RETAIL', value: 280000000, percentage: 35 },
        { label: 'SME', value: 360000000, percentage: 45 },
        { label: 'CORPORATE', value: 160000000, percentage: 20 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure', color: '#3b82f6' },
      ],
      filterField: 'segment',
      filterLabel: '{value}',
    },

    // Chart 3: Credit Status Changes (Bar Chart)
    {
      id: 'status-migration',
      title: 'Credit Status Migrations',
      description: 'Accounts moving between credit status categories',
      type: 'bar',
      data: [
        { label: 'Standard', stable: 30, improved: 2, deteriorated: 3 },
        { label: 'Watchlist', stable: 6, improved: 1, deteriorated: 2 },
        { label: 'Delinquent', stable: 4, improved: 1, deteriorated: 1 },
      ],
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
// 6. Concentration & Contagion Index Charts
// ============================================================================
export const getConcentrationCharts = (): KPIChart[] => {
  return [
    // Chart 1: Concentration by Industry (Bar Chart)
    {
      id: 'concentration-by-industry',
      title: 'Industry Concentration Risk',
      description: 'Top industry exposures contributing to concentration risk',
      type: 'bar',
      data: [
        { label: 'Logistics', value: 580000000, percentage: 12 },
        { label: 'Infrastructure', value: 520000000, percentage: 11 },
        { label: 'IT Services', value: 480000000, percentage: 10 },
        { label: 'Banking', value: 450000000, percentage: 9 },
        { label: 'Steel', value: 420000000, percentage: 9 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure ($M)', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'industry',
      filterLabel: '{value}',
    },

    // Chart 2: Group Exposure Risk (Pie Chart)
    {
      id: 'group-exposure',
      title: 'Group Contagion Exposure',
      description: 'Connected exposure through corporate groups',
      type: 'pie',
      data: [
        { label: 'Tata Group', value: 850000000, percentage: 18 },
        { label: 'Adani Group', value: 720000000, percentage: 15 },
        { label: 'Aditya Birla Group', value: 680000000, percentage: 14 },
        { label: 'HDFC Banking Group', value: 620000000, percentage: 13 },
        { label: 'Reliance Group Mumbai', value: 580000000, percentage: 12 },
        { label: 'Others', value: 1320000000, percentage: 28 },
      ],
      dataKeys: [
        { key: 'value', name: 'Group Exposure', color: '#3b82f6' },
      ],
      filterField: 'group',
      filterLabel: '{value}',
    },

    // Chart 3: Party Type Concentration (Bar Chart)
    {
      id: 'party-type-concentration',
      title: 'Concentration by Party Type',
      description: 'Exposure concentration across borrower categories',
      type: 'bar',
      data: [
        { label: 'Large Corporate', value: 2100000000 },
        { label: 'Corporate', value: 1650000000 },
        { label: 'SME', value: 1050000000 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure ($M)', color: '#3b82f6' },
      ],
      xAxisKey: 'label',
      filterField: 'partyType',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 7. Utilization & Liquidity Stress Charts
// ============================================================================
export const getUtilizationStressCharts = (): KPIChart[] => {
  return [
    // Chart 1: Utilization by Line of Business (Bar Chart)
    {
      id: 'utilization-by-lob',
      title: 'Credit Line Utilization by LOB',
      description: 'Average utilization rates across lines of business',
      type: 'bar',
      data: [
        { label: 'LCB', average: 72.5, high: 15 },
        { label: 'MCB', average: 68.3, high: 12 },
        { label: 'SCB', average: 75.8, high: 18 },
      ],
      dataKeys: [
        { key: 'average', name: 'Avg Utilization (%)', color: '#3b82f6' },
        { key: 'high', name: 'High Util Count', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'lineOfBusiness',
      filterLabel: '{value}',
    },

    // Chart 2: Stress by Product Type (Pie Chart)
    {
      id: 'stress-by-product',
      title: 'Liquidity Stress by Product',
      description: 'High utilization accounts by product type',
      type: 'pie',
      data: [
        { label: 'Business Loan', value: 1850000000, percentage: 42 },
        { label: 'Personal Loan', value: 980000000, percentage: 22 },
        { label: 'Auto Loan', value: 760000000, percentage: 17 },
        { label: 'Home Loan', value: 540000000, percentage: 12 },
      ],
      dataKeys: [
        { key: 'value', name: 'High Util Exposure', color: '#3b82f6' },
      ],
      filterField: 'productType',
      filterLabel: '{value}',
    },

    // Chart 3: Credit Status of High Utilization Accounts (Bar Chart)
    {
      id: 'utilization-credit-status',
      title: 'Credit Status - High Utilization',
      description: 'Credit status of accounts with >75% utilization',
      type: 'bar',
      data: [
        { label: 'Standard', count: 25 },
        { label: 'Watchlist', count: 8 },
        { label: 'Delinquent', count: 5 },
      ],
      dataKeys: [
        { key: 'count', name: 'Account Count', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 8. Restructure / Forbearance Reversion Rate Charts
// ============================================================================
export const getReversionRateCharts = (): KPIChart[] => {
  return [
    // Chart 1: Reversion by Asset Class (Bar Chart)
    {
      id: 'reversion-by-asset-class',
      title: 'Reversion Risk by Asset Class',
      description: 'Risk of delinquency reoccurrence by asset classification',
      type: 'bar',
      data: [
        { label: 'Standard', reversionRate: 15.2, count: 35, exposure: 850000000 },
        { label: 'Delinquent', reversionRate: 42.8, count: 6, exposure: 120000000 },
      ],
      dataKeys: [
        { key: 'reversionRate', name: 'Reversion Rate (%)', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'assetClass',
      filterLabel: '{value}',
    },

    // Chart 2: Reversion by Product Type (Bar Chart)
    {
      id: 'reversion-by-product',
      title: 'Reversion Rate by Product Type',
      description: 'Product-wise restructure success rates',
      type: 'bar',
      data: [
        { label: 'Personal Loan', rate: 28.5, count: 4 },
        { label: 'Auto Loan', rate: 22.3, count: 4 },
        { label: 'Business Loan', rate: 35.8, count: 5 },
        { label: 'Home Loan', rate: 15.2, count: 4 },
      ],
      dataKeys: [
        { key: 'rate', name: 'Reversion Rate (%)', color: '#f59e0b' },
      ],
      xAxisKey: 'label',
      filterField: 'productType',
      filterLabel: '{value}',
    },

    // Chart 3: Credit Status Distribution (Pie Chart)
    {
      id: 'reversion-status',
      title: 'Current Credit Status Distribution',
      description: 'Status of previously restructured accounts',
      type: 'pie',
      data: [
        { label: 'Standard', value: 850000000, percentage: 70 },
        { label: 'Watchlist', value: 180000000, percentage: 15 },
        { label: 'Delinquent', value: 120000000, percentage: 15 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure', color: '#3b82f6' },
      ],
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 9. Forward ECL / Provision Sensitivity Charts
// ============================================================================
export const getECLSensitivityCharts = (): KPIChart[] => {
  return [
    // Chart 1: ECL Exposure by Segment (Bar Chart)
    {
      id: 'ecl-by-segment',
      title: 'ECL Exposure by Portfolio Segment',
      description: 'Expected credit loss distribution across segments',
      type: 'bar',
      data: [
        { label: 'RETAIL', ecl: 280000000, coverage: 2.8 },
        { label: 'SME', ecl: 360000000, coverage: 3.6 },
        { label: 'CORPORATE', ecl: 160000000, coverage: 2.1 },
      ],
      dataKeys: [
        { key: 'ecl', name: 'ECL Exposure ($M)', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'segment',
      filterLabel: '{value}',
    },

    // Chart 2: ECL by Credit Status (Pie Chart)
    {
      id: 'ecl-by-status',
      title: 'ECL Provisioning by Credit Status',
      description: 'Expected credit loss by credit status stages',
      type: 'pie',
      data: [
        { label: 'Standard', value: 120000000, percentage: 28 },
        { label: 'Watchlist', value: 200000000, percentage: 47 },
        { label: 'Delinquent', value: 108000000, percentage: 25 },
      ],
      dataKeys: [
        { key: 'value', name: 'ECL Amount', color: '#3b82f6' },
      ],
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },

    // Chart 3: ECL Sensitivity by Industry (Bar Chart)
    {
      id: 'ecl-by-industry',
      title: 'ECL Sensitivity by Industry',
      description: 'Industry-wise expected credit loss exposure',
      type: 'bar',
      data: [
        { label: 'Infrastructure', value: 78000000 },
        { label: 'Logistics', value: 68000000 },
        { label: 'Steel', value: 55000000 },
        { label: 'Telecom', value: 48000000 },
        { label: 'FMCG', value: 22000000 },
      ],
      dataKeys: [
        { key: 'value', name: 'ECL Amount ($M)', color: '#ef4444' },
      ],
      xAxisKey: 'label',
      filterField: 'industry',
      filterLabel: '{value}',
    },
  ];
};

// ============================================================================
// 10. Portfolio Health Score (PPHS) Charts
// ============================================================================
export const getPPHSCharts = (): KPIChart[] => {
  return [
    // Chart 1: Health Score by Segment (Bar Chart)
    {
      id: 'pphs-by-segment',
      title: 'Portfolio Health Score by Segment',
      description: 'Health score distribution across portfolio segments',
      type: 'bar',
      data: [
        { label: 'RETAIL', current: 65, benchmark: 75 },
        { label: 'SME', current: 61, benchmark: 70 },
        { label: 'CORPORATE', current: 72, benchmark: 78 },
      ],
      dataKeys: [
        { key: 'current', name: 'Current Score', color: '#3b82f6' },
        { key: 'benchmark', name: 'Benchmark', color: '#10b981' },
      ],
      xAxisKey: 'label',
      filterField: 'segment',
      filterLabel: '{value}',
    },

    // Chart 2: Health Score by Credit Status (Bar Chart)
    {
      id: 'pphs-by-status',
      title: 'Portfolio Health by Credit Status',
      description: 'Health score distribution across credit status categories',
      type: 'bar',
      data: [
        { label: 'Standard', score: 78, count: 35 },
        { label: 'Watchlist', score: 52, count: 9 },
        { label: 'Delinquent', score: 28, count: 6 },
      ],
      dataKeys: [
        { key: 'score', name: 'Health Score', color: '#3b82f6' },
      ],
      xAxisKey: 'label',
      filterField: 'creditStatus',
      filterLabel: '{value}',
    },

    // Chart 3: Health Distribution by External Rating (Pie Chart)
    {
      id: 'pphs-by-rating',
      title: 'Portfolio Health by External Rating',
      description: 'Distribution of portfolio exposure by credit rating bands',
      type: 'pie',
      data: [
        { label: 'AAA', value: 580000000, percentage: 12 },
        { label: 'AA', value: 850000000, percentage: 18 },
        { label: 'A', value: 1240000000, percentage: 26 },
        { label: 'BBB', value: 1180000000, percentage: 25 },
        { label: 'BB', value: 920000000, percentage: 19 },
      ],
      dataKeys: [
        { key: 'value', name: 'Exposure', color: '#3b82f6' },
      ],
      filterField: 'borrowerExternalRating',
      filterLabel: '{value} Rating',
    },
  ];
};

// ============================================================================
// Chart Mapper Function
// ============================================================================

/**
 * Returns chart configurations for a given KPI ID
 * @param kpiId - The KPI identifier (e.g., 'quick_mortality', 'pphs')
 * @returns Array of KPIChart configurations
 */
export const getChartsForKPI = (kpiId: string): KPIChart[] => {
  const chartMap: Record<string, () => KPIChart[]> = {
    'quick_mortality': getQuickMortalityCharts,
    'forward_delinquency': getForwardDelinquencyCharts,
    'pbi': getPBICharts,
    'vdi': getVDICharts,
    'net_pd_migration': getPDMigrationCharts,
    'concentration_contagion': getConcentrationCharts,
    'utilization_stress': getUtilizationStressCharts,
    'reversion_rate': getReversionRateCharts,
    'ecl_sensitivity': getECLSensitivityCharts,
    'pphs': getPPHSCharts,
  };

  const chartGenerator = chartMap[kpiId];
  return chartGenerator ? chartGenerator() : [];
};
