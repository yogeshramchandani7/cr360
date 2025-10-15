import type { KPI, Loan } from '../types';

export const mockKPIs: Record<string, KPI> = {
  npa: {
    value: 2.5,
    unit: 'percent',
    trend: 'down',
    changePercent: -0.3,
    threshold: { green: 3.0, amber: 5.0, status: 'green' },
  },
  totalExposure: {
    value: 1250000000,
    unit: 'currency',
    trend: 'up',
    changePercent: 5.2,
  },
  par: {
    value: 4.2,
    unit: 'percent',
    trend: 'down',
    changePercent: -0.5,
    threshold: { green: 5.0, amber: 8.0, status: 'green' },
  },
  delinquency: {
    value: 3.8,
    unit: 'percent',
    trend: 'stable',
    changePercent: 0.1,
    threshold: { green: 4.0, amber: 7.0, status: 'green' },
  },
  utilization: {
    value: 72.5,
    unit: 'percent',
    trend: 'up',
    changePercent: 2.1,
    threshold: { green: 80.0, amber: 90.0, status: 'green' },
  },
  raroc: {
    value: 16.8,
    unit: 'percent',
    trend: 'up',
    changePercent: 1.2,
    threshold: { green: 15.0, amber: 10.0, status: 'green' },
  },
  lgd: {
    value: 42.0,
    unit: 'percent',
    trend: 'stable',
    changePercent: 0.0,
  },
  expectedLoss: {
    value: 15500000,
    unit: 'currency',
    trend: 'down',
    changePercent: -3.2,
  },
};

export const mockLoans: Loan[] = Array.from({ length: 100 }, (_, i) => {
  const productTypes = ['Business Loan', 'Home Loan', 'Personal Loan', 'Auto Loan'];
  const regions = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
  const segments = ['RETAIL', 'SME', 'CORPORATE'];

  return {
    id: `loan-${i + 1}`,
    accountNumber: `LA${String(i + 1).padStart(6, '0')}`,
    borrowerName: `Borrower ${i + 1}`,
    exposureAmount: Math.floor(Math.random() * 50000000) + 100000,
    delinquentDays: Math.floor(Math.random() * 200),
    bucket: ['current', '0-30', '31-60', '61-90', '91-180', '180+'][
      Math.floor(Math.random() * 6)
    ] as Loan['bucket'],
    productType: productTypes[i % 4], // Ensure even distribution
    region: regions[i % 4], // Ensure even distribution
    segment: segments[i % 3], // Ensure even distribution
    riskGrade: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B'][i % 6],
    status: ['Performing', 'Watchlist', 'Delinquent', 'NPA'][
      Math.floor(Math.random() * 4)
    ],
    lastPaymentDate: new Date(
      Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
});

export const mockTrendData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short' }),
  npa: 2.0 + Math.random() * 1.5,
  par: 3.5 + Math.random() * 2,
  exposure: 1100000000 + i * 15000000,
}));

export const mockBreakdown = {
  region: [
    { label: 'NORTH', value: 450000000, percentage: 36.0 },
    { label: 'SOUTH', value: 320000000, percentage: 25.6 },
    { label: 'EAST', value: 280000000, percentage: 22.4 },
    { label: 'WEST', value: 200000000, percentage: 16.0 },
  ],
  product: [
    { label: 'Business Loan', value: 375000000, percentage: 30.0 },
    { label: 'Home Loan', value: 312500000, percentage: 25.0 },
    { label: 'Personal Loan', value: 312500000, percentage: 25.0 },
    { label: 'Auto Loan', value: 250000000, percentage: 20.0 },
  ],
};

export const mockDelinquencyMatrix = {
  rows: ['NORTH', 'SOUTH', 'EAST', 'WEST'],
  buckets: ['current', '0-30', '31-60', '61-90', '91-180', '180+'],
  data: [
    {
      region: 'NORTH',
      current: { count: 10000, exposure: 400000000 },
      '0-30': { count: 450, exposure: 18000000 },
      '31-60': { count: 120, exposure: 4800000 },
      '61-90': { count: 80, exposure: 3200000 },
      '91-180': { count: 50, exposure: 2000000 },
      '180+': { count: 20, exposure: 800000 },
    },
    {
      region: 'SOUTH',
      current: { count: 8000, exposure: 300000000 },
      '0-30': { count: 300, exposure: 12000000 },
      '31-60': { count: 90, exposure: 3600000 },
      '61-90': { count: 60, exposure: 2400000 },
      '91-180': { count: 35, exposure: 1400000 },
      '180+': { count: 15, exposure: 600000 },
    },
    {
      region: 'EAST',
      current: { count: 7000, exposure: 260000000 },
      '0-30': { count: 280, exposure: 11000000 },
      '31-60': { count: 85, exposure: 3400000 },
      '61-90': { count: 50, exposure: 2000000 },
      '91-180': { count: 40, exposure: 1600000 },
      '180+': { count: 18, exposure: 720000 },
    },
    {
      region: 'WEST',
      current: { count: 5000, exposure: 190000000 },
      '0-30': { count: 170, exposure: 7000000 },
      '31-60': { count: 55, exposure: 2200000 },
      '61-90': { count: 30, exposure: 1200000 },
      '91-180': { count: 25, exposure: 1000000 },
      '180+': { count: 10, exposure: 400000 },
    },
  ],
};

const topIndianCompanies = [
  'Reliance Industries Limited',
  'Tata Consultancy Services',
  'HDFC Bank Limited',
  'Infosys Limited',
  'ICICI Bank Limited',
  'State Bank of India',
  'Bharti Airtel Limited',
  'Larsen & Toubro Limited',
  'HCL Technologies Limited',
  'Axis Bank Limited',
  'Mahindra & Mahindra Limited',
  'ITC Limited',
  'Kotak Mahindra Bank',
  'Asian Paints Limited',
  'Wipro Limited',
  'Maruti Suzuki India',
  'Bajaj Finance Limited',
  'UltraTech Cement Limited',
  'Hindustan Unilever Limited',
  'Sun Pharmaceutical Industries',
];

export const mockTopExposures = topIndianCompanies.map((name, i) => ({
  rank: i + 1,
  borrowerName: name,
  accountNumber: `LA${String(1000 + i).padStart(6, '0')}`,
  exposureAmount: 50000000 - i * 2000000,
  percentOfPortfolio: ((50000000 - i * 2000000) / 1250000000) * 100,
  productType: ['Business Loan', 'Term Loan', 'Credit Line'][i % 3],
  region: ['NORTH', 'SOUTH', 'EAST', 'WEST'][i % 4],
  riskGrade: ['AAA', 'AA', 'A', 'BBB'][i % 4],
  utilization: 60 + Math.random() * 30,
}));

// Portfolio View Data
const portfolioCompanies = [
  'IDL Logistics Limited', 'Deepak Cables', 'Reliance Industries', 'Tata Steel', 'Adani Ports',
  'Infosys Limited', 'HDFC Bank', 'Bharti Airtel', 'Mahindra & Mahindra', 'Asian Paints',
  'Larsen & Toubro', 'ICICI Bank', 'Hindustan Unilever', 'Maruti Suzuki', 'Bajaj Finance',
  'Kotak Mahindra Bank', 'TCS Limited', 'Axis Bank', 'Wipro Limited', 'UltraTech Cement',
  'Sun Pharma', 'Nestle India', 'ONGC Limited', 'Power Grid Corp', 'NTPC Limited',
  'Coal India', 'Grasim Industries', 'Titan Company', 'Tech Mahindra', 'IndusInd Bank',
  'SBI Bank', 'Dr Reddy Labs', 'Bajaj Auto', 'Hindalco Industries', 'JSW Steel',
  'Cipla Limited', 'Eicher Motors', 'HCL Technologies', 'Britannia Industries', 'Shree Cement',
  'Divi Laboratories', 'Apollo Hospitals', 'Berger Paints', 'Bosch Limited', 'Godrej Consumer',
  'Pidilite Industries', 'Siemens Limited', 'ABB India', 'Havells India', 'Voltas Limited'
];

