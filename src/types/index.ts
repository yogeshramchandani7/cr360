export interface KPI {
  value: number;
  unit: 'percent' | 'currency';
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  displayValue?: string;        // Optional custom display format (e.g., "$5,250 Mn", "1.42%")
  changeLabel?: string;         // Optional custom change label (e.g., "bps", "MoM")
  threshold?: {
    green: number;
    amber: number;
    status: 'green' | 'amber' | 'red';
  };
}

export interface Loan {
  id: string;
  accountNumber: string;
  borrowerName: string;
  exposureAmount: number;
  delinquentDays: number;
  bucket: 'current' | '0-30' | '31-60' | '61-90' | '91-180' | '180+';
  productType: string;
  region: string;
  segment: string;
  riskGrade: string;
  status: string;
  lastPaymentDate: string;
}

export interface FilterState {
  dateFrom: string | null;
  dateTo: string | null;
  regions: string[];
  segments: string[];
  products: string[];
  status: string[];
}

export interface GlobalFilterState {
  lob: string[];
  partyType: string[];
  rating: string[];
  assetClassification: string[];
}

export interface Insight {
  id: string;
  kpiId?: string;        // Optional: For KPI-level insights (e.g., 'quick_mortality', 'pphs')
  chartId?: string;      // Optional: For chart-specific insights (dashboard or drilldown charts)
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  category: 'trend' | 'risk' | 'opportunity' | 'anomaly';
  metrics?: { label: string; value: string }[];
  timestamp: string;
  filter?: {
    field: string;
    value: string;
    label: string;
  };
}

export interface RiskDetails {
  companyId: string;
  companyName: string;

  // Section 1: Borrower Risk Classification & Status
  borrowerRiskClassification: {
    creditStatus: string;
    assetClassification: string;
    stageClassification: string;
    delinquentFlag: 'Yes' | 'No';
    watchlistFlag: 'Yes' | 'No';
    securityStatus: string;
    guarantorStatus: string;
  };

  // Section 2: Risk Metrics
  riskMetrics: {
    probabilityOfDefault: string;
    lossGivenDefault: string;
    totalExposureAtDefault: string;
    expectedCreditLoss: string;
    loanToValueRatio: string;
    riskWeight: string;
  };

  // Section 3: Credit Rating History
  creditRatingHistory: Array<{
    date: string;
    ratingType: string;
    ratingSource: string;
    creditRating: string;
    creditOutlook: string;
  }>;

  // Section 4: Credit Scoring History
  creditScoringHistory: Array<{
    date: string;
    scoringType: string;
    scoringSource: string;
    score: number;
    outlook: string;
  }>;

  // Section 5: Rating & Scoring Reports
  ratingReports: Array<{
    provider: 'CRISIL' | 'ICRA' | 'CARE' | 'Other';
    reportDate: string;
    rating: string;
    outlook: string;
    rationale: string;
    keyDrivers: string[];
    detailedCommentary: string;
  }>;

  // Section 6: Credit Risk Repo
  creditRiskRepo: {
    riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk';
    commonName: string;
    searchDate: string;
    riskFactors: Array<{
      factor: string;
      confidence: 'Strong' | 'Moderate' | 'Weak';
    }>;
    dataSources: string[];
  };
}

export interface ExposureDetails {
  companyId: string;
  companyName: string;

  // Section 1: Summary Metrics
  exposureSummary: {
    totalExposure: number;
    proportionOfBankExposure: number;
    creditLimit: number;
    drawingLimit: number;
    creditExposure: number;
    undrawnExposure: number;
    grossCreditExposure: number;
    overdues: number;
    dpd: number;
    creditStatus: string;
    assetClassification: string;
    ecl: number;
    securityValue: number;
    rwa: number;
    totalEmi: number;
  };

  // Section 2: Trends Data
  exposureTrends: Array<{
    month: string;
    creditLimit: number;
    drawnLimit: number;
    creditExposure: number;
    overDrawings: number;
    undrawn: number;
  }>;

