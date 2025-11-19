import type { EvidenceChart } from '../types';

// ============================================================================
// INSIGHT 1: Income Policy Exception
// ID: weighted_pd_insight_1
// ============================================================================

const incomePolicyExceptionCharts: EvidenceChart[] = [
  // Chart 1: Default Rate Comparison
  {
    id: 'income_exception_chart_1',
    title: 'Default Rate Comparison by Exception Type',
    keyHighlight: 'Income exceptions show 278% higher default rates compared to standard underwriting (8.7% vs 2.3%)',
    chartType: 'bar',
    data: [
      { exceptionType: 'Standard', defaultRate: 2.3, indexed: 100 },
      { exceptionType: 'Income', defaultRate: 8.7, indexed: 378 },
      { exceptionType: 'LTV', defaultRate: 4.8, indexed: 209 },
      { exceptionType: 'DTI', defaultRate: 5.2, indexed: 226 },
      { exceptionType: 'Credit Score', defaultRate: 6.1, indexed: 265 },
      { exceptionType: 'Multi-exception', defaultRate: 12.4, indexed: 539 },
    ],
    config: {
      xAxis: { key: 'exceptionType', label: 'Exception Type' },
      yAxis: { key: 'defaultRate', label: 'Default Rate (%)', format: 'percent' },
      series: [
        { key: 'defaultRate', name: 'Default Rate', color: '#ef4444' }
      ],
      showLegend: false,
      showGrid: true,
    },
    filterField: 'exceptionType',
    filterLabel: 'Exception Type: {value}'
  },

  // Chart 2: Geographic Distribution
  {
    id: 'income_exception_chart_2',
    title: 'Exception Distribution by Region',
    keyHighlight: 'North and West regions account for 62% of exception volume but show 32% lower default rates than East region',
    chartType: 'table',
    data: [
      { region: 'North', volume: 342, count: 1245, defaultRate: 7.2, delinquentVolume: 24.6 },
      { region: 'South', volume: 185, count: 678, defaultRate: 9.8, delinquentVolume: 18.1 },
      { region: 'East', volume: 156, count: 542, defaultRate: 10.6, delinquentVolume: 16.5 },
      { region: 'West', volume: 432, count: 1583, defaultRate: 7.5, delinquentVolume: 32.4 },
      { region: 'Central', volume: 132, count: 486, defaultRate: 8.9, delinquentVolume: 11.7 },
    ],
    config: {
      columns: [
        { key: 'region', header: 'Region', format: 'text', align: 'left' },
        { key: 'volume', header: 'Volume ($ M)', format: 'currency', align: 'right' },
        { key: 'count', header: 'Count', format: 'number', align: 'right' },
        { key: 'defaultRate', header: 'Default Rate', format: 'percent', align: 'right' },
        { key: 'delinquentVolume', header: 'Delinquent Vol ($ M)', format: 'currency', align: 'right' },
      ],
    },
    filterField: 'region',
    filterLabel: 'Region: {value}'
  },

  // Chart 3: Multiple Exception Overlap
  {
    id: 'income_exception_chart_3',
    title: 'Multiple Exception Overlap Analysis',
    keyHighlight: 'Loans with 3+ exceptions have 18.5% default rate - 3x higher than single exception loans (6.2%)',
    chartType: 'pie',
    data: [
      { name: 'Income Only', value: 642, defaultRate: 6.2 },
      { name: 'Income + LTV', value: 289, defaultRate: 10.8 },
      { name: 'Income + DTI', value: 215, defaultRate: 11.4 },
      { name: 'Income + Credit Score', value: 178, defaultRate: 13.2 },
      { name: '2 Exceptions', value: 156, defaultRate: 14.5 },
      { name: '3+ Exceptions', value: 67, defaultRate: 18.5 },
    ],
    config: {
      xAxis: { key: 'name' },
      yAxis: { key: 'value', format: 'number' },
      series: [{ key: 'value', name: 'Count', color: '#3b82f6' }],
      showLegend: true,
    },
    filterField: 'exceptionCategory',
    filterLabel: 'Exception Category: {value}'
  },

  // Chart 4: Exception Volume & Default Trend
  {
    id: 'income_exception_chart_4',
    title: 'Exception Volume & Default Rate Trend',
    keyHighlight: 'Exception volumes grew 47% over 24 months while default rates increased from 6.8% to 8.7%',
    chartType: 'dual-axis',
    data: [
      { month: 'Jan 23', volume: 42, count: 156, exceptionDefaultRate: 6.8, standardDefaultRate: 2.1 },
      { month: 'Apr 23', volume: 48, count: 178, exceptionDefaultRate: 7.2, standardDefaultRate: 2.2 },
      { month: 'Jul 23', volume: 51, count: 189, exceptionDefaultRate: 7.5, standardDefaultRate: 2.3 },
      { month: 'Oct 23', volume: 54, count: 198, exceptionDefaultRate: 7.8, standardDefaultRate: 2.2 },
      { month: 'Jan 24', volume: 58, count: 215, exceptionDefaultRate: 8.1, standardDefaultRate: 2.3 },
      { month: 'Apr 24', volume: 56, count: 205, exceptionDefaultRate: 8.3, standardDefaultRate: 2.4 },
      { month: 'Jul 24', volume: 59, count: 218, exceptionDefaultRate: 8.5, standardDefaultRate: 2.3 },
      { month: 'Oct 24', volume: 62, count: 229, exceptionDefaultRate: 8.7, standardDefaultRate: 2.3 },
    ],
    config: {
      xAxis: { key: 'month', label: 'Month' },
      series: [
        { key: 'volume', name: 'Exception Volume ($ M)', color: '#3b82f6', type: 'bar' },
        { key: 'exceptionDefaultRate', name: 'Exception Default Rate', color: '#ef4444', type: 'line' },
        { key: 'standardDefaultRate', name: 'Standard Default Rate', color: '#10b981', type: 'line' },
      ],
      showLegend: true,
      showGrid: true,
    }
  },

  // Chart 5: Vintage Cohort Performance (Heatmap)
  {
    id: 'income_exception_chart_5',
    title: 'Vintage Cohort Default Performance',
    keyHighlight: '2024 Q2 and Q3 cohorts showing accelerated defaults - 9-11% cumulative by month 6 vs historical 4-5%',
    chartType: 'table',
    data: [
      { vintage: '2023 Q1', m1: 0.8, m3: 2.1, m6: 4.2, m9: 6.1, m12: 7.8, m18: 9.2, m24: 10.1 },
      { vintage: '2023 Q2', m1: 0.9, m3: 2.3, m6: 4.5, m9: 6.4, m12: 8.1, m18: 9.8, m24: 10.8 },
      { vintage: '2023 Q3', m1: 1.1, m3: 2.8, m6: 5.2, m9: 7.2, m12: 9.1, m18: 10.5, m24: 11.2 },
      { vintage: '2023 Q4', m1: 1.2, m3: 3.1, m6: 6.1, m9: 8.5, m12: 10.2, m18: 11.8, m24: 0 },
      { vintage: '2024 Q1', m1: 1.5, m3: 3.8, m6: 7.8, m9: 10.8, m12: 12.5, m18: 0, m24: 0 },
      { vintage: '2024 Q2', m1: 1.8, m3: 4.5, m6: 9.2, m9: 12.4, m12: 0, m18: 0, m24: 0 },
      { vintage: '2024 Q3', m1: 2.1, m3: 5.2, m6: 10.8, m9: 0, m12: 0, m18: 0, m24: 0 },
      { vintage: '2024 Q4', m1: 2.5, m3: 6.1, m6: 0, m9: 0, m12: 0, m18: 0, m24: 0 },
    ],
    config: {
      columns: [
        { key: 'vintage', header: 'Vintage', format: 'text', align: 'left' },
        { key: 'm1', header: 'Month 1', format: 'percent', align: 'center' },
        { key: 'm3', header: 'Month 3', format: 'percent', align: 'center' },
        { key: 'm6', header: 'Month 6', format: 'percent', align: 'center' },
        { key: 'm9', header: 'Month 9', format: 'percent', align: 'center' },
        { key: 'm12', header: 'Month 12', format: 'percent', align: 'center' },
        { key: 'm18', header: 'Month 18', format: 'percent', align: 'center' },
        { key: 'm24', header: 'Month 24', format: 'percent', align: 'center' },
      ],
    },
    filterField: 'vintage',
    filterLabel: 'Vintage: {value}'
  },

  // Chart 6: Underwriter Exception Performance
  {
    id: 'income_exception_chart_6',
    title: 'Top 10 Underwriters by Exception Volume',
    keyHighlight: 'Top 3 underwriters by exception volume have 2.8x higher default rates than their standard book',
    chartType: 'table',
    data: [
      { underwriter: 'John Smith', exceptionCount: 156, exceptionVolume: 89, approvalRate: 78, exceptionDefaultRate: 12.4, standardDefaultRate: 3.2, delta: 9.2 },
      { underwriter: 'Sarah Johnson', exceptionCount: 142, exceptionVolume: 82, approvalRate: 82, exceptionDefaultRate: 11.8, standardDefaultRate: 2.8, delta: 9.0 },
      { underwriter: 'Michael Chen', exceptionCount: 134, exceptionVolume: 76, approvalRate: 75, exceptionDefaultRate: 10.5, standardDefaultRate: 3.5, delta: 7.0 },
      { underwriter: 'Emily Davis', exceptionCount: 128, exceptionVolume: 71, approvalRate: 80, exceptionDefaultRate: 9.8, standardDefaultRate: 2.9, delta: 6.9 },
      { underwriter: 'David Wilson', exceptionCount: 119, exceptionVolume: 68, approvalRate: 77, exceptionDefaultRate: 10.2, standardDefaultRate: 3.1, delta: 7.1 },
      { underwriter: 'Lisa Anderson', exceptionCount: 112, exceptionVolume: 64, approvalRate: 73, exceptionDefaultRate: 8.9, standardDefaultRate: 2.7, delta: 6.2 },
      { underwriter: 'Robert Taylor', exceptionCount: 108, exceptionVolume: 61, approvalRate: 79, exceptionDefaultRate: 9.4, standardDefaultRate: 3.0, delta: 6.4 },
      { underwriter: 'Jennifer Lee', exceptionCount: 102, exceptionVolume: 58, approvalRate: 76, exceptionDefaultRate: 8.7, standardDefaultRate: 2.6, delta: 6.1 },
      { underwriter: 'William Brown', exceptionCount: 98, exceptionVolume: 56, approvalRate: 81, exceptionDefaultRate: 9.1, standardDefaultRate: 2.8, delta: 6.3 },
      { underwriter: 'Amanda White', exceptionCount: 95, exceptionVolume: 54, approvalRate: 74, exceptionDefaultRate: 8.5, standardDefaultRate: 2.5, delta: 6.0 },
    ],
    config: {
      columns: [
        { key: 'underwriter', header: 'Underwriter', format: 'text', align: 'left' },
        { key: 'exceptionCount', header: 'Exception Count', format: 'number', align: 'right' },
        { key: 'exceptionVolume', header: 'Volume ($ M)', format: 'currency', align: 'right' },
        { key: 'approvalRate', header: 'Approval Rate', format: 'percent', align: 'right' },
        { key: 'exceptionDefaultRate', header: 'Exception Default', format: 'percent', align: 'right' },
        { key: 'standardDefaultRate', header: 'Standard Default', format: 'percent', align: 'right' },
        { key: 'delta', header: 'Delta', format: 'percent', align: 'right' },
      ],
    },
    filterField: 'underwriter',
    filterLabel: 'Underwriter: {value}'
  },

];

