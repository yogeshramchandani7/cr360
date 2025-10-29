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
  VintageDelinquencyData,
  VintageMortalityData,
  OriginationQualityData,
  ModelDriftData,
  ModelPerformanceData,
  CampaignOriginationData,
  VerificationData,
  FraudData,
  ExceptionData,
  ChannelPerformanceData,
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

  // Quick Mortality Sub-KPIs
  qm_new_origination: {
    definition: 'Total sanctioned amount for new loan originations',
    formula: 'Σ(Sanctioned Amount) for all new loans in the period',
    businessImplication: 'Business growth momentum',
  },
  qm_weighted_pd: {
    definition: 'Probability of Default (weighted by exposure)',
    formula: 'Σ(PD × Exposure) / Σ(Exposure)',
    businessImplication: 'Lending quality',
  },
  qm_portfolio_raroc: {
    definition: 'Risk-Adjusted Return on Capital',
    formula: '(Net Income - Expected Loss) / Economic Capital × 100',
    businessImplication: 'Profitability discipline',
  },
  qm_rated_below_bbb: {
    definition: 'Share of weaker exposures rated BBB and below',
    formula: '(Σ Exposure with Rating ≤ BBB / Total Exposure) × 100',
    businessImplication: 'Portfolio quality trend',
  },
  qm_rwa_intensity: {
    definition: 'RWA per ₹ Cr Exposure',
    formula: 'Total RWA / (Total Exposure / 10,000,000)',
    businessImplication: 'Capital efficiency',
  },
  qm_weighted_tds_gds: {
    definition: 'Income coverage & affordability',
    formula: 'Σ((TDS + GDS) × Exposure) / (2 × Σ Exposure)',
    businessImplication: 'Borrower health',
  },
  qm_weighted_credit_score: {
    definition: 'Average score of new borrowers',
    formula: 'Σ(Credit Score × Sanctioned Amount) / Σ(Sanctioned Amount)',
    businessImplication: 'Counterparty strength',
  },
  qm_deviation_rate: {
    definition: '% proposals approved with policy deviations',
    formula: '(Policy Deviations / Total Approvals) × 100',
    businessImplication: 'Underwriting discipline',
  },
  qm_source_mix: {
    definition: '% Net New vs % Enhancements',
    formula: '(Net New Loans / Total Originations) × 100 : (Enhancements / Total Originations) × 100',
    businessImplication: 'Franchise growth vs deepening',
  },
  qm_mortality_12m: {
    definition: 'Early delinquency on recent vintages',
    formula: '(Loans with DPD ≤ 12 months / Total Recent Originations) × 100',
    businessImplication: 'Post-approval quality check',
  },
  qm_channel_mortality: {
    definition: 'Quick mortality rate by acquisition channel/partner and concentration',
    formula: 'Channel mortality = (12mo charge-offs / channel originations) × 100; Conc = channel % of total',
    businessImplication: 'Single bad partner or channel can move overall mortality even if others are fine',
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

// ============================================================================
// Quick Mortality Sub-KPI Data Generators
// ============================================================================

/**
 * Generate 30-Day Delinquency Data by Vintage (Sub-KPI #1)
 * Latest origination vintages hitting 30 DPD
 */
export function generateMock30DayDelinquencyData(): VintageDelinquencyData[] {
  const channels = ['Branch', 'Digital', 'DSA'];
  const products = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan'];
  const geographies = ['North', 'South', 'East', 'West'];
  const baselineRate = 1.8; // Historical 30 DPD baseline

  const data: VintageDelinquencyData[] = [];

  // Generate last 6 months of vintages
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - month));
    const vintage = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const originationMonth = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    channels.forEach((channel) => {
      products.forEach((product) => {
        geographies.forEach((geography) => {
          const totalAccounts = Math.floor(Math.random() * 800) + 200;

          // Recent months show concerning rise in Digital channel
          const channelFactor = channel === 'Digital' ? 1.25 : channel === 'DSA' ? 1.1 : 1.0;
          const timeFactor = month >= 4 ? 1.15 : 1.0; // Recent vintages worse
          const productFactor = product === 'Personal Loan' ? 1.2 : 1.0;

          const delinquency30DPDRate = baselineRate * channelFactor * timeFactor * productFactor * (0.9 + Math.random() * 0.3);
          const delinquent30DPDAccounts = Math.floor(totalAccounts * (delinquency30DPDRate / 100));
          const deltaFromBaseline = (delinquency30DPDRate - baselineRate) * 100; // Basis points

          data.push({
            vintage,
            originationMonth,
            totalAccounts,
            delinquent30DPDAccounts,
            delinquency30DPDRate,
            channel,
            product,
            geography,
            baselineRate,
            deltaFromBaseline,
          });
        });
      });
    });
  }

  return data;
}

/**
 * Generate 12-Month Quick Mortality Data by Cohort (Sub-KPI #2)
 * Cumulative charge-offs/NPAs within 12 months
 */
export function generateMock12MonthMortalityData(): VintageMortalityData[] {
  const channels = ['Branch', 'Digital', 'DSA'];
  const products = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan'];
  const data: VintageMortalityData[] = [];

  // Generate 12 months of vintage cohorts
  for (let month = 0; month < 12; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - month));
    const vintage = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const originationMonth = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const ageInMonths = 11 - month + 1;

    channels.forEach((channel) => {
      products.forEach((product) => {
        const totalAccounts = Math.floor(Math.random() * 1000) + 400;

        // Mortality increases with age and is worse for recent + Digital
        const ageFactor = ageInMonths / 12; // Scales 0-1
        const channelFactor = channel === 'Digital' ? 1.3 : channel === 'DSA' ? 1.15 : 1.0;
        const modeledExpectation = 4.0; // 4% expected mortality

        const cumulativeMortalityRate = modeledExpectation * ageFactor * channelFactor * (0.85 + Math.random() * 0.4);
        const chargedOffAccounts = Math.floor(totalAccounts * (cumulativeMortalityRate / 100) * 0.6);
        const npaAccounts = Math.floor(totalAccounts * (cumulativeMortalityRate / 100) * 0.4);
        const deltaFromExpectation = cumulativeMortalityRate - (modeledExpectation * ageFactor);

        data.push({
          vintage,
          originationMonth,
          ageInMonths,
          totalAccounts,
          chargedOffAccounts,
          npaAccounts,
          cumulativeMortalityRate,
          modeledExpectation: modeledExpectation * ageFactor,
          deltaFromExpectation,
          channel,
          product,
        });
      });
    });
  }

  return data;
}

