/**
 * Mock CCO Dashboard Data
 * Generates test data for 10 advanced portfolio health KPIs per PRD requirements
 */

import type {
  AdvancedKPI,
  KPITooltip,
  QuickMortalityData,
  ForwardDelinquencyForecast,
  VintageAnalysis,
  PBIData,
  PDMigrationData,
  ConcentrationData,
  UtilizationStressData,
  ReversionRateData,
  ECLSensitivityData,
} from '../types';

// ============================================================================
// KPI TOOLTIP DEFINITIONS (Per PRD Requirements)
// ============================================================================

export const KPI_TOOLTIPS: Record<string, KPITooltip> = {
  quick_mortality: {
    definition: '% of new loans (≤6 months vintage) entering early delinquency',
    formula: '(New loans with 30+ DPD / Total new loans ≤6mo) × 100',
    businessImplication: 'High values indicate poor origination quality',
  },
  forward_delinquency: {
    definition: 'Predicted delinquencies in next 90 days using ML model',
    formula: 'Σ(EAD × Forecasted PD) for accounts expected to default',
    businessImplication: 'Enables proactive provisioning and early intervention',
  },
  pbi: {
    definition: 'Behavioral stress score from payment patterns',
    formula: 'Weighted score (partial payments 30%, utilization spikes 40%, bounced payments 30%)',
    businessImplication: 'Detects stress before formal delinquency',
  },
  vdi: {
    definition: 'Current vintage performance vs historical median',
    formula: '(Current vintage cumulative DPD / Historical median DPD at same age)',
    businessImplication: 'Indicates deterioration in credit quality by cohort',
  },
  net_pd_migration: {
    definition: 'Net movement of exposures into worse PD/IFRS stages',
    formula: 'Σ(Downgrades × EAD) - Σ(Upgrades × EAD)',
    businessImplication: 'Tracks portfolio worsening momentum',
  },
  concentration_contagion: {
    definition: 'Systemic risk from top exposures and connected parties',
    formula: 'Σ(EAD × PD × LGD) for top 50 obligors + group linkages',
    businessImplication: 'Measures correlated default risk',
  },
  utilization_stress: {
    definition: '% of revolvers with sudden utilization spikes',
    formula: '(Accounts with >25pp utilization rise in 30d OR >90% usage) / Total revolvers × 100',
    businessImplication: 'Detects liquidity stress in borrowers',
  },
  reversion_rate: {
    definition: '% of restructured accounts returning to default',
    formula: '(Restructured accounts → 90+ DPD within 6-12mo) / Total restructured × 100',
    businessImplication: 'Assesses sustainability of restructuring',
  },
  ecl_sensitivity: {
    definition: 'Expected change in ECL under mild stress scenario',
    formula: 'Δ(PD × EAD × LGD) for next 3 months (base vs stress)',
    businessImplication: 'Quantifies near-term provision requirements',
  },
  pphs: {
    definition: 'Composite portfolio health index',
    formula: 'Weighted avg: Quick Mortality (20%) + Forward Delinq (20%) + Net PD Migration (15%) + VDI (15%) + PBI (10%) + others',
    businessImplication: 'Single health score for executive oversight',
  },
};

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Generate Quick Mortality Data - KPI #2
 * Mock data for loans ≤6 months old entering early delinquency
 */
export function generateMockQuickMortalityData(): QuickMortalityData[] {
  const channels = ['Branch', 'Digital', 'DSA'];
  const products = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan'];
  const geographies = ['North', 'South', 'East', 'West'];

  const data: QuickMortalityData[] = [];

  // Generate last 6 months of data
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - month));
    const vintage = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const originationMonth = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    channels.forEach((channel) => {
      products.forEach((product) => {
        geographies.forEach((geography) => {
          const totalNewLoans = Math.floor(Math.random() * 500) + 100;
          // Digital channel has slightly higher mortality (worse quality)
          const baseRate = channel === 'Digital' ? 0.06 : 0.04;
          const earlyDelinquentLoans = Math.floor(totalNewLoans * (baseRate + (Math.random() * 0.03 - 0.015)));
          const mortalityRatio = (earlyDelinquentLoans / totalNewLoans) * 100;

          data.push({
            vintage,
            originationMonth,
            totalNewLoans,
            earlyDelinquentLoans,
            mortalityRatio,
            channel,
            product,
            geography,
          });
        });
      });
    });
  }

  return data;
}

/**
 * Generate Forward Delinquency Forecast - KPI #3
 * ML-predicted defaults in next 90 days
 */
