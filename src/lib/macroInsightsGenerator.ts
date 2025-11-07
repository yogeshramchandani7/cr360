import type { MacroInsight, MacroIndicator } from '../types';
import { getMacroIndicators } from './mockMarketPulseData';

/**
 * Rule-Based Macro Insights Generator
 *
 * Generates insights based on indicator threshold breaches and correlations
 */

/**
 * Rule: Fed Funds Rate above threshold
 */
function generateFedRateInsight(indicator: MacroIndicator): MacroInsight | null {
  if (indicator.id !== 'fed_funds_rate') return null;

  const bpsOver = indicator.distanceInBps || 0;

  if (bpsOver >= 25) {
    return {
      id: 'macro-insight-fed-rate',
      indicatorIds: ['fed_funds_rate'],
      theme: 'Rising Rate Environment Pressures Borrowers',
      keyInsights: [
        `Federal Funds Rate at ${indicator.currentValue}%, ${bpsOver} bps above threshold of ${indicator.threshold}%`,
        'Higher borrowing costs may impact leveraged portfolio companies',
        'Interest coverage ratios at risk for companies with floating rate debt',
        'Refinancing risk elevated for near-term maturities'
      ],
      implication: 'Increased debt servicing costs could strain cash flows for leveraged borrowers, particularly in rate-sensitive sectors. Monitor interest coverage ratios and refinancing schedules closely.',
      affectedSectors: ['Real Estate', 'Infrastructure', 'Retail'],
      severity: bpsOver >= 50 ? 'critical' : 'warning',
      timestamp: new Date()
    };
  }

  return null;
}

/**
 * Rule: Inflation above threshold
 */
function generateInflationInsight(indicator: MacroIndicator): MacroInsight | null {
  if (indicator.id !== 'inflation_rate') return null;

  const bpsOver = indicator.distanceInBps || 0;

  if (bpsOver >= 50) {
    return {
      id: 'macro-insight-inflation',
      indicatorIds: ['inflation_rate'],
      theme: 'Persistent Inflation Erodes Margins',
      keyInsights: [
        `Inflation at ${indicator.currentValue}%, ${bpsOver} bps above ${indicator.threshold}% threshold`,
        'Rising input costs pressuring profit margins across sectors',
        'Companies with limited pricing power most vulnerable',
        'Real wage erosion may dampen consumer demand'
      ],
      implication: 'Sustained inflation above target indicates ongoing cost pressures that could compress margins and weaken credit metrics for companies unable to pass through costs.',
      affectedSectors: ['Manufacturing', 'Retail', 'Consumer Goods'],
      severity: 'critical',
      timestamp: new Date()
    };
  }

  return null;
}

/**
 * Rule: Credit Spread widening
 */
function generateCreditSpreadInsight(indicator: MacroIndicator): MacroInsight | null {
  if (indicator.id !== 'bbb_credit_spread') return null;

  const bpsOver = indicator.distanceInBps || 0;

  if (bpsOver >= 25) {
    return {
      id: 'macro-insight-credit-spread',
      indicatorIds: ['bbb_credit_spread'],
      theme: 'Credit Spread Widening Signals Market Stress',
      keyInsights: [
        `BBB credit spreads at ${indicator.currentValue} bps, ${bpsOver} bps wider than ${indicator.threshold} bps threshold`,
        'Market pricing in increased credit risk and tighter financial conditions',
        'Refinancing costs rising for BBB-rated and below credits',
        'Flight to quality may reduce access to capital markets for weaker borrowers'
      ],
      implication: 'Widening credit spreads indicate deteriorating market confidence and higher risk premiums. Portfolio companies with near-term refinancing needs face elevated costs and potential access challenges.',
      affectedSectors: ['All Sectors'],
      severity: bpsOver >= 50 ? 'critical' : 'warning',
      timestamp: new Date()
    };
  }

  return null;
}

/**
 * Rule: Correlation - Rising rates + Widening spreads
 */
function generateRateSpreadCorrelationInsight(indicators: MacroIndicator[]): MacroInsight | null {
  const fedRate = indicators.find(i => i.id === 'fed_funds_rate');
  const creditSpread = indicators.find(i => i.id === 'bbb_credit_spread');

  if (!fedRate || !creditSpread) return null;

  const rateAboveThreshold = (fedRate.distanceInBps || 0) >= 25;
  const spreadAboveThreshold = (creditSpread.distanceInBps || 0) >= 25;

  if (rateAboveThreshold && spreadAboveThreshold) {
    return {
      id: 'macro-insight-rate-spread-correlation',
      indicatorIds: ['fed_funds_rate', 'bbb_credit_spread'],
      theme: 'Dual Pressure: Rising Rates and Widening Spreads',
      keyInsights: [
        `Fed Funds Rate elevated at ${fedRate.currentValue}% while credit spreads widen to ${creditSpread.currentValue} bps`,
        'Combined effect compounds borrowing costs for portfolio companies',
        'Both base rates and risk premiums moving against borrowers',
        'Increased probability of credit quality deterioration'
      ],
      implication: 'The combination of elevated base rates and widening credit spreads creates a challenging refinancing environment. Total borrowing costs could increase by 75-100 bps for BBB credits, significantly impacting debt service capacity.',
      affectedSectors: ['All Sectors'],
      severity: 'critical',
      timestamp: new Date()
    };
  }

  return null;
}

