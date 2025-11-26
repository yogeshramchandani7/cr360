import type { EvidenceChart } from '../types';

// HELOC Utilization Trap Evidence Charts
export const helocUtilizationCharts: EvidenceChart[] = [
  // Chart 1: Texas Geographical Risk Map
  {
    id: 'heloc_chart_1',
    title: 'Texas HELOC Risk Geographic Distribution',
    keyHighlight: 'West Texas concentration: 5 critical cities (Odessa, Lone Star, Houston, Amarillo, Midland) showing >38% utilization velocity - regional stress pattern',
    chartType: 'geo-map',
    data: [
      {
        city: 'Odessa',
        zipCode: '79761',
        coordinates: [-102.3676, 31.8457],
        riskLevel: 'critical',
        utilizationVelocity: 45.2,
        exposureM: 125,
        avgCLTV: 92.3,
        hpiChange: -4.8,
        primeCount: 342
      },
      {
        city: 'Lone Star',
        zipCode: '75668',
        coordinates: [-94.7083, 32.7540],
        riskLevel: 'critical',
        utilizationVelocity: 42.8,
        exposureM: 98,
        avgCLTV: 89.1,
        hpiChange: -4.2,
        primeCount: 289
      },
      {
        city: 'Houston',
        zipCode: '77002',
        coordinates: [-95.3698, 29.7604],
        riskLevel: 'critical',
        utilizationVelocity: 38.5,
        exposureM: 87,
        avgCLTV: 88.7,
        hpiChange: -3.9,
        primeCount: 245
      },
      {
        city: 'San Antonio',
        zipCode: '78205',
        coordinates: [-98.4936, 29.4241],
        riskLevel: 'medium',
        utilizationVelocity: 32.1,
        exposureM: 65,
        avgCLTV: 85.2,
        hpiChange: -3.1,
        primeCount: 178
      },
      {
        city: 'Fort Worth',
        zipCode: '76102',
        coordinates: [-97.3308, 32.7555],
        riskLevel: 'medium',
        utilizationVelocity: 28.7,
        exposureM: 45,
        avgCLTV: 82.4,
        hpiChange: -2.8,
        primeCount: 156
      },
      {
        city: 'Plano',
        zipCode: '75074',
        coordinates: [-96.6989, 33.0198],
        riskLevel: 'low',
        utilizationVelocity: 22.3,
        exposureM: 30,
        avgCLTV: 78.9,
        hpiChange: -1.9,
        primeCount: 98
      },
      {
        city: 'Austin',
        zipCode: '78701',
        coordinates: [-97.7431, 30.2672],
        riskLevel: 'low',
        utilizationVelocity: 12.5,
        exposureM: 22,
        avgCLTV: 72.1,
        hpiChange: -0.8,
        primeCount: 85
      },
      {
        city: 'Dallas',
        zipCode: '75201',
        coordinates: [-96.7970, 32.7767],
        riskLevel: 'medium',
        utilizationVelocity: 28.3,
        exposureM: 78,
        avgCLTV: 83.5,
        hpiChange: -2.5,
        primeCount: 195
      },
      {
        city: 'El Paso',
        zipCode: '79901',
        coordinates: [-106.4850, 31.7619],
        riskLevel: 'medium',
        utilizationVelocity: 26.8,
        exposureM: 52,
        avgCLTV: 81.2,
        hpiChange: -2.1,
        primeCount: 142
      },
      {
        city: 'Amarillo',
        zipCode: '79101',
        coordinates: [-101.8313, 35.2220],
        riskLevel: 'critical',
        utilizationVelocity: 39.5,
        exposureM: 67,
        avgCLTV: 87.6,
        hpiChange: -3.8,
        primeCount: 198
      },
      {
        city: 'Lubbock',
        zipCode: '79401',
        coordinates: [-101.8552, 33.5779],
        riskLevel: 'medium',
        utilizationVelocity: 31.2,
        exposureM: 48,
        avgCLTV: 84.3,
        hpiChange: -2.9,
        primeCount: 134
      },
      {
        city: 'Waco',
        zipCode: '76701',
        coordinates: [-97.1467, 31.5493],
        riskLevel: 'low',
        utilizationVelocity: 18.7,
        exposureM: 28,
        avgCLTV: 76.4,
        hpiChange: -1.2,
        primeCount: 92
      },
      {
        city: 'Corpus Christi',
        zipCode: '78401',
        coordinates: [-97.3964, 27.8006],
        riskLevel: 'low',
        utilizationVelocity: 15.3,
        exposureM: 34,
        avgCLTV: 74.8,
        hpiChange: -0.9,
        primeCount: 108
      },
      {
        city: 'Laredo',
        zipCode: '78040',
        coordinates: [-99.5075, 27.5306],
        riskLevel: 'low',
        utilizationVelocity: 14.2,
        exposureM: 19,
        avgCLTV: 73.5,
        hpiChange: -0.7,
        primeCount: 67
      },
      {
        city: 'Tyler',
        zipCode: '75701',
        coordinates: [-95.3011, 32.3513],
        riskLevel: 'medium',
        utilizationVelocity: 24.5,
        exposureM: 38,
        avgCLTV: 79.8,
        hpiChange: -1.8,
        primeCount: 112
      },
      {
        city: 'Midland',
        zipCode: '79701',
        coordinates: [-102.0779, 31.9973],
        riskLevel: 'critical',
        utilizationVelocity: 41.8,
        exposureM: 89,
        avgCLTV: 90.1,
        hpiChange: -4.5,
        primeCount: 267
      },
      {
        city: 'Abilene',
        zipCode: '79601',
        coordinates: [-99.7331, 32.4487],
        riskLevel: 'medium',
        utilizationVelocity: 27.4,
        exposureM: 42,
        avgCLTV: 82.1,
        hpiChange: -2.3,
        primeCount: 128
      },
      {
        city: 'Beaumont',
        zipCode: '77701',
        coordinates: [-94.1266, 30.0802],
        riskLevel: 'medium',
        utilizationVelocity: 29.6,
        exposureM: 51,
        avgCLTV: 83.7,
        hpiChange: -2.7,
        primeCount: 148
      },
      {
        city: 'Wichita Falls',
        zipCode: '76301',
        coordinates: [-98.4934, 33.9137],
        riskLevel: 'low',
        utilizationVelocity: 19.8,
        exposureM: 25,
        avgCLTV: 77.2,
        hpiChange: -1.4,
        primeCount: 89
      }
    ],
    config: {
      mapConfig: {
        defaultView: 'texas',
        markerColors: {
          critical: '#dc2626',
          medium: '#f59e0b',
          low: '#10b981'
        },
        enableZoom: true
      }
    },
    filterField: 'city',
    filterLabel: 'City: {value}'
  },

  // Chart 2: Utilization Rate by FICO Band Over Time (Grouped Bar Chart)
  {
    id: 'heloc_chart_2',
    title: 'Utilization Rate by FICO Score Band - Quarterly Trend',
    keyHighlight: 'Prime borrowers (FICO >740) utilization spiked to 42% in Q4 2024 from 12% in Q1 2024 - anomalous behavior indicating sudden income shock',
    chartType: 'bar',
    data: [
      {
        quarter: 'Q1 2023',
        lessThan650: 32,
        from650to740: 25,
        above740: 10
      },
      {
        quarter: 'Q2 2023',
        lessThan650: 33,
        from650to740: 26,
        above740: 11
      },
      {
        quarter: 'Q3 2023',
        lessThan650: 34,
        from650to740: 27,
        above740: 11
      },
      {
        quarter: 'Q4 2023',
        lessThan650: 35,
        from650to740: 27,
        above740: 12
      },
      {
        quarter: 'Q1 2024',
        lessThan650: 36,
        from650to740: 28,
        above740: 12
      },
      {
        quarter: 'Q2 2024',
        lessThan650: 38,
        from650to740: 30,
        above740: 15
      },
      {
        quarter: 'Q3 2024',
        lessThan650: 42,
        from650to740: 33,
        above740: 28
      },
      {
        quarter: 'Q4 2024',
        lessThan650: 48,
        from650to740: 37,
        above740: 42
      }
    ],
    config: {
      xAxis: {
        key: 'quarter',
        label: 'Quarter'
      },
      yAxis: {
        label: 'Average Utilization Rate (%)',
        format: 'number'
      },
      series: [
        {
          key: 'lessThan650',
          name: 'FICO <650',
          color: '#ef4444'
        },
        {
          key: 'from650to740',
          name: 'FICO 650-740',
          color: '#f59e0b'
        },
        {
          key: 'above740',
          name: 'FICO >740',
          color: '#10b981'
        }
      ],
      showLegend: true,
      showGrid: true
    },
    filterField: 'quarter',
    filterLabel: 'Quarter: {value}'
  },

  // Chart 3: Drawdown Destination Analysis (Stacked Bar - Quarterly Trend)
  {
    id: 'heloc_chart_3',
    title: 'HELOC Drawdown Destination Analysis',
    keyHighlight: 'Cash Transfer exposure reached $293M (65%) in Q4 2024 vs $50M (20%) historically - dramatic shift from home improvement to liquidity stress',
    chartType: 'bar',
    data: [
      {
        quarter: 'Q1 2023',
        homeImprovement: 112.5,
        debtConsolidation: 87.5,
        cashTransfer: 50
      },
      {
        quarter: 'Q2 2023',
        homeImprovement: 122,
        debtConsolidation: 90,
        cashTransfer: 53
      },
      {
        quarter: 'Q3 2023',
        homeImprovement: 123.2,
        debtConsolidation: 100.8,
        cashTransfer: 56
      },
      {
        quarter: 'Q4 2023',
        homeImprovement: 138.5,
        debtConsolidation: 97.3,
        cashTransfer: 59
      },
      {
        quarter: 'Q1 2024',
        homeImprovement: 145.7,
        debtConsolidation: 125.3,
        cashTransfer: 68
      },
      {
        quarter: 'Q2 2024',
        homeImprovement: 133,
        debtConsolidation: 133,
        cashTransfer: 84
      },
      {
        quarter: 'Q3 2024',
        homeImprovement: 112,
        debtConsolidation: 128,
        cashTransfer: 160
      },
      {
        quarter: 'Q4 2024',
        homeImprovement: 63,
        debtConsolidation: 94,
        cashTransfer: 293
      }
    ],
    config: {
      xAxis: {
        key: 'quarter',
        label: 'Quarter'
      },
      yAxis: {
        label: 'Total Exposure ($M)',
        format: 'currency'
      },
      series: [
        {
          key: 'homeImprovement',
          name: 'Home Improvement',
          color: '#10b981',
          stack: 'total'
        },
        {
          key: 'debtConsolidation',
          name: 'Debt Consolidation',
          color: '#f59e0b',
          stack: 'total'
        },
        {
          key: 'cashTransfer',
          name: 'Cash Transfer',
          color: '#dc2626',
          stack: 'total'
        }
      ],
      showLegend: true,
      showGrid: true
    },
    filterField: 'quarter',
    filterLabel: 'Quarter: {value}'
  },

  // Chart 4: Dynamic CLTV vs. HPI Trend
  {
    id: 'heloc_chart_4',
    title: 'Combined Loan-to-Value vs. Home Price Index Trend',
    keyHighlight: 'At current HPI trends, 15% of Texas portfolio will be underwater (CLTV >100%) within 3 months - Severity of Loss increasing',
    chartType: 'dual-axis',
    data: [
      { month: 'Jul 24', cltv: 78.2, hpi: 312.5 },
      { month: 'Aug 24', cltv: 80.1, hpi: 310.8 },
      { month: 'Sep 24', cltv: 82.5, hpi: 308.2 },
      { month: 'Oct 24', cltv: 85.8, hpi: 305.1 },
      { month: 'Nov 24', cltv: 88.9, hpi: 302.3 },
      { month: 'Dec 24', cltv: 91.7, hpi: 299.8 },
      { month: 'Jan 25 (Proj)', cltv: 95.2, hpi: 297.1 },
      { month: 'Feb 25 (Proj)', cltv: 98.8, hpi: 294.5 },
      { month: 'Mar 25 (Proj)', cltv: 102.5, hpi: 291.8 }
    ],
    config: {
      xAxis: { key: 'month', label: 'Month' },
      yAxis: {
        key: 'cltv',
        label: 'Average CLTV (%)',
        format: 'number'
      },
      series: [
        {
          key: 'cltv',
          name: 'Portfolio CLTV (%)',
          color: '#ef4444',
          type: 'line',
          axis: 'left'
        },
        {
          key: 'hpi',
          name: 'Home Price Index',
          color: '#6b7280',
          type: 'line',
          axis: 'right'
        }
      ],
      referenceLine: {
        x: 'Feb 25 (Proj)',
        label: 'CLTV = 100%',
        stroke: '#dc2626',
        strokeDasharray: '5 5'
      },
      showLegend: true,
      showGrid: true
    },
    timelineMarker: {
      date: 'Dec 24',
      label: 'Current'
    }
  },

  // Chart 5: Interest-Only Payment Burden Trend
  {
    id: 'heloc_chart_5',
    title: 'Interest-Only Payment Burden - High Utilization Segment',
    keyHighlight: 'Interest-only portion spiked to 85% of monthly payment - borrowers not reducing principal, just servicing debt',
    chartType: 'line',
    data: [
      { quarter: 'Q1 2023', interestOnlyPct: 62.3, principalPct: 37.7 },
      { quarter: 'Q2 2023', interestOnlyPct: 64.1, principalPct: 35.9 },
      { quarter: 'Q3 2023', interestOnlyPct: 66.8, principalPct: 33.2 },
      { quarter: 'Q4 2023', interestOnlyPct: 69.2, principalPct: 30.8 },
      { quarter: 'Q1 2024', interestOnlyPct: 72.5, principalPct: 27.5 },
      { quarter: 'Q2 2024', interestOnlyPct: 75.8, principalPct: 24.2 },
      { quarter: 'Q3 2024', interestOnlyPct: 79.4, principalPct: 20.6 },
      { quarter: 'Q4 2024', interestOnlyPct: 85.1, principalPct: 14.9 }
    ],
    config: {
      xAxis: { key: 'quarter', label: 'Quarter' },
      yAxis: {
        key: 'interestOnlyPct',
        label: 'Interest-Only Portion of Payment (%)',
        format: 'number'
      },
      series: [
        {
          key: 'interestOnlyPct',
          name: 'Interest-Only %',
          color: '#dc2626',
          type: 'area'
        },
        {
          key: 'principalPct',
          name: 'Principal %',
          color: '#10b981',
          type: 'area'
        }
      ],
      showLegend: true,
      showGrid: true
    }
  },

  // Chart 6: Payment Hierarchy & Wallet Share
  {
    id: 'heloc_chart_6',
    title: 'Cross-Product Payment Status (Same Borrowers)',
    keyHighlight: 'Credit Card 30+ DPD at 8.5% while HELOC current at 2.8% - payment prioritization signals HELOC delinquency in ~90 days',
    chartType: 'bar',
    data: [
      {
        product: 'Mortgage',
        current: 96.8,
        dpd30: 2.2,
        dpd60: 0.7,
        dpd90: 0.3
      },
      {
        product: 'HELOC',
        current: 95.4,
        dpd30: 2.8,
        dpd60: 1.2,
        dpd90: 0.6
      },
      {
        product: 'Credit Cards',
        current: 87.2,
        dpd30: 8.5,
        dpd60: 2.8,
        dpd90: 1.5
      },
      {
        product: 'Auto Loans',
        current: 93.5,
        dpd30: 4.2,
        dpd60: 1.5,
        dpd90: 0.8
      }
    ],
    config: {
      xAxis: { key: 'product', label: 'Product Type' },
      yAxis: {
        key: 'value',
        label: 'Percentage of Portfolio (%)',
        format: 'number'
      },
      series: [
        { key: 'current', name: 'Current', color: '#10b981', type: 'bar' },
        { key: 'dpd30', name: '30 DPD', color: '#fbbf24', type: 'bar' },
        { key: 'dpd60', name: '60 DPD', color: '#f59e0b', type: 'bar' },
        { key: 'dpd90', name: '90+ DPD', color: '#dc2626', type: 'bar' }
      ],
      showLegend: true,
      showGrid: true
    },
    filterField: 'product',
    filterLabel: 'Product: {value}'
  },

  // Chart 7: Vintage Cohort Default Performance (Heatmap Table)
  {
    id: 'heloc_chart_7',
    title: 'HELOC Vintage Cohort Default Performance',
    keyHighlight: '2022 Q2-Q4 vintages (peak housing market) showing 3x higher early defaults vs. 2019-2020 baseline - structural issue from inflated collateral values',
    chartType: 'table',
    data: [
      { vintage: '2019 Q1', m1: 0.1, m3: 0.2, m6: 0.3, m9: 0.5, m12: 0.8, m18: 1.2, m24: 1.5 },
      { vintage: '2019 Q2', m1: 0.1, m3: 0.2, m6: 0.4, m9: 0.6, m12: 0.9, m18: 1.4, m24: 1.8 },
      { vintage: '2020 Q1', m1: 0.1, m3: 0.3, m6: 0.4, m9: 0.6, m12: 0.9, m18: 1.3, m24: 1.7 },
      { vintage: '2020 Q2', m1: 0.1, m3: 0.2, m6: 0.4, m9: 0.7, m12: 1.0, m18: 1.5, m24: 1.9 },
      { vintage: '2021 Q1', m1: 0.2, m3: 0.3, m6: 0.5, m9: 0.8, m12: 1.1, m18: 1.7, m24: 2.2 },
      { vintage: '2021 Q2', m1: 0.2, m3: 0.4, m6: 0.6, m9: 0.9, m12: 1.3, m18: 1.9, m24: 2.4 },
      { vintage: '2022 Q1', m1: 0.3, m3: 0.6, m6: 1.2, m9: 2.0, m12: 2.8, m18: 4.5, m24: 5.8 },
      { vintage: '2022 Q2', m1: 0.4, m3: 0.8, m6: 1.5, m9: 2.4, m12: 3.2, m18: 5.1, m24: 6.5 },
      { vintage: '2022 Q3', m1: 0.5, m3: 0.9, m6: 1.6, m9: 2.6, m12: 3.5, m18: 5.4, m24: 6.8 },
      { vintage: '2022 Q4', m1: 0.4, m3: 0.8, m6: 1.4, m9: 2.3, m12: 3.1, m18: 4.9, m24: 0 },
      { vintage: '2023 Q1', m1: 0.3, m3: 0.5, m6: 0.9, m9: 1.6, m12: 2.3, m18: 3.5, m24: 0 },
      { vintage: '2023 Q2', m1: 0.2, m3: 0.5, m6: 0.8, m9: 1.4, m12: 2.1, m18: 0, m24: 0 },
      { vintage: '2023 Q3', m1: 0.3, m3: 0.6, m6: 1.0, m9: 1.7, m12: 0, m18: 0, m24: 0 },
      { vintage: '2024 Q1', m1: 0.4, m3: 0.7, m6: 1.2, m9: 0, m12: 0, m18: 0, m24: 0 },
      { vintage: '2024 Q2', m1: 0.5, m3: 0.9, m6: 0, m9: 0, m12: 0, m18: 0, m24: 0 },
      { vintage: '2024 Q3', m1: 0.6, m3: 0, m6: 0, m9: 0, m12: 0, m18: 0, m24: 0 }
    ],
    config: {
      columns: [
        { key: 'vintage', header: 'Vintage', format: 'text', align: 'left' },
        { key: 'm1', header: 'Month 1', format: 'heatmap', align: 'center' },
        { key: 'm3', header: 'Month 3', format: 'heatmap', align: 'center' },
        { key: 'm6', header: 'Month 6', format: 'heatmap', align: 'center' },
        { key: 'm9', header: 'Month 9', format: 'heatmap', align: 'center' },
        { key: 'm12', header: 'Month 12', format: 'heatmap', align: 'center' },
        { key: 'm18', header: 'Month 18', format: 'heatmap', align: 'center' },
        { key: 'm24', header: 'Month 24', format: 'heatmap', align: 'center' }
      ],
      heatmapConfig: {
        minValue: 0,
        maxValue: 7,
        colorScale: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
        hideZeros: true
      }
    },
    filterField: 'vintage',
    filterLabel: 'Vintage: {value}'
  },

  // Chart 8: Cross Product Vulnerability - Contagion Risk Matrix
  {
    id: 'heloc_chart_8',
    title: 'Cross-Product Contagion Risk Matrix',
    keyHighlight: 'Credit cards showing 8.5% 30+ DPD while HELOC at 2.8% DPD - payment prioritization signals 90-day warning window for HELOC defaults',
    chartType: 'table',
    data: [
      {
        product: 'HELOC',
        currentUtilization: 72.5,
        utilizationTrend: '+42pp',
        currentDPD: 2.8,
        dpd30Projection: 6.5,
        exposureM: 450,
        contagionRisk: 'Critical'
      },
      {
        product: 'Credit Cards',
        currentUtilization: 78.5,
        utilizationTrend: '+22pp',
        currentDPD: 8.5,
        dpd30Projection: 12.8,
        exposureM: 215,
        contagionRisk: 'High'
      },
      {
        product: 'Personal Loans',
        currentUtilization: 68.2,
        utilizationTrend: '+12pp',
        currentDPD: 5.8,
        dpd30Projection: 9.2,
        exposureM: 125,
        contagionRisk: 'High'
      },
      {
        product: 'Auto Loans',
        currentUtilization: 88.5,
        utilizationTrend: '+8pp',
        currentDPD: 4.2,
        dpd30Projection: 6.8,
        exposureM: 340,
        contagionRisk: 'Medium'
      },
      {
        product: 'Student Loans',
        currentUtilization: 92.3,
        utilizationTrend: '+2pp',
        currentDPD: 7.2,
        dpd30Projection: 8.5,
        exposureM: 95,
        contagionRisk: 'Low'
      }
    ],
    config: {
      columns: [
        { key: 'product', header: 'Product Type', format: 'text', align: 'left' },
        { key: 'currentUtilization', header: 'Current Util (%)', format: 'number', align: 'center' },
        { key: 'utilizationTrend', header: 'Util Δ (QoQ)', format: 'text', align: 'center' },
        { key: 'currentDPD', header: 'Current 30+ DPD (%)', format: 'number', align: 'center' },
        { key: 'dpd30Projection', header: '90-Day DPD Proj (%)', format: 'number', align: 'center' },
        { key: 'exposureM', header: 'Exposure ($M)', format: 'currency', align: 'right' },
        { key: 'contagionRisk', header: 'Contagion Risk', format: 'text', align: 'center' }
      ],
      heatmapConfig: {
        minValue: 0,
        maxValue: 100,
        colorScale: ['#dcfce7', '#fef08a', '#fca5a5', '#dc2626']
      },
      showLegend: false,
      showGrid: true
    },
    filterField: 'product',
    filterLabel: 'Product: {value}'
  }
];