export function generateMockForwardDelinquencyForecast(): ForwardDelinquencyForecast {
  const contributorNames = [
    'ABC Manufacturing Ltd',
    'XYZ Textiles Pvt Ltd',
    'Global Trading Corp',
    'Sunrise Enterprises',
    'Metro Retail Chain',
    'TechStart Solutions',
    'Green Energy Co',
    'Urban Developers Ltd',
    'Premier Logistics',
    'Coastal Imports Inc',
  ];

  return {
    forecastPeriod: '90d',
    expectedSlippages: 127,
    expectedSlippagesValue: 45200000,
    confidence: 0.82,
    topContributors: contributorNames.map((name, idx) => ({
      accountId: `LA${String(100000 + idx).padStart(6, '0')}`,
      borrowerName: name,
      currentStatus: idx < 3 ? 'Watchlist' : 'Performing',
      predictedPD: 0.15 + Math.random() * 0.35, // 15-50% PD
      ead: 2000000 + Math.random() * 8000000,
      expectedLoss: 0, // Will calculate
    })).map(c => ({
      ...c,
      expectedLoss: c.ead * c.predictedPD * 0.45, // Assuming 45% LGD
    })),
  };
}

/**
 * Generate Vintage Analysis - KPI #5
 * Performance tracking by origination cohort
 */
export function generateMockVintageAnalysis(): VintageAnalysis[] {
  const vintages = ['2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2', '2024-Q3'];

  return vintages.map((vintage, idx) => {
    const ageInMonths = (vintages.length - idx) * 3 + 3;
    const historicalMedianDPD = 2.5 + (ageInMonths * 0.08); // Gradually increases
    // Recent vintages showing slight deterioration (VDI > 1)
    const deteriorationFactor = idx >= 5 ? 1.15 + (Math.random() * 0.15) : 0.95 + (Math.random() * 0.1);
    const currentDPDRate = historicalMedianDPD * deteriorationFactor;

    return {
      vintage,
      ageInMonths,
      currentDPDRate,
      historicalMedianDPD,
      deteriorationIndex: currentDPDRate / historicalMedianDPD,
    };
  });
}

/**
 * Generate PBI Data - KPI #4
 * Behavioral stress indicators
 */
export function generateMockPBIData(): PBIData[] {
  const borrowerNames = [
    'Alpha Industries',
    'Beta Enterprises',
    'Gamma Corp',
    'Delta Services',
    'Epsilon Trading',
  ];

  return borrowerNames.map((name, idx) => {
    const partialPaymentScore = 20 + Math.random() * 60; // 20-80
    const utilizationSpikeScore = 30 + Math.random() * 50; // 30-80
    const bouncedPaymentScore = 10 + Math.random() * 40; // 10-50

    // Weighted composite: 30% partial, 40% utilization, 30% bounced
    const compositeBehaviorScore =
      (partialPaymentScore * 0.3) +
      (utilizationSpikeScore * 0.4) +
      (bouncedPaymentScore * 0.3);

    const riskBand: 'Low' | 'Medium' | 'High' | 'Critical' =
      compositeBehaviorScore < 30 ? 'Low' :
      compositeBehaviorScore < 50 ? 'Medium' :
      compositeBehaviorScore < 70 ? 'High' : 'Critical';

    return {
      accountId: `LA${String(200000 + idx).padStart(6, '0')}`,
      borrowerName: name,
      partialPaymentScore,
      utilizationSpikeScore,
      bouncedPaymentScore,
      compositeBehaviorScore,
      riskBand,
    };
  });
}

/**
 * Generate PD Migration Data - KPI #6
 * IFRS stage and PD band movements
 */
export function generateMockPDMigrationData(): PDMigrationData[] {
  const pdBands = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'];

  const migrations: PDMigrationData[] = [];

  // Stage migrations
  migrations.push({
    fromStage: 'Stage 1',
    toStage: 'Stage 2',
    exposureAmount: 28500000,
    accountCount: 45,
    direction: 'downgrade',
  });

  migrations.push({
    fromStage: 'Stage 2',
    toStage: 'Stage 3',
    exposureAmount: 12300000,
    accountCount: 18,
    direction: 'downgrade',
  });

  migrations.push({
    fromStage: 'Stage 2',
    toStage: 'Stage 1',
    exposureAmount: 8700000,
    accountCount: 12,
    direction: 'upgrade',
  });

  // PD band migrations (downgrades)
  for (let i = 0; i < pdBands.length - 1; i++) {
    if (Math.random() > 0.5) {
      migrations.push({
        fromStage: pdBands[i],
        toStage: pdBands[i + 1],
        exposureAmount: Math.random() * 5000000 + 1000000,
        accountCount: Math.floor(Math.random() * 10) + 2,
        direction: 'downgrade',
      });
    }
  }

  return migrations;
}