// Company-to-Group mapping based on real corporate structures
const companyToGroupMapping: Record<string, string> = {
  // Tata Group companies
  'Tata Steel': 'Tata Group',
  'TCS Limited': 'Tata Group',
  'Titan Company': 'Tata Group',
  'Tata Consultancy Services': 'Tata Group',

  // Reliance Group companies
  'Reliance Industries': 'Reliance Group Mumbai',
  'JioMart': 'Reliance Group Mumbai',

  // Adani Group companies
  'Adani Ports': 'Adani Group',
  'ONGC Limited': 'Adani Group',
  'Power Grid Corp': 'Adani Group',
  'NTPC Limited': 'Adani Group',
  'Coal India': 'Adani Group',

  // Aditya Birla Group companies
  'Grasim Industries': 'Aditya Birla Group',
  'UltraTech Cement': 'Aditya Birla Group',
  'Hindalco Industries': 'Aditya Birla Group',
  'ABB India': 'Aditya Birla Group',
  'Vodafone Idea': 'Aditya Birla Group',

  // Mahindra Group companies
  'Mahindra & Mahindra': 'Mahindra Group',
  'Tech Mahindra': 'Mahindra Group',

  // Bajaj Group companies
  'Bajaj Finance': 'Bajaj Group',
  'Bajaj Auto': 'Bajaj Group',

  // Godrej Group companies
  'Godrej Consumer': 'Godrej Group',

  // L&T Group companies
  'Larsen & Toubro': 'L&T Group',

  // Hinduja Group companies
  'IDL Logistics Limited': 'Hinduja Group',
  'Ashok Leyland': 'Hinduja Group',
  'Hinduja Global': 'Hinduja Group',

  // DCIL Group companies
  'Deepak Cables': 'DCIL',

  // Banking & Financial Services Group (grouped together for portfolio diversification)
  'HDFC Bank': 'HDFC Banking Group',
  'ICICI Bank': 'HDFC Banking Group',
  'Axis Bank': 'HDFC Banking Group',
  'Kotak Mahindra Bank': 'HDFC Banking Group',
  'SBI Bank': 'HDFC Banking Group',
  'IndusInd Bank': 'HDFC Banking Group',

  // Pharma & Healthcare Group
  'Sun Pharma': 'Pharma & Healthcare Group',
  'Dr Reddy Labs': 'Pharma & Healthcare Group',
  'Cipla Limited': 'Pharma & Healthcare Group',
  'Divi Laboratories': 'Pharma & Healthcare Group',
  'Apollo Hospitals': 'Pharma & Healthcare Group',

  // IT Services Group
  'Infosys Limited': 'IT Services Group',
  'Wipro Limited': 'IT Services Group',
  'HCL Technologies': 'IT Services Group',

  // Telecom Group
  'Bharti Airtel': 'Telecom Group',

  // FMCG Group
  'Hindustan Unilever': 'FMCG Group',
  'ITC Limited': 'FMCG Group',
  'Nestle India': 'FMCG Group',
  'Britannia Industries': 'FMCG Group',

  // Auto Group
  'Maruti Suzuki': 'Auto Manufacturing Group',
  'Eicher Motors': 'Auto Manufacturing Group',

  // Industrials Group
  'Asian Paints': 'Industrials Group',
  'Berger Paints': 'Industrials Group',
  'Pidilite Industries': 'Industrials Group',
  'Siemens Limited': 'Industrials Group',
  'Bosch Limited': 'Industrials Group',
  'Havells India': 'Industrials Group',
  'Voltas Limited': 'Industrials Group',

  // Steel & Metals Group
  'JSW Steel': 'Steel & Metals Group',
  'Shree Cement': 'Steel & Metals Group',
};

const orgStructures = ['Bangalore LCB', 'Chennai MCB', 'Mumbai LCB', 'Delhi LCB', 'Kolkata MCB', 'Hyderabad LCB'];
const lineOfBusiness = ['LCB', 'MCB', 'SCB'];
const industries = [
  'Logistics', 'Infrastructure', 'Oil & Gas', 'Steel', 'Ports', 'IT Services',
  'Banking', 'Telecom', 'Automotive', 'FMCG', 'Cement', 'Pharma', 'Power'
];
const partyTypes = ['Corporate', 'SME', 'Large Corporate'];
// const creditStatuses = ['Standard', 'Delinquent', 'Watchlist'];
// const assetClasses = ['Standard', 'Delinquent', 'Substandard'];
const externalRatings = ['AAA', 'AA', 'A', 'BBB', 'BB', 'CRISIL A1+', 'CRISIL A2+', 'ICRA A1'];
const internalRatings = ['YLC3', 'YLC5', 'YMR1', 'YMR2', 'YHR1', 'YHR2'];
const securityStatuses = ['Secured', 'Clean', 'Part Secured'];

export interface PortfolioCompany {
  id: string;
  customerName: string;
  custId: number;
  partyType: string;
  group: string;
  parentId: string | null;  // Parent company ID for hierarchical relationships (null for root/parent companies)
  orgStructure: string;
  lineOfBusiness: string;
  industry: string;
  productType: string;
  region: string;
  segment: string;
  creditLimit: number;
  grossCreditExposure: number;
  creditExposure: number;
  undrawnExposure: number;
  overdues: number;
  creditStatus: string;
  assetClass: string;
  borrowerExternalRating: string;
  borrowerInternalRating: string;
  borrowerCreditScore: number;
  riskGrade: string;
  stageClassification: number;
  securityStatus: string;
  securityValue: number;
}

// Map product types to match Dashboard chart labels
// const productTypeMapping: Record<string, string> = {
//   'Business Loan': 'Business Loan',
//   'Home Loan': 'Home Loan',
//   'Personal Loan': 'Personal Loan',
//   'Auto Loan': 'Auto Loan',
// };

// Ensure even distribution across regions
const regionDistribution = ['NORTH', 'SOUTH', 'EAST', 'WEST'];

// Ensure even distribution across segments
const segmentDistribution = ['RETAIL', 'SME', 'CORPORATE'];

// Parent-child relationships within groups (company name -> parent company name)
const parentChildMapping: Record<string, string | null> = {
  // Reliance Group - Reliance Industries is parent
  'Reliance Industries': null, // Parent/root

  // Tata Group - Tata Steel is parent
  'Tata Steel': null, // Parent/root
  'TCS Limited': 'Tata Steel',
  'Titan Company': 'Tata Steel',

  // Adani Group - Adani Ports is parent
  'Adani Ports': null, // Parent/root
  'ONGC Limited': 'Adani Ports',
  'Power Grid Corp': 'Adani Ports',
  'NTPC Limited': 'Adani Ports',
  'Coal India': 'Adani Ports',

  // Aditya Birla Group - Grasim Industries is parent
  'Grasim Industries': null, // Parent/root
  'UltraTech Cement': 'Grasim Industries',
  'Hindalco Industries': 'Grasim Industries',
  'ABB India': 'Grasim Industries',

  // Mahindra Group - Mahindra & Mahindra is parent
  'Mahindra & Mahindra': null, // Parent/root
  'Tech Mahindra': 'Mahindra & Mahindra',

  // Bajaj Group - Bajaj Finance is parent
  'Bajaj Finance': null, // Parent/root
  'Bajaj Auto': 'Bajaj Finance',

  // Hinduja Group - IDL Logistics Limited is parent
  'IDL Logistics Limited': null, // Parent/root

  // HDFC Banking Group - HDFC Bank is parent
  'HDFC Bank': null, // Parent/root
  'ICICI Bank': 'HDFC Bank',
  'Axis Bank': 'HDFC Bank',
  'Kotak Mahindra Bank': 'HDFC Bank',
  'SBI Bank': 'HDFC Bank',
  'IndusInd Bank': 'HDFC Bank',

  // Pharma & Healthcare Group - Sun Pharma is parent
  'Sun Pharma': null, // Parent/root
  'Dr Reddy Labs': 'Sun Pharma',
  'Cipla Limited': 'Sun Pharma',
  'Divi Laboratories': 'Sun Pharma',
  'Apollo Hospitals': 'Sun Pharma',

  // IT Services Group - Infosys Limited is parent
  'Infosys Limited': null, // Parent/root
  'Wipro Limited': 'Infosys Limited',
  'HCL Technologies': 'Infosys Limited',

  // FMCG Group - Hindustan Unilever is parent
  'Hindustan Unilever': null, // Parent/root
  'Nestle India': 'Hindustan Unilever',
  'Britannia Industries': 'Hindustan Unilever',

  // Auto Manufacturing Group - Maruti Suzuki is parent
  'Maruti Suzuki': null, // Parent/root
  'Eicher Motors': 'Maruti Suzuki',

  // Industrials Group - Asian Paints is parent
  'Asian Paints': null, // Parent/root
  'Berger Paints': 'Asian Paints',
  'Pidilite Industries': 'Asian Paints',
  'Siemens Limited': 'Asian Paints',
  'Bosch Limited': 'Asian Paints',
  'Havells India': 'Asian Paints',
  'Voltas Limited': 'Asian Paints',

  // Steel & Metals Group - JSW Steel is parent
  'JSW Steel': null, // Parent/root
  'Shree Cement': 'JSW Steel',

  // Standalone/single-entity groups (all are parents)
  'Deepak Cables': null,
  'Larsen & Toubro': null,
  'Godrej Consumer': null,
  'Bharti Airtel': null,
};

