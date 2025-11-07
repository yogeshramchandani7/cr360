import type { KPIInsight } from '../types';

// ============================================================================
// CMI Insights (also used for Net Deterioration)
// ============================================================================

const cmiInsights: KPIInsight[] = [
  {
    id: 'cmi_insight_1',
    kpiId: 'qm_12m_mortality',
    theme: 'Sector Stress Alert',
    keyInsights: [
      'Real Estate CMI = 61.5 vs 57.0 (CRISIL) → +4.5 gap',
      'NBFC CMI = 58.4 vs 54.8 (CRISIL) → +3.6 gap',
      'Below Investment Grade exposure up by 7%; 40% of Real Estate book is BBB & below',
      'Catch-up ratio = 0.78 → internal downgrades lag market'
    ],
    implication: 'These sectors are deteriorating faster than peers, and internal rating updates are delayed — potential under-recognition of risk.',
    croActions: [
      'Trigger portfolio-level review for Real Estate & NBFCs',
      'Tighten incremental exposure limits',
      'Direct recalibration of PD/EWS models for lag correction'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Real Estate',
        label: 'Industry: Real Estate',
        source: 'Sector Stress Alert insight'
      },
      {
        field: 'industry',
        value: 'NBFC',
        label: 'Industry: NBFC',
        source: 'Sector Stress Alert insight'
      }
    ]
  },
  {
    id: 'cmi_insight_2',
    kpiId: 'qm_12m_mortality',
    theme: '60% of migration deterioration from 3 sectors — Real Estate, Infra, NBFC',
    keyInsights: [
      'Top 3 sectors contribute 68% of downgrades',
      'Concentration Index (Herfindahl proxy): 0.42 → high concentration',
      'Bank\'s overall CMI = 57.6 vs Market 54.2 → 3.4-point divergence',
      'Infra portfolio now 8% exposure, neutral-to-negative sentiment'
    ],
    implication: 'Portfolio deterioration is concentrated, not broad-based — worsening in limited but large sectors increases systemic risk.',
    croActions: [
      'Launch Sectoral Realignment Review with Risk & Business',
      'Rebalance exposures toward stable retail & manufacturing sectors',
      'Schedule Credit Committee review on migration divergence'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Infrastructure',
        label: 'Industry: Infrastructure',
        source: 'Concentration & Divergence Risk insight'
      },
      {
        field: 'industry',
        value: 'Real Estate',
        label: 'Industry: Real Estate',
        source: 'Concentration & Divergence Risk insight'
      },
      {
        field: 'industry',
        value: 'NBFC',
        label: 'Industry: NBFC',
        source: 'Concentration & Divergence Risk insight'
      }
    ]
  },
  {
    id: 'cmi_insight_3',
    kpiId: 'qm_12m_mortality',
    theme: 'Monitoring Gaps & Rating Responsiveness',
    keyInsights: [
      'Catch-up Ratio = 0.78 → 22% lag in recognizing deterioration',
      'Lag highest in Infra & Real Estate accounts',
      'EWS triggers not flagging timely (PD drift +18 bps vs market +12 bps)'
    ],
    implication: 'Monitoring cadence and PD model responsiveness require strengthening — rating lag may mask early deterioration.',
    croActions: [
      'Commission EWS performance audit for lagging sectors',
      'Mandate monthly review of large obligors with external rating change',
      'Initiate stress test under adverse migration drift scenario'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Infrastructure',
        label: 'Industry: Infrastructure',
        source: 'Monitoring Gaps & Rating Responsiveness insight'
      },
      {
        field: 'industry',
        value: 'Real Estate',
        label: 'Industry: Real Estate',
        source: 'Monitoring Gaps & Rating Responsiveness insight'
      }
    ]
  }
];

// ============================================================================
// Origination Quality Insights (MTD Originations, Weighted PD, Portfolio RAROC)
// ============================================================================

