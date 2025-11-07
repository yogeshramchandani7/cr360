import type { MacroIndicator } from '../types';

/**
 * Mock Macroeconomic Indicators with hard-coded thresholds
 *
 * Severity Logic:
 * - Critical: >50 bps over threshold OR >100 bps under threshold
 * - Warning: 25-50 bps over/under threshold
 * - Info: Within 25 bps of threshold
 */

export const mockMacroIndicators: MacroIndicator[] = [
  {
    id: 'fed_funds_rate',
    name: 'Federal Funds Rate',
    currentValue: 5.25,
    threshold: 5.0,
    unit: '%',
    direction: 'up',
    distanceFromThreshold: 0.25,
    distanceInBps: 25,
    severity: 'warning',
    lastUpdated: new Date('2025-10-30T12:00:00Z'),
    description: 'Target federal funds rate set by the Federal Reserve'
  },
  {
    id: 'treasury_10y',
    name: '10-Year Treasury Yield',
    currentValue: 4.65,
    threshold: 4.75,
    unit: '%',
    direction: 'down',
    distanceFromThreshold: 0.10,
    distanceInBps: 10,
    severity: 'info',
    lastUpdated: new Date('2025-10-30T12:00:00Z'),
    description: 'Yield on 10-year U.S. Treasury bonds'
  },
  {
    id: 'inflation_rate',
    name: 'Inflation Rate (CPI)',
    currentValue: 3.9,
    threshold: 3.2,
    unit: '%',
    direction: 'up',
    distanceFromThreshold: 0.70,
    distanceInBps: 70,
    severity: 'critical',
    lastUpdated: new Date('2025-10-30T12:00:00Z'),
    description: 'Consumer Price Index year-over-year change'
  },
  {
    id: 'unemployment_rate',
    name: 'Unemployment Rate',
    currentValue: 4.1,
    threshold: 4.5,
    unit: '%',
    direction: 'stable',
    distanceFromThreshold: 0.40,
    distanceInBps: 40,
    severity: 'info',
    lastUpdated: new Date('2025-10-30T12:00:00Z'),
    description: 'U.S. unemployment rate (seasonally adjusted)'
  },
  {
    id: 'sp500_index',
    name: 'S&P 500 Index',
    currentValue: 4850,
    threshold: 4800,
    unit: 'points',
    direction: 'up',
    distanceFromThreshold: 50,
    severity: 'info',
    lastUpdated: new Date('2025-10-30T12:00:00Z'),
    description: 'S&P 500 stock market index'
  },
  {
    id: 'bbb_credit_spread',
    name: 'BBB Credit Spread',
    currentValue: 220,
    threshold: 185,
    unit: 'bps',
    direction: 'up',
    distanceFromThreshold: 35,
    distanceInBps: 35,
    severity: 'warning',
    lastUpdated: new Date('2025-10-30T12:00:00Z'),
    description: 'BBB-rated corporate bond spread over Treasury'
  }
];

/**
 * Get all macro indicators
 */
export function getMacroIndicators(): MacroIndicator[] {
  return mockMacroIndicators;
}

/**
 * Get a specific indicator by ID
 */
export function getMacroIndicatorById(id: string): MacroIndicator | undefined {
  return mockMacroIndicators.find(indicator => indicator.id === id);
}

/**
 * Get indicators by severity
 */
export function getIndicatorsBySeverity(severity: 'critical' | 'warning' | 'info'): MacroIndicator[] {
  return mockMacroIndicators.filter(indicator => indicator.severity === severity);
}