export const mockPortfolioCompanies: PortfolioCompany[] = portfolioCompanies.map((name, i) => {
  const creditLimit = Math.floor(Math.random() * 2000) + 500;
  const grossExposure = Math.floor(creditLimit * (0.7 + Math.random() * 0.3));
  const creditExposure = Math.floor(grossExposure * (0.8 + Math.random() * 0.2));
  const undrawn = creditLimit - creditExposure;
  const isDelinquent = Math.random() > 0.8;

  // Ensure proper distribution of product types matching Dashboard
  const productTypes = ['Business Loan', 'Home Loan', 'Personal Loan', 'Auto Loan'];
  const selectedProduct = productTypes[i % 4];

  // Use company-to-group mapping for realistic groupings
  const companyGroup = companyToGroupMapping[name] || 'Independent';

  // Determine parent ID based on parent-child mapping
  const parentCompanyName = parentChildMapping[name] !== undefined ? parentChildMapping[name] : null;
  const parentId = parentCompanyName
    ? portfolioCompanies.findIndex(c => c === parentCompanyName) !== -1
      ? `portfolio-${portfolioCompanies.findIndex(c => c === parentCompanyName) + 1}`
      : null
    : null;

  return {
    id: `portfolio-${i + 1}`,
    customerName: name,
    custId: 1234 + i,
    partyType: partyTypes[i % 3],
    group: companyGroup,
    parentId,
    orgStructure: orgStructures[i % orgStructures.length],
    lineOfBusiness: lineOfBusiness[i % lineOfBusiness.length],
    industry: industries[i % industries.length],
    productType: selectedProduct, // Ensure matches Dashboard chart
    region: regionDistribution[i % 4], // Ensure even distribution
    segment: segmentDistribution[i % 3], // Ensure even distribution
    creditLimit,
    grossCreditExposure: grossExposure,
    creditExposure,
    undrawnExposure: undrawn,
    overdues: isDelinquent ? Math.floor(Math.random() * 20) : 0,
    creditStatus: isDelinquent ? 'Delinquent' : (Math.random() > 0.9 ? 'Watchlist' : 'Standard'),
    assetClass: isDelinquent ? 'Delinquent' : 'Standard',
    borrowerExternalRating: externalRatings[Math.floor(Math.random() * externalRatings.length)],
    borrowerInternalRating: internalRatings[Math.floor(Math.random() * internalRatings.length)],
    borrowerCreditScore: Math.floor(Math.random() * 300) + 650,
    riskGrade: externalRatings[i % externalRatings.length], // Ensure coverage of all grades
    stageClassification: isDelinquent ? 2 : 1,
    securityStatus: securityStatuses[Math.floor(Math.random() * securityStatuses.length)],
    securityValue: Math.floor(Math.random() * 1500),
  };
});

// AI Insights Mock Data
import type { Insight } from '../types';