const originationQualityInsights: KPIInsight[] = [
  {
    id: 'origination_insight_1',
    kpiId: 'quick_mortality',
    theme: 'Risk-Return Imbalance in New Originations',
    keyInsights: [
      'Weighted PD: ↑ from 1.32% → 1.42% (MoM +10 bps)',
      'Portfolio RAROC: ↓ from 14.4% → 13.8% (−0.6 p.p.)',
      '% Rated BBB & below: ↑ to 38% (↑6 p.p.)',
      'RWA intensity: ₹0.78 Cr per ₹1 Cr exposure (↑ from ₹0.72)',
      'Sector Mix: Real Estate + NBFC = 52% of new book',
      'Sector Sentiment: Negative — liquidity & refinancing stress'
    ],
    implication: 'Business growth is being driven by higher-risk, lower-yield sectors. Despite expanding origination volumes, the RAROC gap versus PD indicates erosion in underwriting profitability. Risk capital consumption rising faster than returns.',
    croActions: [
      'Implement sector-specific RAROC hurdle rates (min 15% for Real Estate & NBFC)',
      'Review and tighten credit policy for BBB and below ratings',
      'Mandate RWA efficiency review for all new large exposures',
      'Initiate portfolio rebalancing strategy toward higher RAROC sectors'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Real Estate',
        label: 'Industry: Real Estate',
        source: 'Risk-Return Imbalance insight'
      },
      {
        field: 'industry',
        value: 'NBFC',
        label: 'Industry: NBFC',
        source: 'Risk-Return Imbalance insight'
      }
    ]
  },
  {
    id: 'origination_insight_2',
    kpiId: 'quick_mortality',
    theme: 'South Region Lending Surge: Volume Spike, Quality Erosion',
    keyInsights: [
      'Origination Growth: +28% MoM (highest among all regions)',
      'Sector Concentration: 64% of South\'s new business → Infrastructure sector',
      'Sector Sentiment: Negative, outlook = Weak',
      'Weighted PD: ↑ from 1.25% → 1.58%',
      'RAROC: ↓ from 14.6% → 12.9%',
      'Weighted GDS / TDS: ↓ 8–10% MoM → affordability tightening',
      'Deviation Rate: 26% (vs bank average 21%) → mainly DSCR and Collateral Coverage relaxations',
      'Early Mortality: 1.1% of accounts sanctioned in last 12 months already in DPD >30 → double bank average'
    ],
    implication: 'Growth in South is volume-led, not differentiated. The spike stems from a few large infrastructure exposures — a sector already under watch. The region\'s risk metrics (PD, GDS/TDS, RAROC) all worsened simultaneously, while deviation approvals rose. Early mortality in this cohort signals quality compromise and policy laxity.',
    croActions: [
      'Impose temporary origination cap for South Infrastructure exposures',
      'Conduct forensic review of recent deviation approvals in South region',
      'Mandate enhanced monitoring (monthly reviews) for South Infrastructure book',
      'Strengthen regional credit oversight and compliance governance'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'region',
        value: 'South',
        label: 'Region: South',
        source: 'South Region Lending Surge insight'
      },
      {
        field: 'industry',
        value: 'Infrastructure',
        label: 'Industry: Infrastructure',
        source: 'South Region Lending Surge insight'
      }
    ]
  },
  {
    id: 'origination_insight_3',
    kpiId: 'quick_mortality',
    theme: 'Top 10% underwriters by volume show 2.5× higher default rates on their book',
    keyInsights: [
      'Top decile underwriters: Avg. monthly approvals +45% above median',
      'Default rate on their booked loans: 5.4% vs 2.1% (×2.5)',
      'Exception rate: 19.6% vs 11.2% (×1.8)',
      'Avg. case review time: −28% shorter than peers',
      'Avg. tenure of high-volume underwriters: <12 months (new hires)'
    ],
    implication: 'A review of individual underwriter performance highlights that high throughput correlates negatively with loan performance. Training or workload balancing required to maintain credit discipline.',
    croActions: [
      'Implement workload caps for underwriters to ensure adequate review time per case',
      'Mandate enhanced training program for high-volume underwriters with elevated default rates',
      'Introduce peer review mechanism for underwriters with exception rates >15%',
      'Establish quality-based performance metrics alongside volume targets',
      'Conduct forensic review of recent approvals by high-default-rate underwriters'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString()
  },
  {
    id: 'origination_insight_4',
    kpiId: 'quick_mortality',
    theme: 'Top 25 New Originations: Differentiation or Drift?',
    keyInsights: [
      'Top 25 new accounts = 38% of total new origination volume',
      'Average PD: 1.51% (vs Bank Avg 1.42%)',
      'RAROC: 12.7% (vs Portfolio Avg 13.8%)',
      'Sectoral Distribution: 10 in Infrastructure, 6 in Real Estate, 4 in NBFC, 5 in Misc.',
      '8/25 rated BBB or below; 6 accounts with approved policy deviations',
      'RWA per ₹ Cr exposure: ₹0.83 Cr (↑ from ₹0.78) → higher capital intensity',
      'Benchmark Comparison: 60% of these accounts have RAROC below peer average for same sector and rating class'
    ],
    implication: 'The bank\'s largest new exposures are not demonstrating superior differentiation. Instead, they are below-par vs peers on RAROC and PD, adding disproportionate risk without incremental return. These accounts are materially diluting the bank\'s overall origination quality index.',
    croActions: [
      'Mandate Credit Committee review for all exposures >₹50 Cr with RAROC <14%',
      'Implement peer benchmarking requirement for all large exposures before approval',
      'Review pricing strategy — consider relationship profitability beyond RAROC',
      'Establish quarterly quality review of top exposures by CRO office'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Infrastructure',
        label: 'Industry: Infrastructure',
        source: 'Top 25 Originations insight'
      },
      {
        field: 'industry',
        value: 'Real Estate',
        label: 'Industry: Real Estate',
        source: 'Top 25 Originations insight'
      },
      {
        field: 'industry',
        value: 'NBFC',
        label: 'Industry: NBFC',
        source: 'Top 25 Originations insight'
      }
    ]
  }
];

