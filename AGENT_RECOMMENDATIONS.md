# Agent Recommendations for All 7 Insights

This file contains all the agent recommendations to be added to kpiInsights.ts

## 1. Income Policy Exception (weighted_pd_insight_1) ✅ DONE
Already implemented

## 2. South Region Lending Surge (origination_insight_2)

```typescript
agentRecommendation: {
  title: 'Urgent: Impose Controls on South Infrastructure Lending',
  description: 'The 28% MoM growth in South region, heavily concentrated in Infrastructure (64%), combined with deteriorating risk metrics (PD +26%, RAROC -12%, deviation rate at 26%) and 2x early mortality rate signals aggressive, quality-compromised lending. Immediate intervention required to prevent significant losses.',
  actionItems: [
    'Implement immediate origination cap for South Infrastructure exposures (freeze at current levels)',
    'Mandate Credit Committee approval for all new South exposures >₹25 Cr',
    'Conduct forensic review of all deviation approvals in South region from last 6 months',
    'Establish enhanced monthly monitoring for top 10 large infrastructure deals',
    'Launch regional credit governance audit focusing on policy compliance',
    'Implement mandatory cooling period (90 days) before new large infrastructure sanctions in South'
  ],
  ctas: [
    {
      label: 'Review South Portfolio',
      action: 'view_south_portfolio',
      variant: 'primary'
    },
    {
      label: 'Generate Regional Report',
      action: 'generate_south_report',
      variant: 'secondary'
    }
  ],
  priority: 'high',
  estimatedImpact: 'Implementing origination caps and enhanced governance can prevent estimated ₹80-100 Cr in potential credit losses from deteriorating South infrastructure book. Early mortality trends suggest 1.5-2% of recent originations may slip to NPL - timely intervention can reduce this by 40-50%.'
},
evidenceCharts: [
  'south_region_chart_1',
  'south_region_chart_2',
  'south_region_chart_3',
  'south_region_chart_4',
  'south_region_chart_5',
  'south_region_chart_6'
]
```

## 3. Sector Stress Alert (cmi_insight_1)

```typescript
agentRecommendation: {
  title: 'Critical: Sector Portfolio Review and Rating Recalibration Required',
  description: 'Real Estate and NBFC sectors showing systemic deterioration - CMI gaps of +4.5 and +3.6 points vs market, with 40% and 35% rated BBB & below respectively. Internal rating lag (catch-up ratio 0.78) masks true risk. Combined exposure of these 2 sectors at ₹4,285 Cr represents material systemic risk.',
  actionItems: [
    'Trigger immediate portfolio-level review for all Real Estate & NBFC exposures >₹25 Cr',
    'Mandate external rating alignment within 30 days for 23 accounts with >2 notch gap',
    'Tighten incremental exposure limits for both sectors (reduce by 30%)',
    'Initiate PD/EWS model recalibration specifically for RE and NBFC to address lag',
    'Establish monthly Credit Committee review for these sector exposures',
    'Increase provision coverage to 12% for BBB & below rated accounts in these sectors'
  ],
  ctas: [
    {
      label: 'View RE/NBFC Portfolio',
      action: 'view_sector_portfolio',
      variant: 'primary'
    },
    {
      label: 'Generate Sector Analysis',
      action: 'generate_sector_report',
      variant: 'secondary'
    }
  ],
  priority: 'high',
  estimatedImpact: 'Proactive rating recalibration and exposure limits can reduce potential losses by ₹120-150 Cr over 18 months. Current trajectory suggests 8-10% of BBB & below book may migrate to NPA - early intervention can halve this migration rate.'
},
evidenceCharts: [
  'sector_stress_chart_1',
  'sector_stress_chart_2',
  'sector_stress_chart_3',
  'sector_stress_chart_4',
  'sector_stress_chart_5',
  'sector_stress_chart_6'
]
```

## 4. Tariff Impact (weighted_pd_insight_2)

```typescript
agentRecommendation: {
  title: 'Immediate: Stress Test and Contingency Planning for Tariff-Impacted Portfolio',
  description: '35% of portfolio (₹3,847 Cr) exposed to tariff impacts with expected 180-220 bps margin compression. 42 accounts show stressed ICR below 2.0x and DSCR below 1.25x. Manufacturing, Auto, and Electronics sectors at highest risk. Only 35% of borrowers have pricing power to pass through costs.',
  actionItems: [
    'Conduct immediate stress testing for all 42 critical-quadrant borrowers',
    'Engage with top 20 impacted borrowers (₹2,450 Cr exposure) to assess mitigation plans',
    'Review and revise industry outlook assumptions for Manufacturing, Auto, and Electronics',
    'Implement enhanced monthly monitoring for high-risk tariff-exposed accounts',
    'Evaluate need for increased Stage 2 provisions on high-exposure accounts',
    'Establish contingency restructuring framework for accounts showing payment stress'
  ],
  ctas: [
    {
      label: 'View Tariff-Impacted Accounts',
      action: 'view_tariff_portfolio',
      variant: 'primary'
    },
    {
      label: 'Generate Impact Assessment',
      action: 'generate_tariff_report',
      variant: 'secondary'
    }
  ],
  priority: 'high',
  estimatedImpact: 'Early engagement and restructuring support can prevent ₹100-130 Cr in potential NPL slippages. Borrowers with low ICR (<2.0x) and fixed contract terms are at highest risk - proactive restructuring can reduce default probability by 35-45%.'
},
evidenceCharts: [
  'tariff_impact_chart_1',
  'tariff_impact_chart_2',
  'tariff_impact_chart_3',
  'tariff_impact_chart_4',
  'tariff_impact_chart_5',
  'tariff_impact_chart_6'
]
```