export const mockInsights: Insight[] = [
  // Portfolio Trends Insights
  {
    id: 'insight-trends-1',
    chartId: 'portfolio-trends',
    title: 'NPA Declining Trend',
    description: 'Non-Performing Assets decreased by 0.3% quarter-over-quarter, indicating improved portfolio quality management and effective recovery strategies.',
    severity: 'info',
    category: 'trend',
    metrics: [
      { label: 'Current NPA', value: '2.5%' },
      { label: 'Previous Quarter', value: '2.8%' },
      { label: 'Change', value: '-0.3%' }
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: 'insight-trends-2',
    chartId: 'portfolio-trends',
    title: 'PAR Upward Movement',
    description: 'Portfolio at Risk has increased by 0.2% over the last 2 months. Early intervention recommended for accounts showing early signs of stress.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Current PAR', value: '4.2%' },
      { label: '2 Months Ago', value: '4.0%' },
      { label: 'Trend', value: '+0.2%' }
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: 'insight-trends-3',
    chartId: 'portfolio-trends',
    title: 'Healthy Portfolio Growth',
    description: 'Total exposure grew by 5.2% year-over-year, demonstrating healthy expansion within risk appetite limits and market demand.',
    severity: 'info',
    category: 'opportunity',
    metrics: [
      { label: 'Current Exposure', value: '₹125 Cr' },
      { label: 'Growth Rate', value: '+5.2%' },
      { label: 'Target Growth', value: '6-8%' }
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: 'insight-trends-4',
    chartId: 'portfolio-trends',
    title: 'Seasonal Pattern Detected',
    description: 'Historical data shows a recurring seasonal dip in Q1. Plan for proactive customer engagement and targeted credit offers.',
    severity: 'info',
    category: 'anomaly',
    timestamp: new Date().toISOString(),
  },

  // Regional Breakdown Insights
  {
    id: 'insight-regional-1',
    chartId: 'regional-breakdown',
    title: 'North Region Outperformance',
    description: 'North region leads with 36% of total exposure and maintains the lowest NPA rate at 2.1%, significantly below portfolio average.',
    severity: 'info',
    category: 'trend',
    metrics: [
      { label: 'Exposure Share', value: '36%' },
      { label: 'NPA Rate', value: '2.1%' },
      { label: 'RAROC', value: '17.2%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'region',
      value: 'NORTH',
      label: 'North Region Accounts',
    },
  },
  {
    id: 'insight-regional-2',
    chartId: 'regional-breakdown',
    title: 'West Region Concentration Risk',
    description: 'Top 5 accounts in West region represent 60% of regional exposure. Diversification recommended to reduce concentration risk.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Top 5 Concentration', value: '60%' },
      { label: 'Recommended Max', value: '45%' },
      { label: 'Regional Exposure', value: '₹20 Cr' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'region',
      value: 'WEST',
      label: 'West Region Accounts',
    },
  },
  {
    id: 'insight-regional-3',
    chartId: 'regional-breakdown',
    title: 'South Region Expansion Opportunity',
    description: 'South region shows strong credit appetite and low NPA. Consider targeted expansion to capture market share.',
    severity: 'info',
    category: 'opportunity',
    metrics: [
      { label: 'Current Share', value: '25.6%' },
      { label: 'NPA Rate', value: '2.3%' },
      { label: 'Growth Potential', value: 'High' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'region',
      value: 'SOUTH',
      label: 'South Region Accounts',
    },
  },

  // Product Mix Insights
  {
    id: 'insight-product-1',
    chartId: 'product-mix',
    title: 'Business Loans Drive RAROC',
    description: 'Business Loans segment delivers highest risk-adjusted returns at 18.5%, justifying continued focus on this product line.',
    severity: 'info',
    category: 'trend',
    metrics: [
      { label: 'RAROC', value: '18.5%' },
      { label: 'Portfolio Share', value: '30%' },
      { label: 'NPA Rate', value: '2.7%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'productType',
      value: 'Business Loan',
      label: 'Business Loan Accounts',
    },
  },
  {
    id: 'insight-product-2',
    chartId: 'product-mix',
    title: 'Home Loans Stability',
    description: 'Home Loans show the most stable performance with lowest NPA at 1.8% and consistent growth patterns.',
    severity: 'info',
    category: 'trend',
    metrics: [
      { label: 'NPA Rate', value: '1.8%' },
      { label: 'Portfolio Share', value: '25%' },
      { label: 'Stability Score', value: '9.2/10' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'productType',
      value: 'Home Loan',
      label: 'Home Loan Accounts',
    },
  },
  {
    id: 'insight-product-3',
    chartId: 'product-mix',
    title: 'Personal Loans Above Benchmark',
    description: 'Personal Loans NPA at 3.5% exceeds industry benchmark of 2.8%. Enhanced underwriting and monitoring recommended.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Current NPA', value: '3.5%' },
      { label: 'Industry Benchmark', value: '2.8%' },
      { label: 'Gap', value: '+0.7%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'productType',
      value: 'Personal Loan',
      label: 'Personal Loan Accounts',
    },
  },
  {
    id: 'insight-product-4',
    chartId: 'product-mix',
    title: 'Product Diversification Goal',
    description: 'Portfolio diversification index at 0.72. Opportunity to expand Auto Loans segment to achieve optimal 0.80 target.',
    severity: 'info',
    category: 'opportunity',
    metrics: [
      { label: 'Current Index', value: '0.72' },
      { label: 'Target Index', value: '0.80' },
      { label: 'Auto Loans Share', value: '20%' }
    ],
    timestamp: new Date().toISOString(),
  },

  // Delinquency Matrix Insights
  {
    id: 'insight-delinquency-1',
    chartId: 'delinquency-matrix',
    title: 'North 91-180 Bucket Alert',
    description: 'North region 91-180 days bucket increased 15% month-over-month. Immediate intervention required to prevent further deterioration.',
    severity: 'critical',
    category: 'risk',
    metrics: [
      { label: 'Current Count', value: '50 accounts' },
      { label: 'MoM Change', value: '+15%' },
      { label: 'Exposure', value: '₹2 Cr' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'region',
      value: 'NORTH',
      label: 'North Region - Delinquent Accounts',
    },
  },
  {
    id: 'insight-delinquency-2',
    chartId: 'delinquency-matrix',
    title: 'East Region Best Performer',
    description: 'East region maintains 89% of accounts in current status, representing best-in-class collection efficiency.',
    severity: 'info',
    category: 'trend',
    metrics: [
      { label: 'Current %', value: '89%' },
      { label: 'Portfolio Average', value: '83%' },
      { label: 'Performance Gap', value: '+6%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'region',
      value: 'EAST',
      label: 'East Region Accounts',
    },
  },
  {
    id: 'insight-delinquency-3',
    chartId: 'delinquency-matrix',
    title: 'Bucket Migration Risk',
    description: '15 accounts currently in 61-90 bucket show high probability of migrating to 91-180 this month based on payment patterns.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'At-Risk Accounts', value: '15' },
      { label: 'Total Exposure', value: '₹1.2 Cr' },
      { label: 'Migration Probability', value: '78%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'creditStatus',
      value: 'Delinquent',
      label: 'Delinquent Accounts',
    },
  },
  {
    id: 'insight-delinquency-4',
    chartId: 'delinquency-matrix',
    title: 'Early Warning Signal',
    description: '0-30 days bucket showing 8% increase. Proactive customer engagement can prevent progression to higher buckets.',
    severity: 'warning',
    category: 'anomaly',
    metrics: [
      { label: '0-30 Days Count', value: '1,200' },
      { label: 'MoM Change', value: '+8%' },
      { label: 'Recovery Potential', value: 'High' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'creditStatus',
      value: 'Watchlist',
      label: 'Watchlist Accounts',
    },
  },

  // Top 20 Exposures Insights
  {
    id: 'insight-top20-1',
    chartId: 'top-exposures',
    title: 'Concentration Above Threshold',
    description: 'Top 20 exposures represent 32% of total portfolio, exceeding optimal threshold of 25%. Consider risk mitigation strategies.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Current Concentration', value: '32%' },
      { label: 'Recommended Max', value: '25%' },
      { label: 'Excess', value: '+7%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'partyType',
      value: 'Large Corporate',
      label: 'Large Corporate Borrowers',
    },
  },
  {
    id: 'insight-top20-2',
    chartId: 'top-exposures',
    title: 'Rating Downgrades Detected',
    description: '3 accounts in Top 20 have experienced credit rating downgrades in the last quarter. Enhanced monitoring and review recommended.',
    severity: 'critical',
    category: 'risk',
    metrics: [
      { label: 'Downgraded Accounts', value: '3' },
      { label: 'Combined Exposure', value: '₹8.5 Cr' },
      { label: 'Portfolio Impact', value: '6.8%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'creditStatus',
      value: 'Watchlist',
      label: 'Watchlist Accounts',
    },
  },
  {
    id: 'insight-top20-3',
    chartId: 'top-exposures',
    title: 'Credit Limit Expansion Opportunity',
    description: '8 accounts showing excellent payment history and low utilization. Eligible for credit limit increase to drive revenue growth.',
    severity: 'info',
    category: 'opportunity',
    metrics: [
      { label: 'Eligible Accounts', value: '8' },
      { label: 'Avg Utilization', value: '45%' },
      { label: 'Revenue Potential', value: '₹50 Lakhs' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'creditStatus',
      value: 'Standard',
      label: 'Standard Credit Accounts',
    },
  },
  {
    id: 'insight-top20-4',
    chartId: 'top-exposures',
    title: 'Sector Concentration',
    description: 'IT Services sector represents 40% of Top 20 exposures. Sectoral diversification recommended for balanced risk profile.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'IT Services Share', value: '40%' },
      { label: 'Recommended Max', value: '30%' },
      { label: 'Accounts', value: '8' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'industry',
      value: 'IT Services',
      label: 'IT Services Industry',
    },
  },

  // ============================================================================
  // KPI-LEVEL INSIGHTS (for Advanced KPI Cards)
  // ============================================================================

  // KPI #1: PPHS (Portfolio Health Score)
  {
    id: 'insight-kpi-pphs-1',
    kpiId: 'pphs',
    title: 'Composite Health Score Improving',
    description: 'Portfolio Health Score at 72.5 driven by Quick Mortality improvement (-0.4%) and stable RAROC. Continue monitoring PBI stress indicators.',
    severity: 'info',
    category: 'trend',
    metrics: [
      { label: 'Current PPHS', value: '72.5' },
      { label: 'Previous Month', value: '74.2' },
      { label: 'Key Driver', value: 'Quick Mortality ↓' }
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: 'insight-kpi-pphs-2',
    kpiId: 'pphs',
    title: 'Net PD Migration Component Alert',
    description: 'Net PD Migration contributing 15% weight to PPHS shows upward trend. This component needs immediate attention to prevent score deterioration.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Component Weight', value: '15%' },
      { label: 'Trend', value: '+12.5%' },
      { label: 'Impact on PPHS', value: '-1.8 pts' }
    ],
    timestamp: new Date().toISOString(),
  },

  // KPI #2: Quick Mortality
  {
    id: 'insight-kpi-mortality-1',
    kpiId: 'quick_mortality',
    title: 'Digital Channel Mortality 2x Higher',
    description: 'Digital-originated loans show 6.2% mortality vs 4.1% branch average. Enhanced screening needed for digital channel underwriting.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Digital Channel', value: '6.2%' },
      { label: 'Branch Channel', value: '4.1%' },
      { label: 'Gap', value: '+51%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'segment',
      value: 'RETAIL',
      label: 'Retail Digital Accounts',
    },
  },
  {
    id: 'insight-kpi-mortality-2',
    kpiId: 'quick_mortality',
    title: 'Personal Loans Drive Mortality',
    description: 'Personal Loans represent 45% of early delinquent accounts despite only 25% portfolio share. Top contributing segment for Quick Mortality.',
    severity: 'critical',
    category: 'risk',
    metrics: [
      { label: 'Portfolio Share', value: '25%' },
      { label: 'Mortality Contribution', value: '45%' },
      { label: 'Mortality Rate', value: '7.8%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'productType',
      value: 'Personal Loan',
      label: 'Personal Loan Accounts',
    },
  },

  // KPI #3: Forward Delinquency
  {
    id: 'insight-kpi-forecast-1',
    kpiId: 'forward_delinquency',
    title: 'Top 10 Accounts = 65% of Risk',
    description: '127 accounts predicted to slip, but top 10 account for ₹29.4Cr (65% of expected slippages). Focus intervention on high-value accounts.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Total Predicted', value: '127' },
      { label: 'Top 10 Exposure', value: '₹29.4Cr' },
      { label: 'Model Confidence', value: '82%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'creditStatus',
      value: 'Watchlist',
      label: 'Watchlist Accounts',
    },
  },
  {
    id: 'insight-kpi-forecast-2',
    kpiId: 'forward_delinquency',
    title: 'SME Segment Highest PD',
    description: 'SME segment shows 45% of predicted defaults with average PD of 28%. Enhanced monitoring and early warning triggers recommended.',
    severity: 'critical',
    category: 'risk',
    metrics: [
      { label: 'SME Predicted Slippages', value: '57' },
      { label: 'Average PD', value: '28%' },
      { label: 'Expected Loss', value: '₹18.2Cr' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'segment',
      value: 'SME',
      label: 'SME Accounts',
    },
  },

  // KPI #4: PBI (Pre-Delinquency Behavior Index)
  {
    id: 'insight-kpi-pbi-1',
    kpiId: 'pbi',
    title: '15 Accounts in Critical Stress Zone',
    description: '15 SME accounts showing critical behavior stress scores >70. High utilization spikes and bounced payments detected. Immediate outreach required.',
    severity: 'critical',
    category: 'risk',
    metrics: [
      { label: 'Critical Accounts', value: '15' },
      { label: 'Avg Stress Score', value: '76.2' },
      { label: 'Combined Exposure', value: '₹8.5Cr' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'segment',
      value: 'SME',
      label: 'SME High-Stress Accounts',
    },
  },
  {
    id: 'insight-kpi-pbi-2',
    kpiId: 'pbi',
    title: 'Partial Payment Score Trending Up',
    description: 'Average partial payment score increased from 35 to 42 month-over-month, indicating rising financial stress across borrower base.',
    severity: 'warning',
    category: 'trend',
    metrics: [
      { label: 'Current Avg Score', value: '42' },
      { label: 'Previous Month', value: '35' },
      { label: 'MoM Change', value: '+20%' }
    ],
    timestamp: new Date().toISOString(),
  },

  // KPI #5: VDI (Vintage Deterioration Index)
  {
    id: 'insight-kpi-vdi-1',
    kpiId: 'vdi',
    title: '2024-Q2 Vintage Shows 18% Deterioration',
    description: 'Recent 2024-Q2 vintage performing 18% worse than historical median at same age. Review origination quality and underwriting standards for this cohort.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Current DPD Rate', value: '5.2%' },
      { label: 'Historical Median', value: '4.4%' },
      { label: 'Deterioration Index', value: '118%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'segment',
      value: 'RETAIL',
      label: 'Retail Q2 2024 Vintage',
    },
  },
  {
    id: 'insight-kpi-vdi-2',
    kpiId: 'vdi',
    title: 'Older Vintages Reverting to Mean',
    description: 'Vintages older than 12 months showing improvement trend, reverting to historical averages. Focus should remain on recent vintages.',
    severity: 'info',
    category: 'trend',
    metrics: [
      { label: 'Mature Vintages VDI', value: '102%' },
      { label: 'Recent Vintages VDI', value: '115%' },
      { label: 'Gap', value: '13%' }
    ],
    timestamp: new Date().toISOString(),
  },

  // KPI #6: Net PD Migration
  {
    id: 'insight-kpi-migration-1',
    kpiId: 'net_pd_migration',
    title: '₹28.5Cr Downgraded Stage 1→2',
    description: 'Significant stage migration: 45 accounts with ₹28.5Cr moved from Stage 1 to Stage 2 this month. Immediate review and remediation required.',
    severity: 'critical',
    category: 'risk',
    metrics: [
      { label: 'Downgraded Exposure', value: '₹28.5Cr' },
      { label: 'Account Count', value: '45' },
      { label: 'Avg Exposure', value: '₹63L' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'creditStatus',
      value: 'Watchlist',
      label: 'Stage 2 Accounts',
    },
  },
  {
    id: 'insight-kpi-migration-2',
    kpiId: 'net_pd_migration',
    title: 'Rating Downgrades Accelerating',
    description: 'External rating downgrades increased 35% QoQ. Corporate segment accounts for 60% of downgrades, driven by sector headwinds.',
    severity: 'warning',
    category: 'trend',
    metrics: [
      { label: 'QoQ Increase', value: '+35%' },
      { label: 'Corporate Share', value: '60%' },
      { label: 'Total Downgrades', value: '27' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'segment',
      value: 'CORPORATE',
      label: 'Corporate Downgraded Accounts',
    },
  },

  // KPI #7: Concentration & Contagion
  {
    id: 'insight-kpi-concentration-1',
    kpiId: 'concentration_contagion',
    title: 'Mega Corp Group = 40% Top 10',
    description: 'Mega Corp Group and subsidiaries represent 40% of top 10 exposures (₹50Cr). Group contagion risk significant if parent entity deteriorates.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Group Exposure', value: '₹50Cr' },
      { label: 'Top 10 Share', value: '40%' },
      { label: 'Linked Entities', value: '3' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'group',
      value: 'Mega Corp Group',
      label: 'Mega Corp Group Entities',
    },
  },
  {
    id: 'insight-kpi-concentration-2',
    kpiId: 'concentration_contagion',
    title: 'Common Promoter Linkage Detected',
    description: '2 large exposures share common promoter with cross-holdings. Combined exposure ₹18Cr presents correlated default risk.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Combined Exposure', value: '₹18Cr' },
      { label: 'Correlation Risk', value: 'High' },
      { label: 'Linked Accounts', value: '2' }
    ],
    timestamp: new Date().toISOString(),
  },

  // KPI #8: Utilization & Liquidity Stress
  {
    id: 'insight-kpi-utilization-1',
    kpiId: 'utilization_stress',
    title: '5 Revolvers Spiked >30pp in 30 Days',
    description: 'Critical utilization stress detected: 5 revolving credit accounts spiked >30 percentage points in last 30 days, indicating liquidity crunch.',
    severity: 'critical',
    category: 'anomaly',
    metrics: [
      { label: 'Stressed Accounts', value: '5' },
      { label: 'Avg Utilization', value: '94%' },
      { label: 'Avg Spike', value: '+38pp' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'productType',
      value: 'Credit Line',
      label: 'High Utilization Revolvers',
    },
  },
  {
    id: 'insight-kpi-utilization-2',
    kpiId: 'utilization_stress',
    title: 'LCB Segment Shows Stress',
    description: 'LCB (Large Corporate Banking) segment shows 8% of revolvers in stress vs 3% portfolio average. Monitor for systemic liquidity issues.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'LCB Stress Rate', value: '8%' },
      { label: 'Portfolio Average', value: '3%' },
      { label: 'Stressed Exposure', value: '₹12Cr' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'lineOfBusiness',
      value: 'LCB',
      label: 'LCB Stressed Accounts',
    },
  },

  // KPI #9: Reversion Rate
  {
    id: 'insight-kpi-reversion-1',
    kpiId: 'reversion_rate',
    title: '25% of Restructured Accounts Reverting',
    description: 'Reversion rate at 25%, above target of 20%. EMI reduction structures showing highest reversion at 35%. Reassess restructuring effectiveness.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Reversion Rate', value: '25%' },
      { label: 'Target', value: '20%' },
      { label: 'EMI Reduction Type', value: '35%' }
    ],
    timestamp: new Date().toISOString(),
    filter: {
      field: 'creditStatus',
      value: 'Delinquent',
      label: 'Reverted Accounts',
    },
  },
  {
    id: 'insight-kpi-reversion-2',
    kpiId: 'reversion_rate',
    title: 'Tenor Extension Performing Best',
    description: 'Tenor extension restructures show only 15% reversion vs 35% for EMI reduction. Consider favoring tenor extension in future restructuring.',
    severity: 'info',
    category: 'opportunity',
    metrics: [
      { label: 'Tenor Extension', value: '15%' },
      { label: 'EMI Reduction', value: '35%' },
      { label: 'Accounts Restructured', value: '45' }
    ],
    timestamp: new Date().toISOString(),
  },

  // KPI #10: ECL Sensitivity
  {
    id: 'insight-kpi-ecl-1',
    kpiId: 'ecl_sensitivity',
    title: 'Mild Stress: +₹36Cr Provision Needed',
    description: 'Forward ECL sensitivity shows ₹36Cr additional provision requirement under mild stress scenario (PD +50%, LGD +20%). Plan for capital allocation.',
    severity: 'warning',
    category: 'risk',
    metrics: [
      { label: 'Base ECL', value: '₹45Cr' },
      { label: 'Mild Stress ECL', value: '₹81Cr' },
      { label: 'Delta', value: '+₹36Cr' }
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: 'insight-kpi-ecl-2',
    kpiId: 'ecl_sensitivity',
    title: 'PD Component Drives Sensitivity',
    description: 'PD contribution accounts for 65% of ECL increase under stress. Focus on probability of default reduction through early intervention programs.',
    severity: 'info',
    category: 'trend',
    metrics: [
      { label: 'PD Contribution', value: '65%' },
      { label: 'EAD Contribution', value: '20%' },
      { label: 'LGD Contribution', value: '15%' }
    ],
    timestamp: new Date().toISOString(),
  },
];

// Helper functions
export const getInsightsByChartId = (chartId: string): Insight[] => {
  return mockInsights.filter((insight) => insight.chartId === chartId);
};

export const getInsightCountByChartId = (chartId: string): number => {
  return mockInsights.filter((insight) => insight.chartId === chartId).length;
};

export const getFilterOptions = () => {
  return {
    lob: Array.from(new Set(mockPortfolioCompanies.map((c) => c.lineOfBusiness))).sort(),
    partyType: Array.from(new Set(mockPortfolioCompanies.map((c) => c.partyType))).sort(),
    rating: Array.from(new Set(mockPortfolioCompanies.map((c) => c.borrowerExternalRating))).sort(),
    assetClassification: Array.from(new Set(mockPortfolioCompanies.map((c) => c.assetClass))).sort(),
  };
};

// Risk Details Helper
import type { RiskDetails } from '../types';

export const getRiskDetails = (companyId: string): RiskDetails | null => {
  const company = mockPortfolioCompanies.find((c) => c.id === companyId);
  if (!company) return null;

  // Determine risk level based on company's asset class and credit status
  const getRiskLevel = (): RiskDetails['creditRiskRepo']['riskLevel'] => {
    if (company.assetClass === 'Delinquent' || company.creditStatus === 'Delinquent') {
      return 'High Risk';
    }
    if (company.creditStatus === 'Watchlist') {
      return 'Medium Risk';
    }
    return Math.random() > 0.7 ? 'Medium Risk' : 'Low Risk';
  };

  // Generate credit rating history (last 6 entries)
  const generateCreditRatingHistory = () => {
    const ratings = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'BBB+', 'BBB', 'BB'];
    const sources = ['CRISIL', 'ICRA', 'CARE', 'India Ratings'];
    const outlooks = ['Stable', 'Positive', 'Negative', 'Watch'];

    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i * 6);

      return {
        date: date.toISOString().split('T')[0],
        ratingType: i === 0 ? 'Long Term' : (i % 2 === 0 ? 'Long Term' : 'Short Term'),
        ratingSource: sources[i % sources.length],
        creditRating: i === 0 ? company.borrowerExternalRating : ratings[Math.floor(Math.random() * ratings.length)],
        creditOutlook: outlooks[Math.floor(Math.random() * outlooks.length)],
      };
    });
  };

  // Generate credit scoring history (last 8 entries)
  const generateCreditScoringHistory = () => {
    const scoringTypes = ['Credit Score', 'Risk Score', 'Behavioral Score'];
    const sources = ['Internal Model', 'CIBIL', 'Experian', 'Equifax'];
    const outlooks = ['Improving', 'Stable', 'Deteriorating'];

    return Array.from({ length: 8 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i * 3);

      const baseScore = company.borrowerCreditScore;
      const variance = Math.floor(Math.random() * 50) - 25;

      return {
        date: date.toISOString().split('T')[0],
        scoringType: scoringTypes[i % scoringTypes.length],
        scoringSource: sources[i % sources.length],
        score: baseScore + variance,
        outlook: outlooks[Math.floor(Math.random() * outlooks.length)],
      };
    });
  };

  // Generate rating reports (2-3 detailed reports)
  const generateRatingReports = (): RiskDetails['ratingReports'] => {
    const providers: Array<'CRISIL' | 'ICRA' | 'CARE' | 'Other'> = ['CRISIL', 'ICRA', 'CARE'];
    const ratings = ['AAA', 'AA+', 'AA', 'A+', 'A', 'BBB+', 'BBB'];
    const outlooks = ['Stable', 'Positive', 'Negative'];

    return Array.from({ length: Math.floor(Math.random() * 2) + 2 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i * 12);

      const provider = providers[i % providers.length];

      return {
        provider,
        reportDate: date.toISOString().split('T')[0],
        rating: i === 0 ? company.borrowerExternalRating : ratings[Math.floor(Math.random() * ratings.length)],
        outlook: outlooks[i % outlooks.length],
        rationale: `${provider} has assigned ${company.borrowerExternalRating} rating to ${company.customerName} based on its strong market position in ${company.industry} sector, healthy financial profile, and experienced management team.`,
        keyDrivers: [
          `Strong market position in ${company.industry} sector`,
          'Healthy financial metrics with adequate liquidity',
          'Experienced management with proven track record',
          'Diversified revenue streams and customer base',
          company.securityStatus === 'Secured' ? 'Adequate security coverage' : 'Clean facility structure',
        ],
        detailedCommentary: `The rating reflects ${company.customerName}'s established market position in the ${company.industry} industry. The company has demonstrated consistent operational performance with a credit exposure of ₹${company.creditExposure.toFixed(2)} Cr against a sanctioned limit of ₹${company.creditLimit.toFixed(2)} Cr. The ${company.securityStatus.toLowerCase()} nature of facilities provides ${company.securityStatus === 'Secured' ? 'adequate collateral coverage' : 'reflects strong creditworthiness'}. The outlook remains ${outlooks[i % outlooks.length].toLowerCase()} based on industry dynamics and company-specific factors.`,
      };
    });
  };

  // Generate risk factors based on company profile
  const generateRiskFactors = () => {
    const factors = [];
    const riskLevel = getRiskLevel();

    if (company.creditStatus === 'Delinquent') {
      factors.push(
        { factor: 'Criminal Record: Property Crime', confidence: 'Strong' as const },
        { factor: 'Criminal Record: Disorderly Conduct', confidence: 'Strong' as const }
      );
    } else if (company.creditStatus === 'Watchlist') {
      factors.push(
        { factor: 'Financial Irregularities Reported', confidence: 'Moderate' as const },
        { factor: 'Regulatory Compliance Issues', confidence: 'Moderate' as const }
      );
    } else if (riskLevel === 'Medium Risk') {
      factors.push(
        { factor: 'Market Volatility Impact', confidence: 'Moderate' as const },
        { factor: 'Sector-Specific Challenges', confidence: 'Weak' as const }
      );
    }

    return factors;
  };

  const riskLevel = getRiskLevel();
  const riskFactors = generateRiskFactors();

  return {
    companyId: company.id,
    companyName: company.customerName,

    borrowerRiskClassification: {
      creditStatus: company.creditStatus,
      assetClassification: company.assetClass,
      stageClassification: `Stage ${company.stageClassification}`,
      delinquentFlag: company.overdues > 0 ? 'Yes' : 'No',
      watchlistFlag: company.creditStatus === 'Watchlist' ? 'Yes' : 'No',
      securityStatus: company.securityStatus,
      guarantorStatus: Math.random() > 0.5 ? 'Available' : 'Not Available',
    },

    riskMetrics: {
      probabilityOfDefault: `${(Math.random() * 5 + 0.5).toFixed(2)}%`,
      lossGivenDefault: `${(Math.random() * 20 + 30).toFixed(2)}%`,
      totalExposureAtDefault: `₹${company.creditExposure.toFixed(2)} Cr`,
      expectedCreditLoss: `₹${(company.creditExposure * (Math.random() * 0.05)).toFixed(2)} Cr`,
      loanToValueRatio: company.securityStatus === 'Secured'
        ? `${((company.creditExposure / company.securityValue) * 100).toFixed(2)}%`
        : 'N/A',
      riskWeight: `${Math.floor(Math.random() * 50 + 50)}%`,
    },

    creditRatingHistory: generateCreditRatingHistory(),

    creditScoringHistory: generateCreditScoringHistory(),

    ratingReports: generateRatingReports(),

    creditRiskRepo: {
      riskLevel,
      commonName: company.customerName,
      searchDate: new Date().toISOString().split('T')[0],
      riskFactors,
      dataSources: riskFactors.length > 0
        ? ['Google Search', 'Search Engine Records', 'Court and Arrest Records']
        : [],
    },
  };
};

