import type { EvidenceChart } from '../types';

/**
 * Evidence charts for Credit Pipeline Insight
 * Charts show sector breaches, rating migrations, high-risk accounts, composition, and health metrics
 */

export const creditPipelineCharts: EvidenceChart[] = [
  // Chart 1: Scatter Plot - Sector Breach Analysis
  {
    id: 'credit_pipeline_chart_1',
    title: 'Weekly Credit Pipeline Trends',
    keyHighlight: '8 sectors breaching limits - IT at 108.2% and Health Care at 106.1%',
    chartType: 'dual-axis',
    data: [
      { week: 'Week 1', pipelineValue: 950, dealCount: 42, avgDealSize: 10.2, sectorBreaches: 2 },
      { week: 'Week 2', pipelineValue: 1050, dealCount: 45, avgDealSize: 10.5, sectorBreaches: 3 },
      { week: 'Week 3', pipelineValue: 1120, dealCount: 48, avgDealSize: 10.8, sectorBreaches: 3 },
      { week: 'Week 4', pipelineValue: 980, dealCount: 41, avgDealSize: 10.1, sectorBreaches: 2 },
      { week: 'Week 5', pipelineValue: 1180, dealCount: 51, avgDealSize: 11.2, sectorBreaches: 4 },
      { week: 'Week 6', pipelineValue: 1250, dealCount: 54, avgDealSize: 11.5, sectorBreaches: 5 },
      { week: 'Week 7', pipelineValue: 1100, dealCount: 46, avgDealSize: 10.9, sectorBreaches: 4 },
      { week: 'Week 8', pipelineValue: 1350, dealCount: 58, avgDealSize: 11.8, sectorBreaches: 6 },
      { week: 'Week 9', pipelineValue: 1420, dealCount: 61, avgDealSize: 12.1, sectorBreaches: 6 },
      { week: 'Week 10', pipelineValue: 1200, dealCount: 52, avgDealSize: 11.3, sectorBreaches: 5 },
      { week: 'Week 11', pipelineValue: 1550, dealCount: 66, avgDealSize: 12.3, sectorBreaches: 7 },
      { week: 'This Week', pipelineValue: 1730, dealCount: 72, avgDealSize: 12.5, sectorBreaches: 8 },
    ],
    config: {
      xAxis: { key: 'week', label: 'Week' },
      yAxisLeft: { key: 'pipelineValue', label: 'Pipeline Value ($M)' },
      yAxisRight: { key: 'sectorBreaches', label: 'Sector Breaches' },
      bars: [
        { key: 'pipelineValue', name: 'Pipeline Value ($M)', color: '#3b82f6', axis: 'left' }
      ],
      lines: [
        { key: 'sectorBreaches', name: 'Sector Breaches', color: '#ef4444', axis: 'right' }
      ],
      showLegend: true,
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },

  // Chart 2: Bar Chart - Pipeline Composition by Region
  {
    id: 'credit_pipeline_chart_2',
    title: 'Pipeline Composition by Region',
    keyHighlight: 'Northeast and West regions dominate pipeline at 58% combined - concentration risk in coastal markets',
    chartType: 'bar',
    data: [
      { region: 'Northeast', pipelineValue: 520, percentage: 30, dealCount: 22, avgDealSize: 23.6 },
      { region: 'West', pipelineValue: 485, percentage: 28, dealCount: 18, avgDealSize: 26.9 },
      { region: 'Southeast', pipelineValue: 345, percentage: 20, dealCount: 15, avgDealSize: 23.0 },
      { region: 'Midwest', pipelineValue: 240, percentage: 14, dealCount: 11, avgDealSize: 21.8 },
      { region: 'Southwest', pipelineValue: 140, percentage: 8, dealCount: 6, avgDealSize: 23.3 },
    ],
    config: {
      xAxis: { key: 'region', label: 'Region' },
      yAxis: { key: 'pipelineValue', label: 'Pipeline Value ($ M)', format: 'currency' },
      series: [{ key: 'pipelineValue', name: 'Pipeline Value', color: '#3b82f6' }],
      showLegend: false,
      showGrid: true,
    },
    filterField: 'region',
    filterLabel: 'Region: {value}'
  },

  // Chart 3: Table with Alerts - High Risk Accounts
  {
    id: 'credit_pipeline_chart_3',
    title: 'High-Risk Pipeline Accounts Requiring Review',
    keyHighlight: '15 accounts with critical risk flags showing rating deterioration ($850M combined) requiring immediate review',
    chartType: 'table',
    data: [
      { borrower: 'HCA Healthcare', exposure: 95, sector: 'Health Care', rating: 'BBB', stage: 'Final Approval', riskFlags: 'Rating Downgrade (-1 notch), High Debt Load, Reimbursement Risk', days: 45, alert: true },
      { borrower: 'Tenet Healthcare', exposure: 78, sector: 'Health Care', rating: 'BB+', stage: 'Credit Committee', riskFlags: 'Rating Downgrade (-2 notches), Covenant Breach, Liquidity Concerns', days: 52, alert: true },
      { borrower: 'Oracle Corporation', exposure: 85, sector: 'IT', rating: 'BBB+', stage: 'Final Approval', riskFlags: 'Rating Downgrade (-1 notch), Cloud Competition, Margin Pressure', days: 38, alert: true },
      { borrower: 'DXC Technology', exposure: 70, sector: 'IT', rating: 'BBB-', stage: 'Documentation', riskFlags: 'Rating Downgrade (-2 notches), Client Attrition, Execution Risk', days: 41, alert: true },
      { borrower: 'Fluor Corporation', exposure: 72, sector: 'Infrastructure', rating: 'BB+', stage: 'Final Approval', riskFlags: 'Rating Downgrade (-3 notches), Project Losses, Cash Flow Issues', days: 48, alert: true },
      { borrower: 'Community Health Systems', exposure: 55, sector: 'Health Care', rating: 'B+', stage: 'Credit Committee', riskFlags: 'Rating Downgrade (-3 notches), High Leverage, Asset Sales', days: 55, alert: true },
      { borrower: 'Cognizant Technology', exposure: 62, sector: 'IT', rating: 'BBB', stage: 'Final Approval', riskFlags: 'Rating Downgrade (-1 notch), Visa Restrictions, Cost Inflation', days: 35, alert: true },
      { borrower: 'AECOM', exposure: 58, sector: 'Infrastructure', rating: 'BBB-', stage: 'Documentation', riskFlags: 'Rating Downgrade (-1 notch), Project Delays, Backlog Concerns', days: 42, alert: true },
      { borrower: 'Universal Health Services', exposure: 52, sector: 'Health Care', rating: 'BBB-', stage: 'Final Approval', riskFlags: 'Rating Downgrade (-1 notch), Regulatory Scrutiny, Labor Costs', days: 39, alert: true },
      { borrower: 'Unisys Corporation', exposure: 42, sector: 'IT', rating: 'BB', stage: 'Credit Committee', riskFlags: 'Rating Downgrade (-2 notches), Revenue Decline, Restructuring', days: 51, alert: true },
      { borrower: 'Quanta Services', exposure: 45, sector: 'Infrastructure', rating: 'BBB', stage: 'Final Approval', riskFlags: 'Rating Downgrade (-1 notch), Weather Delays, Supply Chain Issues', days: 32, alert: true },
      { borrower: 'LifePoint Health', exposure: 38, sector: 'Health Care', rating: 'BB+', stage: 'Documentation', riskFlags: 'Rating Downgrade (-2 notches), Rural Market Pressure, Payer Mix', days: 44, alert: true },
      { borrower: 'Teradata Corporation', exposure: 35, sector: 'IT', rating: 'BB+', stage: 'Credit Committee', riskFlags: 'Rating Downgrade (-2 notches), Cloud Migration Lag, Competition', days: 28, alert: true },
      { borrower: 'MasTec Inc', exposure: 32, sector: 'Infrastructure', rating: 'BBB-', stage: 'Final Approval', riskFlags: 'Rating Downgrade (-1 notch), Contract Disputes, Working Capital', days: 36, alert: true },
      { borrower: 'Select Medical Holdings', exposure: 31, sector: 'Health Care', rating: 'BB+', stage: 'Documentation', riskFlags: 'Rating Downgrade (-1 notch), Volume Declines, Integration Risk', days: 29, alert: true },
    ],
    config: {
      columns: [
        { key: 'borrower', header: 'Borrower Name', format: 'text', align: 'left' },
        { key: 'exposure', header: 'Exposure ($ M)', format: 'currency', align: 'right' },
        { key: 'sector', header: 'Sector', format: 'text', align: 'left' },
        { key: 'rating', header: 'Rating', format: 'text', align: 'center' },
        { key: 'stage', header: 'Pipeline Stage', format: 'text', align: 'center' },
        { key: 'riskFlags', header: 'Risk Flags', format: 'text', align: 'left' },
        { key: 'days', header: 'Days in Pipeline', format: 'number', align: 'center' },
      ],
    },
    filterField: 'borrowerName',
    filterLabel: 'Borrower: {value}'
  },

  // Chart 4: Bar Chart - Pipeline Composition
  {
    id: 'credit_pipeline_chart_4',
    title: 'Pipeline Composition by Sector',
    keyHighlight: 'Real Estate and NBFC represent 52% of total pipeline value - driving concentration concerns',
    chartType: 'bar',
    data: [
      { sector: 'Real Estate', pipelineValue: 485, percentage: 28, breaching: true, count: 32 },
      { sector: 'NBFC', pipelineValue: 412, percentage: 24, breaching: true, count: 28 },
      { sector: 'Infrastructure', pipelineValue: 325, percentage: 19, breaching: true, count: 22 },
      { sector: 'Manufacturing', pipelineValue: 285, percentage: 16, breaching: true, count: 18 },
      { sector: 'Services', pipelineValue: 223, percentage: 13, breaching: false, count: 15 },
    ],
    config: {
      xAxis: { key: 'sector', label: 'Sector' },
      yAxis: { key: 'pipelineValue', label: 'Pipeline Value ($ M)', format: 'currency' },
      series: [{ key: 'pipelineValue', name: 'Pipeline Value', color: '#3b82f6' }],
      showLegend: false,
      showGrid: true,
    },
    filterField: 'industry',
    filterLabel: 'Industry: {value}'
  },

  // Chart 5: Multi-widget Dashboard
  {
    id: 'credit_pipeline_chart_5',
    title: 'Pipeline Health Dashboard - Week-over-Week Trends',
    keyHighlight: 'Volume targets met but quality metrics deteriorating - velocity up 28% but rating down 1 notch',
    chartType: 'table',
    data: [
      {
        metric: 'Total Pipeline Value',
        wtd: '$1,730M',
        mtd: '$4,850M',
        q1Budget: '$12,000M',
        pctOfBudget: 40.4,
        vsLastWeek: '+8.5%',
        status: 'On Track'
      },
      {
        metric: 'Deal Count',
        wtd: '138',
        mtd: '412',
        q1Budget: '950',
        pctOfBudget: 43.4,
        vsLastWeek: '+12',
        status: 'On Track'
      },
      {
        metric: 'Avg Deal Size',
        wtd: '$12.5M',
        mtd: '$11.8M',
        q1Budget: '$10.5M',
        pctOfBudget: 112.4,
        vsLastWeek: '+5.2%',
        status: 'Above Target'
      },
      {
        metric: 'Sector Limit Breaches',
        wtd: '8',
        mtd: '8',
        q1Budget: '0',
        pctOfBudget: null,
        vsLastWeek: '+2',
        status: 'Critical'
      },
      {
        metric: 'Avg Credit Rating',
        wtd: 'BBB',
        mtd: 'BBB',
        q1Budget: 'BBB+',
        pctOfBudget: null,
        vsLastWeek: '-1 notch',
        status: 'Warning'
      },
      {
        metric: 'High Risk Accounts',
        wtd: '15',
        mtd: '15',
        q1Budget: '<5',
        pctOfBudget: null,
        vsLastWeek: '+3',
        status: 'Critical'
      },
      {
        metric: 'Avg Days in Pipeline',
        wtd: '38',
        mtd: '35',
        q1Budget: '30',
        pctOfBudget: 116.7,
        vsLastWeek: '+5',
        status: 'Warning'
      },
      {
        metric: 'Exception Rate',
        wtd: '18.5%',
        mtd: '16.8%',
        q1Budget: '12.0%',
        pctOfBudget: 140.0,
        vsLastWeek: '+2.2%',
        status: 'Warning'
      },
    ],
    config: {
      columns: [
        { key: 'metric', header: 'Metric', format: 'text', align: 'left' },
        { key: 'wtd', header: 'WTD', format: 'text', align: 'right' },
        { key: 'mtd', header: 'MTD', format: 'text', align: 'right' },
        { key: 'q1Budget', header: 'Q1 Budget', format: 'text', align: 'right' },
        { key: 'pctOfBudget', header: '% of Budget', format: 'percent', align: 'right' },
        { key: 'vsLastWeek', header: 'vs Last Week', format: 'text', align: 'right' },
        { key: 'status', header: 'Status', format: 'text', align: 'center' },
      ],
    }
  },
];