  // Section 3: Hierarchical Exposure Breakdown
  hierarchicalExposure: {
    bankingBook: {
      loanExposure: {
        fundBased: Array<{ product: string; exposure: number }>;
        nonFundBased: Array<{ product: string; exposure: number }>;
      };
      investmentExposure: {
        fundBased: number;
        nonFundBased: number;
      };
    };
    tradingBook: {
      investmentExposure: {
        fundBased: number;
        nonFundBased: number;
      };
      derivativesExposure: {
        value: number;
      };
    };
  };

  // Section 4: Contract Summary
  contractSummary: {
    totalAccounts: number;
    accountsOpen: number;
    accountsWithOutstandingDues: number;
    accountsWithOverdues: number;
    accountsDelinquent: number;
    accountsDefault: number;
  };

  // Section 5: Account Details
  accounts: Array<{
    accountId: string;
    product: string;
    creditLimit: number;
    drawingLimit: number;
    outstandingBalance: number;
    availableLimit: number;
    grossCreditExposure: number;
    openedDate: string;
    tenor: string;
    maturityDate: string;
    paymentFrequency: string;
    overdues: number;
    emi: number;
    roi: number;
    lastPaymentDueDate: string;
    daysPastDue: number;
    accountStatus: string;
    classification: string;
    securityValue: number;
    ltv: number;
    ecl: number;
    instrumentRating: string;
  }>;
}

export interface GroupExposureDetails {
  companyId: string;
  companyName: string;

  // Section 1: Group Header Info
  groupInfo: {
    groupName: string;
    parentEntity: string;
    groupRating: string;
    numberOfFundedCompanies: number;
    numberOfCompaniesWithOverdues: number;
  };

  // Section 2: Group Aggregate Metrics
  groupExposureSummary: {
    totalExposure: number;
    proportionOfBankExposure: number;
    creditLimit: number;
    drawingLimit: number;
    creditExposure: number;
    undrawnExposure: number;
    grossCreditExposure: number;
    overdues: number;
    dpd: number;
    creditStatus: string;
    assetClassification: string;
    ecl: number;
    securityValue: number;
    rwa: number;
    totalEmi: number;
  };

  // Section 3: Group-Level Trends
  groupExposureTrends: Array<{
    month: string;
    creditLimit: number;
    drawnLimit: number;
    creditExposure: number;
    overDrawings: number;
    undrawn: number;
  }>;

  // Section 4: Member Companies Details
  memberCompanies: Array<{
    entityName: string;
    entityId: string;
    companyId: string;
    industry: string;
    internalRating: string;
    externalRating: string;
    baselRating: string;
    creditLimit: number;
    drawingCredit: number;
    exposure: number;
    undrawnExposure: number;
    grossCreditExposure: number;
    overdues: number;
    dpd: number;
    creditStatus: string;
    assetClassification: string;
    ecl: number;
    securityValue: number;
    riskWeight: number;
    rwa: number;
  }>;
}

export interface KYCComplianceDetails {
  companyId: string;
  companyName: string;

  // Section 1: Adverse Media Scans
  adverseMediaScans: {
    commonName: string;
    searchDate: string;
    detected: boolean;
    riskFactors: Array<{
      factor: string;
      confidence: 'Strong' | 'Moderate' | 'Weak';
    }>;
    dataSources: Array<{
      source: string;
      confidenceLevel: string;
    }>;
  };

  // Section 2: Risk Summary
  riskSummary: {
    details: string;
    profileRisk: string;
    riskFactors: string[];
  };

  // Section 3: Risk Score History
  riskScoreHistory: Array<{
    score: number;
    dateScored: string;
    risk: string;
    manualOverride: string;
    type: string;
  }>;

  // Section 4: Watch List Scans
  watchListScans: Array<{
    scanDate: string;
    result: string;
    score: number;
    source: string;
  }>;

  // Section 5: Compliance Summary
  complianceSummary: {
    caseDetails: {
      totalCases: number;
      openCases: number;
      closedCases: number;
    };
    events: {
      totalEvents: number;
      recentEvents: number;
    };
    sars: {
      totalSARs: number;
      pendingSARs: number;
    };
  };
}