// Exposure Details Helper
import type { ExposureDetails } from '../types';

export const getExposureDetails = (companyId: string): ExposureDetails | null => {
  const company = mockPortfolioCompanies.find((c) => c.id === companyId);
  if (!company) return null;

  const totalBankExposure = 125000; // Total bank portfolio exposure in Cr
  const drawingLimit = company.creditLimit * 0.85;

  // Generate 18 months of trend data
  const generateTrends = () => {
    return Array.from({ length: 18 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (17 - i));

      const baseCredit = company.creditLimit;
      const growthFactor = 1 + (i * 0.02); // 2% growth per month

      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        creditLimit: baseCredit * growthFactor,
        drawnLimit: baseCredit * 0.85 * growthFactor,
        creditExposure: company.creditExposure * growthFactor * (0.9 + Math.random() * 0.2),
        overDrawings: Math.random() > 0.7 ? Math.random() * 50 : 0,
        undrawn: (baseCredit * growthFactor) - (company.creditExposure * growthFactor),
      };
    });
  };

  // Generate hierarchical exposure
  const loanProducts = ['Loans', 'Cards'];
  const nonFundBasedProducts = ['Guarantees', 'Letter of Credit'];

  const totalLoanExposure = company.creditExposure * 0.7;
  const totalInvestment = company.creditExposure * 0.2;
  const totalDerivatives = company.creditExposure * 0.1;

  // Generate 3-7 accounts
  const numAccounts = Math.floor(Math.random() * 5) + 3;
  const generateAccounts = () => {
    const products = ['Term Loan', 'Cash Credit', 'Overdraft', 'Letter of Credit', 'Bank Guarantee'];
    const paymentFrequencies = ['Monthly', 'Quarterly', 'Half-Yearly', 'Annual'];
    const statuses = ['Active', 'Closed', 'Suspended'];
    const classifications = ['Standard', 'Watch list', 'Substandard', 'Doubtful'];

    return Array.from({ length: numAccounts }, (_, i) => {
      const creditLimit = Math.floor(Math.random() * 500) + 100;
      const drawingLimit = creditLimit * 0.85;
      const outstanding = creditLimit * (0.5 + Math.random() * 0.4);
      const overdues = Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0;
      const dpd = overdues > 0 ? Math.floor(Math.random() * 90) : 0;

      const openDate = new Date();
      openDate.setFullYear(openDate.getFullYear() - Math.floor(Math.random() * 5) - 1);

      const tenorMonths = Math.floor(Math.random() * 120) + 12;
      const maturityDate = new Date(openDate);
      maturityDate.setMonth(maturityDate.getMonth() + tenorMonths);

      return {
        accountId: `ACC${String(10000 + i).padStart(6, '0')}`,
        product: products[i % products.length],
        creditLimit,
        drawingLimit,
        outstandingBalance: outstanding,
        availableLimit: creditLimit - outstanding,
        grossCreditExposure: outstanding * 1.1,
        openedDate: openDate.toISOString().split('T')[0],
        tenor: `${tenorMonths} months`,
        maturityDate: maturityDate.toISOString().split('T')[0],
        paymentFrequency: paymentFrequencies[i % paymentFrequencies.length],
        overdues,
        emi: outstanding / tenorMonths,
        roi: 8 + Math.random() * 4,
        lastPaymentDueDate: new Date(Date.now() - dpd * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysPastDue: dpd,
        accountStatus: statuses[Math.floor(Math.random() * statuses.length)],
        classification: classifications[Math.floor(Math.random() * classifications.length)],
        securityValue: company.securityStatus === 'Secured' ? outstanding * 1.2 : 0,
        ltv: company.securityStatus === 'Secured' ? (outstanding / (outstanding * 1.2)) * 100 : 0,
        ecl: outstanding * 0.02,
        instrumentRating: company.borrowerExternalRating,
      };
    });
  };

  const accounts = generateAccounts();
  const accountsOpen = accounts.filter(a => a.accountStatus === 'Active').length;
  const accountsWithOverdues = accounts.filter(a => a.overdues > 0).length;
  const accountsDelinquent = accounts.filter(a => a.daysPastDue > 90).length;

  return {
    companyId: company.id,
    companyName: company.customerName,

    exposureSummary: {
      totalExposure: company.creditExposure,
      proportionOfBankExposure: (company.creditExposure / totalBankExposure) * 100,
      creditLimit: company.creditLimit,
      drawingLimit,
      creditExposure: company.creditExposure,
      undrawnExposure: company.undrawnExposure,
      grossCreditExposure: company.grossCreditExposure,
      overdues: company.overdues,
      dpd: company.overdues > 0 ? Math.floor(Math.random() * 90) : 0,
      creditStatus: company.creditStatus,
      assetClassification: company.assetClass,
      ecl: company.creditExposure * 0.02,
      securityValue: company.securityValue,
      rwa: company.creditExposure * 0.75,
      totalEmi: company.creditExposure * 0.015,
    },

    exposureTrends: generateTrends(),

    hierarchicalExposure: {
      bankingBook: {
        loanExposure: {
          fundBased: loanProducts.map(product => ({
            product,
            exposure: totalLoanExposure * (0.4 + Math.random() * 0.3),
          })),
          nonFundBased: nonFundBasedProducts.map(product => ({
            product,
            exposure: totalLoanExposure * (0.1 + Math.random() * 0.2),
          })),
        },
        investmentExposure: {
          fundBased: totalInvestment * 0.6,
          nonFundBased: totalInvestment * 0.4,
        },
      },
      tradingBook: {
        investmentExposure: {
          fundBased: totalInvestment * 0.3,
          nonFundBased: totalInvestment * 0.2,
        },
        derivativesExposure: {
          value: totalDerivatives,
        },
      },
    },

    contractSummary: {
      totalAccounts: numAccounts,
      accountsOpen,
      accountsWithOutstandingDues: accounts.filter(a => a.outstandingBalance > 0).length,
      accountsWithOverdues,
      accountsDelinquent,
      accountsDefault: Math.floor(accountsDelinquent * 0.3),
    },

    accounts,
  };
};

