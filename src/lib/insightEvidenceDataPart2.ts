import type { EvidenceChart } from '../types';

// This file contains additional insight evidence charts (Part 2)
// To be merged with insightEvidenceData.ts

// ============================================================================
// INSIGHT 3: Sector Stress Alert (Real Estate & NBFC)
// ID: cmi_insight_1
// ============================================================================

export const sectorStressCharts: EvidenceChart[] = [
  {
    id: 'sector_stress_chart_1',
    title: 'Sector Performance vs Market Benchmark',
    keyHighlight: 'Real Estate CMI at 61.5 vs market 57.0 (+4.5 gap); NBFC at 58.4 vs 54.8 (+3.6 gap)',
    chartType: 'line',
    data: [
      { quarter: 'Q1 23', reCMI: 55.2, reMarket: 54.8, nbfcCMI: 54.5, nbfcMarket: 53.2 },
      { quarter: 'Q2 23', reCMI: 56.8, reMarket: 55.2, nbfcCMI: 55.2, nbfcMarket: 53.8 },
      { quarter: 'Q3 23', reCMI: 58.5, reMarket: 56.1, nbfcCMI: 56.1, nbfcMarket: 54.2 },
      { quarter: 'Q4 23', reCMI: 59.8, reMarket: 56.5, nbfcCMI: 57.2, nbfcMarket: 54.5 },
      { quarter: 'Q1 24', reCMI: 60.5, reMarket: 56.8, nbfcCMI: 57.8, nbfcMarket: 54.6 },
      { quarter: 'Q2 24', reCMI: 61.5, reMarket: 57.0, nbfcCMI: 58.4, nbfcMarket: 54.8 },
    ],
    config: {
      xAxis: { key: 'quarter', label: 'Quarter' },
      yAxis: { key: 'cmi', label: 'CMI Index', format: 'number' },
      series: [
        { key: 'reCMI', name: 'Bank RE CMI', color: '#ef4444' },
        { key: 'reMarket', name: 'Market RE Index', color: '#fb923c' },
        { key: 'nbfcCMI', name: 'Bank NBFC CMI', color: '#dc2626' },
        { key: 'nbfcMarket', name: 'Market NBFC Index', color: '#fbbf24' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },
  {
    id: 'sector_stress_chart_2',
    title: 'Internal vs External Rating Gap Analysis',
    keyHighlight: 'Sample accounts showing >2 notch gap between internal and external ratings - representing $58M exposure',
    chartType: 'scatter',
    data: [
      { company: 'ABC RE', internalRating: 7, externalRating: 4, exposure: 85, sector: 'Real Estate' },
      { company: 'XYZ NBFC', internalRating: 6, externalRating: 4, exposure: 65, sector: 'NBFC' },
      { company: 'Delta Properties', internalRating: 8, externalRating: 5, exposure: 45, sector: 'Real Estate' },
      { company: 'Omega Finance', internalRating: 7, externalRating: 4, exposure: 58, sector: 'NBFC' },
      { company: 'Sigma Realty', internalRating: 6, externalRating: 3, exposure: 72, sector: 'Real Estate' },
      { company: 'Gamma NBFC', internalRating: 8, externalRating: 6, exposure: 38, sector: 'NBFC' },
      { company: 'Beta Builders', internalRating: 7, externalRating: 5, exposure: 42, sector: 'Real Estate' },
      { company: 'Alpha Finance', internalRating: 6, externalRating: 4, exposure: 48, sector: 'NBFC' },
      { company: 'Theta RE', internalRating: 7, externalRating: 4, exposure: 32, sector: 'Real Estate' },
    ],
    config: {
      xAxis: { key: 'internalRating', label: 'Internal Rating (1-10)', type: 'number' },
      yAxis: { key: 'externalRating', label: 'External Rating (1-10)', type: 'number' },
      series: [{ key: 'exposure', name: 'Exposure ($ M)', color: '#ef4444' }],
      showLegend: false,
    },
    filterField: 'borrowerName',
    filterLabel: 'Company: {value}'
  },
  {
    id: 'sector_stress_chart_3',
    title: 'Rating Migration: Downgrade Concentration',
    keyHighlight: '68% of downgrades from these 2 sectors - concentration risk at critical level',
    chartType: 'bar',
    data: [
      { sector: 'Real Estate', downgrades: 42, upgrades: 8, stable: 125 },
      { sector: 'NBFC', downgrades: 35, upgrades: 12, stable: 98 },
      { sector: 'Infrastructure', downgrades: 18, upgrades: 15, stable: 142 },
      { sector: 'Manufacturing', downgrades: 12, upgrades: 22, stable: 178 },
      { sector: 'Services', downgrades: 8, upgrades: 18, stable: 156 },
    ],
    config: {
      xAxis: { key: 'sector', label: 'Sector' },
      yAxis: { key: 'count', label: 'Account Count', format: 'number' },
      series: [
        { key: 'downgrades', name: 'Downgrades', color: '#ef4444' },
        { key: 'stable', name: 'Stable', color: '#10b981' },
        { key: 'upgrades', name: 'Upgrades', color: '#3b82f6' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },
  {
    id: 'sector_stress_chart_4',
    title: 'Rating Update Lag - Accounts Requiring Review',
    keyHighlight: 'Sample showing 4 critical accounts with >90 days lag since external downgrade - immediate review required',
    chartType: 'table',
    data: [
      { borrower: 'ABC Real Estate Co', exposure: 85, bankRating: 'BBB+', extRating: 'BBB-', gap: 2, extDate: '2024-06-15', days: 148, alert: true },
      { borrower: 'XYZ NBFC Ltd', exposure: 65, bankRating: 'BBB', extRating: 'BB+', gap: 2, extDate: '2024-07-01', days: 132, alert: true },
      { borrower: 'Delta Properties', exposure: 45, bankRating: 'A-', extRating: 'BBB', gap: 2, extDate: '2024-07-20', days: 113, alert: true },
      { borrower: 'Omega Finance Corp', exposure: 58, bankRating: 'BBB+', extRating: 'BBB-', gap: 2, extDate: '2024-08-05', days: 97, alert: true },
      { borrower: 'Sigma Developers', exposure: 72, bankRating: 'BBB', extRating: 'BB+', gap: 2, extDate: '2024-08-15', days: 87, alert: false },
    ],
    config: {
      columns: [
        { key: 'borrower', header: 'Borrower Name', format: 'text', align: 'left' },
        { key: 'exposure', header: 'Exposure ($ M)', format: 'currency', align: 'right' },
        { key: 'bankRating', header: 'Bank Rating', format: 'text', align: 'center' },
        { key: 'extRating', header: 'Ext. Rating', format: 'text', align: 'center' },
        { key: 'gap', header: 'Gap (notches)', format: 'number', align: 'center' },
        { key: 'days', header: 'Days Since', format: 'number', align: 'center' },
      ],
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },
  {
    id: 'sector_stress_chart_5',
    title: 'Sub-Sector Exposure Breakdown',
    keyHighlight: 'Commercial Office and Housing Finance showing highest stress - 44% of sector exposure ($42M of $96M)',
    chartType: 'bar',
    data: [
      { subsector: 'Commercial Office', exposure: 185, stress: 42 },
      { subsector: 'Housing Finance', exposure: 168, stress: 38 },
      { subsector: 'Residential Dev', exposure: 142, stress: 28 },
      { subsector: 'Vehicle Finance', exposure: 125, stress: 22 },
      { subsector: 'Retail/Mall', exposure: 98, stress: 18 },
      { subsector: 'Gold Loan', exposure: 78, stress: 12 },
    ],
    config: {
      xAxis: { key: 'subsector', label: 'Sub-Sector' },
      yAxis: { key: 'value', label: 'Amount ($ M)', format: 'currency' },
      series: [
        { key: 'exposure', name: 'Total Exposure', color: '#3b82f6' },
        { key: 'stress', name: 'Stressed Exposure', color: '#ef4444' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'subSector',
    filterLabel: 'Sub-Sector: {value}'
  },
  {
    id: 'sector_stress_chart_6',
    title: 'BBB & Below Concentration',
    keyHighlight: '40% of Real Estate book and 35% of NBFC book rated BBB & below - significantly above bank average of 24%',
    chartType: 'bar',
    data: [
      { sector: 'Real Estate', bbbBelow: 40, bbbPlus: 32, aRange: 28 },
      { sector: 'NBFC', bbbBelow: 35, bbbPlus: 38, aRange: 27 },
      { sector: 'Infrastructure', bbbBelow: 28, bbbPlus: 42, aRange: 30 },
      { sector: 'Manufacturing', bbbBelow: 18, bbbPlus: 45, aRange: 37 },
      { sector: 'Bank Average', bbbBelow: 24, bbbPlus: 41, aRange: 35 },
    ],
    config: {
      xAxis: { key: 'sector', label: 'Sector' },
      yAxis: { key: 'percentage', label: 'Portfolio %', format: 'percent' },
      series: [
        { key: 'bbbBelow', name: 'BBB & Below', color: '#ef4444' },
        { key: 'bbbPlus', name: 'BBB+', color: '#f59e0b' },
        { key: 'aRange', name: 'A Range & Above', color: '#10b981' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'ratingCategory',
    filterLabel: 'Rating: {value}'
  },
];

// ============================================================================
// INSIGHT 4: Tariff Impact
// ID: weighted_pd_insight_2
// ============================================================================

export const tariffImpactCharts: EvidenceChart[] = [
  {
    id: 'tariff_impact_chart_1',
    title: 'Portfolio Exposure Mapping',
    keyHighlight: '$463M (35% of portfolio) directly or indirectly impacted by tariff announcements',
    chartType: 'bar',
    data: [
      { category: 'Direct Impact', exposure: 2145, percentage: 19.3 },
      { category: 'Indirect Impact', exposure: 1702, percentage: 15.3 },
      { category: 'Not Impacted', exposure: 7253, percentage: 65.4 },
    ],
    config: {
      xAxis: { key: 'category', label: 'Impact Category' },
      yAxis: { key: 'exposure', label: 'Exposure ($ M)', format: 'currency' },
      series: [{ key: 'exposure', name: 'Exposure', color: '#ef4444' }],
      showLegend: false,
      showGrid: true,
    }
  },
  {
    id: 'tariff_impact_chart_2',
    title: 'Sector-wise Exposure & Import Dependency',
    keyHighlight: 'Manufacturing has $257M exposure with 65% import dependency - highest risk',
    chartType: 'table',
    data: [
      { sector: 'Manufacturing', exposure: 2135, preMargin: 8.5, importDep: 65, impact: 'High' },
      { sector: 'Auto & Components', exposure: 892, preMargin: 7.2, importDep: 58, impact: 'High' },
      { sector: 'Electronics', exposure: 820, preMargin: 9.8, importDep: 72, impact: 'High' },
      { sector: 'Pharma', exposure: 485, preMargin: 12.5, importDep: 42, impact: 'Medium' },
      { sector: 'Textiles', exposure: 315, preMargin: 6.8, importDep: 48, impact: 'Medium' },
      { sector: 'Other', exposure: 200, preMargin: 10.2, importDep: 28, impact: 'Low' },
    ],
    config: {
      columns: [
        { key: 'sector', header: 'Sector', format: 'text', align: 'left' },
        { key: 'exposure', header: 'Exposure ($ M)', format: 'currency', align: 'right' },
        { key: 'preMargin', header: 'Pre-Tariff Margin %', format: 'percent', align: 'right' },
        { key: 'importDep', header: 'Import Dep %', format: 'percent', align: 'right' },
        { key: 'impact', header: 'Impact Rating', format: 'text', align: 'center' },
      ],
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },
  {
    id: 'tariff_impact_chart_3',
    title: 'Margin Compression Analysis',
    keyHighlight: 'Average 180-220 bps margin compression expected across impacted sectors',
    chartType: 'bar',
    data: [
      { sector: 'Manufacturing', preTariff: 8.5, postTariff: 6.3, compression: 2.2 },
      { sector: 'Auto', preTariff: 7.2, postTariff: 5.4, compression: 1.8 },
      { sector: 'Electronics', preTariff: 9.8, postTariff: 7.5, compression: 2.3 },
      { sector: 'Pharma', preTariff: 12.5, postTariff: 11.0, compression: 1.5 },
      { sector: 'Textiles', preTariff: 6.8, postTariff: 5.2, compression: 1.6 },
    ],
    config: {
      xAxis: { key: 'sector', label: 'Sector' },
      yAxis: { key: 'margin', label: 'Margin %', format: 'percent' },
      series: [
        { key: 'preTariff', name: 'Pre-Tariff Margin', color: '#10b981' },
        { key: 'postTariff', name: 'Post-Tariff Margin (Est.)', color: '#ef4444' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },
  {
    id: 'tariff_impact_chart_4',
    title: 'Borrower Vulnerability Matrix',
    keyHighlight: 'Sample borrowers in critical quadrant with high margin compression (>2%) and low ICR (<2.5x)',
    chartType: 'scatter',
    data: [
      { company: 'ABC Steel', marginComp: 2.8, icr: 2.1, exposure: 125, quad: 'Critical' },
      { company: 'XYZ Auto', marginComp: 2.2, icr: 2.3, exposure: 98, quad: 'Critical' },
      { company: 'Delta Electronics', marginComp: 2.5, icr: 2.0, exposure: 85, quad: 'Critical' },
      { company: 'Omega Pharma', marginComp: 1.5, icr: 3.5, exposure: 72, quad: 'Monitor' },
      { company: 'Sigma Textiles', marginComp: 1.8, icr: 2.2, exposure: 65, quad: 'Critical' },
      { company: 'Gamma Manufacturing', marginComp: 2.0, icr: 2.8, exposure: 58, quad: 'Watch' },
      { company: 'Beta Components', marginComp: 1.2, icr: 3.2, exposure: 48, quad: 'Monitor' },
      { company: 'Alpha Steel', marginComp: 2.3, icr: 2.4, exposure: 52, quad: 'Critical' },
    ],
    config: {
      xAxis: { key: 'marginComp', label: 'Margin Compression %', type: 'number' },
      yAxis: { key: 'icr', label: 'Pre-Tariff ICR', type: 'number' },
      series: [{ key: 'exposure', name: 'Exposure ($ M)', color: '#ef4444' }],
      showLegend: false,
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },
  {
    id: 'tariff_impact_chart_5',
    title: 'Pass-Through Ability Assessment',
    keyHighlight: 'Sample showing varying pricing power - borrowers with "High" pricing power can better absorb tariff impacts',
    chartType: 'table',
    data: [
      { borrower: 'ABC Steel Co', exposure: 125, currentMargin: 8.2, compression: 2.8, pricingPower: 'Low', contractTerms: 'Fixed' },
      { borrower: 'XYZ Auto Parts', exposure: 98, currentMargin: 7.5, compression: 2.2, pricingPower: 'Medium', contractTerms: 'Variable' },
      { borrower: 'Delta Electronics', exposure: 85, currentMargin: 9.5, compression: 2.5, pricingPower: 'Low', contractTerms: 'Fixed' },
      { borrower: 'Omega Pharma', exposure: 72, currentMargin: 12.8, compression: 1.5, pricingPower: 'High', contractTerms: 'Variable' },
      { borrower: 'Sigma Textiles', exposure: 65, currentMargin: 6.5, compression: 1.8, pricingPower: 'Medium', contractTerms: 'Fixed' },
    ],
    config: {
      columns: [
        { key: 'borrower', header: 'Borrower Name', format: 'text', align: 'left' },
        { key: 'exposure', header: 'Exposure ($ M)', format: 'currency', align: 'right' },
        { key: 'currentMargin', header: 'Current Margin %', format: 'percent', align: 'right' },
        { key: 'compression', header: 'Compression %', format: 'percent', align: 'right' },
        { key: 'pricingPower', header: 'Pricing Power', format: 'text', align: 'center' },
        { key: 'contractTerms', header: 'Contract Terms', format: 'text', align: 'center' },
      ],
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },
  {
    id: 'tariff_impact_chart_6',
    title: 'Financial Metric Stress Test Results',
    keyHighlight: 'Sample accounts showing stressed ICR below 2.0x and DSCR below 1.25x in post-tariff scenario',
    chartType: 'bar',
    data: [
      { borrower: 'ABC Steel', currentICR: 2.5, stressedICR: 1.8, currentDSCR: 1.5, stressedDSCR: 1.1 },
      { borrower: 'XYZ Auto', currentICR: 2.8, stressedICR: 2.1, currentDSCR: 1.8, stressedDSCR: 1.3 },
      { borrower: 'Delta Electronics', currentICR: 2.4, stressedICR: 1.7, currentDSCR: 1.6, stressedDSCR: 1.0 },
      { borrower: 'Omega Pharma', currentICR: 3.5, stressedICR: 3.0, currentDSCR: 2.2, stressedDSCR: 1.8 },
      { borrower: 'Sigma Textiles', currentICR: 2.6, stressedICR: 1.9, currentDSCR: 1.7, stressedDSCR: 1.2 },
    ],
    config: {
      xAxis: { key: 'borrower', label: 'Borrower' },
      yAxis: { key: 'ratio', label: 'Coverage Ratio', format: 'number' },
      series: [
        { key: 'currentICR', name: 'Current ICR', color: '#10b981' },
        { key: 'stressedICR', name: 'Stressed ICR', color: '#ef4444' },
        { key: 'currentDSCR', name: 'Current DSCR', color: '#3b82f6' },
        { key: 'stressedDSCR', name: 'Stressed DSCR', color: '#dc2626' },
      ],
      showLegend: true,
      showGrid: true,
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },
];
