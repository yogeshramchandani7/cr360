import type { EvidenceChart } from '../types';

// This file contains additional insight evidence charts (Part 3)
// To be merged with insightEvidenceData.ts

// ============================================================================
// INSIGHT 5: Risk-Return Imbalance
// ID: origination_insight_1
// ============================================================================

export const riskReturnImbalanceCharts: EvidenceChart[] = [
  {
    id: 'risk_return_chart_1',
    title: 'RAROC vs PD Distribution',
    keyHighlight: '42% of new originations fall below minimum RAROC hurdle of 15% despite elevated PD',
    chartType: 'scatter',
    data: [
      { borrower: 'ABC Infra', pd: 1.52, raroc: 12.5, volume: 125, sector: 'Infrastructure' },
      { borrower: 'XYZ NBFC', pd: 1.48, raroc: 13.2, volume: 98, sector: 'NBFC' },
      { borrower: 'Delta RE', pd: 1.62, raroc: 11.8, volume: 85, sector: 'Real Estate' },
      { borrower: 'Omega Mfg', pd: 1.28, raroc: 15.5, volume: 72, sector: 'Manufacturing' },
      { borrower: 'Sigma Services', pd: 1.18, raroc: 16.8, volume: 65, sector: 'Services' },
      { borrower: 'Gamma Auto', pd: 1.45, raroc: 13.8, volume: 58, sector: 'Auto' },
      { borrower: 'Beta Construction', pd: 1.68, raroc: 11.2, volume: 52, sector: 'Infrastructure' },
      { borrower: 'Alpha NBFC', pd: 1.55, raroc: 12.8, volume: 48, sector: 'NBFC' },
    ],
    config: {
      xAxis: { key: 'pd', label: 'Probability of Default (%)', type: 'number' },
      yAxis: { key: 'raroc', label: 'RAROC (%)', type: 'number' },
      series: [{ key: 'volume', name: 'Origination Volume ($ M)', color: '#ef4444' }],
      showLegend: false,
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },
  {
    id: 'risk_return_chart_2',
    title: 'Sector Profitability Matrix',
    keyHighlight: 'Real Estate & NBFC in "Problem" quadrant - high growth but below-hurdle RAROC',
    chartType: 'scatter',
    data: [
      { sector: 'Manufacturing', growth: 5.2, raroc: 15.8, volume: 1850 },
      { sector: 'Real Estate', growth: 12.5, raroc: 12.2, volume: 1425 },
      { sector: 'NBFC', growth: 15.8, raroc: 12.5, volume: 1285 },
      { sector: 'Auto', growth: 8.5, raroc: 14.2, volume: 985 },
      { sector: 'Services', growth: 6.8, raroc: 16.2, volume: 865 },
      { sector: 'Infrastructure', growth: 10.2, raroc: 13.5, volume: 1125 },
    ],
    config: {
      xAxis: { key: 'growth', label: 'Volume Growth YoY %', type: 'number' },
      yAxis: { key: 'raroc', label: 'RAROC %', type: 'number' },
      series: [{ key: 'volume', name: 'Volume ($ M)', color: '#3b82f6' }],
      showLegend: false,
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },
  {
    id: 'risk_return_chart_3',
    title: 'RAROC Trend by Origination Cohort',
    keyHighlight: 'RAROC declining quarter-over-quarter - from 14.4% to 13.8% in last 3 quarters',
    chartType: 'line',
    data: [
      { quarter: 'Q1 23', manufacturing: 16.2, realEstate: 13.5, nbfc: 13.8, auto: 15.2, services: 17.1, bankAvg: 14.8 },
      { quarter: 'Q2 23', manufacturing: 16.0, realEstate: 13.2, nbfc: 13.5, auto: 14.8, services: 16.8, bankAvg: 14.6 },
      { quarter: 'Q3 23', manufacturing: 15.8, realEstate: 12.8, nbfc: 13.2, auto: 14.5, services: 16.5, bankAvg: 14.4 },
      { quarter: 'Q4 23', manufacturing: 15.5, realEstate: 12.5, nbfc: 12.8, auto: 14.2, services: 16.2, bankAvg: 14.2 },
      { quarter: 'Q1 24', manufacturing: 15.8, realEstate: 12.2, nbfc: 12.5, auto: 14.0, services: 16.0, bankAvg: 14.0 },
      { quarter: 'Q2 24', manufacturing: 15.5, realEstate: 12.2, nbfc: 12.5, auto: 13.8, services: 15.8, bankAvg: 13.8 },
    ],
    config: {
      xAxis: { key: 'quarter', label: 'Origination Quarter' },
      yAxis: { key: 'raroc', label: 'Average RAROC %', format: 'percent' },
      series: [
        { key: 'manufacturing', name: 'Manufacturing', color: '#10b981' },
        { key: 'realEstate', name: 'Real Estate', color: '#ef4444' },
        { key: 'nbfc', name: 'NBFC', color: '#dc2626' },
        { key: 'auto', name: 'Auto', color: '#f59e0b' },
        { key: 'services', name: 'Services', color: '#3b82f6' },
        { key: 'bankAvg', name: 'Bank Average', color: '#000000' },
      ],
      showLegend: true,
      showGrid: true,
    }
  },
  {
    id: 'risk_return_chart_4',
    title: 'Capital vs Return Efficiency',
    keyHighlight: 'Infrastructure & Real Estate consuming 44% of RWA ($425M) with below-average RAROC of 12.2-13.5%',
    chartType: 'bar',
    data: [
      { sector: 'Manufacturing', rwa: 1250, raroc: 15.8 },
      { sector: 'Real Estate', rwa: 1850, raroc: 12.2 },
      { sector: 'NBFC', rwa: 1425, raroc: 12.5 },
      { sector: 'Infrastructure', rwa: 1685, raroc: 13.5 },
      { sector: 'Auto', rwa: 985, raroc: 14.2 },
      { sector: 'Services', rwa: 765, raroc: 16.2 },
    ],
    config: {
      xAxis: { key: 'sector', label: 'Sector' },
      series: [
        { key: 'rwa', name: 'RWA Consumed ($ M)', color: '#3b82f6', type: 'bar' },
        { key: 'raroc', name: 'RAROC %', color: '#10b981', type: 'line' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },
  {
    id: 'risk_return_chart_5',
    title: 'Deal Profitability Ranking',
    keyHighlight: 'Bottom 20 deals by RAROC represent $102M exposure - requiring pricing review',
    chartType: 'table',
    data: [
      { borrower: 'ABC Infrastructure Ltd', sector: 'Infrastructure', exposure: 85, raroc: 11.2, pd: 1.68, rating: 'BBB-', justification: 'Relationship value' },
      { borrower: 'XYZ Real Estate Co', sector: 'Real Estate', exposure: 78, raroc: 11.5, pd: 1.62, rating: 'BBB', justification: 'Cross-sell potential' },
      { borrower: 'Delta NBFC Pvt Ltd', sector: 'NBFC', exposure: 65, raroc: 11.8, pd: 1.55, rating: 'BBB', justification: 'Strategic account' },
      { borrower: 'Omega Construction', sector: 'Infrastructure', exposure: 58, raroc: 12.1, pd: 1.52, rating: 'BBB+', justification: 'Group relationship' },
      { borrower: 'Sigma Developers', sector: 'Real Estate', exposure: 52, raroc: 12.2, pd: 1.48, rating: 'BBB', justification: 'Market share growth' },
    ],
    config: {
      columns: [
        { key: 'borrower', header: 'Borrower Name', format: 'text', align: 'left' },
        { key: 'sector', header: 'Sector', format: 'text', align: 'left' },
        { key: 'exposure', header: 'Exposure ($ M)', format: 'currency', align: 'right' },
        { key: 'raroc', header: 'RAROC %', format: 'percent', align: 'right' },
        { key: 'pd', header: 'PD %', format: 'percent', align: 'right' },
        { key: 'rating', header: 'Rating', format: 'text', align: 'center' },
      ],
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },
  {
    id: 'risk_return_chart_6',
    title: 'Pricing Spread Distribution',
    keyHighlight: 'Median pricing spread 40 bps below peers for BBB-rated accounts - under-pricing risk',
    chartType: 'bar',
    data: [
      { ratingBand: 'AAA-AA', currentQ: 145, priorYear: 152, median: 150, q1: 140, q3: 160 },
      { ratingBand: 'A+, A, A-', currentQ: 185, priorYear: 198, median: 195, q1: 175, q3: 215 },
      { ratingBand: 'BBB+, BBB', currentQ: 228, priorYear: 268, median: 265, q1: 235, q3: 285 },
      { ratingBand: 'BBB-, BB+', currentQ: 312, priorYear: 358, median: 355, q1: 315, q3: 385 },
      { ratingBand: 'BB & Below', currentQ: 445, priorYear: 485, median: 475, q1: 425, q3: 515 },
    ],
    config: {
      xAxis: { key: 'ratingBand', label: 'Rating Band' },
      yAxis: { key: 'spread', label: 'Pricing Spread (bps)', format: 'number' },
      series: [
        { key: 'currentQ', name: 'Current Quarter', color: '#ef4444' },
        { key: 'priorYear', name: 'Prior Year', color: '#3b82f6' },
        { key: 'median', name: 'Market Median', color: '#10b981' },
      ],
      showLegend: true,
      showGrid: true,
    }
  },
];

// ============================================================================
// INSIGHT 6: Top 10% Underwriters
// ID: origination_insight_3
// ============================================================================

export const underwritersPerformanceCharts: EvidenceChart[] = [
  {
    id: 'underwriters_chart_1',
    title: 'Underwriter Performance Ranking',
    keyHighlight: 'Top 5 by volume (flagged) show 5.6% avg default rate vs 4.6% for next 5 - quality deteriorates with volume',
    chartType: 'table',
    data: [
      { underwriter: 'John Smith', volume: 485, count: 156, approvalRate: 78, defaultRate: 6.2, lossRate: 4.1, raroc: 11.8, flag: true },
      { underwriter: 'Sarah Johnson', volume: 468, count: 148, approvalRate: 82, defaultRate: 5.8, lossRate: 3.8, raroc: 12.2, flag: true },
      { underwriter: 'Michael Chen', volume: 445, count: 142, approvalRate: 75, defaultRate: 5.5, lossRate: 3.6, raroc: 12.5, flag: true },
      { underwriter: 'Emily Davis', volume: 432, count: 138, approvalRate: 80, defaultRate: 5.2, lossRate: 3.4, raroc: 12.8, flag: true },
      { underwriter: 'David Wilson', volume: 418, count: 134, approvalRate: 77, defaultRate: 5.4, lossRate: 3.5, raroc: 12.6, flag: true },
      { underwriter: 'Lisa Anderson', volume: 405, count: 128, approvalRate: 73, defaultRate: 4.8, lossRate: 3.2, raroc: 13.1, flag: false },
      { underwriter: 'Robert Taylor', volume: 392, count: 125, approvalRate: 79, defaultRate: 4.9, lossRate: 3.3, raroc: 13.0, flag: false },
      { underwriter: 'Jennifer Lee', volume: 378, count: 122, approvalRate: 76, defaultRate: 4.5, lossRate: 3.0, raroc: 13.4, flag: false },
      { underwriter: 'William Brown', volume: 365, count: 118, approvalRate: 81, defaultRate: 4.6, lossRate: 3.1, raroc: 13.3, flag: false },
      { underwriter: 'Amanda White', volume: 352, count: 115, approvalRate: 74, defaultRate: 4.2, lossRate: 2.8, raroc: 13.6, flag: false },
    ],
    config: {
      columns: [
        { key: 'underwriter', header: 'Underwriter Name', format: 'text', align: 'left' },
        { key: 'volume', header: 'Volume ($ M)', format: 'currency', align: 'right' },
        { key: 'count', header: 'Deal Count', format: 'number', align: 'right' },
        { key: 'approvalRate', header: 'Approval %', format: 'percent', align: 'right' },
        { key: 'defaultRate', header: 'Default %', format: 'percent', align: 'right' },
        { key: 'raroc', header: 'RAROC %', format: 'percent', align: 'right' },
      ],
    },
    filterField: 'underwriter',
    filterLabel: 'Underwriter: {value}'
  },
  {
    id: 'underwriters_chart_2',
    title: 'Volume vs Quality Trade-off',
    keyHighlight: 'Clear inverse correlation - higher volume underwriters show 2.5x elevated default rates',
    chartType: 'scatter',
    data: [
      { underwriter: 'John Smith', volume: 485, defaultRate: 6.2, dealCount: 156, quad: 'Problem' },
      { underwriter: 'Sarah Johnson', volume: 468, defaultRate: 5.8, dealCount: 148, quad: 'Problem' },
      { underwriter: 'Michael Chen', volume: 445, defaultRate: 5.5, dealCount: 142, quad: 'Problem' },
      { underwriter: 'Emily Davis', volume: 432, defaultRate: 5.2, dealCount: 138, quad: 'Problem' },
      { underwriter: 'David Wilson', volume: 418, defaultRate: 5.4, dealCount: 134, quad: 'Problem' },
      { underwriter: 'Lisa Anderson', volume: 185, defaultRate: 2.2, dealCount: 68, quad: 'Star' },
      { underwriter: 'Robert Taylor', volume: 198, defaultRate: 2.0, dealCount: 72, quad: 'Star' },
      { underwriter: 'Jennifer Lee', volume: 175, defaultRate: 1.8, dealCount: 65, quad: 'Star' },
    ],
    config: {
      xAxis: { key: 'volume', label: 'Origination Volume ($ M)', type: 'number' },
      yAxis: { key: 'defaultRate', label: 'Default Rate %', type: 'number' },
      series: [{ key: 'dealCount', name: 'Deal Count', color: '#ef4444' }],
      showLegend: false,
    },
    filterField: 'underwriter',
    filterLabel: 'Underwriter: {value}'
  },
  {
    id: 'underwriters_chart_3',
    title: 'Approval Rate Impact on Defaults',
    keyHighlight: 'Underwriters with >80% approval rates show 2.8x higher defaults - lax credit discipline',
    chartType: 'bar',
    data: [
      { approvalBucket: '60-70%', uwCount: 18, avgDefault: 1.8 },
      { approvalBucket: '71-75%', uwCount: 25, avgDefault: 2.1 },
      { approvalBucket: '76-80%', uwCount: 32, avgDefault: 2.5 },
      { approvalBucket: '81-85%', uwCount: 28, avgDefault: 4.2 },
      { approvalBucket: '>85%', uwCount: 15, avgDefault: 5.8 },
    ],
    config: {
      xAxis: { key: 'approvalBucket', label: 'Approval Rate Bucket' },
      yAxis: { key: 'value', label: 'Value', format: 'number' },
      series: [
        { key: 'uwCount', name: 'Underwriter Count', color: '#3b82f6' },
        { key: 'avgDefault', name: 'Avg Default Rate %', color: '#ef4444' },
      ],
      showLegend: true,
      showGrid: true,
    }
  },
  {
    id: 'underwriters_chart_4',
    title: 'Cohort Performance by Underwriter',
    keyHighlight: 'Q2 2024 cohort by high-volume UWs shows 6.7% avg defaults vs 2.3% for low-volume UWs - consistent quality gap',
    chartType: 'table',
    data: [
      { underwriter: 'John Smith', q2_2023: 5.8, q3_2023: 6.2, q4_2023: 6.5, q1_2024: 6.8, q2_2024: 7.2, lifetime: 6.5 },
      { underwriter: 'Sarah Johnson', q2_2023: 5.5, q3_2023: 5.8, q4_2023: 6.2, q1_2024: 6.5, q2_2024: 6.8, lifetime: 6.2 },
      { underwriter: 'Michael Chen', q2_2023: 5.2, q3_2023: 5.5, q4_2023: 5.8, q1_2024: 6.2, q2_2024: 6.5, lifetime: 5.8 },
      { underwriter: 'Lisa Anderson', q2_2023: 2.0, q3_2023: 2.1, q4_2023: 2.2, q1_2024: 2.3, q2_2024: 2.4, lifetime: 2.2 },
      { underwriter: 'Robert Taylor', q2_2023: 1.8, q3_2023: 1.9, q4_2023: 2.0, q1_2024: 2.1, q2_2024: 2.2, lifetime: 2.0 },
    ],
    config: {
      columns: [
        { key: 'underwriter', header: 'Underwriter', format: 'text', align: 'left' },
        { key: 'q2_2023', header: 'Q2 2023', format: 'percent', align: 'center' },
        { key: 'q3_2023', header: 'Q3 2023', format: 'percent', align: 'center' },
        { key: 'q4_2023', header: 'Q4 2023', format: 'percent', align: 'center' },
        { key: 'q1_2024', header: 'Q1 2024', format: 'percent', align: 'center' },
        { key: 'q2_2024', header: 'Q2 2024', format: 'percent', align: 'center' },
        { key: 'lifetime', header: 'Lifetime Avg', format: 'percent', align: 'right' },
      ],
    },
    filterField: 'underwriter',
    filterLabel: 'Underwriter: {value}'
  },
  {
    id: 'underwriters_chart_5',
    title: 'Exception Usage Pattern',
    keyHighlight: 'High-volume UWs grant 2.8x more exceptions with 3.2x higher default rates on those exceptions',
    chartType: 'bar',
    data: [
      { underwriter: 'John Smith', totalExc: 48, income: 22, ltv: 15, credit: 8, dti: 3, excDefault: 14.5, stdDefault: 4.2 },
      { underwriter: 'Sarah Johnson', totalExc: 45, income: 20, ltv: 14, credit: 7, dti: 4, excDefault: 13.8, stdDefault: 4.0 },
      { underwriter: 'Michael Chen', totalExc: 42, income: 18, ltv: 13, credit: 8, dti: 3, excDefault: 13.2, stdDefault: 3.8 },
      { underwriter: 'Lisa Anderson', totalExc: 15, income: 7, ltv: 5, credit: 2, dti: 1, excDefault: 5.2, stdDefault: 1.8 },
      { underwriter: 'Robert Taylor', totalExc: 12, income: 6, ltv: 4, credit: 1, dti: 1, excDefault: 4.8, stdDefault: 1.6 },
    ],
    config: {
      xAxis: { key: 'underwriter', label: 'Underwriter' },
      yAxis: { key: 'count', label: 'Exception Count', format: 'number' },
      series: [
        { key: 'income', name: 'Income', color: '#ef4444' },
        { key: 'ltv', name: 'LTV', color: '#f59e0b' },
        { key: 'credit', name: 'Credit Score', color: '#3b82f6' },
        { key: 'dti', name: 'DTI', color: '#8b5cf6' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'underwriter',
    filterLabel: 'Underwriter: {value}'
  },
  {
    id: 'underwriters_chart_6',
    title: 'Experience & Training Profile',
    keyHighlight: 'High-default UWs average <15 months experience vs 36 months for low-default UWs',
    chartType: 'scatter',
    data: [
      { underwriter: 'John Smith', experience: 11, defaultRate: 6.2, volume: 485, certifications: 1 },
      { underwriter: 'Sarah Johnson', experience: 13, defaultRate: 5.8, volume: 468, certifications: 2 },
      { underwriter: 'Michael Chen', experience: 14, defaultRate: 5.5, volume: 445, certifications: 1 },
      { underwriter: 'Emily Davis', experience: 12, defaultRate: 5.2, volume: 432, certifications: 2 },
      { underwriter: 'Lisa Anderson', experience: 38, defaultRate: 2.2, volume: 185, certifications: 4 },
      { underwriter: 'Robert Taylor', experience: 42, defaultRate: 2.0, volume: 198, certifications: 5 },
      { underwriter: 'Jennifer Lee', experience: 35, defaultRate: 1.8, volume: 175, certifications: 4 },
    ],
    config: {
      xAxis: { key: 'experience', label: 'Years of Experience', type: 'number' },
      yAxis: { key: 'defaultRate', label: 'Default Rate %', type: 'number' },
      series: [{ key: 'volume', name: 'Volume ($ M)', color: '#3b82f6' }],
      showLegend: false,
    },
    filterField: 'underwriter',
    filterLabel: 'Underwriter: {value}'
  },
];

// ============================================================================
// INSIGHT 7: Borrower Concentration Breach
// ID: weighted_pd_insight_3
// ============================================================================

export const concentrationBreachCharts: EvidenceChart[] = [
  {
    id: 'concentration_chart_1',
    title: 'Top 50 Obligor Concentration Trend',
    keyHighlight: 'Top 10 now at 29.2% (breach of 25% policy limit) - grew from 26.2% in 6 months',
    chartType: 'line',
    data: [
      { month: 'Jun 24', top10: 26.2, top25: 42.5, top50: 58.2, threshold: 25 },
      { month: 'Jul 24', top10: 26.8, top25: 43.1, top50: 58.8, threshold: 25 },
      { month: 'Aug 24', top10: 27.2, top25: 43.6, top50: 59.2, threshold: 25 },
      { month: 'Sep 24', top10: 27.8, top25: 44.2, top50: 59.8, threshold: 25 },
      { month: 'Oct 24', top10: 28.5, top25: 44.8, top50: 60.5, threshold: 25 },
      { month: 'Nov 24', top10: 29.2, top25: 45.5, top50: 61.2, threshold: 25 },
    ],
    config: {
      xAxis: { key: 'month', label: 'Month' },
      yAxis: { key: 'concentration', label: 'Concentration %', format: 'percent' },
      series: [
        { key: 'top10', name: 'Top 10', color: '#ef4444' },
        { key: 'top25', name: 'Top 25', color: '#f59e0b' },
        { key: 'top50', name: 'Top 50', color: '#3b82f6' },
        { key: 'threshold', name: 'Policy Limit', color: '#000000' },
      ],
      showLegend: true,
      showGrid: true,
    }
  },
  {
    id: 'concentration_chart_2',
    title: 'Top 20 Borrower Details',
    keyHighlight: 'Single largest exposure at $58.4M approaching internal limit of $60M',
    chartType: 'table',
    data: [
      { borrower: 'ABC Conglomerate', exposure: 485.5, share: 4.4, tier1: 6.2, facilityMix: 'Term/Revolver/LC', undrawn: 125, rating: 'BBB+', trend: 'up', sector: 'Diversified' },
      { borrower: 'XYZ Infrastructure', exposure: 425.2, share: 3.8, tier1: 5.4, facilityMix: 'Term/Guarantee', undrawn: 85, rating: 'BBB', trend: 'stable', sector: 'Infrastructure' },
      { borrower: 'Delta Power Corp', exposure: 385.8, share: 3.5, tier1: 4.9, facilityMix: 'Term/Revolver', undrawn: 102, rating: 'BBB+', trend: 'up', sector: 'Power' },
      { borrower: 'Omega Steel Ltd', exposure: 342.5, share: 3.1, tier1: 4.4, facilityMix: 'Term/LC', undrawn: 78, rating: 'BBB', trend: 'down', sector: 'Steel' },
      { borrower: 'Sigma Group', exposure: 315.8, share: 2.8, tier1: 4.0, facilityMix: 'Term/Revolver/LC', undrawn: 95, rating: 'BBB+', trend: 'stable', sector: 'Diversified' },
    ],
    config: {
      columns: [
        { key: 'borrower', header: 'Borrower/Group Name', format: 'text', align: 'left' },
        { key: 'exposure', header: 'Exposure ($ M)', format: 'currency', align: 'right' },
        { key: 'share', header: '% of Book', format: 'percent', align: 'right' },
        { key: 'tier1', header: '% of Tier 1', format: 'percent', align: 'right' },
        { key: 'undrawn', header: 'Undrawn ($ M)', format: 'currency', align: 'right' },
        { key: 'rating', header: 'Rating', format: 'text', align: 'center' },
        { key: 'sector', header: 'Sector', format: 'text', align: 'left' },
      ],
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },
  {
    id: 'concentration_chart_3',
    title: 'Drawdown Timeline Analysis',
    keyHighlight: '25% policy threshold breached in August 2024 - driven by $66.7M incremental drawdowns over 11 months',
    chartType: 'area',
    data: [
      { month: 'Dec 23', top1: 385, top2_3: 725, top4_10: 1285, total: 2395 },
      { month: 'Feb 24', top1: 398, top2_3: 748, top4_10: 1325, total: 2471 },
      { month: 'Apr 24', top1: 412, top2_3: 775, top4_10: 1368, total: 2555 },
      { month: 'Jun 24', top1: 428, top2_3: 798, top4_10: 1412, total: 2638 },
      { month: 'Aug 24', top1: 452, top2_3: 835, top4_10: 1485, total: 2772 },
      { month: 'Oct 24', top1: 472, top2_3: 865, top4_10: 1545, total: 2882 },
      { month: 'Nov 24', top1: 485.5, top2_3: 885, top4_10: 1580, total: 2950.5 },
    ],
    config: {
      xAxis: { key: 'month', label: 'Month' },
      yAxis: { key: 'exposure', label: 'Outstanding Exposure ($ M)', format: 'currency' },
      series: [
        { key: 'top1', name: 'Top 1 Borrower', color: '#ef4444' },
        { key: 'top2_3', name: 'Top 2-3', color: '#f59e0b' },
        { key: 'top4_10', name: 'Top 4-10', color: '#3b82f6' },
      ],
      showLegend: true,
      showGrid: true,
    }
  },
  {
    id: 'concentration_chart_4',
    title: 'Undrawn Commitment Risk',
    keyHighlight: 'If fully drawn, top 10 would reach 38.5% concentration - creating severe systemic risk',
    chartType: 'bar',
    data: [
      { borrower: 'ABC Conglomerate', drawn: 485.5, undrawn: 125, total: 610.5, utilization: 79.5 },
      { borrower: 'XYZ Infrastructure', drawn: 425.2, undrawn: 85, total: 510.2, utilization: 83.3 },
      { borrower: 'Delta Power Corp', drawn: 385.8, undrawn: 102, total: 487.8, utilization: 79.1 },
      { borrower: 'Omega Steel Ltd', drawn: 342.5, undrawn: 78, total: 420.5, utilization: 81.5 },
      { borrower: 'Sigma Group', drawn: 315.8, undrawn: 95, total: 410.8, utilization: 76.9 },
    ],
    config: {
      xAxis: { key: 'borrower', label: 'Borrower' },
      yAxis: { key: 'amount', label: 'Amount ($ M)', format: 'currency' },
      series: [
        { key: 'drawn', name: 'Drawn Amount', color: '#3b82f6' },
        { key: 'undrawn', name: 'Undrawn Committed', color: '#fbbf24' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },
  {
    id: 'concentration_chart_5',
    title: 'Group Linkage Network Analysis',
    keyHighlight: '12 distinct group structures with $299M exposure - hidden concentration through linkages',
    chartType: 'table',
    data: [
      { groupName: 'ABC Group', entities: 5, totalExposure: 725, largestEntity: 485.5, commonDirectors: 'Yes', crossHoldings: 'Yes', shareOfBook: 6.5 },
      { groupName: 'XYZ Conglomerate', entities: 4, totalExposure: 625, largestEntity: 425.2, commonDirectors: 'Yes', crossHoldings: 'No', shareOfBook: 5.6 },
      { groupName: 'Delta Industries', entities: 3, totalExposure: 485, largestEntity: 385.8, commonDirectors: 'Yes', crossHoldings: 'Yes', shareOfBook: 4.4 },
      { groupName: 'Omega Enterprises', entities: 3, totalExposure: 425, largestEntity: 342.5, commonDirectors: 'Yes', crossHoldings: 'No', shareOfBook: 3.8 },
      { groupName: 'Sigma Holdings', entities: 2, totalExposure: 385, largestEntity: 315.8, commonDirectors: 'Yes', crossHoldings: 'Yes', shareOfBook: 3.5 },
    ],
    config: {
      columns: [
        { key: 'groupName', header: 'Group Name', format: 'text', align: 'left' },
        { key: 'entities', header: 'Entities', format: 'number', align: 'center' },
        { key: 'totalExposure', header: 'Total Exp ($ M)', format: 'currency', align: 'right' },
        { key: 'largestEntity', header: 'Largest ($ M)', format: 'currency', align: 'right' },
        { key: 'shareOfBook', header: '% of Book', format: 'percent', align: 'right' },
      ],
    },
    filterField: 'groupName',
    filterLabel: 'Group: {value}'
  },
  {
    id: 'concentration_chart_6',
    title: 'Sector Double-Concentration',
    keyHighlight: '70% of top 10 exposure in Infrastructure & Energy - sector + name concentration risk compounded',
    chartType: 'bar',
    data: [
      { sector: 'Infrastructure', top10Exposure: 1285, totalSectorExp: 3850, concentration: 33.4 },
      { sector: 'Energy', top10Exposure: 785, totalSectorExp: 2425, concentration: 32.4 },
      { sector: 'Manufacturing', top10Exposure: 485, totalSectorExp: 2650, concentration: 18.3 },
      { sector: 'Real Estate', top10Exposure: 285, totalSectorExp: 1850, concentration: 15.4 },
      { sector: 'Services', top10Exposure: 110, totalSectorExp: 1425, concentration: 7.7 },
    ],
    config: {
      xAxis: { key: 'sector', label: 'Sector' },
      yAxis: { key: 'exposure', label: 'Exposure ($ M)', format: 'currency' },
      series: [
        { key: 'top10Exposure', name: 'Top 10 Exposure', color: '#ef4444' },
        { key: 'totalSectorExp', name: 'Total Sector Exposure', color: '#3b82f6' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },
];