// Group Exposure Details Helper
import type { GroupExposureDetails } from '../types';

export const getGroupExposureDetails = (companyId: string): GroupExposureDetails | null => {
  const company = mockPortfolioCompanies.find((c) => c.id === companyId);
  if (!company || company.group === 'Independent') return null;

  // Find all companies in the same group
  const groupMembers = mockPortfolioCompanies.filter((c) => c.group === company.group);
  const totalBankExposure = 125000;

  // Aggregate group metrics
  const groupTotalCreditLimit = groupMembers.reduce((sum, m) => sum + m.creditLimit, 0);
  const groupTotalExposure = groupMembers.reduce((sum, m) => sum + m.creditExposure, 0);
  const groupTotalOverdues = groupMembers.reduce((sum, m) => sum + m.overdues, 0);
  const groupTotalUndrawn = groupMembers.reduce((sum, m) => sum + m.undrawnExposure, 0);
  const groupTotalGross = groupMembers.reduce((sum, m) => sum + m.grossCreditExposure, 0);
  const groupTotalSecurity = groupMembers.reduce((sum, m) => sum + m.securityValue, 0);

  const companiesWithOverdues = groupMembers.filter(m => m.overdues > 0).length;
  const worstCreditStatus = groupMembers.some(m => m.creditStatus === 'Delinquent')
    ? 'Delinquent'
    : groupMembers.some(m => m.creditStatus === 'Watchlist')
    ? 'Watchlist'
    : 'Standard';

  // Find parent entity (company with highest exposure in group)
  const parentEntity = groupMembers.reduce((max, m) =>
    m.creditExposure > max.creditExposure ? m : max
  , groupMembers[0]);

  // Generate group trends
  const generateGroupTrends = () => {
    return Array.from({ length: 18 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (17 - i));
      const growthFactor = 1 + (i * 0.02);

      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        creditLimit: groupTotalCreditLimit * growthFactor,
        drawnLimit: groupTotalCreditLimit * 0.85 * growthFactor,
        creditExposure: groupTotalExposure * growthFactor * (0.9 + Math.random() * 0.2),
        overDrawings: Math.random() > 0.7 ? Math.random() * 100 : 0,
        undrawn: (groupTotalCreditLimit * growthFactor) - (groupTotalExposure * growthFactor),
      };
    });
  };

  // Generate member companies data
  const memberCompanies = groupMembers.map((member, idx) => ({
    entityName: member.customerName,
    entityId: `ENT${String(5000 + idx).padStart(6, '0')}`,
    companyId: member.id,
    industry: member.industry,
    internalRating: member.borrowerInternalRating,
    externalRating: member.borrowerExternalRating,
    baselRating: `Basel ${['II', 'III'][Math.floor(Math.random() * 2)]}`,
    creditLimit: member.creditLimit,
    drawingCredit: member.creditLimit * 0.85,
    exposure: member.creditExposure,
    undrawnExposure: member.undrawnExposure,
    grossCreditExposure: member.grossCreditExposure,
    overdues: member.overdues,
    dpd: member.overdues > 0 ? Math.floor(Math.random() * 90) : 0,
    creditStatus: member.creditStatus,
    assetClassification: member.assetClass,
    ecl: member.creditExposure * 0.02,
    securityValue: member.securityValue,
    riskWeight: Math.floor(Math.random() * 50 + 50),
    rwa: member.creditExposure * 0.75,
  }));

  return {
    companyId: company.id,
    companyName: company.customerName,

    groupInfo: {
      groupName: company.group,
      parentEntity: parentEntity.customerName,
      groupRating: parentEntity.borrowerExternalRating,
      numberOfFundedCompanies: groupMembers.length,
      numberOfCompaniesWithOverdues: companiesWithOverdues,
    },

    groupExposureSummary: {
      totalExposure: groupTotalExposure,
      proportionOfBankExposure: (groupTotalExposure / totalBankExposure) * 100,
      creditLimit: groupTotalCreditLimit,
      drawingLimit: groupTotalCreditLimit * 0.85,
      creditExposure: groupTotalExposure,
      undrawnExposure: groupTotalUndrawn,
      grossCreditExposure: groupTotalGross,
      overdues: groupTotalOverdues,
      dpd: groupTotalOverdues > 0 ? Math.floor(Math.random() * 90) : 0,
      creditStatus: worstCreditStatus,
      assetClassification: worstCreditStatus === 'Delinquent' ? 'Delinquent' : 'Standard',
      ecl: groupTotalExposure * 0.02,
      securityValue: groupTotalSecurity,
      rwa: groupTotalExposure * 0.75,
      totalEmi: groupTotalExposure * 0.015,
    },

    groupExposureTrends: generateGroupTrends(),
    memberCompanies,
  };
};