// ============================================================================
// Weighted PD Insights
// ============================================================================

const weightedPDInsights: KPIInsight[] = [
  {
    id: 'weighted_pd_insight_1',
    kpiId: 'qm_weighted_pd',
    theme: 'Higher default rates in loans made with Income Policy Exception',
    keyInsights: [
      'Exception loans default rate: 8.7% (vs 2.3% standard underwriting, +278%)',
      'Total exception loan portfolio: ₹1,247 Cr (11.2% of total originations)',
      '90+ DPD rate for exception loans: 12.4% (vs 3.1% standard, +300%)',
      'Loss given default (LGD) on exceptions: 68% (vs 45% standard, +51%)',
      'Exception loans aged 12-24 months: 73% of all exception defaults'
    ],
    implication: 'Income policy exceptions show 278% higher default rates, indicating weakened underwriting controls and systemic credit quality deterioration.',
    croActions: [
      'Immediate review of all active income policy exception cases',
      'Tighten exception approval thresholds and secondary review requirements',
      'Implement enhanced monitoring for existing exception loan portfolio',
      'Conduct deep-dive analysis on exception approval decision patterns',
      'Increase provisions for exception loans based on elevated loss rates'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'creditStatus',
        value: 'Exception',
        label: 'Policy: Income Exception',
        source: 'Income Policy Exception insight'
      }
    ]
  },
  {
    id: 'weighted_pd_insight_2',
    kpiId: 'qm_weighted_pd',
    theme: 'Newly announced tariffs impact on portfolio',
    keyInsights: [
      'Total exposure to tariff-impacted sectors: ₹3,847 Cr (34.6% of portfolio)',
      'Manufacturing exposure: ₹2,135 Cr (19.2% of portfolio, steel/aluminum +15% input costs)',
      'Auto & Auto Components: ₹892 Cr (8.0%, facing 25% tariff on imports)',
      'Electronics & Technology: ₹820 Cr (7.4%, supply chain disruption expected)',
      'Estimated margin compression: 180-220 bps across impacted borrowers'
    ],
    implication: 'Tariff announcements impact 35% of portfolio (₹3,847 Cr), causing margin compression and elevated risk of rating migrations in manufacturing and auto sectors.',
    croActions: [
      'Conduct urgent stress testing for all tariff-exposed obligors',
      'Review and update industry outlook assumptions for manufacturing and auto sectors',
      'Engage with top 20 impacted borrowers to assess mitigation strategies',
      'Evaluate need for increased provisions on high-exposure tariff-sensitive accounts',
      'Monitor supply chain disruptions and working capital requirements closely'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Manufacturing',
        label: 'Industry: Manufacturing',
        source: 'Tariffs Impact insight'
      },
      {
        field: 'industry',
        value: 'Automobiles',
        label: 'Industry: Automobiles',
        source: 'Tariffs Impact insight'
      }
    ]
  },
  {
    id: 'weighted_pd_insight_3',
    kpiId: 'qm_weighted_pd',
    theme: 'Borrower concentration breaches internal threshold; top 10 names now represent 29% of total corporate exposure',
    keyInsights: [
      'Top 10 borrowers share: 29.2% (vs. policy threshold 25%)',
      'Top 3 borrowers: 14.1% of total group limits',
      'Sector overlap: 70% in infra & energy',
      'Avg. internal rating of top 10: BBB– (vs. portfolio avg. BBB+)',
      'Incremental drawdowns last quarter: ₹1,842 Cr (+19% QoQ)'
    ],
    implication: 'Rapid drawdowns from a few large conglomerates have tilted portfolio concentration, raising systemic exposure risk. The largest three borrowers now account for 14% of total group limits.',
    croActions: [
      'Implement immediate concentration limit enforcement for top 10 borrowers',
      'Review and potentially reduce exposure limits for infrastructure and energy sectors',
      'Conduct stress testing for correlated default scenarios across top borrowers',
      'Mandate Credit Committee approval for any additional drawdowns from top 10 obligors',
      'Diversify portfolio through targeted origination in dispersed segments and sectors'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Infrastructure',
        label: 'Industry: Infrastructure',
        source: 'Borrower Concentration Breach insight'
      },
      {
        field: 'industry',
        value: 'Energy',
        label: 'Industry: Energy',
        source: 'Borrower Concentration Breach insight'
      }
    ]
  },
  {
    id: 'weighted_pd_insight_4',
    kpiId: 'qm_weighted_pd',
    theme: 'PD Migration Acceleration in High-Risk Cohorts',
    keyInsights: [
      'Weighted PD increased from 1.55% → 1.68% (+13 bps MoM)',
      '35% of the PD rise driven by Stage 1 → Stage 2 migrations',
      'High-risk segment (PD > 5%): now 18.5% of portfolio (↑ from 16.2%)',
      'Top 3 sectors contributing: Real Estate (+25 bps), NBFC (+18 bps), Infrastructure (+12 bps)',
      'PD upgrades declining: only 12.8% of accounts showed improvement vs 18.5% last quarter'
    ],
    implication: 'The portfolio is experiencing broad-based PD deterioration, with limited offsetting upgrades. Migration momentum suggests potential Stage 2 ECL pressure building.',
    croActions: [
      'Conduct sector-wise PD migration review with Risk Analytics',
      'Trigger Stage 2 watch list review for accounts with PD > 3%',
      'Evaluate need for portfolio-level stress testing',
      'Review and recalibrate Early Warning System triggers'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Real Estate',
        label: 'Industry: Real Estate',
        source: 'PD Migration Acceleration insight'
      },
      {
        field: 'industry',
        value: 'NBFC',
        label: 'Industry: NBFC',
        source: 'PD Migration Acceleration insight'
      }
    ]
  },
  {
    id: 'weighted_pd_insight_5',
    kpiId: 'qm_weighted_pd',
    theme: 'Model Drift vs Market Observable PDs',
    keyInsights: [
      'Internal PD models lagging market-observed default rates by ~22%',
      'Catch-up ratio: 0.78 (threshold = 0.90 for acceptable model performance)',
      'Largest gaps in Infrastructure and Real Estate sectors',
      'External rating agency downgrades: 45 accounts this month, internal recognition: 28 accounts',
      'PD model last recalibrated: 18 months ago'
    ],
    implication: 'Internal PD models are not keeping pace with market deterioration, potentially under-reserving ECL and mis-pricing new exposures.',
    croActions: [
      'Commission urgent PD model recalibration',
      'Implement overlay adjustments for lagging sectors',
      'Align internal ratings with external rating changes monthly',
      'Conduct model validation and back-testing exercise'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString()
  }
];