## 5. Risk-Return Imbalance (origination_insight_1)

```typescript
agentRecommendation: {
  title: 'Strategic Realignment: Implement Sector-Specific RAROC Hurdles',
  description: '42% of new originations fall below 15% RAROC hurdle despite elevated PD. Real Estate and NBFC in "Problem" quadrant with high growth but sub-par returns. Portfolio RAROC declined from 14.4% to 13.8% despite volume growth, indicating value-destroying originations. RWA intensity rising faster than returns.',
  actionItems: [
    'Implement mandatory sector-specific RAROC hurdles (15% min for RE & NBFC, 14% for others)',
    'Mandate Credit Committee review for all exposures >₹50 Cr with RAROC <14%',
    'Review pricing strategy - increase spreads by 40-60 bps for BBB-rated accounts',
    'Establish quarterly portfolio rebalancing targeting higher RAROC sectors',
    'Implement peer benchmarking requirement for all large exposures before approval',
    'Launch training program on risk-adjusted pricing for RMs and underwriters'
  ],
  ctas: [
    {
      label: 'Review Low-RAROC Portfolio',
      action: 'view_raroc_portfolio',
      variant: 'primary'
    },
    {
      label: 'Generate Profitability Analysis',
      action: 'generate_raroc_report',
      variant: 'secondary'
    }
  ],
  priority: 'medium',
  estimatedImpact: 'Implementing RAROC hurdles and repricing can improve portfolio returns by 1.2-1.5 percentage points over 12 months, generating an additional ₹150-180 Cr in risk-adjusted income. Halting value-destroying originations prevents further capital erosion.'
},
evidenceCharts: [
  'risk_return_chart_1',
  'risk_return_chart_2',
  'risk_return_chart_3',
  'risk_return_chart_4',
  'risk_return_chart_5',
  'risk_return_chart_6'
]
```

## 6. Top 10% Underwriters (origination_insight_3)

```typescript
agentRecommendation: {
  title: 'Urgent: Underwriter Quality Control and Workload Rebalancing',
  description: 'Top 10% underwriters by volume show 2.5x higher default rates (5.4% vs 2.1%), correlating with 1.8x higher exception rates, 28% shorter case review times, and <15 months average experience. Clear evidence of quality compromise due to volume pressure and inadequate training.',
  actionItems: [
    'Implement immediate workload caps for high-volume underwriters (max 12 cases/month)',
    'Mandate enhanced training program for all underwriters with default rates >3%',
    'Introduce mandatory peer review for all approvals with exceptions from high-default-rate UWs',
    'Establish quality-based performance metrics (70% weight) alongside volume targets (30%)',
    'Conduct forensic review of all recent approvals by top 5 high-default underwriters',
    'Require minimum 36 months experience for unsupervised large exposure approvals'
  ],
  ctas: [
    {
      label: 'Review Underwriter Performance',
      action: 'view_underwriter_dashboard',
      variant: 'primary'
    },
    {
      label: 'Generate Quality Report',
      action: 'generate_underwriter_report',
      variant: 'secondary'
    }
  ],
  priority: 'high',
  estimatedImpact: 'Workload rebalancing and enhanced training can reduce default rates for high-volume underwriters from 5.4% to 3.0-3.5% over 9-12 months, preventing ₹60-80 Cr in losses. Quality-focused metrics will improve overall origination standards.'
},
evidenceCharts: [
  'underwriters_chart_1',
  'underwriters_chart_2',
  'underwriters_chart_3',
  'underwriters_chart_4',
  'underwriters_chart_5',
  'underwriters_chart_6'
]
```

## 7. Borrower Concentration Breach (weighted_pd_insight_3)

```typescript
agentRecommendation: {
  title: 'Critical: Enforce Concentration Limits and Diversification Strategy',
  description: 'Top 10 obligors at 29.2% (breach of 25% policy limit), with single largest at ₹485.5 Cr approaching ₹500 Cr ceiling. If undrawn commitments are fully utilized, concentration would reach 38.5%. Hidden concentration through 12 group structures with ₹2,485 Cr exposure. 70% of top 10 in Infrastructure & Energy compounds sectoral risk.',
  actionItems: [
    'Implement immediate freeze on any new facilities to top 10 obligors until concentration <27%',
    'Mandate Credit Committee approval for any drawdowns from top 3 obligors',
    'Reduce largest single exposure from ₹485.5 Cr to <₹450 Cr within 90 days',
    'Conduct group exposure aggregation audit and establish group-level limits',
    'Launch targeted origination campaign in dispersed retail and SME segments',
    'Implement stress testing for correlated default scenarios across top obligors'
  ],
  ctas: [
    {
      label: 'View Concentration Dashboard',
      action: 'view_concentration_dashboard',
      variant: 'primary'
    },
    {
      label: 'Generate Concentration Report',
      action: 'generate_concentration_report',
      variant: 'secondary'
    }
  ],
  priority: 'high',
  estimatedImpact: 'Reducing concentration to <27% and implementing group limits significantly reduces tail risk. A correlated default scenario of top 3 obligors could result in ₹1,900 Cr exposure at risk - diversification reduces this single-event risk by 40-50%.'
},
evidenceCharts: [
  'concentration_chart_1',
  'concentration_chart_2',
  'concentration_chart_3',
  'concentration_chart_4',
  'concentration_chart_5',
  'concentration_chart_6'
]
```