// KYC & Compliance Details Helper
import type { KYCComplianceDetails } from '../types';

export const getKYCComplianceDetails = (companyId: string): KYCComplianceDetails | null => {
  const company = mockPortfolioCompanies.find((c) => c.id === companyId);
  if (!company) return null;

  const hasAdverseMedia = company.creditStatus === 'Delinquent' || Math.random() > 0.7;

  const generateRiskFactors = () => {
    if (!hasAdverseMedia) return [];

    const allFactors = [
      { factor: 'Criminal Record: Property Crime', confidence: 'Strong' as const },
      { factor: 'Criminal Record: Disorderly Conduct', confidence: 'Strong' as const },
      { factor: 'Federal Bond:Stockley Cadet', confidence: 'Strong' as const },
      { factor: 'Financial Fraud Allegations', confidence: 'Moderate' as const },
      { factor: 'Regulatory Non-Compliance', confidence: 'Moderate' as const },
      { factor: 'Legal Disputes Pending', confidence: 'Weak' as const },
    ];

    const count = Math.floor(Math.random() * 3) + 2;
    return allFactors.slice(0, count);
  };

  const riskFactors = generateRiskFactors();

  const generateRiskScoreHistory = () => {
    return Array.from({ length: Math.floor(Math.random() * 5) + 5 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i * 2);

      const baseScore = company.borrowerCreditScore;
      const variance = Math.floor(Math.random() * 100) - 50;

      return {
        score: baseScore + variance,
        dateScored: date.toISOString().split('T')[0],
        risk: baseScore + variance < 650 ? 'High' : baseScore + variance < 750 ? 'Medium' : 'Low',
        manualOverride: Math.random() > 0.9 ? 'Yes' : 'No',
        type: ['Credit Risk', 'Operational Risk', 'Compliance Risk'][i % 3],
      };
    });
  };

  const generateWatchListScans = () => {
    return Array.from({ length: Math.floor(Math.random() * 4) + 3 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i * 3);

      return {
        scanDate: date.toISOString().split('T')[0],
        result: Math.random() > 0.8 ? 'Match Found' : 'No Match',
        score: Math.floor(Math.random() * 100),
        source: ['OFAC', 'UN Sanctions', 'PEP List', 'Adverse Media'][i % 4],
      };
    });
  };

  return {
    companyId: company.id,
    companyName: company.customerName,

    adverseMediaScans: {
      commonName: company.customerName,
      searchDate: new Date().toISOString().split('T')[0],
      detected: hasAdverseMedia,
      riskFactors,
      dataSources: riskFactors.length > 0 ? [
        { source: 'Google Search', confidenceLevel: 'High' },
        { source: 'Search Engine Records', confidenceLevel: 'Medium' },
        { source: 'Court and Arrest Records', confidenceLevel: 'High' },
        { source: 'News Archives', confidenceLevel: 'Medium' },
      ] : [],
    },

    riskSummary: {
      details: hasAdverseMedia ? 'Profile Risk Detected' : 'No Risk Detected',
      profileRisk: hasAdverseMedia ? 'High' : 'Low',
      riskFactors: riskFactors.map(rf => rf.factor),
    },

    riskScoreHistory: generateRiskScoreHistory(),

    watchListScans: generateWatchListScans(),

    complianceSummary: {
      caseDetails: {
        totalCases: Math.floor(Math.random() * 20),
        openCases: Math.floor(Math.random() * 5),
        closedCases: Math.floor(Math.random() * 15),
      },
      events: {
        totalEvents: Math.floor(Math.random() * 50),
        recentEvents: Math.floor(Math.random() * 10),
      },
      sars: {
        totalSARs: Math.floor(Math.random() * 10),
        pendingSARs: Math.floor(Math.random() * 3),
      },
    },
  };
};

