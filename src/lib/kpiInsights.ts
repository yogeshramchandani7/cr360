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
    theme: 'Concentration & Divergence Risk',
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
  // CMI and Net Deterioration share the same 3 insights
  if (kpiId === 'qm_12m_mortality' || kpiId === 'qm_credit_score') {
    return cmiInsights.map(insight => ({
      ...insight,
      kpiId: kpiId // Override to current KPI
    }));
  }

  // Origination Quality insights for MTD Originations, Weighted PD, and Portfolio RAROC
  if (kpiId === 'quick_mortality' || kpiId === 'qm_30d_delinquency' || kpiId === 'qm_raroc') {
    return originationQualityInsights.map(insight => ({
      ...insight,
      kpiId: kpiId // Override to current KPI
    }));
  }

  // Placeholder insights for remaining 5 KPIs
  const otherKpis = [
    'qm_psi',
    'qm_model_auc',
    'qm_promo_originations',
    'qm_verification_failures',
    'qm_fraud_rate',
    'qm_exception_rate'
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