/**
 * Generate Origination Quality Data (Sub-KPI #3)
 * Weighted-average credit scores by vintage/channel
 */
export function generateMockOriginationQualityData(): OriginationQualityData[] {
  const channels = ['Branch', 'Digital', 'DSA'];
  const products = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan'];
  const geographies = ['North', 'South', 'East', 'West'];
  const baselineScore = 720; // Historical baseline credit score

  const data: OriginationQualityData[] = [];

  // Generate last 6 months
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - month));
    const vintage = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const originationMonth = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    channels.forEach((channel) => {
      products.forEach((product) => {
        geographies.forEach((geography) => {
          const totalAccounts = Math.floor(Math.random() * 500) + 150;

          // Recent vintages show score degradation, especially Digital
          const channelScore = channel === 'Digital' ? -35 : channel === 'DSA' ? -20 : 0;
          const timeScore = month >= 4 ? -15 : 0; // Recent months worse
          const productScore = product === 'Home Loan' ? 40 : product === 'Personal Loan' ? -25 : 0;

          const weightedAvgCreditScore = baselineScore + channelScore + timeScore + productScore + (Math.random() * 30 - 15);
          const weightedAvgPD = Math.max(0.5, 8.0 - (weightedAvgCreditScore - 600) / 30); // Simple PD model
          const totalFundedAmount = totalAccounts * (50000 + Math.random() * 100000);
          const scoreDelta = weightedAvgCreditScore - baselineScore;

          data.push({
            vintage,
            originationMonth,
            weightedAvgCreditScore,
            weightedAvgPD,
            totalAccounts,
            totalFundedAmount,
            channel,
            product,
            geography,
            baselineScore,
            scoreDelta,
          });
        });
      });
    });
  }

  return data;
}

/**
 * Generate Model Drift Data (Sub-KPI #4)
 * Population Stability Index by feature
 */
export function generateMockModelDriftData(): ModelDriftData[] {
  const features = ['Credit Score', 'Income', 'LTV', 'DTI', 'Employment Type'];
  const channels = ['Branch', 'Digital', 'DSA'];
  const data: ModelDriftData[] = [];

  const date = new Date();
  const measurementPeriod = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  features.forEach((feature) => {
    channels.forEach((channel) => {
      // Digital channel shows more drift
      const basePSI = channel === 'Digital' ? 0.18 : channel === 'DSA' ? 0.12 : 0.08;
      const psiValue = basePSI + (Math.random() * 0.1 - 0.05);

      const drift: 'no_drift' | 'slight_drift' | 'moderate_drift' | 'severe_drift' =
        psiValue < 0.10 ? 'no_drift' :
        psiValue < 0.15 ? 'slight_drift' :
        psiValue < 0.25 ? 'moderate_drift' : 'severe_drift';

      // Generate mock distributions
      const expectedDistribution = [0.15, 0.25, 0.30, 0.20, 0.10];
      const actualDistribution = expectedDistribution.map((val) =>
        Math.max(0, val + (Math.random() * 0.1 - 0.05))
      );

      data.push({
        feature,
        psiValue,
        drift,
        expectedDistribution,
        actualDistribution,
        measurementPeriod,
        channel,
        threshold: 0.15,
      });
    });
  });

  return data;
}

/**
 * Generate Model Performance Data (Sub-KPI #5)
 * AUC/KS discrimination metrics
 */
export function generateMockModelPerformanceData(): ModelPerformanceData[] {
  const channels = ['Branch', 'Digital', 'DSA'];
  const products = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan'];
  const data: ModelPerformanceData[] = [];

  // Generate last 6 months
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - month));
    const measurementPeriod = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    channels.forEach((channel) => {
      products.forEach((product) => {
        const baselineAUC = 0.78; // Expected AUC from validation

        // Recent months show degradation, especially Digital
        const channelDegradation = channel === 'Digital' ? 0.04 : channel === 'DSA' ? 0.02 : 0.01;
        const timeDegradation = month >= 4 ? 0.02 : 0;

        const aucScore = baselineAUC - channelDegradation - timeDegradation + (Math.random() * 0.02 - 0.01);
        const ksStatistic = (aucScore - 0.5) * 100; // Approximation: KS ≈ (AUC - 0.5) * 100
        const giniCoefficient = 2 * aucScore - 1;
        const aucDelta = aucScore - baselineAUC;
        const sampleSize = Math.floor(Math.random() * 2000) + 500;

        data.push({
          measurementPeriod,
          aucScore,
          ksStatistic,
          giniCoefficient,
          baselineAUC,
          aucDelta,
          sampleSize,
          channel,
          product,
        });
      });
    });
  }

  return data;
}

/**
 * Generate Campaign Origination Data (Sub-KPI #6)
 * Promotional campaign share and performance
 */