export interface ProfitabilityDetails {
  companyId: string;
  companyName: string;
  customerCode: string;

  // Section 1: Customer Banking Profile
  bankingProfile: {
    assetsTotalEOPBalance: number;
    averageTenorOfAssets: string;
    liabilitiesTotalEOPBalance: number;
    averageTenorOfLiabilities: string;
  };

  // Section 2: Customer Profitability Metrics
  profitabilityMetrics: {
    totalIncome: number;
    totalExpenditure: number;
    netFeeIncome: number;
    netIncome: number;
    netInterestMargin: number;
    returnOnTotalAssets: number;
    returnOnEquity: number;
    riskAdjustedReturnOnCapital: number;
  };

  // Section 3: Customer Income Statement
  incomeStatement: Array<{
    lineItemIdentifier: string;
    lineItemLeafName: string;
    amount: number;
    level: number;
  }>;

  // Section 4: Group Profitability Link
  hasGroupProfitability: boolean;
}

export interface ClimateRiskDetails {
  companyId: string;
  companyName: string;

  // Section 1: Emissions Summary
  emissionsSummary: {
    totalEmissions: number;
    scope1: number;
    scope2: number;
    scope3: number;
    financedEmissions: number;
    percentOfTotalFinancedEmissions: number;
    waci: number;
    industryAverageIntensity: number;
  };

  // Section 2: Exposure Summary
  exposureSummary: {
    grossExposure: number;
    percentOfTotalExposure: number;
  };

  // Section 3: Climate Risk Score
  climateRiskScore: {
    isin: string;
    counterpartyCountry: string;
    counterpartyIndustry: string;
    climateRiskScore: number;
    climateRating: string;
    ratingReference: 'Positive' | 'Negative' | 'Neutral';
    industryAverageScore: number;
  };

  // Section 4: Climate Risk Report
  climateRiskReport: {
    companyName: string;
    industry: string;
    climateRating: string;
    climateScore: number;
    rating: 'Positive' | 'Negative' | 'Neutral';
    keyRiskFactors: string[];
    topPositives: string[];
  };

  // Section 5: Peer Comparison Dimensions
  peerComparisonDimensions: {
    industryType: string;
    obligorType: string;
    assetClass: string;
    exposureBand: string;
    creditRating: string;
    geography: string;
    creditScore: string;
    orgStructure: string;
  };

  // Section 6: Peer Comparison Data
  peerComparison: Array<{
    obligor: string;
    group: string;
    orgStructure: string;
    counterpartCountry: string;
    counterpartyIndustry: string;
    creditStatus: string;
    baselRating: string;
    grossExposure: number;
    totalEmissions: number;
    financedEmissions: number;
    emissionsIntensity: number;
    climateRiskScore: number;
    climateRiskRating: string;
    ratingReference: string;
  }>;
}

// ============================================================================
// CCO Dashboard Types (Advanced KPIs)
// ============================================================================

/**
 * Tooltip interface for KPI definitions per PRD requirements
 */
export interface KPITooltip {
  definition: string;        // What is it?
  formula: string;           // How is it calculated?
  businessImplication: string; // Why does it matter?
}

/**
 * Advanced KPI interface extending base KPI with CCO-specific fields
 */
export interface AdvancedKPI extends KPI {
  id: string;                         // e.g., 'quick_mortality', 'pphs'
  label: string;                      // Display name
  tooltip: KPITooltip;               // PRD-compliant tooltip
  drilldownUrl?: string;              // API endpoint for drilldown data
  alertSeverity?: 'none' | 'info' | 'warning' | 'critical';
  breachReason?: string;              // e.g., "Exceeds 5% amber threshold"
  topContributingSegment?: string;    // e.g., "Digital Channel - Personal Loans"
  components?: Array<{                // For composite metrics like PPHS
    name: string;
    weight: number;
    value: number;
  }>;
}

/**
 * Drilldown data structure per PRD API specification
 */