// ============================================================================
// Portfolio RAROC Insights
// ============================================================================

const rarocInsights: KPIInsight[] = [
  {
    id: 'raroc_insight_1',
    kpiId: 'qm_portfolio_raroc',
    theme: 'RAROC Compression Despite Volume Growth',
    keyInsights: [
      'Portfolio RAROC declined from 14.4% → 12.4% (-2.0 pp)',
      'New originations growing at +8.5% but RAROC down -12.7%',
      'Net Interest Margin: 3.85% (↓ from 4.10%)',
      'Expected Loss increasing faster than NII: +15% vs +5%',
      'Economic Capital requirement up 15.2% driven by PD increases'
    ],
    implication: 'Volume growth is diluting profitability metrics. The bank is adding exposures that consume more capital without proportional returns.',
    croActions: [
      'Implement minimum RAROC hurdle rates by sector (15% floor)',
      'Review pricing strategy for new originations',
      'Conduct profitability segmentation analysis',
      'Consider selective portfolio exits in sub-15% RAROC segments'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString()
  },
  {
    id: 'raroc_insight_2',
    kpiId: 'qm_portfolio_raroc',
    theme: 'Cost-to-Income Deterioration Impact',
    keyInsights: [
      'Cost-to-Income ratio: 42.5% (↑ from 40.8%)',
      'Operating expenses growing at +7.2% vs income growth of +5.1%',
      'Technology & compliance costs up 12% year-over-year',
      'Return on Equity: 16.8% (↓ from 19.2% last year)',
      'Efficiency drag reducing RAROC by estimated 0.8 pp'
    ],
    implication: 'Operational inefficiency is eroding risk-adjusted returns. The bank needs to either improve operational leverage or increase risk-adjusted pricing.',
    croActions: [
      'Launch cost optimization initiative across business units',
      'Review technology spend ROI and prioritization',
      'Implement process automation for high-volume operations',
      'Benchmark operating efficiency against peer banks'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString()
  }
];

// ============================================================================
// Credit Quality Insights (Quick Mortality Ratio / BBB & below)
// ============================================================================

const creditQualityInsights: KPIInsight[] = [
  {
    id: 'credit_quality_insight_1',
    kpiId: 'qm_rated_below_bbb',
    theme: 'BBB & Below Exposure Concentration Rising',
    keyInsights: [
      'BBB & below exposure: 28.5% of portfolio (↑ from 24.2% last quarter)',
      'Sub-investment grade (< BBB-): 12.5% (↑ from 9.8%)',
      'Rating downgrades: 45 accounts this month (35% increase MoM)',
      'Rating upgrades: only 18 accounts (↓ from 28 accounts)',
      'Average credit rating deteriorating: BBB+ vs A- six months ago'
    ],
    implication: 'The portfolio is experiencing broad-based rating deterioration with limited positive migration. This increases expected losses and capital requirements.',
    croActions: [
      'Implement exposure caps for BBB & below rated accounts',
      'Mandate Credit Committee review for all sub-investment grade exposures',
      'Conduct portfolio rebalancing toward higher-rated obligors',
      'Review pricing adequacy for BBB & below segment'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString()
  },
  {
    id: 'credit_quality_insight_2',
    kpiId: 'qm_rated_below_bbb',
    theme: 'Watchlist Expansion Signaling Early Stress',
    keyInsights: [
      'Watchlist exposure: 8.5% of portfolio (↑ from 6.2%)',
      '40% of watchlist accounts rated BBB or below',
      'Watchlist-to-default conversion: 15% over last 12 months',
      'Average time on watchlist before downgrade: 4.2 months',
      'Top sectors on watchlist: Real Estate (35%), NBFC (28%), Infrastructure (22%)'
    ],
    implication: 'The watchlist is an early indicator of future NPLs. Current expansion suggests potential credit quality deterioration pipeline.',
    croActions: [
      'Accelerate watchlist account reviews to monthly frequency',
      'Pre-emptively increase provisions for high-risk watchlist accounts',
      'Implement exit strategies for chronic watchlist accounts',
      'Strengthen monitoring and covenant enforcement'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Real Estate',
        label: 'Industry: Real Estate',
        source: 'Watchlist Expansion insight'
      },
      {
        field: 'industry',
        value: 'NBFC',
        label: 'Industry: NBFC',
        source: 'Watchlist Expansion insight'
      }
    ]
  }
];

// ============================================================================
// NPL Insights
// ============================================================================

const nplInsights: KPIInsight[] = [
  {
    id: 'npl_insight_1',
    kpiId: 'qm_npl_ratio',
    theme: 'NPL Inflow Acceleration Outpacing Recoveries',
    keyInsights: [
      'NPL ratio: 2.8% (↑ from 2.4%, +16.7% MoM)',
      'NPL inflow: $18.5M this month (+25% vs $14.8M last month)',
      'NPL recovery/upgrade: $7.8M (↓ from $9.2M)',
      'Net NPL addition: $10.7M vs $5.6M last month (91% increase)',
      'NPL coverage ratio declining: 68.5% (↓ from 72.3%)'
    ],
    implication: 'NPL formation is accelerating while recovery effectiveness is declining, creating a double-negative impact on asset quality.',
    croActions: [
      'Strengthen collections and recovery efforts immediately',
      'Review NPL recovery strategies and write-off policies',
      'Increase provisioning to maintain 70%+ coverage ratio',
      'Analyze root causes of recent NPL inflows by segment'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString()
  },
  {
    id: 'npl_insight_2',
    kpiId: 'qm_npl_ratio',
    theme: 'Vintage NPL Concentration - Chronic Problem Loans',
    keyInsights: [
      'NPLs aged > 2 years: 35.8% of total NPL book',
      'Chronic NPLs (>2yr) recovery rate: only 18% vs 45% for recent NPLs',
      'Write-off backlog: $12.5M in NPLs pending final resolution',
      'Average NPL age: 18.2 months (↑ from 14.5 months)',
      'Resolution timeline lengthening by ~3 months year-over-year'
    ],
    implication: 'A significant portion of NPLs are becoming entrenched, reducing overall recovery prospects and tying up provisions.',
    croActions: [
      'Accelerate write-off process for NPLs aged > 2 years with low recovery probability',
      'Implement specialized recovery team for chronic NPLs',
      'Review legal strategy and timeline for stuck accounts',
      'Consider NPL portfolio sale for select vintage accounts'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString()
  },
  {
    id: 'npl_insight_3',
    kpiId: 'qm_npl_ratio',
    theme: 'Sector-Driven NPL Spike - Retail Unsecured Focus',
    keyInsights: [
      'Retail unsecured NPLs: $58.5M (41% of total NPL book)',
      'Retail unsecured NPL ratio: 4.8% (vs portfolio average 2.8%)',
      'Personal loan NPLs up 32% MoM',
      'Digital channel NPLs: 2.2x higher than branch-originated loans',
      '65% of new NPL additions from loans originated in last 18 months'
    ],
    implication: 'Recent-vintage retail unsecured lending, especially through digital channels, is driving NPL formation. This suggests underwriting quality issues.',
    croActions: [
      'Immediate review of retail unsecured underwriting standards',
      'Tighten credit policy for digital channel originations',
      'Implement enhanced monitoring for recent vintages',
      'Review and recalibrate credit scoring models for digital channels'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'productType',
        value: 'Personal Loan',
        label: 'Product: Personal Loan',
        source: 'Sector-Driven NPL Spike insight'
      }
    ]
  }
];

// ============================================================================
// Underwriting Insights (Approval Rate)
// ============================================================================

const underwritingInsights: KPIInsight[] = [
  {
    id: 'underwriting_insight_1',
    kpiId: 'qm_approval_rate',
    theme: 'Tightening Credit Policy Impact on Growth',
    keyInsights: [
      'Approval rate declined: 68.5% (↓ from 72.3%, -5.2%)',
      'Decline rate increased: 22.5% (↑ from 18.2%)',
      'Withdrawal rate up: 9.0% (↑ from 7.2%) - potential competitiveness issue',
      'Pull-through rate: 85.5% (applications → disbursements)',
      'New business volume impact: -8.5% estimated from tighter policy'
    ],
    implication: 'Conservative underwriting is protecting asset quality but may be impacting growth targets and market share.',
    croActions: [
      'Conduct risk-return trade-off analysis on recent policy changes',
      'Benchmark approval rates against peer banks',
      'Review pricing competitiveness to reduce withdrawal rate',
      'Consider risk-based pricing to maintain approval rates in select segments'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString()
  },
  {
    id: 'underwriting_insight_2',
    kpiId: 'qm_approval_rate',
    theme: 'Processing Efficiency Gains Amid Policy Tightening',
    keyInsights: [
      'Average TAT: 3.2 days (↓ from 3.8 days, -15.5% improvement)',
      'Straight-through processing: 58% of applications (↑ from 52%)',
      'Manual intervention rate: 42% (↓ from 48%)',
      'Credit decision automation improving despite tighter criteria',
      'Digital channel TAT: 2.1 days vs branch: 4.5 days'
    ],
    implication: 'Operational efficiency is improving, which can offset some competitive disadvantage from tighter credit policy through faster service.',
    croActions: [
      'Continue investing in decisioning automation',
      'Share best practices from digital channel with branch network',
      'Monitor customer satisfaction scores related to speed',
      'Leverage faster TAT as competitive differentiator in marketing'
    ],
    severity: 'info',
    timestamp: new Date().toISOString()
  }
];

// ============================================================================
// Provisioning Insights (Provision Expense)
// ============================================================================

const provisioningInsights: KPIInsight[] = [
  {
    id: 'provisioning_insight_1',
    kpiId: 'qm_provision_expense',
    theme: 'Stage 2 ECL Surge Driving Provision Spike',
    keyInsights: [
      'Total provision expense: $12.4M (+14.8% MoM)',
      'Stage 2 ECL: $125.5M (+22.5% quarter-over-quarter)',
      'Stage 2 contributing 44% of total ECL (↑ from 36%)',
      'Stage 1 → Stage 2 migrations: $285M in exposure this quarter',
      'ECL coverage ratio: 5.6% of total exposure (↑ from 5.1%)'
    ],
    implication: 'Significant credit deterioration is driving Stage 2 provisions. This is an early indicator of potential future NPL formation.',
    croActions: [
      'Conduct deep-dive review of Stage 2 book composition',
      'Identify accounts at risk of Stage 2 → Stage 3 migration',
      'Assess adequacy of lifetime ECL assumptions',
      'Consider management overlay if model-driven ECL appears insufficient'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString()
  },
  {
    id: 'provisioning_insight_2',
    kpiId: 'qm_provision_expense',
    theme: 'Write-off Acceleration Indicates Quality Stress',
    keyInsights: [
      'Write-offs MTD: $8.5M (+18% vs $7.2M last month)',
      'Write-off rate: 1.2% of NPL book per month',
      'Sectors driving write-offs: Retail unsecured (52%), SME (28%), other (20%)',
      'Average time from default to write-off: 22 months (↓ from 26 months)',
      'Write-offs accelerating faster than NPL growth'
    ],
    implication: 'Increased write-off activity suggests management is clearing aged NPLs, but also indicates realized credit losses are rising.',
    croActions: [
      'Review write-off policy for appropriateness and consistency',
      'Analyze recovery rates before write-off to ensure maximization',
      'Monitor impact on regulatory capital ratios',
      'Ensure adequate provisioning for write-off pipeline'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString()
  },
  {
    id: 'provisioning_insight_3',
    kpiId: 'qm_provision_expense',
    theme: 'Cost of Credit Trending Above Peer Benchmarks',
    keyInsights: [
      'Cost of credit: 1.85% of average loans (↑ from 1.62%)',
      'Peer average cost of credit: 1.45% (bank is +40 bps above peers)',
      'Provision expense as % of NII: 24.5% (↑ from 19.8%)',
      'ECL/EAD ratio higher than peers across all stages',
      'Provision release opportunities limited given portfolio trends'
    ],
    implication: 'The bank\'s credit costs are materially above peer average, impacting profitability and potentially signaling weaker origination quality or model conservatism.',
    croActions: [
      'Benchmark provision models and assumptions against peers',
      'Review underwriting standards to improve front-end quality',
      'Assess whether ECL methodology is overly conservative',
      'Develop plan to reduce cost of credit to peer levels over 12-18 months'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString()
  }
];

// ============================================================================
// Concentration Insights (EAD Concentration)
// ============================================================================

const concentrationInsights: KPIInsight[] = [
  {
    id: 'concentration_insight_1',
    kpiId: 'qm_ead_concentration',
    theme: 'Top 50 Obligor Concentration at Elevated Levels',
    keyInsights: [
      'Top 50 EAD: $4.8B (+11.6% growth vs $4.3B)',
      'Top 50 as % of portfolio: 28.5% (↑ from 26.2%)',
      'Single largest exposure: $485.5M (↑12.5%, approaching internal limit of $500M)',
      'Top 10 obligors: 28.5% of portfolio (concentration threshold = 25%)',
      'Herfindahl-Hirschman Index: 0.085 (moderate concentration)'
    ],
    implication: 'Concentration in top obligors is growing faster than the overall portfolio, increasing single-name risk and potential correlated losses.',
    croActions: [
      'Implement strict concentration limits enforcement',
      'Review and potentially reduce exposure to single largest obligor',
      'Diversify portfolio through targeted origination in dispersed segments',
      'Conduct stress testing for top 50 obligor default scenarios'
    ],
    severity: 'warning',
    timestamp: new Date().toISOString()
  },
  {
    id: 'concentration_insight_2',
    kpiId: 'qm_ead_concentration',
    theme: 'Group Linkage and Contagion Risk',
    keyInsights: [
      'Group-linked exposure in top 50: 15.5% (↑ from 12.8%)',
      'Connected counterparties: 12 distinct group structures',
      'Largest group linkage: $725M across 5 entities',
      'Cross-default provisions: only 60% of group-linked exposures',
      'Concentrated sectors: Real Estate groups (45%), Conglomerate groups (35%)'
    ],
    implication: 'Hidden concentration through group linkages increases contagion risk. A single group failure could trigger multiple defaults.',
    croActions: [
      'Mandate group exposure aggregation for all credit decisions',
      'Implement group-level concentration limits',
      'Ensure cross-default clauses in all group-linked facilities',
      'Conduct group stress testing and scenario analysis'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'Real Estate',
        label: 'Industry: Real Estate',
        source: 'Group Linkage Risk insight'
      }
    ]
  }
];

// ============================================================================
// Placeholder Insights for Other KPIs
// ============================================================================

const placeholderInsights: KPIInsight[] = [
  {
    id: 'placeholder_1',
    kpiId: 'placeholder',
    theme: 'Placeholder Insight 1',
    keyInsights: ['Insight detail to be added'],
    implication: 'Business implication to be added.',
    croActions: ['Action item to be added'],
    severity: 'info',
    timestamp: new Date().toISOString()
  },
  {
    id: 'placeholder_2',
    kpiId: 'placeholder',
    theme: 'Placeholder Insight 2',
    keyInsights: ['Insight detail to be added'],
    implication: 'Business implication to be added.',
    croActions: ['Action item to be added'],
    severity: 'info',
    timestamp: new Date().toISOString()
  }
];

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Get insights for a specific KPI
 * @param kpiId - The KPI identifier
 * @returns Array of insights for the KPI
 */
export function getInsightsForKPI(kpiId: string): KPIInsight[] {
  // MTD Originations insights - ONLY for quick_mortality, keep original
  if (kpiId === 'quick_mortality') {
    return originationQualityInsights.map(insight => ({
      ...insight,
      kpiId: kpiId
    }));
  }

  // CMI insights - only for CMI/RWA Intensity page
  if (kpiId === 'qm_rwa_intensity') {
    return cmiInsights.map(insight => ({
      ...insight,
      kpiId: kpiId // Override to current KPI
    }));
  }

  // Weighted PD insights
  if (kpiId === 'qm_weighted_pd') {
    return weightedPDInsights.map(insight => ({
      ...insight,
      kpiId: kpiId
    }));
  }

  // Portfolio RAROC insights
  if (kpiId === 'qm_portfolio_raroc') {
    return rarocInsights.map(insight => ({
      ...insight,
      kpiId: kpiId
    }));
  }

  // Credit Quality insights - mapped to Quick Mortality Ratio dashboard KPI
  if (kpiId === 'qm_rated_below_bbb') {
    return creditQualityInsights.map(insight => ({
      ...insight,
      kpiId: kpiId
    }));
  }

  // NPL insights - mapped to NPL Ratio dashboard KPI
  if (kpiId === 'qm_npl_ratio') {
    return nplInsights.map(insight => ({
      ...insight,
      kpiId: kpiId
    }));
  }

  // Underwriting insights - mapped to Approval Rate dashboard KPI
  if (kpiId === 'qm_approval_rate') {
    return underwritingInsights.map(insight => ({
      ...insight,
      kpiId: kpiId
    }));
  }

  // Provisioning insights - mapped to Provision Expense dashboard KPI
  if (kpiId === 'qm_provision_expense') {
    return provisioningInsights.map(insight => ({
      ...insight,
      kpiId: kpiId
    }));
  }

  // Concentration insights - mapped to EAD Concentration dashboard KPI
  if (kpiId === 'qm_ead_concentration') {
    return concentrationInsights.map(insight => ({
      ...insight,
      kpiId: kpiId
    }));
  }

  // Placeholder insights for remaining KPIs
  const otherKpis = [
    'qm_psi',
    'qm_model_auc',
    'qm_promo_originations',
    'qm_verification_failures',
    'qm_fraud_rate',
    'qm_exception_rate',
    'qm_30d_delinquency',
    'qm_raroc'
  ];

  if (otherKpis.includes(kpiId)) {
    return placeholderInsights.map((insight, idx) => ({
      ...insight,
      id: `${kpiId}_insight_${idx + 1}`,
      kpiId: kpiId
    }));
  }

  return [];
}

/**
 * Get the count of insights for a specific KPI
 * @param kpiId - The KPI identifier
 * @returns Number of insights available
 */
export function getInsightCountForKPI(kpiId: string): number {
  return getInsightsForKPI(kpiId).length;
}

/**
 * KPI ID to display name mapping
 */
const KPI_DISPLAY_NAMES: Record<string, string> = {
  'quick_mortality': 'MTD Originations',
  'qm_12m_mortality': '12M Mortality',
  'qm_rwa_intensity': 'CMI / RWA Intensity',
  'qm_weighted_pd': 'Weighted PD',
  'qm_portfolio_raroc': 'Portfolio RAROC',
  'qm_rated_below_bbb': 'BBB & Below',
  'qm_npl_ratio': 'NPL Ratio',
  'qm_approval_rate': 'Approval Rate',
  'qm_provision_expense': 'Provision Expense',
  'qm_ead_concentration': 'EAD Concentration',
  'qm_new_origination': 'New Origination',
  'qm_mortality_12m': 'Mortality (≤12M DPD)',
  'qm_psi': 'PSI',
  'qm_model_auc': 'Model AUC',
  'qm_promo_originations': 'Promo Originations',
  'qm_verification_failures': 'Verification Failures',
  'qm_fraud_rate': 'Fraud Rate',
  'qm_exception_rate': 'Exception Rate',
  'qm_30d_delinquency': '30D Delinquency',
  'qm_raroc': 'RAROC'
};

/**
 * Get display name for a KPI ID
 * @param kpiId - The KPI identifier
 * @returns Human-readable KPI name
 */
export function getKPIDisplayName(kpiId: string): string {
  return KPI_DISPLAY_NAMES[kpiId] || kpiId;
}

/**
 * Get all insights from all KPIs (excluding placeholders)
 * @returns Array of all insights
 */
export function getAllKPIInsights(): KPIInsight[] {
  return [
    ...weightedPDInsights,
    ...cmiInsights,
    ...originationQualityInsights,
    ...rarocInsights,
    ...creditQualityInsights,
    ...nplInsights,
    ...underwritingInsights,
    ...provisioningInsights,
    ...concentrationInsights
  ];
}
