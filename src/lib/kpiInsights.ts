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
      'Real Estate CMI at 61.5 vs market 57.0 (+4.5 gap); NBFC at 58.4 vs 54.8 (+3.6 gap)',
      'Sample accounts showing >2 notch gap between internal and external ratings - representing $58M exposure',
      '68% of downgrades from these 2 sectors - concentration risk at critical level',
      'Sample showing 4 critical accounts with >90 days lag since external downgrade - immediate review required',
      'Commercial Office and Housing Finance showing highest stress - 44% of sector exposure ($42M of $96M)',
      '40% of Real Estate book and 35% of NBFC book rated BBB & below - significantly above bank average of 24%'
    ],
    implication: 'Real Estate and NBFCs are deteriorating faster than peers, and internal rating updates are delayed — potential under-recognition of risk.',
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
    ],
    agentRecommendation: {
      title: 'Critical: Sector Portfolio Review and Rating Recalibration Required',
      description: 'Real Estate and NBFC sectors showing systemic deterioration - CMI gaps of +4.5 and +3.6 points vs market, with 40% and 35% rated BBB & below respectively. Internal rating lag (catch-up ratio 0.78) masks true risk. Combined exposure of these 2 sectors at $515M represents material systemic risk.',
      actionItems: [
        'Add all the obligors with >2 notch gap in watchlist',
        'Tighten incremental exposure limits for both sectors (require CCO approval for exposures >$3M)'
      ],
      ctas: [
        { label: 'View RE/NBFC Portfolio', action: 'view_sector_portfolio', variant: 'primary' },
        { label: 'Generate Sector Analysis', action: 'generate_sector_report', variant: 'secondary' }
      ],
      priority: 'high',
      estimatedImpact: 'Adding 23 accounts with >2 notch gap to watchlist enables enhanced monitoring and early intervention. Requiring CCO approval for new exposures >$3M in these sectors will prevent concentration build-up and ensure senior oversight of high-risk lending. These controls can reduce potential migration to NPA by 30-40%, preventing estimated losses of $8-12M over 12-18 months.'
    },
    evidenceCharts: ['sector_stress_chart_1', 'sector_stress_chart_2', 'sector_stress_chart_3', 'sector_stress_chart_4', 'sector_stress_chart_5', 'sector_stress_chart_6']
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
      '42% of new originations fall below minimum RAROC hurdle of 15% despite elevated PD',
      'Real Estate & NBFC in "Problem" quadrant - high growth but below-hurdle RAROC',
      'RAROC declining quarter-over-quarter - from 14.4% to 13.8% in last 3 quarters',
      'Infrastructure & Real Estate consuming 21% of RWA ($425M of $2,034M total) with below-average RAROC of 12.2-13.5% - Portfolio RWA density: 83%',
      'Bottom 20 deals by RAROC represent $102M exposure - requiring pricing review',
      'Median pricing spread 40 bps below peers for BBB-rated accounts - under-pricing risk'
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
    ],
    agentRecommendation: {
      title: 'Strategic Realignment: Implement Sector-Specific RAROC Hurdles',
      description: '42% of new originations fall below 15% RAROC hurdle despite elevated PD. Real Estate and NBFC in "Problem" quadrant with high growth but sub-par returns. Portfolio RAROC declined from 14.4% to 13.8% despite volume growth, indicating value-destroying originations. RWA intensity rising faster than returns.',
      actionItems: [
        'Set PD-linked pricing floors immediately across all product segments',
        'Route all sub-floor RAROC deals to Capital Allocation Committee for approval'
      ],
      assignedTo: 'Credit Risk Modeling & Capital Allocation teams',
      ctas: [
        { label: 'Execute', action: 'view_raroc_portfolio', variant: 'primary' },
        { label: 'Impacted Portfolio', action: 'view_impacted_portfolio', variant: 'secondary' }
      ],
      priority: 'medium',
      estimatedImpact: 'Implementing RAROC hurdles and repricing can improve portfolio returns by 1.2-1.5 percentage points over 12 months, generating an additional $18-22M in risk-adjusted income. Halting value-destroying originations prevents further capital erosion.'
    },
    evidenceCharts: ['risk_return_chart_1', 'risk_return_chart_2', 'risk_return_chart_3', 'risk_return_chart_4', 'risk_return_chart_5', 'risk_return_chart_6']
  },
  {
    id: 'origination_insight_2',
    kpiId: 'quick_mortality',
    theme: 'South Region Lending Surge: Volume Spike, Quality Erosion',
    keyInsights: [
      'South region grew 28% MoM - highest among all regions, now represents 26% of total originations',
      '64% of South originations concentrated in Infrastructure - far above bank average of 28%',
      'All risk metrics deteriorated in South - PD up 26%, RAROC down 12%, GDS/TDS down 9%',
      'Deviation rate spiked from 18% to 26% over 6 months - mainly DSCR and collateral relaxations',
      'Top 10 infrastructure deals total $64M representing major portion of South infra book - 7 have approved deviations',
      'South cohorts show 2x early mortality rate - 1.1% at 30 DPD by month 3 vs 0.5% for other regions'
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
    ],
    agentRecommendation: {
      title: 'Urgent: Impose Controls on South Infrastructure Lending',
      description: 'The 28% MoM growth in South region, heavily concentrated in Infrastructure (64%), combined with deteriorating risk metrics (PD +26%, RAROC -12%, deviation rate at 26%) and 2x early mortality rate signals aggressive, quality-compromised lending. Immediate intervention required to prevent significant losses.',
      actionItems: [
        'Cut deviation limits by 50% for South region',
        'Freeze new infrastructure sanctions exceeding $2.4M until revalidation',
        'Require risk memo sign-off from regional risk head for all exceptions'
      ],
      assignedTo: 'Regional Credit Risk & Infrastructure Lending teams',
      ctas: [
        { label: 'Execute', action: 'view_south_portfolio', variant: 'primary' },
        { label: 'Impacted Portfolio', action: 'view_impacted_portfolio', variant: 'secondary' }
      ],
      priority: 'high',
      estimatedImpact: 'Implementing origination caps and enhanced governance can prevent estimated $10-12M in potential credit losses from deteriorating South infrastructure book. Early mortality trends suggest 1.5-2% of recent originations may slip to NPL - timely intervention can reduce this by 40-50%.'
    },
    evidenceCharts: ['south_region_chart_1', 'south_region_chart_2', 'south_region_chart_3', 'south_region_chart_4', 'south_region_chart_5', 'south_region_chart_6']
  },
  {
    id: 'origination_insight_3',
    kpiId: 'quick_mortality',
    theme: 'Top 10% underwriters by volume show 2.5× higher default rates on their book',
    keyInsights: [
      'Top 5 by volume (flagged) show 5.6% avg default rate vs 4.6% for next 5 - quality deteriorates with volume',
      'Clear inverse correlation - higher volume underwriters show 2.5x elevated default rates',
      'Underwriters with >80% approval rates show 2.8x higher defaults - lax credit discipline',
      'Q2 2024 cohort by high-volume UWs shows 6.7% avg defaults vs 2.3% for low-volume UWs - consistent quality gap',
      'High-volume UWs grant 2.8x more exceptions with 3.2x higher default rates on those exceptions',
      'High-default UWs average <15 months experience vs 36 months for low-default UWs'
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
    timestamp: new Date().toISOString(),
    agentRecommendation: {
      title: 'Urgent: Underwriter Quality Control and Workload Rebalancing',
      description: 'Top 10% underwriters by volume show 2.5x higher default rates (5.4% vs 2.1%), correlating with 1.8x higher exception rates, 28% shorter case review times, and <15 months average experience. Clear evidence of quality compromise due to volume pressure and inadequate training.',
      actionItems: [
        'Reduce approval authorities for flagged underwriters by 50%',
        'Implement mandatory co-approval for all flagged underwriters',
        'Recommend individual performance reviews for flagged underwriters'
      ],
      assignedTo: 'Credit Operations & Quality Assurance teams',
      ctas: [
        { label: 'Execute', action: 'view_underwriter_dashboard', variant: 'primary' },
        { label: 'Impacted Portfolio', action: 'view_impacted_portfolio', variant: 'secondary' }
      ],
      priority: 'high',
      estimatedImpact: 'Workload rebalancing and enhanced training can reduce default rates for high-volume underwriters from 5.4% to 3.0-3.5% over 9-12 months, preventing $7-10M in losses. Quality-focused metrics will improve overall origination standards.'
    },
    evidenceCharts: ['underwriters_chart_1', 'underwriters_chart_2', 'underwriters_chart_3', 'underwriters_chart_4', 'underwriters_chart_5', 'underwriters_chart_6']
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
      'RWA per $ M exposure: $0.83M (↑ from $0.78M) → higher capital intensity',
      'Benchmark Comparison: 60% of these accounts have RAROC below peer average for same sector and rating class'
    ],
    implication: 'The bank\'s largest new exposures are not demonstrating superior differentiation. Instead, they are below-par vs peers on RAROC and PD, adding disproportionate risk without incremental return. These accounts are materially diluting the bank\'s overall origination quality index.',
    croActions: [
      'Mandate Credit Committee review for all exposures >$6M with RAROC <14%',
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
// Credit Pipeline Insights
// ============================================================================

const creditPipelineInsights: KPIInsight[] = [
  {
    id: 'credit_pipeline_insight_1',
    kpiId: 'quick_mortality',
    theme: "This Week's Credit Pipeline: 40% of Q1 Budget, 2 Critical Sector Limit Breaches",
    keyInsights: [
      'Week-to-date pipeline at $1,730M - brings month to 40% of Q1 budget ($4,850M vs $12,000M target)',
      '2 sectors breaching 15% portfolio concentration limits - IT $398M vs $368M limit (+$30M breach, 108%) and Health Care $390M vs $368M limit (+$22M breach, 106%)',
      'Pipeline credit quality deteriorating - average rating BBB vs BBB+ target',
      '15 high-risk accounts ($850M combined) with multiple risk flags in final approval stage',
      'Deal velocity increased 28% WoW but quality metrics declining across all stages',
      'Average deal size $12.5M - 19% above Q1 plan, suggesting concentration risk building'
    ],
    implication: 'Aggressive pipeline growth is driving critical sector limit breaches in IT and Health Care, along with quality deterioration. Current trajectory suggests further concentration risk if pipeline converts at historical rates.',
    croActions: [
      'Immediately freeze new pipeline entries for IT and Health Care until exposures return to policy limits',
      'Mandate Credit Committee review for all pipeline deals >$10M with BBB or below ratings',
      'Implement enhanced due diligence for 15 flagged high-risk accounts before final approval',
      'Review and recalibrate sector exposure limits vs Q1 business targets',
      'Establish weekly pipeline quality governance meetings until breach situation normalizes'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'industry',
        value: 'IT',
        label: 'Industry: IT',
        source: 'Credit Pipeline insight'
      },
      {
        field: 'industry',
        value: 'Health Care',
        label: 'Industry: Health Care',
        source: 'Credit Pipeline insight'
      }
    ],
    agentRecommendation: {
      title: 'Critical: Immediate Pipeline Controls and Quality Recalibration',
      description: '2 critical sectors breaching 15% portfolio limits. IT at $398M vs $368M limit (+$30M, 108%) and Health Care at $390M vs $368M limit (+$22M, 106%). Pipeline velocity up 28% WoW but average deal quality down to BBB. 15 accounts with critical risk flags ($850M) awaiting final approval.',
      actionItems: [
        'Require Credit Committee sign-off for all deals >$10M in Healthcare and IT',
        'Conduct forensic review of 15 flagged high-risk accounts in the pipeline'
      ],
      ctas: [
        { label: 'View Pipeline Dashboard', action: 'view_pipeline', variant: 'primary' },
        { label: 'Impacted Portfolio', action: 'view_impacted_portfolio', variant: 'secondary' }
      ],
      priority: 'high',
      estimatedImpact: 'Requiring Credit Committee oversight for large Healthcare and IT deals prevents further concentration build-up in these breached sectors. Forensic review of 15 high-risk accounts ($850M) can prevent $45-60M in potential NPL migrations over 12-18 months through early identification and enhanced due diligence.'
    },
    evidenceCharts: [
      'credit_pipeline_chart_1',
      'credit_pipeline_chart_2',
      'credit_pipeline_chart_3',
      'credit_pipeline_chart_4',
      'credit_pipeline_chart_5'
    ]
  }
];

// ============================================================================
// Weighted PD Insights
// ============================================================================

const weightedPDInsights: KPIInsight[] = [
  {
    id: 'midwest_origination_insight_1',
    kpiId: 'qm_weighted_pd',
    theme: 'High Risk Origination in Midwest region - new loans are up but quality deteriorates',
    keyInsights: [
      '30-Day Delinquencies on recent vintages (last 6 months) have breached the 1.5% threshold at 2.5% by Month 4',
      'Loans with TDS/GDS breach exceptions failing 3x faster - 5.0% 90-day delinquency vs 1.6% for other exceptions',
      'Bureau scores stable at ~720 while TDS spiked from 40% to 48% in last 3 months - good credit history masking bad capacity to pay',
      'TDS/GDS breach deviations grew from 5% to 22% of bookings in Q3 - local managers overriding policy to hit volume targets',
      'Q3 2024 vintage hitting 2.5% default by Month 4 vs Q1 at 0.5% - rapid mortality signals borrower over-leverage',
      'Risk Ratings 6-8 show negative net margin (-$420 avg per loan) - interest income low but ECL high due to TDS overrides',
      'Top 25 high-risk loans total $2.85M exposure with $428K expected loss - all have TDS breaches and multiple override approvals'
    ],
    implication: '30-Day Delinquencies on recent vintages (last 6 months) have breached the 1.5% threshold. Loans with TDS/GDS policy exceptions failing 3x faster (5.0% delinquency) while credit managers override policy caps to hit volume targets - systemic governance failure requiring immediate suspension of deviated lending in Midwest Region B.',
    croActions: [
      'Immediately suspend new unsecured loan originations in Midwest Region B with TDS/GDS breach exceptions',
      'Conduct forensic review of all deviation approvals by local credit managers in last 6 months',
      'Implement mandatory dual approval for all exceptions - regional manager cannot override alone',
      'Launch portfolio-level stress testing for all Midwest unsecured loans with TDS >43%',
      'Mandate enhanced monthly monitoring for all loans with policy deviations',
      'Initiate disciplinary review for approvers RM-045, RM-088, RM-122 with highest exception-to-default rates'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'region',
        value: 'Midwest',
        label: 'Region: Midwest',
        source: 'Midwest Origination Quality insight'
      },
      {
        field: 'productType',
        value: 'Unsecured',
        label: 'Product: Unsecured Loans',
        source: 'Midwest Origination Quality insight'
      }
    ],
    agentRecommendation: {
      title: 'Critical: Immediate Lending Suspension and Governance Overhaul - Midwest Region B',
      description: 'The 30-day delinquency breach (2.5% at Month 4 vs 1.5% threshold), combined with TDS breach exceptions showing 5.0% 90-day delinquency rate (3x higher than other exceptions, 5x higher than clean approvals), represents systemic underwriting failure. Bureau scores stable at 720 while TDS climbed to 48% proves algorithms are ignoring capacity deterioration. The 22% exception rate in Q3 bookings (up from 5%) with rapid vintage mortality demands immediate intervention.',
      actionItems: [
        'Freeze all new Midwest Region B unsecured lending with TDS/GDS exceptions until full review complete',
        'Cut deviation approval limits by 75% for all Midwest regional credit managers',
        'Require CCO sign-off for all Midwest exceptions >$50K and any multi-deviation cases',
        'Implement automated TDS breach rejection - no manual overrides permitted for TDS >43%',
        'Launch investigation into top 3 approvers (RM-045, RM-088, RM-122) with 68% of exception volume'
      ],
      assignedTo: 'Chief Credit Officer & Regional Risk teams',
      ctas: [
        {
          label: 'Execute Controls',
          action: 'view_midwest_portfolio',
          variant: 'primary'
        },
        {
          label: 'Evidence Dashboard',
          action: 'view_evidence',
          variant: 'secondary'
        }
      ],
      priority: 'high',
      estimatedImpact: 'Immediate suspension of TDS breach lending can prevent estimated $8-12M in future NPL slippages. The top 25 worst originations alone represent $428K in expected loss. If current trajectory continues, 15-20% of recent Midwest originations could migrate to NPL within 12-18 months. Enhanced governance and automated controls can reduce exception-driven defaults by 60-70%, preventing $15-20M in total credit losses.'
    },
    evidenceCharts: [
      'midwest_chart_1',
      'midwest_chart_2',
      'midwest_chart_3',
      'midwest_chart_4',
      'midwest_chart_5',
      'midwest_chart_6'
    ]
  },
  {
    id: 'weighted_pd_insight_1',
    kpiId: 'qm_weighted_pd',
    theme: 'Higher default rates in loans made with Income Policy Exception',
    keyInsights: [
      'Income exceptions show 192% higher default rates compared to standard underwriting (3.8% vs 1.3%)',
      'North and West regions account for 62% of exception volume but show 45% lower default rates than South region',
      'Loans with 3+ exceptions have 7.2% default rate - 3x higher than single exception loans (2.4%)',
      'Exception volumes grew 47% over 24 months while default rates increased from 2.8% to 3.8%',
      '2024 Q2 and Q3 cohorts showing accelerated defaults - 4.5-5.2% cumulative by month 6 vs historical 2.0-2.5%',
      'Top 3 underwriters by exception volume have 2.8x higher default rates than their standard book'
    ],
    implication: 'Income policy exceptions show 192% higher default rates (3.8% vs 1.3%), indicating weakened underwriting controls and systemic credit quality deterioration.',
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
    ],
    agentRecommendation: {
      title: 'Immediate Action Required: Tighten Exception Controls',
      description: 'The 192% higher default rate on income policy exceptions (3.8% vs 1.3% standard) represents a critical risk to portfolio quality. With $150M in exposure and 73% of defaults occurring in the 12-24 month vintage, immediate intervention is required to prevent further deterioration. The data suggests that current exception approval processes lack adequate risk assessment and ongoing monitoring.',
      actionItems: [
        'Enforce 100% Dual review for all income-based exception loans',
        'Auto-decline multi-exception cases > $120K',
        'Ask all regional credit heads to submit explanation report on increase in policy exception related defaults'
      ],
      assignedTo: 'Underwriting & Credit Policy teams',
      ctas: [
        {
          label: 'Execute',
          action: 'view_exception_portfolio',
          variant: 'primary'
        },
        {
          label: 'Impacted Portfolio',
          action: 'view_impacted_portfolio',
          variant: 'secondary'
        }
      ],
      priority: 'high',
      estimatedImpact: 'Implementing these controls could reduce exception default rates by 40% (from 3.8% to 2.3%), preventing an estimated $6-7M in credit losses over the next 12 months. Enhanced monitoring will also improve early detection, allowing proactive restructuring before accounts reach NPA status.'
    },
    evidenceCharts: [
      'income_exception_chart_1',
      'income_exception_chart_2',
      'income_exception_chart_3',
      'income_exception_chart_4',
      'income_exception_chart_5',
      'income_exception_chart_6'
    ]
  },
  {
    id: 'weighted_pd_insight_2',
    kpiId: 'qm_weighted_pd',
    theme: 'Newly announced tariffs impact on portfolio',
    keyInsights: [
      '$463M (35% of portfolio) directly or indirectly impacted by tariff announcements',
      'Manufacturing has $257M exposure with 65% import dependency - highest risk',
      'Average 180-220 bps margin compression expected across impacted sectors',
      'Sample borrowers in critical quadrant with high margin compression (>2%) and low ICR (<2.5x)',
      'Sample showing varying pricing power - borrowers with "High" pricing power can better absorb tariff impacts',
      'Sample accounts showing stressed ICR below 2.0x and DSCR below 1.25x in post-tariff scenario'
    ],
    implication: 'Tariff announcements impact 35% of portfolio ($463M), causing margin compression and elevated risk of rating migrations in manufacturing and auto sectors.',
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
    ],
    agentRecommendation: {
      title: 'Immediate: Stress Test and Contingency Planning for Tariff-Impacted Portfolio',
      description: '35% of portfolio ($463M) exposed to tariff impacts with expected 180-220 bps margin compression. 42 accounts show stressed ICR below 2.0x and DSCR below 1.25x. Manufacturing, Auto, and Electronics sectors at highest risk. Only 35% of borrowers have pricing power to pass through costs.',
      actionItems: [
        'Tag all margin-impacted accounts with risk overlay flags',
        'Halt renewals without CFO-certified margin impact disclosure'
      ],
      assignedTo: 'Industry Analytics & Relationship Management teams',
      ctas: [
        { label: 'Execute', action: 'view_tariff_portfolio', variant: 'primary' },
        { label: 'Impacted Portfolio', action: 'view_impacted_portfolio', variant: 'secondary' }
      ],
      priority: 'high',
      estimatedImpact: 'Early engagement and restructuring support can prevent $12-16M in potential NPL slippages. Borrowers with low ICR (<2.0x) and fixed contract terms are at highest risk - proactive restructuring can reduce default probability by 35-45%.'
    },
    evidenceCharts: ['tariff_impact_chart_1', 'tariff_impact_chart_2', 'tariff_impact_chart_3', 'tariff_impact_chart_4', 'tariff_impact_chart_5', 'tariff_impact_chart_6']
  },
  {
    id: 'weighted_pd_insight_3',
    kpiId: 'qm_weighted_pd',
    theme: 'Borrower concentration breaches internal threshold; top 10 names now represent 29% of total corporate exposure',
    keyInsights: [
      'Top 10 now at 29.2% (breach of 25% policy limit) - grew from 26.2% in 6 months',
      'Single largest exposure at $58.4M approaching internal limit of $60M',
      '25% policy threshold breached in August 2024 - driven by $66.7M incremental drawdowns over 11 months',
      'If fully drawn, top 10 would reach 38.5% concentration - creating severe systemic risk',
      '5 distinct group structures with $318M exposure - hidden concentration through linkages',
      '35% of top 10 exposure in Infrastructure & Energy ($249M of $715M) - sector + name concentration risk compounded'
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
    ],
    agentRecommendation: {
      title: 'Critical: Enforce Concentration Limits and Diversification Strategy',
      description: 'Top 10 obligors at 29.2% (breach of 25% policy limit), with single largest at $58.4M approaching $60M ceiling. If undrawn commitments are fully utilized, concentration would reach 38.5%. Hidden concentration through 5 group structures with $318M exposure. 35% of top 10 ($249M) in Infrastructure & Energy compounds sectoral risk.',
      actionItems: [
        'Freeze incremental limits for top 5 obligor groups',
        'Demand 12-month cash flow forecasts from all top 5 groups within 30 days',
        'Require board-signed repayment plans for all existing commitments from top 5 groups'
      ],
      assignedTo: 'Corporate Credit Risk & Exposure Management teams',
      ctas: [
        { label: 'Execute', action: 'view_concentration_dashboard', variant: 'primary' },
        { label: 'Impacted Portfolio', action: 'view_impacted_portfolio', variant: 'secondary' }
      ],
      priority: 'high',
      estimatedImpact: 'Reducing concentration to <27% and implementing group limits significantly reduces tail risk. A correlated default scenario of top 3 obligors could result in $228M exposure at risk - diversification reduces this single-event risk by 40-50%.'
    },
    evidenceCharts: ['concentration_chart_1', 'concentration_chart_2', 'concentration_chart_3', 'concentration_chart_4', 'concentration_chart_5', 'concentration_chart_6']
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
  },
  {
    id: 'heloc_utilization_insight_1',
    kpiId: 'qm_weighted_pd',
    theme: 'HELOC Utilization Trap: Decreasing prices and Rapid Drawdown in Texas',
    keyInsights: [
      '12% of Prime borrowers in this region increased utilization by >40% in the last 30 days along with a 3% dip in HPI',
      '$450M total exposure in high-velocity HELOC segment with elevated utilization risk',
      '8% of portfolio loans now above 90% CLTV due to combined HPI decline (-4%) and drawdowns',
      '65% of new HELOC drawdowns are "Cash to Checking" transfers (vs 20% historical avg) - liquidity stress signal',
      '15% of portfolio projected to be underwater (CLTV >100%) within 3 months at current HPI trends',
      '85% of monthly payment is interest-only for high-utilization segment - no principal reduction',
      'Credit cards showing 18% 30+ DPD while HELOC current - payment prioritization signals 90-day warning window',
      '2022 vintage (peak housing originations) showing 3x higher early payment default vs 2019 baseline'
    ],
    implication: '12% of Prime borrowers in this region increased utilization by >40% in the last 30 days along with a 3% dip in HPI.',
    croActions: [
      'Freeze new HELOC originations for borrowers with >70% utilization in affected regions',
      'Mandate monthly monitoring and borrower contact for all HELOCs >80% utilized',
      'Implement enhanced underwriting overlays for Texas zip codes with HPI decline >3%',
      'Conduct immediate portfolio review of 2022 vintage HELOC originations',
      'Establish cross-product early warning alerts linking credit card delinquency to HELOC risk',
      'Require updated property valuations for all HELOCs with estimated CLTV >85%'
    ],
    severity: 'critical',
    timestamp: new Date().toISOString(),
    filters: [
      {
        field: 'productType',
        value: 'HELOC',
        label: 'Product: HELOC',
        source: 'HELOC Utilization Trap insight'
      },
      {
        field: 'region',
        value: 'Texas',
        label: 'Region: Texas',
        source: 'HELOC Utilization Trap insight'
      }
    ],
    agentRecommendation: {
      title: 'Critical: HELOC Portfolio Review and Utilization Controls Required',
      description: 'High-velocity HELOC drawdowns in Texas represent behavioral shift from Prime borrowers (FICO >740), with 12% showing >40% utilization increase in 30 days. Combined with -4% HPI decline, 8% of portfolio now exceeds 90% CLTV. The shift from home improvement (14%) to cash transfers (65%) indicates liquidity stress. Credit card delinquencies at 18% while HELOC remains current provides 90-day early warning signal.',
      actionItems: [
        'Freeze new HELOC lending and limit increases for affected Texas zip codes',
        'Implement mandatory quarterly property revaluations for all HELOCs with CLTV >85%',
        'Create cross-product monitoring dashboard linking credit card DPD to HELOC exposure'
      ],
      assignedTo: 'Consumer Credit Risk & Portfolio Management teams',
      ctas: [
        { label: 'View HELOC Portfolio', action: 'view_heloc_portfolio', variant: 'primary' },
        { label: 'Evidence Dashboard', action: 'view_evidence', variant: 'secondary' }
      ],
      priority: 'high',
      estimatedImpact: 'Implementing utilization controls and enhanced monitoring for $450M exposure segment can reduce projected HELOC charge-offs by 35-45%. Early intervention based on credit card delinquency signals enables proactive collections 90 days earlier, potentially preventing $15-22M in losses over 12-18 months.'
    },
    evidenceCharts: ['heloc_chart_1', 'heloc_chart_2', 'heloc_chart_3', 'heloc_chart_4', 'heloc_chart_5', 'heloc_chart_6', 'heloc_chart_7', 'heloc_chart_8']
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
  // Only return specific insights for Daily Briefing
  const allowedInsightIds = [
    'midwest_origination_insight_1', // Midwest High Risk Origination - NEW
    'heloc_utilization_insight_1', // HELOC Utilization Trap
    'weighted_pd_insight_1',     // Income Policy Exception
    'origination_insight_2',     // South Region Lending Surge
    'cmi_insight_1',             // Sector Stress Alert
    'weighted_pd_insight_2',     // Tariffs impact
    'origination_insight_1',     // Risk-Return Imbalance
    'weighted_pd_insight_3',     // Borrower concentration breach
    'credit_pipeline_insight_1'  // Credit Pipeline: 40% Q1 Budget, 8 Sector Breaches
  ];

  const allInsights = [
    ...weightedPDInsights,
    ...cmiInsights,
    ...originationQualityInsights,
    ...creditPipelineInsights,
    ...rarocInsights,
    ...creditQualityInsights,
    ...nplInsights,
    ...underwritingInsights,
    ...provisioningInsights,
    ...concentrationInsights
  ];

  // Filter and sort by the order in allowedInsightIds
  const filteredInsights = allInsights.filter(insight => allowedInsightIds.includes(insight.id));
  return filteredInsights.sort((a, b) => {
    return allowedInsightIds.indexOf(a.id) - allowedInsightIds.indexOf(b.id);
  });
}