export interface DrilldownData {
  segment_name: string;
  metric_value: number;
  delta_vs_prev: number;
  contribution_to_total: number;
  top_accounts: Array<{
    account_id: string;
    borrower: string;
    value: number;
    dpd?: number;
  }>;
}

/**
 * Quick Mortality Ratio - KPI #2
 * % of new loans (≤6 months vintage) entering early delinquency
 */
export interface QuickMortalityData {
  vintage: string;           // e.g., "2024-10"
  originationMonth: string;  // e.g., "Oct 2024"
  totalNewLoans: number;
  earlyDelinquentLoans: number;
  mortalityRatio: number;
  channel: string;           // Branch, Digital, DSA
  product: string;           // Personal Loan, Auto Loan, etc.
  geography: string;         // North, South, East, West
}

// ============================================================================
// Quick Mortality Sub-KPI Data Models
// ============================================================================

/**
 * Quick Mortality Sub-KPI #1: 30-Day Delinquency Rate by Vintage
 * % of accounts from each recent monthly vintage hitting 30 DPD
 */
export interface VintageDelinquencyData {
  vintage: string;                 // e.g., "2024-10"
  originationMonth: string;        // e.g., "Oct 2024"
  totalAccounts: number;
  delinquent30DPDAccounts: number;
  delinquency30DPDRate: number;    // Percentage
  channel: string;                 // Branch, Digital, DSA
  product: string;                 // Personal Loan, Auto Loan, etc.
  geography: string;               // North, South, East, West
  baselineRate: number;            // Historical baseline for comparison
  deltaFromBaseline: number;       // Basis points change
}

/**
 * Quick Mortality Sub-KPI #2: 12-Month Quick Mortality (Cohort)
 * Cumulative % charged-off or NPA within 12 months by origination month
 */
export interface VintageMortalityData {
  vintage: string;                 // e.g., "2024-04"
  originationMonth: string;        // e.g., "Apr 2024"
  ageInMonths: number;             // Age of vintage (0-12 months)
  totalAccounts: number;
  chargedOffAccounts: number;
  npaAccounts: number;
  cumulativeMortalityRate: number; // Percentage
  modeledExpectation: number;      // Expected mortality rate
  deltaFromExpectation: number;    // Percentage points difference
  channel: string;
  product: string;
}

/**
 * Quick Mortality Sub-KPI #3: Weighted-Average Credit Score / PD
 * WA FICO / internal score or expected PD for each vintage and channel
 */
export interface OriginationQualityData {
  vintage: string;                 // e.g., "2024-10"
  originationMonth: string;        // e.g., "Oct 2024"
  weightedAvgCreditScore: number;  // WA FICO or internal score
  weightedAvgPD: number;           // Expected probability of default (%)
  totalAccounts: number;
  totalFundedAmount: number;
  channel: string;
  product: string;
  geography: string;
  baselineScore: number;           // Historical baseline score
  scoreDelta: number;              // Change from baseline
}

/**
 * Quick Mortality Sub-KPI #4: Population Stability Index (PSI)
 * Distribution drift vs model training population
 */
export interface ModelDriftData {
  feature: string;                 // Score, Income, LTV, etc.
  psiValue: number;                // Population Stability Index
  drift: 'no_drift' | 'slight_drift' | 'moderate_drift' | 'severe_drift';
  expectedDistribution: number[];  // Historical distribution
  actualDistribution: number[];    // Current distribution
  measurementPeriod: string;       // e.g., "Oct 2024"
  channel: string;
  threshold: number;               // PSI threshold (typically 0.15-0.25)
}

/**
 * Quick Mortality Sub-KPI #5: Model Discrimination (AUC / KS)
 * AUC/KS measured on most recent approvals
 */
export interface ModelPerformanceData {
  measurementPeriod: string;       // e.g., "Oct 2024"
  aucScore: number;                // Area Under Curve (0-1)
  ksStatistic: number;             // Kolmogorov-Smirnov statistic (0-100)
  giniCoefficient: number;         // Gini coefficient
  baselineAUC: number;             // Expected AUC from validation
  aucDelta: number;                // Change from baseline
  sampleSize: number;
  channel: string;
  product: string;
}

