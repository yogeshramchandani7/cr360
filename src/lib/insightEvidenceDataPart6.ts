import type { EvidenceChart } from '../types';

// Midwest Unsecured Loan Origination Quality Evidence Charts
export const midwestOriginationCharts: EvidenceChart[] = [
  // Chart 1: The "Invisible Risk" Chart (Score vs. Capacity)
  {
    id: 'midwest_chart_1',
    title: 'Credit Score vs. Debt Service Capacity - Midwest Unsecured Loans (12M Trend)',
    keyHighlight: 'Bureau scores stable at ~720 while TDS spiked from 40% to 48% in last 3 months - good credit history masking bad ability to pay',
    chartType: 'dual-axis',
    data: [
      { month: 'Jan 24', bureauScore: 718, tds: 39.8, gds: 28.5 },
      { month: 'Feb 24', bureauScore: 719, tds: 40.2, gds: 28.9 },
      { month: 'Mar 24', bureauScore: 720, tds: 40.5, gds: 29.1 },
      { month: 'Apr 24', bureauScore: 721, tds: 41.1, gds: 29.6 },
      { month: 'May 24', bureauScore: 720, tds: 41.8, gds: 30.2 },
      { month: 'Jun 24', bureauScore: 719, tds: 42.5, gds: 30.8 },
      { month: 'Jul 24', bureauScore: 720, tds: 43.2, gds: 31.5 },
      { month: 'Aug 24', bureauScore: 721, tds: 44.8, gds: 32.8 },
      { month: 'Sep 24', bureauScore: 720, tds: 46.2, gds: 34.1 },
      { month: 'Oct 24', bureauScore: 719, tds: 47.5, gds: 35.6 },
      { month: 'Nov 24', bureauScore: 720, tds: 48.1, gds: 36.2 },
      { month: 'Dec 24', bureauScore: 720, tds: 48.3, gds: 36.5 }
    ],
    config: {
      xAxis: { key: 'month', label: 'Month' },
      yAxis: {
        key: 'bureauScore',
        label: 'Weighted Avg Bureau Score',
        format: 'number'
      },
      series: [
        {
          key: 'bureauScore',
          name: 'Bureau Score',
          color: '#3b82f6',
          type: 'bar',
          axis: 'left'
        },
        {
          key: 'tds',
          name: 'Total Debt Service (TDS %)',
          color: '#ef4444',
          type: 'line',
          axis: 'right'
        },
        {
          key: 'gds',
          name: 'Gross Debt Service (GDS %)',
          color: '#f59e0b',
          type: 'line',
          axis: 'right'
        }
      ],
      referenceLine: {
        y: 43,
        label: 'TDS Policy Limit (43%)',
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

  // Chart 2: The "Breach" Chart (Deviations Analysis)
  {
    id: 'midwest_chart_2',
    title: 'Loan Volume by Approval Type - Midwest Region B (Monthly)',
    keyHighlight: 'TDS/GDS breach deviations grew from 5% to 22% of bookings in Q3 - local credit managers overriding policy to hit volume targets',
    chartType: 'bar',
    data: [
      { month: 'Jan 24', cleanApprovals: 850, incomeVerificationDeviation: 120, tdsGdsBreachDeviation: 45 },
      { month: 'Feb 24', cleanApprovals: 920, incomeVerificationDeviation: 135, tdsGdsBreachDeviation: 52 },
      { month: 'Mar 24', cleanApprovals: 890, incomeVerificationDeviation: 145, tdsGdsBreachDeviation: 58 },
      { month: 'Apr 24', cleanApprovals: 875, incomeVerificationDeviation: 155, tdsGdsBreachDeviation: 68 },
      { month: 'May 24', cleanApprovals: 830, incomeVerificationDeviation: 165, tdsGdsBreachDeviation: 85 },
      { month: 'Jun 24', cleanApprovals: 795, incomeVerificationDeviation: 180, tdsGdsBreachDeviation: 102 },
      { month: 'Jul 24', cleanApprovals: 750, incomeVerificationDeviation: 195, tdsGdsBreachDeviation: 128 },
      { month: 'Aug 24', cleanApprovals: 720, incomeVerificationDeviation: 210, tdsGdsBreachDeviation: 165 },
      { month: 'Sep 24', cleanApprovals: 685, incomeVerificationDeviation: 225, tdsGdsBreachDeviation: 198 },
      { month: 'Oct 24', cleanApprovals: 652, incomeVerificationDeviation: 238, tdsGdsBreachDeviation: 225 },
      { month: 'Nov 24', cleanApprovals: 620, incomeVerificationDeviation: 245, tdsGdsBreachDeviation: 248 },
      { month: 'Dec 24', cleanApprovals: 598, incomeVerificationDeviation: 252, tdsGdsBreachDeviation: 268 }
    ],
    config: {
      xAxis: {
        key: 'month',
        label: 'Month'
      },
      yAxis: {
        label: 'Number of Loans Originated',
        format: 'number'
      },
      series: [
        {
          key: 'cleanApprovals',
          name: 'Clean Approvals',
          color: '#10b981',
          stack: 'total'
        },
        {
          key: 'incomeVerificationDeviation',
          name: 'Income Verification Deviation',
          color: '#fbbf24',
          stack: 'total'
        },
        {
          key: 'tdsGdsBreachDeviation',
          name: 'TDS/GDS Breach',
          color: '#ef4444',
          stack: 'total'
        }
      ],
      showLegend: true,
      showGrid: true
    },
    filterField: 'month',
    filterLabel: 'Month: {value}'
  },

  // Chart 3: Deviation Type vs. Delinquency Rate
  {
    id: 'midwest_chart_3',
    title: 'Delinquency Rate by Policy Deviation Type',
    keyHighlight: 'TDS Breach deviations show 5.0% 90-day delinquency rate - 3x higher than other exceptions and 5x higher than clean approvals',
    chartType: 'bar',
    data: [
      {
        deviationType: 'Clean Approvals',
        delinquency30Day: 0.8,
        delinquency60Day: 0.5,
        delinquency90Day: 1.0,
        loanCount: 9850,
        avgExposure: 28500
      },
      {
        deviationType: 'Income Verification Waiver',
        delinquency30Day: 1.2,
        delinquency60Day: 0.8,
        delinquency90Day: 1.6,
        loanCount: 2105,
        avgExposure: 26800
      },
      {
        deviationType: 'LTV Override',
        delinquency30Day: 1.5,
        delinquency60Day: 1.0,
        delinquency90Day: 1.8,
        loanCount: 850,
        avgExposure: 32500
      },
      {
        deviationType: 'GDS Breach',
        delinquency30Day: 2.3,
        delinquency60Day: 1.8,
        delinquency90Day: 3.2,
        loanCount: 685,
        avgExposure: 29800
      },
      {
        deviationType: 'TDS Breach',
        delinquency30Day: 3.8,
        delinquency60Day: 2.9,
        delinquency90Day: 5.0,
        loanCount: 1548,
        avgExposure: 31200
      },
      {
        deviationType: 'Multiple Deviations',
        delinquency30Day: 4.2,
        delinquency60Day: 3.5,
        delinquency90Day: 5.8,
        loanCount: 425,
        avgExposure: 33500
      }
    ],
    config: {
      xAxis: { key: 'deviationType', label: 'Deviation Type' },
      yAxis: {
        key: 'value',
        label: '90-Day Delinquency Rate (%)',
        format: 'number'
      },
      series: [
        {
          key: 'delinquency90Day',
          name: '90-Day Delinquency Rate',
          color: '#dc2626',
          type: 'bar'
        }
      ],
      showLegend: false,
      showGrid: true
    },
    filterField: 'deviationType',
    filterLabel: 'Deviation Type: {value}'
  },

  // Chart 4: The Consequence (Quick Mortality / Vintage Curve)
  {
    id: 'midwest_chart_4',
    title: 'Vintage Cumulative Default Curve - Midwest Region B',
    keyHighlight: 'Q3 2024 vintage hitting 2.5% default by Month 4 vs Q1 at 0.5% - rapid mortality signals borrower over-leverage at origination',
    chartType: 'line',
    data: [
      { mob: 1, q1_2024: 0.1, q2_2024: 0.2, q3_2024: 0.8, q4_2024: 1.2 },
      { mob: 2, q1_2024: 0.2, q2_2024: 0.4, q3_2024: 1.5, q4_2024: 2.1 },
      { mob: 3, q1_2024: 0.3, q2_2024: 0.7, q3_2024: 2.0, q4_2024: 2.8 },
      { mob: 4, q1_2024: 0.5, q2_2024: 1.1, q3_2024: 2.5, q4_2024: 3.4 },
      { mob: 5, q1_2024: 0.6, q2_2024: 1.4, q3_2024: 2.9, q4_2024: 3.9 },
      { mob: 6, q1_2024: 0.8, q2_2024: 1.8, q3_2024: 3.2, q4_2024: 4.2 },
      { mob: 7, q1_2024: 1.0, q2_2024: 2.1, q3_2024: 3.5, q4_2024: 0 },
      { mob: 8, q1_2024: 1.2, q2_2024: 2.4, q3_2024: 3.8, q4_2024: 0 },
      { mob: 9, q1_2024: 1.4, q2_2024: 2.6, q3_2024: 0, q4_2024: 0 },
      { mob: 10, q1_2024: 1.6, q2_2024: 2.8, q3_2024: 0, q4_2024: 0 },
      { mob: 11, q1_2024: 1.8, q2_2024: 3.0, q3_2024: 0, q4_2024: 0 },
      { mob: 12, q1_2024: 2.0, q2_2024: 3.2, q3_2024: 0, q4_2024: 0 }
    ],
    config: {
      xAxis: { key: 'mob', label: 'Months on Book (MOB)' },
      yAxis: {
        key: 'value',
        label: 'Cumulative Default Rate (%)',
        format: 'number'
      },
      series: [
        {
          key: 'q1_2024',
          name: 'Q1 2024',
          color: '#3b82f6',
          type: 'line'
        },
        {
          key: 'q2_2024',
          name: 'Q2 2024',
          color: '#f59e0b',
          type: 'line'
        },
        {
          key: 'q3_2024',
          name: 'Q3 2024',
          color: '#ef4444',
          type: 'line'
        },
        {
          key: 'q4_2024',
          name: 'Q4 2024',
          color: '#dc2626',
          type: 'line'
        }
      ],
      showLegend: true,
      showGrid: true
    }
  },

  // Chart 5: Net Risk-Adjusted Yield (Profitability by True Risk)
  {
    id: 'midwest_chart_5',
    title: 'Net Risk-Adjusted Yield by Internal Risk Rating - Midwest Region B',
    keyHighlight: 'Risk Ratings 6-8 show negative net margin (-$420 avg per loan) - interest income low due to bureau-score pricing but ECL high due to TDS overrides',
    chartType: 'dual-axis',
    data: [
      {
        riskRating: 'Rating 1-2',
        avgInterestIncome: 2850,
        avgExpectedLoss: 285,
        netMargin: 2565,
        originationVolume: 1250,
        avgTDS: 32.5,
        avgBureauScore: 780
      },
      {
        riskRating: 'Rating 3-4',
        avgInterestIncome: 3200,
        avgExpectedLoss: 448,
        netMargin: 2752,
        originationVolume: 3850,
        avgTDS: 37.2,
        avgBureauScore: 745
      },
      {
        riskRating: 'Rating 5',
        avgInterestIncome: 3850,
        avgExpectedLoss: 693,
        netMargin: 3157,
        originationVolume: 5420,
        avgTDS: 42.8,
        avgBureauScore: 728
      },
      {
        riskRating: 'Rating 6',
        avgInterestIncome: 4200,
        avgExpectedLoss: 1890,
        netMargin: 2310,
        originationVolume: 2685,
        avgTDS: 46.5,
        avgBureauScore: 718
      },
      {
        riskRating: 'Rating 7',
        avgInterestIncome: 4500,
        avgExpectedLoss: 3150,
        netMargin: 1350,
        originationVolume: 1548,
        avgTDS: 48.2,
        avgBureauScore: 715
      },
      {
        riskRating: 'Rating 8',
        avgInterestIncome: 4800,
        avgExpectedLoss: 5220,
        netMargin: -420,
        originationVolume: 685,
        avgTDS: 51.8,
        avgBureauScore: 712
      },
      {
        riskRating: 'Rating 9-10',
        avgInterestIncome: 5200,
        avgExpectedLoss: 7280,
        netMargin: -2080,
        originationVolume: 425,
        avgTDS: 54.5,
        avgBureauScore: 708
      }
    ],
    config: {
      xAxis: { key: 'riskRating', label: 'Internal Risk Rating' },
      yAxis: {
        key: 'avgInterestIncome',
        label: 'Average Amount per Loan ($)',
        format: 'currency'
      },
      series: [
        {
          key: 'avgInterestIncome',
          name: 'Avg Interest Income',
          color: '#10b981',
          type: 'bar',
          axis: 'left'
        },
        {
          key: 'avgExpectedLoss',
          name: 'Avg Expected Loss (ECL)',
          color: '#ef4444',
          type: 'bar',
          axis: 'left'
        },
        {
          key: 'netMargin',
          name: 'Net Margin',
          color: '#3b82f6',
          type: 'line',
          axis: 'right'
        }
      ],
      referenceLine: {
        y: 0,
        label: 'Break-even',
        stroke: '#000000',
        strokeDasharray: '3 3'
      },
      showLegend: true,
      showGrid: true
    },
    filterField: 'riskRating',
    filterLabel: 'Risk Rating: {value}'
  },

  // Chart 6: Top 25 Worst Originations
  {
    id: 'midwest_chart_6',
    title: 'Top 25 Worst Originations by Expected Loss - Midwest Region B',
    keyHighlight: 'Top 25 high-risk loans total $2.85M exposure with $428K expected loss - all have TDS breaches and multiple override approvals',
    chartType: 'table',
    data: [
      {
        rank: 1,
        loanId: 'L-MW8234',
        originationDate: '2024-10-15',
        loanAmount: 125000,
        mob: 2,
        currentStatus: '30 DPD',
        tds: 52.8,
        bureauScore: 712,
        riskRating: 8,
        deviations: 'TDS Override, Income Verif',
        approver: 'RM-045',
        pd: 8.5,
        ead: 125000,
        lgd: 45,
        expectedLoss: 47812,
        netMargin: -12500
      },
      {
        rank: 2,
        loanId: 'L-MW8156',
        originationDate: '2024-09-28',
        loanAmount: 98000,
        mob: 3,
        currentStatus: '60 DPD',
        tds: 54.2,
        bureauScore: 708,
        riskRating: 9,
        deviations: 'TDS Override, GDS Override',
        approver: 'RM-045',
        pd: 9.2,
        ead: 98000,
        lgd: 48,
        expectedLoss: 43315,
        netMargin: -15200
      },
      {
        rank: 3,
        loanId: 'L-MW8401',
        originationDate: '2024-11-05',
        loanAmount: 135000,
        mob: 1,
        currentStatus: 'Current',
        tds: 51.5,
        bureauScore: 715,
        riskRating: 8,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 8.8,
        ead: 135000,
        lgd: 45,
        expectedLoss: 53460,
        netMargin: -9800
      },
      {
        rank: 4,
        loanId: 'L-MW8089',
        originationDate: '2024-09-12',
        loanAmount: 88000,
        mob: 3,
        currentStatus: '30 DPD',
        tds: 53.1,
        bureauScore: 710,
        riskRating: 8,
        deviations: 'TDS Override, Income Verif',
        approver: 'RM-045',
        pd: 8.9,
        ead: 88000,
        lgd: 46,
        expectedLoss: 36051,
        netMargin: -11200
      },
      {
        rank: 5,
        loanId: 'L-MW8512',
        originationDate: '2024-11-18',
        loanAmount: 112000,
        mob: 1,
        currentStatus: 'Current',
        tds: 50.8,
        bureauScore: 718,
        riskRating: 7,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 7.8,
        ead: 112000,
        lgd: 44,
        expectedLoss: 38438,
        netMargin: -5600
      },
      {
        rank: 6,
        loanId: 'L-MW7998',
        originationDate: '2024-08-22',
        loanAmount: 145000,
        mob: 4,
        currentStatus: '90+ DPD',
        tds: 55.2,
        bureauScore: 705,
        riskRating: 9,
        deviations: 'TDS Override, GDS Override, LTV',
        approver: 'RM-088',
        pd: 9.8,
        ead: 145000,
        lgd: 50,
        expectedLoss: 71050,
        netMargin: -18500
      },
      {
        rank: 7,
        loanId: 'L-MW8276',
        originationDate: '2024-10-08',
        loanAmount: 95000,
        mob: 2,
        currentStatus: 'Current',
        tds: 49.8,
        bureauScore: 720,
        riskRating: 7,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 7.5,
        ead: 95000,
        lgd: 43,
        expectedLoss: 30638,
        netMargin: -4200
      },
      {
        rank: 8,
        loanId: 'L-MW8334',
        originationDate: '2024-10-22',
        loanAmount: 105000,
        mob: 2,
        currentStatus: '30 DPD',
        tds: 52.3,
        bureauScore: 713,
        riskRating: 8,
        deviations: 'TDS Override, Income Verif',
        approver: 'RM-045',
        pd: 8.6,
        ead: 105000,
        lgd: 45,
        expectedLoss: 40635,
        netMargin: -10500
      },
      {
        rank: 9,
        loanId: 'L-MW8445',
        originationDate: '2024-11-12',
        loanAmount: 118000,
        mob: 1,
        currentStatus: 'Current',
        tds: 51.2,
        bureauScore: 716,
        riskRating: 8,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 8.4,
        ead: 118000,
        lgd: 44,
        expectedLoss: 43651,
        netMargin: -8900
      },
      {
        rank: 10,
        loanId: 'L-MW8023',
        originationDate: '2024-08-30',
        loanAmount: 92000,
        mob: 4,
        currentStatus: '60 DPD',
        tds: 53.8,
        bureauScore: 709,
        riskRating: 9,
        deviations: 'TDS Override, GDS Override',
        approver: 'RM-088',
        pd: 9.5,
        ead: 92000,
        lgd: 47,
        expectedLoss: 41078,
        netMargin: -14800
      },
      {
        rank: 11,
        loanId: 'L-MW8189',
        originationDate: '2024-09-15',
        loanAmount: 108000,
        mob: 3,
        currentStatus: 'Current',
        tds: 50.2,
        bureauScore: 719,
        riskRating: 7,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 7.6,
        ead: 108000,
        lgd: 43,
        expectedLoss: 35294,
        netMargin: -4800
      },
      {
        rank: 12,
        loanId: 'L-MW8367',
        originationDate: '2024-10-28',
        loanAmount: 128000,
        mob: 2,
        currentStatus: '30 DPD',
        tds: 52.1,
        bureauScore: 714,
        riskRating: 8,
        deviations: 'TDS Override, Income Verif',
        approver: 'RM-045',
        pd: 8.7,
        ead: 128000,
        lgd: 45,
        expectedLoss: 50112,
        netMargin: -11800
      },
      {
        rank: 13,
        loanId: 'L-MW7956',
        originationDate: '2024-08-05',
        loanAmount: 152000,
        mob: 4,
        currentStatus: '90+ DPD',
        tds: 56.1,
        bureauScore: 703,
        riskRating: 10,
        deviations: 'TDS Override, GDS Override, LTV',
        approver: 'RM-088',
        pd: 10.2,
        ead: 152000,
        lgd: 52,
        expectedLoss: 80371,
        netMargin: -21500
      },
      {
        rank: 14,
        loanId: 'L-MW8478',
        originationDate: '2024-11-15',
        loanAmount: 115000,
        mob: 1,
        currentStatus: 'Current',
        tds: 50.5,
        bureauScore: 717,
        riskRating: 7,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 7.9,
        ead: 115000,
        lgd: 44,
        expectedLoss: 40018,
        netMargin: -6200
      },
      {
        rank: 15,
        loanId: 'L-MW8201',
        originationDate: '2024-09-20',
        loanAmount: 99000,
        mob: 3,
        currentStatus: '30 DPD',
        tds: 51.8,
        bureauScore: 715,
        riskRating: 8,
        deviations: 'TDS Override',
        approver: 'RM-045',
        pd: 8.5,
        ead: 99000,
        lgd: 45,
        expectedLoss: 37822,
        netMargin: -9500
      },
      {
        rank: 16,
        loanId: 'L-MW8389',
        originationDate: '2024-11-01',
        loanAmount: 122000,
        mob: 1,
        currentStatus: 'Current',
        tds: 51.0,
        bureauScore: 716,
        riskRating: 8,
        deviations: 'TDS Override, Income Verif',
        approver: 'RM-122',
        pd: 8.3,
        ead: 122000,
        lgd: 44,
        expectedLoss: 44555,
        netMargin: -8200
      },
      {
        rank: 17,
        loanId: 'L-MW8067',
        originationDate: '2024-09-05',
        loanAmount: 87000,
        mob: 3,
        currentStatus: '60 DPD',
        tds: 53.5,
        bureauScore: 710,
        riskRating: 9,
        deviations: 'TDS Override, GDS Override',
        approver: 'RM-088',
        pd: 9.3,
        ead: 87000,
        lgd: 47,
        expectedLoss: 38014,
        netMargin: -13800
      },
      {
        rank: 18,
        loanId: 'L-MW8423',
        originationDate: '2024-11-08',
        loanAmount: 131000,
        mob: 1,
        currentStatus: 'Current',
        tds: 51.3,
        bureauScore: 715,
        riskRating: 8,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 8.6,
        ead: 131000,
        lgd: 45,
        expectedLoss: 50661,
        netMargin: -9200
      },
      {
        rank: 19,
        loanId: 'L-MW8245',
        originationDate: '2024-10-12',
        loanAmount: 103000,
        mob: 2,
        currentStatus: '30 DPD',
        tds: 52.5,
        bureauScore: 713,
        riskRating: 8,
        deviations: 'TDS Override, Income Verif',
        approver: 'RM-045',
        pd: 8.8,
        ead: 103000,
        lgd: 45,
        expectedLoss: 40788,
        netMargin: -10800
      },
      {
        rank: 20,
        loanId: 'L-MW7989',
        originationDate: '2024-08-18',
        loanAmount: 148000,
        mob: 4,
        currentStatus: '90+ DPD',
        tds: 55.8,
        bureauScore: 704,
        riskRating: 10,
        deviations: 'TDS Override, GDS Override, LTV',
        approver: 'RM-088',
        pd: 10.0,
        ead: 148000,
        lgd: 51,
        expectedLoss: 75480,
        netMargin: -20200
      },
      {
        rank: 21,
        loanId: 'L-MW8312',
        originationDate: '2024-10-18',
        loanAmount: 96000,
        mob: 2,
        currentStatus: 'Current',
        tds: 50.0,
        bureauScore: 719,
        riskRating: 7,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 7.7,
        ead: 96000,
        lgd: 43,
        expectedLoss: 31814,
        netMargin: -4500
      },
      {
        rank: 22,
        loanId: 'L-MW8456',
        originationDate: '2024-11-14',
        loanAmount: 119000,
        mob: 1,
        currentStatus: 'Current',
        tds: 51.1,
        bureauScore: 716,
        riskRating: 8,
        deviations: 'TDS Override, Income Verif',
        approver: 'RM-122',
        pd: 8.4,
        ead: 119000,
        lgd: 44,
        expectedLoss: 43978,
        netMargin: -8600
      },
      {
        rank: 23,
        loanId: 'L-MW8134',
        originationDate: '2024-09-25',
        loanAmount: 91000,
        mob: 3,
        currentStatus: '30 DPD',
        tds: 52.8,
        bureauScore: 712,
        riskRating: 8,
        deviations: 'TDS Override',
        approver: 'RM-045',
        pd: 8.9,
        ead: 91000,
        lgd: 46,
        expectedLoss: 37285,
        netMargin: -11500
      },
      {
        rank: 24,
        loanId: 'L-MW8378',
        originationDate: '2024-10-30',
        loanAmount: 126000,
        mob: 2,
        currentStatus: 'Current',
        tds: 51.6,
        bureauScore: 715,
        riskRating: 8,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 8.5,
        ead: 126000,
        lgd: 45,
        expectedLoss: 48195,
        netMargin: -8900
      },
      {
        rank: 25,
        loanId: 'L-MW8501',
        originationDate: '2024-11-20',
        loanAmount: 114000,
        mob: 1,
        currentStatus: 'Current',
        tds: 50.7,
        bureauScore: 717,
        riskRating: 7,
        deviations: 'TDS Override',
        approver: 'RM-122',
        pd: 8.0,
        ead: 114000,
        lgd: 44,
        expectedLoss: 40128,
        netMargin: -6500
      }
    ],
    config: {
      columns: [
        { key: 'rank', header: 'Rank', format: 'text', align: 'center' },
        { key: 'loanId', header: 'Loan ID', format: 'text', align: 'left' },
        { key: 'originationDate', header: 'Orig Date', format: 'text', align: 'center' },
        { key: 'loanAmount', header: 'Amount', format: 'currency', align: 'right' },
        { key: 'mob', header: 'MOB', format: 'number', align: 'center' },
        { key: 'currentStatus', header: 'Status', format: 'text', align: 'center' },
        { key: 'tds', header: 'TDS %', format: 'number', align: 'center' },
        { key: 'bureauScore', header: 'FICO', format: 'number', align: 'center' },
        { key: 'riskRating', header: 'Risk', format: 'number', align: 'center' },
        { key: 'deviations', header: 'Deviations', format: 'text', align: 'left' },
        { key: 'approver', header: 'Approver', format: 'text', align: 'center' },
        { key: 'pd', header: 'PD %', format: 'number', align: 'center' },
        { key: 'expectedLoss', header: 'Exp Loss', format: 'currency', align: 'right' },
        { key: 'netMargin', header: 'Net Margin', format: 'currency', align: 'right' }
      ],
      heatmapConfig: {
        minValue: 0,
        maxValue: 100,
        colorScale: ['#dcfce7', '#fef08a', '#fca5a5', '#dc2626']
      },
      showLegend: false,
      showGrid: true
    },
    filterField: 'loanId',
    filterLabel: 'Loan: {value}'
  }
];