/**
 * Generate Concentration Data - KPI #7
 * Network of borrowers and group linkages
 */
export function generateMockConcentrationData(): ConcentrationData {
  const nodes = [
    { id: 'group1', name: 'Mega Corp Group', exposure: 50000000, type: 'group' as const, pd: 0.05, lgd: 0.45 },
    { id: 'b1', name: 'Mega Corp Manufacturing', exposure: 25000000, type: 'borrower' as const, pd: 0.04, lgd: 0.40 },
    { id: 'b2', name: 'Mega Corp Trading', exposure: 15000000, type: 'borrower' as const, pd: 0.06, lgd: 0.50 },
    { id: 'b3', name: 'Mega Corp Services', exposure: 10000000, type: 'borrower' as const, pd: 0.05, lgd: 0.45 },

    { id: 'group2', name: 'Sunshine Group', exposure: 35000000, type: 'group' as const, pd: 0.08, lgd: 0.50 },
    { id: 'b4', name: 'Sunshine Textiles', exposure: 20000000, type: 'borrower' as const, pd: 0.07, lgd: 0.48 },
    { id: 'b5', name: 'Sunshine Retail', exposure: 15000000, type: 'borrower' as const, pd: 0.09, lgd: 0.52 },

    { id: 'b6', name: 'Independent Steel Ltd', exposure: 22000000, type: 'borrower' as const, pd: 0.06, lgd: 0.42 },
    { id: 'b7', name: 'Standalone Pharma', exposure: 18000000, type: 'borrower' as const, pd: 0.04, lgd: 0.38 },
  ];

  const links = [
    { source: 'group1', target: 'b1', relationship: 'subsidiary' as const },
    { source: 'group1', target: 'b2', relationship: 'subsidiary' as const },
    { source: 'group1', target: 'b3', relationship: 'subsidiary' as const },
    { source: 'group2', target: 'b4', relationship: 'subsidiary' as const },
    { source: 'group2', target: 'b5', relationship: 'subsidiary' as const },
    { source: 'b1', target: 'b4', relationship: 'common_promoter' as const }, // Cross-group linkage
  ];

  // Calculate concentration index: Σ(EAD × PD × LGD)
  const concentrationIndex = nodes.reduce((sum, node) =>
    sum + (node.exposure * node.pd * node.lgd), 0
  );

  return { nodes, links, concentrationIndex };
}

/**
 * Generate Utilization Stress Data - KPI #8
 * Revolving credit line stress indicators
 */
export function generateMockUtilizationStressData(): UtilizationStressData[] {
  const borrowerNames = [
    'Quick Mart Retail',
    'Flash Electronics',
    'Speed Logistics',
    'Rapid Manufacturing',
    'Swift Services',
  ];

  return borrowerNames.map((name, idx) => {
    const previousUtilization = 50 + Math.random() * 30; // 50-80%
    const stressType = Math.random() > 0.5 ? 'spike' : 'max_usage';

    let currentUtilization: number;
    if (stressType === 'spike') {
      currentUtilization = previousUtilization + 30 + Math.random() * 15; // +30-45pp
    } else {
      currentUtilization = 92 + Math.random() * 7; // 92-99%
    }

    const stressFlagReason: 'spike' | 'max_usage' | 'both' =
      currentUtilization > 90 && (currentUtilization - previousUtilization) > 25 ? 'both' :
      (currentUtilization - previousUtilization) > 25 ? 'spike' : 'max_usage';

    return {
      accountId: `RL${String(300000 + idx).padStart(6, '0')}`,
      borrowerName: name,
      previousUtilization,
      currentUtilization: Math.min(currentUtilization, 99),
      utilizationDelta: currentUtilization - previousUtilization,
      creditLimit: 5000000 + Math.random() * 10000000,
      product: 'Revolving Credit',
      stressFlagReason,
    };
  });
}

/**
 * Generate Reversion Rate Data - KPI #9
 * Restructured accounts returning to default
 */