/**
 * Quick Mortality Sub-KPI #6: Promotional/Incentivized Campaign Originations
 * Share of funded accounts from promo/discount channels
 */
export interface CampaignOriginationData {
  campaignId: string;
  campaignName: string;
  campaignType: 'promotional' | 'discount' | 'standard' | 'partner';
  originationMonth: string;
  accountCount: number;
  fundedAmount: number;
  shareOfTotalOriginations: number; // Percentage
  earlyDelinquencyRate: number;     // 30 DPD rate for this campaign
  channel: string;
  product: string;
}

/**
 * Quick Mortality Sub-KPI #7: Verification Failure / KYC Exception Rate
 * % of apps failing income/employment/KYC verification
 */
export interface VerificationData {
  verificationType: 'income' | 'employment' | 'kyc' | 'identity';
  measurementPeriod: string;       // e.g., "Oct 2024"
  totalApplications: number;
  failedVerifications: number;
  failureRate: number;             // Percentage
  exceptionRate: number;           // % requiring manual exceptions
  subsequentDefaultRate: number;   // Default rate of failed verifications
  channel: string;
  product: string;
}

/**
 * Quick Mortality Sub-KPI #8: Fraud Hit Rate and Loss
 * Detected fraud % and $ loss on fraud incidents per 1,000 apps
 */
export interface FraudData {
  measurementPeriod: string;       // e.g., "Oct 2024"
  totalApplications: number;
  detectedFraudCount: number;
  fraudHitRate: number;            // Percentage
  fraudLossAmount: number;         // Dollar amount
  fraudLossPer1000Apps: number;    // Loss per 1,000 applications
  fraudType: 'identity' | 'synthetic' | 'misrepresentation' | 'first_party';
  channel: string;
  product: string;
}

/**
 * Quick Mortality Sub-KPI #9: Manual Review / Policy Exception Rate
 * % approved through manual review or with policy exceptions
 */
export interface ExceptionData {
  measurementPeriod: string;       // e.g., "Oct 2024"
  totalApprovals: number;
  manualReviewApprovals: number;
  policyExceptionApprovals: number;
  manualReviewRate: number;        // Percentage
  exceptionRate: number;           // Percentage
  exceptionPerformance30DPD: number; // 30 DPD rate for exceptions
  exceptionPerformance90DPD: number; // 90 DPD rate for exceptions
  exceptionType: string;           // Type of exception
  underwriter: string;
  channel: string;
}

/**
 * Quick Mortality Sub-KPI #10: Channel/Partner-Specific Quick Mortality
 * Quick mortality rate by acquisition channel/partner
 */
export interface ChannelPerformanceData {
  channel: string;                 // Branch, Digital, DSA, Partner name
  channelType: 'direct' | 'partner' | 'broker';
  partnerId?: string;
  partnerName?: string;
  measurementPeriod: string;       // e.g., "Oct 2024"
  totalOriginations: number;
  fundedAmount: number;
  shareOfTotalOriginations: number; // Percentage (concentration)
  quickMortalityRate: number;      // 12-month mortality %
  delinquency30DPDRate: number;    // 30 DPD rate
  geography: string;
  product: string;
}

// ============================================================================
// Original CCO KPI Data Models
// ============================================================================

/**
 * Forward Delinquency Forecast - KPI #3
 * ML-predicted delinquencies in next 90 days
 */
export interface ForwardDelinquencyForecast {
  forecastPeriod: '30d' | '60d' | '90d';
  expectedSlippages: number;          // Count of accounts
  expectedSlippagesValue: number;     // Total exposure value
  confidence: number;                 // Model confidence (0-1)
  topContributors: Array<{
    accountId: string;
    borrowerName: string;
    currentStatus: string;
    predictedPD: number;
    ead: number;
    expectedLoss: number;
  }>;
}

/**
 * Vintage Deterioration Index - KPI #5
 * Current vintage performance vs historical median
 */
export interface VintageAnalysis {
  vintage: string;                 // e.g., "2023-Q1"
  ageInMonths: number;
  currentDPDRate: number;
  historicalMedianDPD: number;
  deteriorationIndex: number;       // Ratio: current/historical
}