// Profitability Details Helper
import type { ProfitabilityDetails } from '../types';

export const getProfitabilityDetails = (companyId: string): ProfitabilityDetails | null => {
  const company = mockPortfolioCompanies.find((c) => c.id === companyId);
  if (!company) return null;

  const generateIncomeStatement = (): ProfitabilityDetails['incomeStatement'] => {
    const baseIncome = company.creditExposure * (0.08 + Math.random() * 0.04);

    return [
      { lineItemIdentifier: '0', lineItemLeafName: 'Income', amount: -412000, level: 0 },
      { lineItemIdentifier: '1', lineItemLeafName: 'Total Revenue', amount: baseIncome, level: 1 },
      { lineItemIdentifier: '11', lineItemLeafName: 'Net Interest Income', amount: baseIncome * 0.6, level: 2 },
      { lineItemIdentifier: '111', lineItemLeafName: 'Total Interest Income', amount: baseIncome * 0.65, level: 3 },
      { lineItemIdentifier: '1111', lineItemLeafName: 'Interest Expense', amount: baseIncome * 0.05, level: 4 },
      { lineItemIdentifier: '1112', lineItemLeafName: 'Amortization of Premium for assets', amount: baseIncome * 0.02, level: 4 },
      { lineItemIdentifier: '1113', lineItemLeafName: 'Credit for float', amount: baseIncome * 0.03, level: 4 },
      { lineItemIdentifier: '1114', lineItemLeafName: 'Central Bank Int', amount: baseIncome * 0.01, level: 4 },
      { lineItemIdentifier: '12', lineItemLeafName: 'Non-Interest Income', amount: baseIncome * 0.4, level: 2 },
      { lineItemIdentifier: '121', lineItemLeafName: 'Fee Income', amount: baseIncome * 0.25, level: 3 },
      { lineItemIdentifier: '122', lineItemLeafName: 'Trading Income', amount: baseIncome * 0.15, level: 3 },
    ];
  };

  const incomeStatement = generateIncomeStatement();
  const totalIncome = incomeStatement.find(i => i.level === 1)?.amount || 0;
  const totalExpenditure = totalIncome * (0.6 + Math.random() * 0.1);
  const netIncome = totalIncome - totalExpenditure;

  return {
    companyId: company.id,
    companyName: company.customerName,
    customerCode: `CUST${String(company.custId).padStart(7, '0')}`,

    bankingProfile: {
      assetsTotalEOPBalance: company.creditExposure * (1.8 + Math.random() * 0.4),
      averageTenorOfAssets: `${Math.floor(Math.random() * 36) + 12} months`,
      liabilitiesTotalEOPBalance: company.creditExposure * (1.5 + Math.random() * 0.3),
      averageTenorOfLiabilities: `${Math.floor(Math.random() * 24) + 6} months`,
    },

    profitabilityMetrics: {
      totalIncome,
      totalExpenditure,
      netFeeIncome: totalIncome * 0.25,
      netIncome,
      netInterestMargin: 3 + Math.random() * 2,
      returnOnTotalAssets: (netIncome / (company.creditExposure * 2)) * 100,
      returnOnEquity: 12 + Math.random() * 8,
      riskAdjustedReturnOnCapital: 15 + Math.random() * 10,
    },

    incomeStatement,

    hasGroupProfitability: company.group !== 'Independent',
  };
};

// Climate Risk Details Helper
import type { ClimateRiskDetails } from '../types';

export const getClimateRiskDetails = (companyId: string): ClimateRiskDetails | null => {
  const company = mockPortfolioCompanies.find((c) => c.id === companyId);
  if (!company) return null;

  const totalEmissions = Math.floor(Math.random() * 400) + 100;
  const scope1 = Math.floor(totalEmissions * (0.3 + Math.random() * 0.2));
  const scope2 = Math.floor(totalEmissions * (0.15 + Math.random() * 0.15));
  const scope3 = totalEmissions - scope1 - scope2;
  const financedEmissions = Math.floor(totalEmissions * (0.2 + Math.random() * 0.15));

  const climateRatings = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B'];
  const climateRating = climateRatings[Math.floor(Math.random() * climateRatings.length)];
  const climateScore = climateRating === 'AAA' || climateRating === 'AA' ? 4 + Math.random() :
                       climateRating === 'A' || climateRating === 'BBB' ? 3 + Math.random() :
                       2 + Math.random();

  const generatePeerComparison = () => {
    const peerCount = Math.floor(Math.random() * 8) + 5;
    const peers = mockPortfolioCompanies
      .filter(c => c.industry === company.industry && c.id !== company.id)
      .slice(0, peerCount);

    return peers.map(peer => ({
      obligor: peer.customerName,
      group: peer.group,
      orgStructure: peer.orgStructure,
      counterpartCountry: 'India',
      counterpartyIndustry: peer.industry,
      creditStatus: peer.creditStatus,
      baselRating: `Basel ${['II', 'III'][Math.floor(Math.random() * 2)]}`,
      grossExposure: peer.grossCreditExposure,
      totalEmissions: Math.floor(Math.random() * 400) + 100,
      financedEmissions: Math.floor(Math.random() * 150) + 25,
      emissionsIntensity: Math.floor(Math.random() * 500) + 100,
      climateRiskScore: 1 + Math.random() * 4,
      climateRiskRating: climateRatings[Math.floor(Math.random() * climateRatings.length)],
      ratingReference: ['Positive', 'Negative', 'Neutral'][Math.floor(Math.random() * 3)] as 'Positive' | 'Negative' | 'Neutral',
    }));
  };

  return {
    companyId: company.id,
    companyName: company.customerName,

    emissionsSummary: {
      totalEmissions,
      scope1,
      scope2,
      scope3,
      financedEmissions,
      percentOfTotalFinancedEmissions: (financedEmissions / totalEmissions) * 100,
      waci: Math.floor(Math.random() * 300) + 100,
      industryAverageIntensity: Math.floor(Math.random() * 400) + 150,
    },

    exposureSummary: {
      grossExposure: company.grossCreditExposure,
      percentOfTotalExposure: (company.grossCreditExposure / 125000) * 100,
    },

    climateRiskScore: {
      isin: `IN${company.customerName.substring(0, 4).toUpperCase()}${Math.floor(Math.random() * 1000000)}`,
      counterpartyCountry: 'India',
      counterpartyIndustry: company.industry,
      climateRiskScore: climateScore,
      climateRating,
      ratingReference: ['Positive', 'Negative', 'Neutral'][Math.floor(Math.random() * 3)] as 'Positive' | 'Negative' | 'Neutral',
      industryAverageScore: 3 + Math.random(),
    },

    climateRiskReport: {
      companyName: company.customerName,
      industry: company.industry,
      climateRating,
      climateScore,
      rating: ['Positive', 'Negative', 'Neutral'][Math.floor(Math.random() * 3)] as 'Positive' | 'Negative' | 'Neutral',
      keyRiskFactors: [
        'High carbon emissions intensity',
        'Limited renewable energy adoption',
        'Exposure to physical climate risks',
      ],
      topPositives: [
        'Strong emissions disclosure',
        'Climate transition strategy in place',
        'Investment in green technologies',
      ],
    },

    peerComparisonDimensions: {
      industryType: company.industry,
      obligorType: company.partyType,
      assetClass: company.assetClass,
      exposureBand: company.creditExposure > 1000 ? 'High' : company.creditExposure > 500 ? 'Medium' : 'Low',
      creditRating: company.borrowerExternalRating,
      geography: company.region,
      creditScore: company.borrowerCreditScore.toString(),
      orgStructure: company.orgStructure,
    },

    peerComparison: generatePeerComparison(),
  };
};