// ============================================================================
// INSIGHT 2: South Region Lending Surge
// ID: origination_insight_2
// ============================================================================

const southRegionSurgeCharts: EvidenceChart[] = [
  {
    id: 'south_region_chart_1',
    title: 'Regional Volume Comparison (Last 12 Months)',
    keyHighlight: 'South region grew 28% MoM - highest among all regions, now represents 26% of total originations',
    chartType: 'bar',
    data: [
      { month: 'Dec 23', north: 245, south: 158, east: 132, west: 289, central: 98 },
      { month: 'Jan 24', north: 251, south: 165, east: 128, west: 295, central: 102 },
      { month: 'Feb 24', north: 248, south: 172, east: 135, west: 287, central: 105 },
      { month: 'Mar 24', north: 258, south: 181, east: 142, west: 302, central: 108 },
      { month: 'Apr 24', north: 262, south: 189, east: 138, west: 298, central: 112 },
      { month: 'May 24', north: 268, south: 198, east: 145, west: 308, central: 115 },
      { month: 'Jun 24', north: 272, south: 208, east: 148, west: 312, central: 118 },
      { month: 'Jul 24', north: 265, south: 218, east: 152, west: 305, central: 122 },
      { month: 'Aug 24', north: 275, south: 228, east: 158, west: 318, central: 125 },
      { month: 'Sep 24', north: 278, south: 242, east: 162, west: 322, central: 128 },
      { month: 'Oct 24', north: 282, south: 258, east: 165, west: 328, central: 132 },
      { month: 'Nov 24', north: 285, south: 330, east: 168, west: 332, central: 135 },
    ],
    config: {
      xAxis: { key: 'month', label: 'Month' },
      yAxis: { key: 'volume', label: 'Volume ($ M)', format: 'currency' },
      series: [
        { key: 'north', name: 'North', color: '#3b82f6' },
        { key: 'south', name: 'South', color: '#ef4444' },
        { key: 'east', name: 'East', color: '#10b981' },
        { key: 'west', name: 'West', color: '#f59e0b' },
        { key: 'central', name: 'Central', color: '#8b5cf6' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'region',
    filterLabel: 'Region: {value}'
  },
  {
    id: 'south_region_chart_2',
    title: 'South Region Sector Concentration',
    keyHighlight: '64% of South originations concentrated in Infrastructure - far above bank average of 28%',
    chartType: 'donut',
    data: [
      { name: 'Infrastructure', value: 211, percentage: 64 },
      { name: 'Real Estate', value: 49, percentage: 15 },
      { name: 'Manufacturing', value: 33, percentage: 10 },
      { name: 'Services', value: 23, percentage: 7 },
      { name: 'Other', value: 14, percentage: 4 },
    ],
    config: {
      xAxis: { key: 'name' },
      yAxis: { key: 'value', format: 'currency' },
      series: [{ key: 'value', name: 'Volume ($ M)', color: '#ef4444' }],
      showLegend: true,
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },
  {
    id: 'south_region_chart_3',
    title: 'Quality Metrics: South vs Other Regions',
    keyHighlight: 'All risk metrics deteriorated in South - PD up 26%, RAROC down 12%, GDS/TDS down 9%',
    chartType: 'radar',
    data: [
      { metric: 'Avg PD %', south: 1.58, others: 1.28, bank: 1.35 },
      { metric: 'RAROC %', south: 12.9, others: 14.8, bank: 14.2 },
      { metric: 'Avg LTV %', south: 78, others: 72, bank: 74 },
      { metric: 'GDS/TDS %', south: 68, others: 75, bank: 73 },
      { metric: '90+ DPD Rate', south: 1.1, others: 0.5, bank: 0.6 },
      { metric: 'Deviation Rate', south: 26, others: 18, bank: 21 },
    ],
    config: {
      xAxis: { key: 'metric' },
      series: [
        { key: 'south', name: 'South Region', color: '#ef4444' },
        { key: 'others', name: 'Other Regions Avg', color: '#3b82f6' },
        { key: 'bank', name: 'Bank Overall', color: '#10b981' },
      ],
      showLegend: true,
    }
  },
  {
    id: 'south_region_chart_4',
    title: 'Policy Deviation Trend',
    keyHighlight: 'Deviation rate spiked from 18% to 26% over 6 months - mainly DSCR and collateral relaxations',
    chartType: 'line',
    data: [
      { month: 'May 24', southDeviation: 18.2, bankAvg: 19.5 },
      { month: 'Jun 24', southDeviation: 19.8, bankAvg: 19.8 },
      { month: 'Jul 24', southDeviation: 21.5, bankAvg: 20.2 },
      { month: 'Aug 24', southDeviation: 23.2, bankAvg: 20.5 },
      { month: 'Sep 24', southDeviation: 24.8, bankAvg: 20.8 },
      { month: 'Oct 24', southDeviation: 25.5, bankAvg: 21.0 },
      { month: 'Nov 24', southDeviation: 26.1, bankAvg: 21.2 },
    ],
    config: {
      xAxis: { key: 'month', label: 'Month' },
      yAxis: { key: 'rate', label: 'Deviation Rate (%)', format: 'percent' },
      series: [
        { key: 'southDeviation', name: 'South Deviation Rate', color: '#ef4444' },
        { key: 'bankAvg', name: 'Bank Average', color: '#10b981' },
      ],
      showLegend: true,
      showGrid: true,
    }
  },
  {
    id: 'south_region_chart_5',
    title: 'Top 10 Large Deals in South Infrastructure',
    keyHighlight: 'Top 10 infrastructure deals total $64M representing major portion of South infra book - 7 have approved deviations',
    chartType: 'table',
    data: [
      { borrower: 'ABC Infrastructure', exposure: 85, date: '2024-09', rating: 'BBB', sector: 'Roads', deviations: 2, share: 8.5 },
      { borrower: 'XYZ Power Projects', exposure: 78, date: '2024-10', rating: 'BBB+', sector: 'Power', deviations: 1, share: 7.8 },
      { borrower: 'Delta Construction', exposure: 65, date: '2024-08', rating: 'BBB-', sector: 'Construction', deviations: 3, share: 6.5 },
      { borrower: 'Omega Engineering', exposure: 58, date: '2024-11', rating: 'BBB', sector: 'Roads', deviations: 2, share: 5.8 },
      { borrower: 'Sigma Developers', exposure: 52, date: '2024-09', rating: 'BBB+', sector: 'Commercial', deviations: 1, share: 5.2 },
      { borrower: 'Gamma Infra Ltd', exposure: 48, date: '2024-10', rating: 'BBB', sector: 'Roads', deviations: 2, share: 4.8 },
      { borrower: 'Beta Projects', exposure: 42, date: '2024-11', rating: 'BBB-', sector: 'Power', deviations: 3, share: 4.2 },
      { borrower: 'Alpha Build Co', exposure: 38, date: '2024-08', rating: 'BBB', sector: 'Construction', deviations: 0, share: 3.8 },
      { borrower: 'Theta Constructions', exposure: 35, date: '2024-09', rating: 'BBB+', sector: 'Roads', deviations: 1, share: 3.5 },
      { borrower: 'Lambda Infrastructure', exposure: 32, date: '2024-10', rating: 'BBB', sector: 'Power', deviations: 2, share: 3.2 },
    ],
    config: {
      columns: [
        { key: 'borrower', header: 'Borrower Name', format: 'text', align: 'left' },
        { key: 'exposure', header: 'Exposure ($ M)', format: 'currency', align: 'right' },
        { key: 'date', header: 'Orig. Date', format: 'text', align: 'center' },
        { key: 'rating', header: 'Rating', format: 'text', align: 'center' },
        { key: 'sector', header: 'Sector', format: 'text', align: 'left' },
        { key: 'deviations', header: 'Deviations', format: 'number', align: 'center' },
        { key: 'share', header: '% of South', format: 'percent', align: 'right' },
      ],
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },
  {
    id: 'south_region_chart_6',
    title: 'Early Mortality Comparison',
    keyHighlight: 'South cohorts show 2x early mortality rate - 1.1% at 30 DPD by month 3 vs 0.5% for other regions',
    chartType: 'bar',
    data: [
      { cohort: '2024 Q2', south_30dpd: 0.8, others_30dpd: 0.4, south_60dpd: 1.2, others_60dpd: 0.6 },
      { cohort: '2024 Q3', south_30dpd: 1.1, others_30dpd: 0.5, south_60dpd: 1.5, others_60dpd: 0.7 },
      { cohort: '2024 Q4', south_30dpd: 1.1, others_30dpd: 0.5, south_60dpd: 0, others_60dpd: 0 },
    ],
    config: {
      xAxis: { key: 'cohort', label: 'Origination Cohort' },
      yAxis: { key: 'rate', label: 'Delinquency Rate (%)', format: 'percent' },
      series: [
        { key: 'south_30dpd', name: 'South 30 DPD', color: '#ef4444' },
        { key: 'others_30dpd', name: 'Others 30 DPD', color: '#3b82f6' },
        { key: 'south_60dpd', name: 'South 60 DPD', color: '#dc2626' },
        { key: 'others_60dpd', name: 'Others 60 DPD', color: '#2563eb' },
      ],
      showLegend: true,
      showGrid: true,
    }
  },
];

// Import additional charts from part 2 and part 3
import {
  sectorStressCharts,
  tariffImpactCharts
} from './insightEvidenceDataPart2';

import {
  riskReturnImbalanceCharts,
  underwritersPerformanceCharts,
  concentrationBreachCharts
} from './insightEvidenceDataPart3';

/**
 * Get evidence charts for a specific insight ID
 */
export function getEvidenceChartsForInsight(insightId: string): EvidenceChart[] {
  switch (insightId) {
    case 'weighted_pd_insight_1':
      return incomePolicyExceptionCharts;

    case 'origination_insight_2':
      return southRegionSurgeCharts;

    case 'cmi_insight_1':
      return sectorStressCharts;

    case 'weighted_pd_insight_2':
      return tariffImpactCharts;

    case 'origination_insight_1':
      return riskReturnImbalanceCharts;

    case 'origination_insight_3':
      return underwritersPerformanceCharts;

    case 'weighted_pd_insight_3':
      return concentrationBreachCharts;

    default:
      return [];
  }
}

/**
 * Get all available evidence chart IDs for an insight
 */
export function getEvidenceChartIds(insightId: string): string[] {
  const charts = getEvidenceChartsForInsight(insightId);
  return charts.map(chart => chart.id);
}