/**
 * Pre-Delinquency Behavior Index - KPI #4
 * Behavioral stress score
 */
export interface PBIData {
  accountId: string;
  borrowerName: string;
  partialPaymentScore: number;      // 0-100
  utilizationSpikeScore: number;    // 0-100
  bouncedPaymentScore: number;      // 0-100
  compositeBehaviorScore: number;   // Weighted average
  riskBand: 'Low' | 'Medium' | 'High' | 'Critical';
}

/**
 * Net PD / Stage Migration - KPI #6
 * Movement across PD bands and IFRS stages
 */
export interface PDMigrationData {
  fromStage: string;                // e.g., "Stage 1", "AA"
  toStage: string;                  // e.g., "Stage 2", "BBB"
  exposureAmount: number;
  accountCount: number;
  direction: 'upgrade' | 'downgrade' | 'stable';
}

/**
 * Concentration & Contagion Index - KPI #7
 * Systemic risk from top exposures and group linkages
 */
export interface ConcentrationData {
  nodes: Array<{
    id: string;
    name: string;
    exposure: number;
    type: 'borrower' | 'group';
    pd: number;
    lgd: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    relationship: 'subsidiary' | 'parent' | 'common_promoter';
  }>;
  concentrationIndex: number;
}

/**
 * Utilization & Liquidity Stress - KPI #8
 * Sudden utilization spikes in revolvers
 */
export interface UtilizationStressData {
  accountId: string;
  borrowerName: string;
  previousUtilization: number;
  currentUtilization: number;
  utilizationDelta: number;
  creditLimit: number;
  product: string;
  stressFlagReason: 'spike' | 'max_usage' | 'both';
}

/**
 * Restructure / Forbearance Reversion Rate - KPI #9
 * % of restructured accounts returning to default
 */
export interface ReversionRateData {
  restructureDate: string;
  accountId: string;
  borrowerName: string;
  restructureType: 'EMI_reduction' | 'tenor_extension' | 'interest_waiver';
  originalExposure: number;
  currentStatus: 'performing' | 'delinquent' | 'default';
  monthsSinceRestructure: number;
  revertedToDefault: boolean;
}

/**
 * Forward ECL / Provision Sensitivity - KPI #10
 * Expected change in ECL under stress
 */
export interface ECLSensitivityData {
  scenario: 'base' | 'mild_stress' | 'severe_stress';
  pdContribution: number;
  eadContribution: number;
  lgdContribution: number;
  totalECL: number;
  deltaFromBase: number;
}

/**
 * Alert structure for CCO Dashboard
 */
export interface CCOAlert {
  kpiId: string;
  kpiLabel: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  breachReason: string;
  topContributingSegment: string;
  timestamp: string;
  dismissed: boolean;
}

// ============================================================================
// KPI Drilldown Modal Types
// ============================================================================

/**
 * Chart configuration for KPI drilldown modals
 */
export interface KPIChartDataKey {
  key: string;      // data key for chart (e.g., 'value', 'count')
  name: string;     // display name in legend
  color?: string;   // chart color (hex)
}

export interface KPIChart {
  id: string;                    // unique chart identifier
  title: string;                 // chart title
  description?: string;          // optional chart description
  type: 'pie' | 'bar' | 'line' | 'area' | 'sector-table' | 'heatmap' | 'migration-matrix'; // chart type
  data: any[];                   // chart data array
  dataKeys: KPIChartDataKey[];   // keys to render
  xAxisKey?: string;             // for bar/line charts
  yAxisKey?: string;             // for bar/line charts
  filterField: string;           // field name for portfolio drilldown filter
  filterLabel: string;           // label template (use {value} placeholder)
}

/**
 * Configuration for KPI drilldown modal
 */
export interface KPIDrilldownConfig {
  kpiId: string;
  charts: KPIChart[];
}

// ============================================================================
// Chart Action Dropdown & Page Filters
// ============================================================================

/**
 * Page-specific filter applied when user clicks "Apply Filter" on a chart
 */