export function generateMockCampaignOriginationData(): CampaignOriginationData[] {
  const campaigns = [
    { id: 'PROMO_FEST24', name: 'Festival 2024 Offer', type: 'promotional' as const },
    { id: 'DISC_RATE', name: 'Rate Discount Campaign', type: 'discount' as const },
    { id: 'STD_ACQ', name: 'Standard Acquisition', type: 'standard' as const },
    { id: 'PARTNER_DSA', name: 'DSA Partner Drive', type: 'partner' as const },
  ];
  const channels = ['Branch', 'Digital', 'DSA'];
  const products = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan'];
  const data: CampaignOriginationData[] = [];

  // Generate last 6 months
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - month));
    const originationMonth = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    campaigns.forEach((campaign) => {
      channels.forEach((channel) => {
        products.forEach((product) => {
          const accountCount = Math.floor(Math.random() * 300) + 50;
          const avgTicketSize = product === 'Home Loan' ? 5000000 : product === 'Auto Loan' ? 800000 : 200000;
          const fundedAmount = accountCount * avgTicketSize * (0.8 + Math.random() * 0.4);

          // Promo campaigns have higher share and worse delinquency
          const shareOfTotalOriginations = campaign.type === 'promotional' ? 25 + Math.random() * 10 :
                                           campaign.type === 'standard' ? 40 + Math.random() * 10 : 15 + Math.random() * 10;

          const earlyDelinquencyRate = campaign.type === 'promotional' ? 3.5 + Math.random() * 2 :
                                       campaign.type === 'discount' ? 2.8 + Math.random() * 1.5 : 1.8 + Math.random() * 1;

          data.push({
            campaignId: campaign.id,
            campaignName: campaign.name,
            campaignType: campaign.type,
            originationMonth,
            accountCount,
            fundedAmount,
            shareOfTotalOriginations,
            earlyDelinquencyRate,
            channel,
            product,
          });
        });
      });
    });
  }

  return data;
}

/**
 * Generate Verification Data (Sub-KPI #7)
 * KYC/verification failure rates
 */
export function generateMockVerificationData(): VerificationData[] {
  const verificationTypes: Array<'income' | 'employment' | 'kyc' | 'identity'> = ['income', 'employment', 'kyc', 'identity'];
  const channels = ['Branch', 'Digital', 'DSA'];
  const products = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan'];
  const data: VerificationData[] = [];

  // Generate last 6 months
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - month));
    const measurementPeriod = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    verificationTypes.forEach((verificationType) => {
      channels.forEach((channel) => {
        products.forEach((product) => {
          const totalApplications = Math.floor(Math.random() * 1000) + 300;

          // Digital and DSA have higher failure rates
          const baseFailureRate = verificationType === 'income' ? 8 : verificationType === 'employment' ? 6 : 4;
          const channelFactor = channel === 'Digital' ? 1.4 : channel === 'DSA' ? 1.6 : 1.0;

          const failureRate = baseFailureRate * channelFactor * (0.9 + Math.random() * 0.3);
          const failedVerifications = Math.floor(totalApplications * (failureRate / 100));
          const exceptionRate = failureRate * 0.6; // 60% of failures get exceptions
          const subsequentDefaultRate = failureRate * 1.8; // Failed verifications default at 1.8x rate

          data.push({
            verificationType,
            measurementPeriod,
            totalApplications,
            failedVerifications,
            failureRate,
            exceptionRate,
            subsequentDefaultRate,
            channel,
            product,
          });
        });
      });
    });
  }

  return data;
}

/**
 * Generate Fraud Data (Sub-KPI #8)
 * Fraud hit rates and losses
 */
export function generateMockFraudData(): FraudData[] {
  const fraudTypes: Array<'identity' | 'synthetic' | 'misrepresentation' | 'first_party'> =
    ['identity', 'synthetic', 'misrepresentation', 'first_party'];
  const channels = ['Branch', 'Digital', 'DSA'];
  const products = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan'];
  const data: FraudData[] = [];

  // Generate last 6 months
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - month));
    const measurementPeriod = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    fraudTypes.forEach((fraudType) => {
      channels.forEach((channel) => {
        products.forEach((product) => {
          const totalApplications = Math.floor(Math.random() * 2000) + 500;

          // Digital channel has highest fraud, identity fraud most common
          const baseFraudRate = fraudType === 'identity' ? 1.2 : fraudType === 'synthetic' ? 0.8 : 0.5;
          const channelFactor = channel === 'Digital' ? 1.8 : channel === 'DSA' ? 1.3 : 1.0;

          const fraudHitRate = baseFraudRate * channelFactor * (0.85 + Math.random() * 0.35);
          const detectedFraudCount = Math.floor(totalApplications * (fraudHitRate / 100));
          const avgLossPerFraud = product === 'Home Loan' ? 250000 : product === 'Auto Loan' ? 150000 : 80000;
          const fraudLossAmount = detectedFraudCount * avgLossPerFraud * (0.7 + Math.random() * 0.6);
          const fraudLossPer1000Apps = (fraudLossAmount / totalApplications) * 1000;

          data.push({
            measurementPeriod,
            totalApplications,
            detectedFraudCount,
            fraudHitRate,
            fraudLossAmount,
            fraudLossPer1000Apps,
            fraudType,
            channel,
            product,
          });
        });
      });
    });
  }

  return data;
}

/**
 * Generate Exception Data (Sub-KPI #9)
 * Manual review and policy exception rates
 */