export function generateMockReversionRateData(): ReversionRateData[] {
  const borrowerNames = [
    'Revived Industries',
    'Phoenix Trading',
    'Comeback Corp',
    'Recovery Services',
    'Renewed Manufacturing',
  ];

  const restructureTypes: Array<'EMI_reduction' | 'tenor_extension' | 'interest_waiver'> = [
    'EMI_reduction',
    'tenor_extension',
    'interest_waiver',
  ];

  return borrowerNames.map((name, idx) => {
    const monthsSinceRestructure = 6 + Math.floor(Math.random() * 12); // 6-18 months
    const revertedToDefault = Math.random() < 0.25; // 25% reversion rate
    const currentStatus: 'performing' | 'delinquent' | 'default' =
      revertedToDefault ? 'default' :
      Math.random() < 0.2 ? 'delinquent' : 'performing';

    const date = new Date();
    date.setMonth(date.getMonth() - monthsSinceRestructure);

    return {
      restructureDate: date.toISOString().split('T')[0],
      accountId: `RS${String(400000 + idx).padStart(6, '0')}`,
      borrowerName: name,
      restructureType: restructureTypes[idx % 3],
      originalExposure: 5000000 + Math.random() * 10000000,
      currentStatus,
      monthsSinceRestructure,
      revertedToDefault,
    };
  });
}

/**
 * Generate ECL Sensitivity Data - KPI #10
 * Provision requirements under stress scenarios
 */
export function generateMockECLSensitivityData(): ECLSensitivityData[] {
  const baseECL = 45000000;
  const basePD = 0.05;
  const baseEAD = 500000000;
  const baseLGD = 0.45;

  return [
    {
      scenario: 'base',
      pdContribution: basePD * baseEAD * baseLGD,
      eadContribution: 0,
      lgdContribution: 0,
      totalECL: baseECL,
      deltaFromBase: 0,
    },
    {
      scenario: 'mild_stress',
      pdContribution: (basePD * 1.5) * baseEAD * baseLGD, // PD +50%
      eadContribution: basePD * (baseEAD * 1.1) * baseLGD - basePD * baseEAD * baseLGD, // EAD +10%
      lgdContribution: basePD * baseEAD * (baseLGD * 1.2) - basePD * baseEAD * baseLGD, // LGD +20%
      totalECL: baseECL * 1.8, // ~80% increase
      deltaFromBase: baseECL * 0.8,
    },
    {
      scenario: 'severe_stress',
      pdContribution: (basePD * 2.5) * baseEAD * baseLGD, // PD +150%
      eadContribution: basePD * (baseEAD * 1.25) * baseLGD - basePD * baseEAD * baseLGD, // EAD +25%
      lgdContribution: basePD * baseEAD * (baseLGD * 1.4) - basePD * baseEAD * baseLGD, // LGD +40%
      totalECL: baseECL * 3.2, // ~220% increase
      deltaFromBase: baseECL * 2.2,
    },
  ];
}

// ============================================================================
// MASTER KPI CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate all 10 CCO Dashboard KPIs with mock data
 * Returns AdvancedKPI objects ready for display
 */