export interface PageFilter {
  id: string;                 // Unique filter ID (timestamp-based)
  field: string;              // Field to filter on (e.g., 'region', 'productType')
  value: string;              // Filter value (e.g., 'North', 'Business Loan')
  label: string;              // Display label for filter chip
  source: string;             // Source chart/component (e.g., 'Dashboard - Region Pie Chart')
  timestamp: number;          // Creation timestamp for ordering
}

/**
 * Dropdown option configuration for chart action menu
 */
export interface DropdownOption {
  id: 'counterparties' | 'apply-filter' | string; // Action identifier
  label: string;                                   // Display text
  icon?: React.ReactNode;                          // Optional icon
  description?: string;                            // Optional tooltip/description
}

// ============================================================================
// KPI Insights
// ============================================================================

/**
 * KPI Insight interface for actionable insights displayed on drill-down pages
 */
// ============================================================================
// Insight Filter Data Structure
// ============================================================================

/**
 * Filter specification for insights
 * Used to apply filters to drill-down charts when insight is clicked
 */
export interface InsightFilter {
  field: string;                    // Filter field name (e.g., 'industry', 'region', 'creditStatus')
  value: string;                    // Filter value (e.g., 'Real Estate', 'North', 'Delinquent')
  label: string;                    // Display label for filter chip (e.g., 'Industry: Real Estate')
  source: string;                   // Source of filter (e.g., insight theme or 'insight')
}

export interface KPIInsight {
  id: string;                       // Unique insight identifier
  kpiId: string;                    // Associated KPI ID
  theme: string;                    // Insight title/theme
  keyInsights: string[];            // Array of key insight bullet points
  implication: string;              // Business implication paragraph
  croActions: string[];             // Array of CRO action items
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;                // ISO timestamp
  filters?: InsightFilter[];        // Optional: Filters to apply when insight is clicked
}

// ============================================================================
// CMI Custom Chart Data Structures
// ============================================================================

/**
 * CMI Trend Data - Line chart comparing Bank CMI vs CRISIL Migration Index
 */
export interface CMITrendData {
  month: string;                    // e.g., "Oct 2024"
  bankCMI: number;                  // Bank's CMI value
  crisilIndex: number;              // CRISIL Migration Index value
}

/**
 * Sector Comparison Data - Interactive table showing sector-wise CMI analysis
 */
export interface SectorComparisonData {
  sector: string;                   // e.g., "Real Estate"
  bankCMI: number;                  // Bank's sector CMI
  crisilIndex: number;              // CRISIL/ICRA Sector Index
  gap: number;                      // Difference (bankCMI - crisilIndex)
  concentration: number;            // % of portfolio exposure
  sentiment: 'positive' | 'neutral' | 'negative'; // Sentiment indicator
  sentimentIcon: string;            // Emoji: 🟢 🟡 🔴
  outlook: string;                  // Brief outlook text
  commentary: string;               // Detailed commentary
}

/**
 * Heatmap Cell Data - Deterioration by Sector + Region + Product
 */
export interface HeatmapCellData {
  sector: string;                   // e.g., "Real Estate"
  region: string;                   // e.g., "North"
  product: string;                  // e.g., "Term Loan"
  deteriorationRate: number;        // Deterioration % (0-100)
  exposure: number;                 // Exposure amount in $M
  accountCount: number;             // Number of accounts
  color: string;                    // Color intensity (hex)
}

/**
 * Migration Matrix Data - Downgrade ladder by attributes
 */
export interface MigrationMatrixData {
  attribute: string;                // e.g., "Segment: Corporate"
  attributeType: 'segment' | 'industry' | 'rating' | 'region';
  totalExposure: number;            // Total exposure in $M
  downgrade1Notch: {
    count: number;                  // Number of accounts
    exposure: number;               // Exposure in $M
    percentage: number;             // % of total
  };
  downgrade2Notch: {
    count: number;
    exposure: number;
    percentage: number;
  };
  downgrade3Notch: {
    count: number;
    exposure: number;
    percentage: number;
  };
}