export function generateMockExceptionData(): ExceptionData[] {
  const exceptionTypes = ['Score Override', 'Income Verification', 'DTI Waiver', 'LTV Exception', 'Policy Waiver'];
  const underwriters = ['Underwriter A', 'Underwriter B', 'Underwriter C', 'Senior UW', 'Auto System'];
  const channels = ['Branch', 'Digital', 'DSA'];
  const data: ExceptionData[] = [];

  // Generate last 6 months
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - month));
    const measurementPeriod = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    exceptionTypes.forEach((exceptionType) => {
      underwriters.forEach((underwriter) => {
        channels.forEach((channel) => {
          const totalApprovals = Math.floor(Math.random() * 500) + 100;

          // Exception rates rising in recent months
          const timeIncrease = month >= 4 ? 1.3 : 1.0;
          const channelFactor = channel === 'DSA' ? 1.4 : channel === 'Digital' ? 1.2 : 1.0;

          const exceptionRate = 15 * timeIncrease * channelFactor * (0.8 + Math.random() * 0.4);
          const manualReviewRate = exceptionRate * 1.5; // Manual reviews higher than exceptions

          const manualReviewApprovals = Math.floor(totalApprovals * (manualReviewRate / 100));
          const policyExceptionApprovals = Math.floor(totalApprovals * (exceptionRate / 100));

          // Exceptions have worse performance
          const exceptionPerformance30DPD = 4.5 + Math.random() * 3;
          const exceptionPerformance90DPD = 2.2 + Math.random() * 2;

          data.push({
            measurementPeriod,
            totalApprovals,
            manualReviewApprovals,
            policyExceptionApprovals,
            manualReviewRate,
            exceptionRate,
            exceptionPerformance30DPD,
            exceptionPerformance90DPD,
            exceptionType,
            underwriter,
            channel,
          });
        });
      });
    });
  }

  return data;
}

/**
 * Generate Channel Performance Data (Sub-KPI #10)
 * Channel/partner-specific quick mortality and concentration
 */
export function generateMockChannelPerformanceData(): ChannelPerformanceData[] {
  const channels = [
    { name: 'Branch Network', type: 'direct' as const },
    { name: 'Digital App', type: 'direct' as const },
    { name: 'DSA Partner 1', type: 'partner' as const, partnerId: 'DSA001', partnerName: 'FinServe Partners' },
    { name: 'DSA Partner 2', type: 'partner' as const, partnerId: 'DSA002', partnerName: 'Credit Link Associates' },
    { name: 'Broker Network', type: 'broker' as const },
  ];
  const geographies = ['North', 'South', 'East', 'West'];
  const products = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan'];
  const data: ChannelPerformanceData[] = [];

  // Generate last 6 months
  for (let month = 0; month < 6; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - month));
    const measurementPeriod = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    channels.forEach((channelObj) => {
      geographies.forEach((geography) => {
        products.forEach((product) => {
          const totalOriginations = Math.floor(Math.random() * 800) + 200;
          const avgTicketSize = product === 'Home Loan' ? 5000000 : product === 'Auto Loan' ? 800000 : 200000;
          const fundedAmount = totalOriginations * avgTicketSize * (0.8 + Math.random() * 0.4);

          // DSA partners show higher concentration and mortality
          const baseShare = channelObj.type === 'partner' ? 18 : channelObj.type === 'direct' ? 35 : 12;
          const shareOfTotalOriginations = baseShare + Math.random() * 8;

          const baseMortality = channelObj.name === 'DSA Partner 2' ? 6.5 :
                                channelObj.name === 'Digital App' ? 5.2 : 3.8;
          const quickMortalityRate = baseMortality * (0.9 + Math.random() * 0.3);
          const delinquency30DPDRate = quickMortalityRate * 0.4; // 30 DPD is ~40% of 12mo mortality

          data.push({
            channel: channelObj.name,
            channelType: channelObj.type,
            partnerId: channelObj.partnerId,
            partnerName: channelObj.partnerName,
            measurementPeriod,
            totalOriginations,
            fundedAmount,
            shareOfTotalOriginations,
            quickMortalityRate,
            delinquency30DPDRate,
            geography,
            product,
          });
        });
      });
    });
  }

  return data;
}

// ============================================================================
// Original CCO KPI Data Generators
// ============================================================================

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
// DETERIORATION INDICATORS FOR CMI AND NET DETERIORATION DRILL-DOWNS
// ============================================================================

/**
 * Generate 4 shared indicators for CMI and Net Deterioration KPI drill-downs
 * These replace the chart-based drill-downs with indicator cards
 *
 * @returns Array of 4 AdvancedKPI objects representing key deterioration metrics
 */