export function calculateCCOKPIs(): Record<string, AdvancedKPI> {
  // Generate mock data
  const mortalityData = generateMockQuickMortalityData();
  const forecastData = generateMockForwardDelinquencyForecast();
  const vintageData = generateMockVintageAnalysis();
  const pbiData = generateMockPBIData();
  const concentrationData = generateMockConcentrationData();
  const utilizationData = generateMockUtilizationStressData();
  const reversionData = generateMockReversionRateData();
  const eclData = generateMockECLSensitivityData();

  // Calculate averages/aggregates
  const avgMortality = mortalityData.reduce((sum, d) => sum + d.mortalityRatio, 0) / mortalityData.length;
  const latestVDI = vintageData[vintageData.length - 1]?.deteriorationIndex || 1.0;
  const avgPBI = pbiData.reduce((sum, d) => sum + d.compositeBehaviorScore, 0) / pbiData.length;
  const utilizationStressAccounts = utilizationData.length;
  const totalRevolvers = 150; // Mock total
  const utilizationStressPercent = (utilizationStressAccounts / totalRevolvers) * 100;
  const reversionRate = (reversionData.filter(d => d.revertedToDefault).length / reversionData.length) * 100;

  // Net PD Migration: sum downgrades - upgrades (weighted by exposure)
  const migrationData = generateMockPDMigrationData();
  const netMigration = migrationData.reduce((sum, m) =>
    sum + (m.direction === 'downgrade' ? m.exposureAmount : -m.exposureAmount), 0
  );

  // KPI #1: PPHS (Composite Score)
  const pphs: AdvancedKPI = {
    id: 'pphs',
    label: 'Portfolio Health Score (PPHS)',
    value: 72.5, // Composite score 0-100
    unit: 'percent',
    trend: 'down', // Down is good for health score
    changePercent: -2.3,
    tooltip: KPI_TOOLTIPS.pphs,
    threshold: {
      green: 70,
      amber: 50,
      status: 72.5 >= 70 ? 'green' : 72.5 >= 50 ? 'amber' : 'red',
    },
    alertSeverity: 'none',
    components: [
      { name: 'Quick Mortality', weight: 20, value: avgMortality },
      { name: 'Forward Delinquency', weight: 20, value: forecastData.expectedSlippages },
      { name: 'Net PD Migration', weight: 15, value: netMigration / 1000000 }, // In millions
      { name: 'Vintage Deterioration', weight: 15, value: (latestVDI - 1) * 100 },
      { name: 'Behavior Index', weight: 10, value: avgPBI },
      { name: 'Other Factors', weight: 20, value: 15 },
    ],
  };

  // KPI #2: Quick Mortality
  const quickMortality: AdvancedKPI = {
    id: 'quick_mortality',
    label: 'Quick Mortality Ratio',
    value: avgMortality,
    unit: 'percent',
    trend: avgMortality < 4.0 ? 'down' : avgMortality > 5.5 ? 'up' : 'stable',
    changePercent: -0.4,
    tooltip: KPI_TOOLTIPS.quick_mortality,
    drilldownUrl: '/api/kpi/quick_mortality/drilldown',
    threshold: {
      green: 3.0,
      amber: 5.0,
      status: avgMortality <= 3.0 ? 'green' : avgMortality <= 5.0 ? 'amber' : 'red',
    },
    alertSeverity: avgMortality > 5.0 ? 'warning' : 'none',
    breachReason: avgMortality > 5.0 ? 'Exceeds 5% amber threshold' : undefined,
    topContributingSegment: 'Digital Channel - Personal Loans',
  };

  // KPI #3: Forward Delinquency Forecast
  const forwardDelinquency: AdvancedKPI = {
    id: 'forward_delinquency',
    label: 'Forward Delinquency (90d)',
    value: forecastData.expectedSlippages,
    unit: 'currency',
    trend: 'up',
    changePercent: 8.2,
    tooltip: KPI_TOOLTIPS.forward_delinquency,
    drilldownUrl: '/api/kpi/forward_delinquency/drilldown',
    threshold: {
      green: 100,
      amber: 150,
      status: forecastData.expectedSlippages <= 100 ? 'green' : forecastData.expectedSlippages <= 150 ? 'amber' : 'red',
    },
    alertSeverity: 'none',
  };

  // KPI #4: Pre-Delinquency Behavior Index
  const pbi: AdvancedKPI = {
    id: 'pbi',
    label: 'Pre-Delinquency Behavior Index',
    value: avgPBI,
    unit: 'percent',
    trend: 'up',
    changePercent: 2.1,
    tooltip: KPI_TOOLTIPS.pbi,
    drilldownUrl: '/api/kpi/pbi/drilldown',
    threshold: {
      green: 30.0,
      amber: 50.0,
      status: avgPBI <= 30.0 ? 'green' : avgPBI <= 50.0 ? 'amber' : 'red',
    },
    alertSeverity: avgPBI > 50.0 ? 'critical' : avgPBI > 30.0 ? 'warning' : 'none',
    breachReason: avgPBI > 50.0 ? 'Critical behavioral stress detected' : avgPBI > 30.0 ? 'Above normal stress levels' : undefined,
    topContributingSegment: 'SME Segment',
  };

  // KPI #5: Vintage Deterioration Index
  const vdi: AdvancedKPI = {
    id: 'vdi',
    label: 'Vintage Deterioration Index',
    value: latestVDI * 100,
    unit: 'percent',
    trend: latestVDI > 1.0 ? 'up' : 'down',
    changePercent: (latestVDI - 1.0) * 100,
    tooltip: KPI_TOOLTIPS.vdi,
    drilldownUrl: '/api/kpi/vdi/drilldown',
    threshold: {
      green: 100,
      amber: 120,
      status: latestVDI * 100 <= 100 ? 'green' : latestVDI * 100 <= 120 ? 'amber' : 'red',
    },
    alertSeverity: latestVDI > 1.2 ? 'critical' : latestVDI > 1.0 ? 'warning' : 'none',
    breachReason: latestVDI > 1.2 ? 'Significant vintage deterioration' : latestVDI > 1.0 ? 'Slight deterioration vs historical' : undefined,
    topContributingSegment: '2024-Q2 Vintage - Auto Loans',
  };

  // KPI #6: Net PD Migration
  const netPDMigration: AdvancedKPI = {
    id: 'net_pd_migration',
    label: 'Net PD Migration',
    value: netMigration,
    unit: 'currency',
    trend: 'up',
    changePercent: 12.5,
    tooltip: KPI_TOOLTIPS.net_pd_migration,
    drilldownUrl: '/api/kpi/net_pd_migration/drilldown',
    threshold: {
      green: 10000000,
      amber: 25000000,
      status: netMigration <= 10000000 ? 'green' : netMigration <= 25000000 ? 'amber' : 'red',
    },
    alertSeverity: netMigration > 25000000 ? 'warning' : 'none',
    breachReason: netMigration > 25000000 ? 'High negative migration momentum' : undefined,
  };

  // KPI #7: Concentration & Contagion
  const concentration: AdvancedKPI = {
    id: 'concentration_contagion',
    label: 'Concentration & Contagion Index',
    value: concentrationData.concentrationIndex,
    unit: 'currency',
    trend: 'stable',
    changePercent: 0.8,
    tooltip: KPI_TOOLTIPS.concentration_contagion,
    drilldownUrl: '/api/kpi/concentration_contagion/drilldown',
    threshold: {
      green: 20000000,
      amber: 35000000,
      status: concentrationData.concentrationIndex <= 20000000 ? 'green' : concentrationData.concentrationIndex <= 35000000 ? 'amber' : 'red',
    },
    alertSeverity: 'none',
  };

  // KPI #8: Utilization & Liquidity Stress
  const utilizationStress: AdvancedKPI = {
    id: 'utilization_stress',
    label: 'Utilization & Liquidity Stress',
    value: utilizationStressPercent,
    unit: 'percent',
    trend: 'up',
    changePercent: 1.5,
    tooltip: KPI_TOOLTIPS.utilization_stress,
    drilldownUrl: '/api/kpi/utilization_stress/drilldown',
    threshold: {
      green: 5.0,
      amber: 10.0,
      status: utilizationStressPercent <= 5.0 ? 'green' : utilizationStressPercent <= 10.0 ? 'amber' : 'red',
    },
    alertSeverity: 'none',
  };

  // KPI #9: Restructure Reversion Rate
  const reversionRate_kpi: AdvancedKPI = {
    id: 'reversion_rate',
    label: 'Restructure Reversion Rate',
    value: reversionRate,
    unit: 'percent',
    trend: reversionRate < 20 ? 'down' : 'up',
    changePercent: -3.2,
    tooltip: KPI_TOOLTIPS.reversion_rate,
    drilldownUrl: '/api/kpi/reversion_rate/drilldown',
    threshold: {
      green: 15.0,
      amber: 25.0,
      status: reversionRate <= 15.0 ? 'green' : reversionRate <= 25.0 ? 'amber' : 'red',
    },
    alertSeverity: 'none',
  };

  // KPI #10: ECL Sensitivity
  const mildStressECL = eclData.find(d => d.scenario === 'mild_stress');
  const eclSensitivity: AdvancedKPI = {
    id: 'ecl_sensitivity',
    label: 'Forward ECL Sensitivity',
    value: mildStressECL?.deltaFromBase || 0,
    unit: 'currency',
    trend: 'up',
    changePercent: 5.8,
    tooltip: KPI_TOOLTIPS.ecl_sensitivity,
    drilldownUrl: '/api/kpi/ecl_sensitivity/drilldown',
    threshold: {
      green: 30000000,
      amber: 45000000,
      status: (mildStressECL?.deltaFromBase || 0) <= 30000000 ? 'green' : (mildStressECL?.deltaFromBase || 0) <= 45000000 ? 'amber' : 'red',
    },
    alertSeverity: 'none',
  };

  return {
    pphs,
    quick_mortality: quickMortality,
    forward_delinquency: forwardDelinquency,
    pbi,
    vdi,
    net_pd_migration: netPDMigration,
    concentration_contagion: concentration,
    utilization_stress: utilizationStress,
    reversion_rate: reversionRate_kpi,
    ecl_sensitivity: eclSensitivity,
  };
}