/**
 * Rule: Correlation - Rising inflation + Rising unemployment
 */
function generateStagflationInsight(indicators: MacroIndicator[]): MacroInsight | null {
  const inflation = indicators.find(i => i.id === 'inflation_rate');
  const unemployment = indicators.find(i => i.id === 'unemployment_rate');

  if (!inflation || !unemployment) return null;

  const inflationHigh = (inflation.distanceInBps || 0) >= 50;
  const unemploymentRising = unemployment.direction === 'up';

  if (inflationHigh && unemploymentRising) {
    return {
      id: 'macro-insight-stagflation',
      indicatorIds: ['inflation_rate', 'unemployment_rate'],
      theme: 'Stagflation Risk: High Inflation with Rising Unemployment',
      keyInsights: [
        `Inflation at ${inflation.currentValue}% while unemployment trends upward to ${unemployment.currentValue}%`,
        'Classic stagflation pattern emerging: high prices with economic weakness',
        'Consumer purchasing power declining on dual fronts',
        'Policy dilemma limits Fed flexibility to stimulate growth'
      ],
      implication: 'Stagflation presents severe challenges for credit quality as companies face margin pressure from inflation while demand weakens due to job losses and reduced consumer spending. Expect increased credit deterioration.',
      affectedSectors: ['Consumer Discretionary', 'Retail', 'Automotive'],
      severity: 'critical',
      timestamp: new Date()
    };
  }

  return null;
}

/**
 * Rule: Treasury yield inversion (if it happens)
 */
function generateYieldCurveInsight(indicator: MacroIndicator): MacroInsight | null {
  if (indicator.id !== 'treasury_10y') return null;

  // For now, just flag if 10Y is unusually low (potential recession signal)
  if (indicator.currentValue < 4.0 && indicator.direction === 'down') {
    return {
      id: 'macro-insight-treasury-yield',
      indicatorIds: ['treasury_10y'],
      theme: 'Falling Treasury Yields Signal Growth Concerns',
      keyInsights: [
        `10-Year Treasury yield declining to ${indicator.currentValue}%`,
        'Flight to safety as investors anticipate economic slowdown',
        'Market pricing in potential Fed rate cuts',
        'Recession risk premium building in fixed income markets'
      ],
      implication: 'Declining Treasury yields typically precede economic slowdowns. While this may eventually lead to lower borrowing costs, the near-term outlook suggests weaker credit fundamentals and increased default risk.',
      affectedSectors: ['Cyclical Industries', 'Commercial Real Estate'],
      severity: 'warning',
      timestamp: new Date()
    };
  }

  return null;
}

/**
 * Generate all macro insights based on current indicators
 */
export function generateMacroInsights(): MacroInsight[] {
  const indicators = getMacroIndicators();
  const insights: MacroInsight[] = [];

  // Run individual indicator rules
  indicators.forEach(indicator => {
    const fedRateInsight = generateFedRateInsight(indicator);
    if (fedRateInsight) insights.push(fedRateInsight);

    const inflationInsight = generateInflationInsight(indicator);
    if (inflationInsight) insights.push(inflationInsight);

    const creditSpreadInsight = generateCreditSpreadInsight(indicator);
    if (creditSpreadInsight) insights.push(creditSpreadInsight);

    const yieldInsight = generateYieldCurveInsight(indicator);
    if (yieldInsight) insights.push(yieldInsight);
  });

  // Run correlation rules
  const rateSpreadInsight = generateRateSpreadCorrelationInsight(indicators);
  if (rateSpreadInsight) insights.push(rateSpreadInsight);

  const stagflationInsight = generateStagflationInsight(indicators);
  if (stagflationInsight) insights.push(stagflationInsight);

  // Sort by severity (critical first)
  return insights.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

/**
 * Get insights by severity
 */
export function getMacroInsightsBySeverity(severity: 'critical' | 'warning' | 'info'): MacroInsight[] {
  return generateMacroInsights().filter(insight => insight.severity === severity);
}

/**
 * Get insights related to specific indicator
 */
export function getMacroInsightsByIndicator(indicatorId: string): MacroInsight[] {
  return generateMacroInsights().filter(insight =>
    insight.indicatorIds.includes(indicatorId)
  );
}