export function generateDeteriorationIndicators(): AdvancedKPI[] {
  return [
    // Indicator 1: % of Exposure Downgraded (Quarterly)
    {
      id: 'det_exposure_downgraded',
      label: '% of Exposure Downgraded (Quarterly)',
      value: 7.8,
      unit: 'percent',
      trend: 'up',
      changePercent: 12.5,
      tooltip: {
        definition: 'Percentage of total portfolio exposure that moved to a worse PD/IFRS stage in the last quarter',
        formula: '(Total downgraded exposure / Total portfolio exposure) × 100',
        businessImplication: 'Elevated deterioration trend indicates increasing portfolio risk and potential provisioning needs',
      },
      threshold: {
        green: 5.0,
        amber: 7.0,
        status: 7.8 > 7.0 ? 'red' : 7.8 > 5.0 ? 'amber' : 'green',
      },
      alertSeverity: 'warning',
      breachReason: 'Exceeds 7% amber threshold',
      topContributingSegment: 'Elevated deterioration trend',
    },

    // Indicator 2: Weighted PD Drift
    {
      id: 'det_pd_drift',
      label: 'Weighted PD Drift',
      value: 18, // basis points
      unit: 'percent',
      trend: 'up',
      changePercent: 15.3,
      tooltip: {
        definition: 'Weighted average change in Probability of Default across the portfolio',
        formula: 'Σ(ΔPD × EAD) / Total EAD, expressed in basis points',
        businessImplication: 'Positive drift indicates worsening risk profile and requires increased monitoring',
      },
      threshold: {
        green: 10,
        amber: 15,
        status: 18 > 15 ? 'red' : 18 > 10 ? 'amber' : 'green',
      },
      alertSeverity: 'warning',
      breachReason: 'PD drift exceeds 15 bps threshold',
      topContributingSegment: 'Risk profile worsening',
    },

    // Indicator 3: Top Contributing Sectors
    {
      id: 'det_top_sectors',
      label: 'Top Contributing Sectors',
      value: 59, // composite percentage (27 + 18 + 14)
      unit: 'percent',
      trend: 'stable',
      changePercent: 3.2,
      tooltip: {
        definition: 'Top 3 sectors contributing to portfolio deterioration and their impact share',
        formula: 'Sum of percentage contributions from top 3 sectors by downgrade exposure',
        businessImplication: 'Concentration in few sectors indicates sector-specific risks requiring targeted action',
      },
      threshold: {
        green: 50,
        amber: 65,
        status: 59 > 65 ? 'red' : 59 > 50 ? 'amber' : 'green',
      },
      alertSeverity: 'none',
      topContributingSegment: 'Real Estate (27%), Infra (18%), NBFC (14%) → 3 sectors = ~60% impact',
    },

    // Indicator 4: Market Benchmark (CRISIL Aggregate CMI)
    {
      id: 'det_market_benchmark',
      label: 'Market Benchmark (CRISIL Aggregate CMI)',
      value: 54.2,
      unit: 'percent',
      trend: 'up',
      changePercent: 2.8,
      tooltip: {
        definition: 'Industry-wide Credit Migration Index from CRISIL for comparative benchmarking',
        formula: 'CRISIL published aggregate CMI based on rated portfolio migrations',
        businessImplication: 'Bank CMI above market benchmark indicates deterioration faster than peers',
      },
      threshold: {
        green: 50,
        amber: 55,
        status: 54.2 > 55 ? 'red' : 54.2 > 50 ? 'amber' : 'green',
      },
      alertSeverity: 'warning',
      breachReason: "Bank's CMI (57.6) > Market Benchmark (54.2)",
      topContributingSegment: "Bank's CMI > Market Benchmark → internal deterioration faster than peers",
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

  // KPI #1: MTD Originations
  const quickMortality: AdvancedKPI = {
    id: 'quick_mortality',
    label: 'MTD Originations',
    value: 5250, // $5,250 Mn
    unit: 'currency',
    displayValue: '$5,250 Mn',
    trend: 'up',
    changePercent: 12,
    changeLabel: 'MoM',
    tooltip: {
      definition: 'Month-to-date loan originations across all channels and products',
      formula: 'Σ(Disbursed Amount) for current month across all channels',
      businessImplication: 'Tracks disbursement momentum and business growth. High values indicate strong origination activity.',
    },
    drilldownUrl: '/api/kpi/quick_mortality/drilldown',
    threshold: {
      green: 5000,
      amber: 4000,
      status: 5250 >= 5000 ? 'green' : 5250 >= 4000 ? 'amber' : 'red',
    },
    alertSeverity: 'none',
    breachReason: undefined,
    topContributingSegment: 'Retail - Home Loans',
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

  // ==========================================================================
  // Quick Mortality Sub-KPIs
  // ==========================================================================

  // Generate sub-KPI data
  const delinquency30DayData = generateMock30DayDelinquencyData();
  const mortality12MonthData = generateMock12MonthMortalityData();
  const originationQualityData = generateMockOriginationQualityData();
  const modelDriftData = generateMockModelDriftData();
  const modelPerformanceData = generateMockModelPerformanceData();
  const campaignOriginationData = generateMockCampaignOriginationData();
  const verificationData = generateMockVerificationData();
  const fraudData = generateMockFraudData();
  const exceptionData = generateMockExceptionData();
  const channelPerformanceData = generateMockChannelPerformanceData();

  // Sub-KPI #1: New Origination (₹ Cr)
  const totalSanctioned = 8450; // ₹8,450 Cr
  const baselineSanctioned = 7800; // Previous month ₹7,800 Cr
  const qmNewOrigination: AdvancedKPI = {
    id: 'qm_new_origination',
    label: 'New Origination (₹ Cr)',
    value: totalSanctioned,
    unit: 'currency',
    displayValue: `₹${totalSanctioned.toLocaleString('en-IN')} Cr`,
    trend: 'up',
    changePercent: ((totalSanctioned - baselineSanctioned) / baselineSanctioned) * 100,
    tooltip: KPI_TOOLTIPS.qm_new_origination,
    threshold: {
      green: 8000,
      amber: 7000,
      status: totalSanctioned >= 8000 ? 'green' : totalSanctioned >= 7000 ? 'amber' : 'red',
    },
    alertSeverity: totalSanctioned < 7000 ? 'warning' : 'none',
    breachReason: totalSanctioned < 7000 ? 'Origination below target' : undefined,
    topContributingSegment: 'Corporate - Infrastructure',
  };

  // Sub-KPI #2: Weighted PD
  const weightedPD = 1.68; // 1.68%
  const baselinePD = 1.55; // Previous month 1.55%
  const qmWeightedPD: AdvancedKPI = {
    id: 'qm_weighted_pd',
    label: 'Weighted PD',
    value: weightedPD,
    unit: 'percent',
    displayValue: `${weightedPD.toFixed(2)}%`,
    trend: 'up',
    changePercent: ((weightedPD - baselinePD) / baselinePD) * 100,
    tooltip: KPI_TOOLTIPS.qm_weighted_pd,
    threshold: {
      green: 1.5,
      amber: 2.0,
      status: weightedPD <= 1.5 ? 'green' : weightedPD <= 2.0 ? 'amber' : 'red',
    },
    alertSeverity: weightedPD > 2.0 ? 'warning' : 'none',
    breachReason: weightedPD > 2.0 ? 'Weighted PD above amber threshold' : undefined,
    topContributingSegment: 'Corporate - Infrastructure',
  };

  // Sub-KPI #3: Portfolio RAROC (%)
  const portfolioRAROC = 12.4; // 12.4%
  const baselineRAROC = 14.2; // Previous month 14.2%
  const qmPortfolioRAROC: AdvancedKPI = {
    id: 'qm_portfolio_raroc',
    label: 'Portfolio RAROC (%)',
    value: portfolioRAROC,
    unit: 'percent',
    displayValue: `${portfolioRAROC.toFixed(1)}%`,
    trend: 'down',
    changePercent: ((portfolioRAROC - baselineRAROC) / baselineRAROC) * 100,
    tooltip: KPI_TOOLTIPS.qm_portfolio_raroc,
    threshold: {
      green: 15,
      amber: 10,
      status: portfolioRAROC >= 15 ? 'green' : portfolioRAROC >= 10 ? 'amber' : 'red',
    },
    alertSeverity: portfolioRAROC < 10 ? 'warning' : 'none',
    breachReason: portfolioRAROC < 10 ? 'RAROC below minimum hurdle rate' : undefined,
    topContributingSegment: 'Corporate - Large Tickets',
  };

  // Sub-KPI #4: % Rated BBB & below
  const ratedBelowBBB = 18.7; // 18.7%
  const baselineRatedBelowBBB = 16.2; // Previous month 16.2%
  const qmRatedBelowBBB: AdvancedKPI = {
    id: 'qm_rated_below_bbb',
    label: '% Rated BBB & below',
    value: ratedBelowBBB,
    unit: 'percent',
    displayValue: `${ratedBelowBBB.toFixed(1)}%`,
    trend: 'up',
    changePercent: ((ratedBelowBBB - baselineRatedBelowBBB) / baselineRatedBelowBBB) * 100,
    tooltip: KPI_TOOLTIPS.qm_rated_below_bbb,
    threshold: {
      green: 15,
      amber: 25,
      status: ratedBelowBBB <= 15 ? 'green' : ratedBelowBBB <= 25 ? 'amber' : 'red',
    },
    alertSeverity: ratedBelowBBB > 25 ? 'warning' : 'none',
    breachReason: ratedBelowBBB > 25 ? 'High concentration of weaker exposures' : undefined,
    topContributingSegment: 'SME - Manufacturing',
  };

  // Sub-KPI #5: RWA Intensity
  const rwaIntensity = 0.78; // 0.78 RWA per ₹ Cr Exposure
  const baselineRWAIntensity = 0.84; // Previous month 0.84 (improving)
  const qmRWAIntensity: AdvancedKPI = {
    id: 'qm_rwa_intensity',
    label: 'RWA Intensity',
    value: rwaIntensity,
    unit: 'percent',
    displayValue: `${rwaIntensity.toFixed(2)}`,
    trend: 'down',
    changePercent: ((rwaIntensity - baselineRWAIntensity) / baselineRWAIntensity) * 100,
    tooltip: KPI_TOOLTIPS.qm_rwa_intensity,
    threshold: {
      green: 0.7,
      amber: 0.85,
      status: rwaIntensity <= 0.7 ? 'green' : rwaIntensity <= 0.85 ? 'amber' : 'red',
    },
    alertSeverity: rwaIntensity > 0.85 ? 'warning' : 'none',
    breachReason: rwaIntensity > 0.85 ? 'High capital consumption per unit exposure' : undefined,
    topContributingSegment: 'Unsecured Retail',
  };

  // Sub-KPI #6: Weighted TDS / GDS
  const avgDebtService = 38.2; // 38.2% average debt service ratio
  const baselineDebtService = 36.7; // Previous month 36.7% (worsening)
  const qmWeightedTDSGDS: AdvancedKPI = {
    id: 'qm_weighted_tds_gds',
    label: 'Weighted TDS / GDS',
    value: avgDebtService,
    unit: 'percent',
    displayValue: `${avgDebtService.toFixed(1)}%`,
    trend: 'up',
    changePercent: ((avgDebtService - baselineDebtService) / baselineDebtService) * 100,
    tooltip: KPI_TOOLTIPS.qm_weighted_tds_gds,
    threshold: {
      green: 35,
      amber: 42,
      status: avgDebtService <= 35 ? 'green' : avgDebtService <= 42 ? 'amber' : 'red',
    },
    alertSeverity: avgDebtService > 42 ? 'warning' : 'none',
    breachReason: avgDebtService > 42 ? 'High debt service ratios indicate affordability stress' : undefined,
    topContributingSegment: 'Retail - Personal Loans',
  };

  // Sub-KPI #7: Weighted Credit Score
  const weightedCreditScore = 695; // 695 average credit score
  const baselineCreditScore = 709; // Previous month 709 (declining)
  const qmWeightedCreditScore: AdvancedKPI = {
    id: 'qm_weighted_credit_score',
    label: 'Weighted Credit Score',
    value: weightedCreditScore,
    unit: 'percent',
    displayValue: `${Math.round(weightedCreditScore)}`,
    trend: 'down',
    changePercent: ((weightedCreditScore - baselineCreditScore) / baselineCreditScore) * 100,
    tooltip: KPI_TOOLTIPS.qm_weighted_credit_score,
    threshold: {
      green: 720,
      amber: 680,
      status: weightedCreditScore >= 720 ? 'green' : weightedCreditScore >= 680 ? 'amber' : 'red',
    },
    alertSeverity: weightedCreditScore < 680 ? 'warning' : 'none',
    breachReason: weightedCreditScore < 680 ? 'Average credit quality declining' : undefined,
    topContributingSegment: 'Retail - New Borrowers',
  };

  // Sub-KPI #8: Deviation Rate (%)
  const avgExceptionRate = exceptionData.reduce((sum, d) => sum + d.exceptionRate, 0) / exceptionData.length;
  const baselineExceptionRate = avgExceptionRate * 0.85; // Increasing trend
  const qmDeviationRate: AdvancedKPI = {
    id: 'qm_deviation_rate',
    label: 'Deviation Rate (%)',
    value: avgExceptionRate,
    unit: 'percent',
    displayValue: `${avgExceptionRate.toFixed(1)}%`,
    trend: 'up',
    changePercent: ((avgExceptionRate - baselineExceptionRate) / baselineExceptionRate) * 100,
    tooltip: KPI_TOOLTIPS.qm_deviation_rate,
    threshold: {
      green: 10,
      amber: 18,
      status: avgExceptionRate <= 10 ? 'green' : avgExceptionRate <= 18 ? 'amber' : 'red',
    },
    alertSeverity: avgExceptionRate > 18 ? 'warning' : 'none',
    breachReason: avgExceptionRate > 18 ? 'High policy deviations indicate weak underwriting discipline' : undefined,
    topContributingSegment: 'DSA Channel - Score Overrides',
  };

  // Sub-KPI #9: Source Mix (% Net New vs % Enhancements)
  const netNewPct = 62; // 62% net new customers
  const enhancementPct = 38; // 38% enhancements
  const baselineNetNewPct = 58; // Previous month 58%
  const qmSourceMix: AdvancedKPI = {
    id: 'qm_source_mix',
    label: 'Source Mix',
    value: netNewPct,
    unit: 'percent',
    displayValue: `${netNewPct.toFixed(0)}% New : ${enhancementPct.toFixed(0)}% Enh`,
    trend: 'up',
    changePercent: ((netNewPct - baselineNetNewPct) / baselineNetNewPct) * 100,
    tooltip: KPI_TOOLTIPS.qm_source_mix,
    threshold: {
      green: 55,
      amber: 70,
      status: netNewPct >= 55 && netNewPct <= 70 ? 'green' : netNewPct < 55 || netNewPct > 70 ? 'amber' : 'red',
    },
    alertSeverity: netNewPct > 75 ? 'warning' : 'none',
    breachReason: netNewPct > 75 ? 'High new customer concentration may indicate quality trade-off' : undefined,
    topContributingSegment: 'Digital Channel - New Acquisitions',
  };

  // Sub-KPI #10: Mortality (≤12M DPD)
  const mortality12M = 3.4; // 3.4% early delinquency on recent vintages
  const baselineMortality = 3.0; // Previous month 3.0% (worsening)
  const qmMortality12M: AdvancedKPI = {
    id: 'qm_mortality_12m',
    label: 'Mortality (≤12M DPD)',
    value: mortality12M,
    unit: 'percent',
    displayValue: `${mortality12M.toFixed(1)}%`,
    trend: 'up',
    changePercent: baselineMortality > 0 ? ((mortality12M - baselineMortality) / baselineMortality) * 100 : 0,
    tooltip: KPI_TOOLTIPS.qm_mortality_12m,
    threshold: {
      green: 2,
      amber: 4,
      status: mortality12M <= 2 ? 'green' : mortality12M <= 4 ? 'amber' : 'red',
    },
    alertSeverity: mortality12M > 4 ? 'warning' : 'none',
    breachReason: mortality12M > 4 ? 'Early delinquency on recent vintages exceeds threshold' : undefined,
    topContributingSegment: 'Recent Vintages - High Risk Segments',
  };

  // Return Quick Mortality and its 10 diagnostic sub-KPIs (11 total)
  return {
    quick_mortality: quickMortality,
    qm_new_origination: qmNewOrigination,
    qm_weighted_pd: qmWeightedPD,
    qm_portfolio_raroc: qmPortfolioRAROC,
    qm_rated_below_bbb: qmRatedBelowBBB,
    qm_rwa_intensity: qmRWAIntensity,
    qm_weighted_tds_gds: qmWeightedTDSGDS,
    qm_weighted_credit_score: qmWeightedCreditScore,
    qm_deviation_rate: qmDeviationRate,
    qm_source_mix: qmSourceMix,
    qm_mortality_12m: qmMortality12M,
  };
}

// ============================================================================
// CMI Chart Data Generators
// ============================================================================

/**
 * Generate CMI Trend Data - 6-month comparison of Bank CMI vs CRISIL Index
 */
export function generateCMITrendData() {
  const months = ['Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024'];

  return months.map((month, idx) => ({
    month,
    bankCMI: 54.2 + idx * 0.8 + Math.random() * 0.5, // Trending upward 54.2 -> 58.4
    crisilIndex: 53.0 + idx * 0.6 + Math.random() * 0.3, // Trending upward slower 53.0 -> 56.8
  }));
}

/**
 * Generate Sector Comparison Data - 4 key sectors with detailed metrics
 */
export function generateSectorComparisonData() {
  return [
    {
      sector: 'Real Estate',
      bankCMI: 61.5,
      crisilIndex: 57.0,
      gap: 4.5,
      concentration: 10.0,
      sentiment: 'negative' as const,
      sentimentIcon: '🔴',
      outlook: 'Liquidity stress; project delays',
      commentary: 'Over-exposed; deterioration accelerating faster than market peers',
    },
    {
      sector: 'Infra',
      bankCMI: 59.2,
      crisilIndex: 56.5,
      gap: 2.7,
      concentration: 8.0,
      sentiment: 'neutral' as const,
      sentimentIcon: '🟡',
      outlook: 'Govt spend plateauing',
      commentary: 'Aligned with system trend; monitor government policy changes',
    },
    {
      sector: 'NBFC',
      bankCMI: 58.4,
      crisilIndex: 54.8,
      gap: 3.6,
      concentration: 6.0,
      sentiment: 'negative' as const,
      sentimentIcon: '🔴',
      outlook: 'Tightening spreads',
      commentary: 'Worsening faster than market; review exposure concentration',
    },
    {
      sector: 'Retail',
      bankCMI: 48.7,
      crisilIndex: 50.5,
      gap: -1.8,
      concentration: 18.0,
      sentiment: 'positive' as const,
      sentimentIcon: '🟢',
      outlook: 'Household income steady',
      commentary: 'Performing better than peers; stable segment with growth potential',
    },
  ];
}

/**
 * Generate Heatmap Data - Deterioration by Sector + Region + Product
 */
export function generateHeatmapData() {
  const sectors = ['Real Estate', 'Infra', 'NBFC', 'Retail'];
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const products = ['Term Loan', 'Working Capital', 'Trade Finance'];

  const data = [];

  for (const sector of sectors) {
    for (const region of regions) {
      for (const product of products) {
        // Base deterioration rate varies by sector
        let baseDeteriorationRate = 5.0;
        if (sector === 'Real Estate') baseDeteriorationRate = 12.0;
        else if (sector === 'Infra') baseDeteriorationRate = 9.0;
        else if (sector === 'NBFC') baseDeteriorationRate = 10.0;
        else if (sector === 'Retail') baseDeteriorationRate = 4.0;

        // Add regional variation
        const regionalVariation = Math.random() * 3.0 - 1.5;
        const productVariation = Math.random() * 2.0 - 1.0;

        const deteriorationRate = Math.max(0, baseDeteriorationRate + regionalVariation + productVariation);

        // Calculate color intensity based on deterioration rate
        const getColor = (rate: number) => {
          if (rate < 5) return '#10b981'; // green
          if (rate < 8) return '#fbbf24'; // yellow
          if (rate < 12) return '#f59e0b'; // orange
          return '#ef4444'; // red
        };

        data.push({
          sector,
          region,
          product,
          deteriorationRate: Number(deteriorationRate.toFixed(2)),
          exposure: Math.random() * 500 + 100, // $100M-$600M
          accountCount: Math.floor(Math.random() * 100 + 20),
          color: getColor(deteriorationRate),
        });
      }
    }
  }

  return data;
}

/**
 * Generate Migration Matrix Data - Downgrade ladder by attributes
 */
export function generateMigrationMatrixData() {
  const segments = ['CORPORATE', 'SME', 'RETAIL'];
  const industries = ['Real Estate', 'Infra', 'NBFC', 'Manufacturing', 'Services'];
  const ratings = ['AAA', 'AA', 'A', 'BBB', 'BB'];

  const data = [];

  // Generate segment-wise migrations
  for (const segment of segments) {
    const totalExposure = Math.random() * 5000 + 2000; // $2B-$7B
    data.push({
      attribute: `Segment: ${segment}`,
      attributeType: 'segment' as const,
      totalExposure,
      downgrade1Notch: {
        count: Math.floor(Math.random() * 50 + 10),
        exposure: totalExposure * (Math.random() * 0.15 + 0.05), // 5-20%
        percentage: Number((Math.random() * 15 + 5).toFixed(2)),
      },
      downgrade2Notch: {
        count: Math.floor(Math.random() * 30 + 5),
        exposure: totalExposure * (Math.random() * 0.08 + 0.02), // 2-10%
        percentage: Number((Math.random() * 8 + 2).toFixed(2)),
      },
      downgrade3Notch: {
        count: Math.floor(Math.random() * 15 + 2),
        exposure: totalExposure * (Math.random() * 0.04 + 0.01), // 1-5%
        percentage: Number((Math.random() * 4 + 1).toFixed(2)),
      },
    });
  }

  // Generate top 3 industry migrations
  for (const industry of industries.slice(0, 3)) {
    const totalExposure = Math.random() * 3000 + 1000;
    data.push({
      attribute: `Industry: ${industry}`,
      attributeType: 'industry' as const,
      totalExposure,
      downgrade1Notch: {
        count: Math.floor(Math.random() * 40 + 8),
        exposure: totalExposure * (Math.random() * 0.18 + 0.07),
        percentage: Number((Math.random() * 18 + 7).toFixed(2)),
      },
      downgrade2Notch: {
        count: Math.floor(Math.random() * 25 + 4),
        exposure: totalExposure * (Math.random() * 0.10 + 0.03),
        percentage: Number((Math.random() * 10 + 3).toFixed(2)),
      },
      downgrade3Notch: {
        count: Math.floor(Math.random() * 12 + 1),
        exposure: totalExposure * (Math.random() * 0.05 + 0.01),
        percentage: Number((Math.random() * 5 + 1).toFixed(2)),
      },
    });
  }

  // Generate rating-wise migrations for top 3 ratings
  for (const rating of ratings.slice(0, 3)) {
    const totalExposure = Math.random() * 2500 + 800;
    data.push({
      attribute: `Rating: ${rating}`,
      attributeType: 'rating' as const,
      totalExposure,
      downgrade1Notch: {
        count: Math.floor(Math.random() * 35 + 6),
        exposure: totalExposure * (Math.random() * 0.16 + 0.06),
        percentage: Number((Math.random() * 16 + 6).toFixed(2)),
      },
      downgrade2Notch: {
        count: Math.floor(Math.random() * 20 + 3),
        exposure: totalExposure * (Math.random() * 0.09 + 0.02),
        percentage: Number((Math.random() * 9 + 2).toFixed(2)),
      },
      downgrade3Notch: {
        count: Math.floor(Math.random() * 10 + 1),
        exposure: totalExposure * (Math.random() * 0.04 + 0.01),
        percentage: Number((Math.random() * 4 + 1).toFixed(2)),
      },
    });
  }

  return data;
}
