import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatPercent } from './utils';

describe('cn() - className utility', () => {
  it('should merge single class name', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('should merge multiple class names', () => {
    expect(cn('text-red-500', 'bg-blue-200', 'p-4')).toBe('text-red-500 bg-blue-200 p-4');
  });

  it('should handle conditional class names with falsy values', () => {
    const isActive = false;
    const isDisabled = true;

    expect(cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    )).toBe('base-class disabled-class');
  });

  it('should merge Tailwind classes correctly (override conflicting utilities)', () => {
    // twMerge should keep the last conflicting class
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('should handle array of class names', () => {
    expect(cn(['text-red-500', 'bg-blue-200'])).toBe('text-red-500 bg-blue-200');
  });

  it('should handle object with boolean values', () => {
    expect(cn({
      'text-red-500': true,
      'bg-blue-200': false,
      'p-4': true
    })).toBe('text-red-500 p-4');
  });

  it('should handle complex combination of inputs', () => {
    const isActive = true;
    const isDisabled = false;

    expect(cn(
      'base-class',
      ['array-class-1', 'array-class-2'],
      {
        'object-class-1': true,
        'object-class-2': false
      },
      isActive && 'active-class',
      isDisabled && 'disabled-class',
      undefined,
      null
    )).toContain('base-class');
  });
});

describe('formatCurrency() - currency formatting', () => {
  it('should format billions correctly', () => {
    expect(formatCurrency(1_500_000_000)).toBe('$1.50B');
    expect(formatCurrency(5_750_000_000)).toBe('$5.75B');
    expect(formatCurrency(10_000_000_000)).toBe('$10.00B');
  });

  it('should format millions correctly', () => {
    expect(formatCurrency(1_500_000)).toBe('$1.50M');
    expect(formatCurrency(25_750_000)).toBe('$25.75M');
    expect(formatCurrency(500_000_000)).toBe('$500.00M');
  });

  it('should format thousands and smaller amounts with locale formatting', () => {
    expect(formatCurrency(500_000)).toBe('$500,000');
    expect(formatCurrency(50_000)).toBe('$50,000');
    expect(formatCurrency(5_000)).toBe('$5,000');
    expect(formatCurrency(500)).toBe('$500');
  });

  it('should handle boundary value at exactly 1 billion', () => {
    expect(formatCurrency(1_000_000_000)).toBe('$1.00B');
  });

  it('should handle boundary value at exactly 1 million', () => {
    expect(formatCurrency(1_000_000)).toBe('$1.00M');
  });

  it('should handle boundary value just under 1 million', () => {
    expect(formatCurrency(999_999)).toBe('$999,999');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should format small amounts correctly', () => {
    expect(formatCurrency(100)).toBe('$100');
    expect(formatCurrency(10)).toBe('$10');
    expect(formatCurrency(1)).toBe('$1');
  });

  it('should handle decimal precision for billions', () => {
    expect(formatCurrency(1_234_567_890)).toBe('$1.23B');
    expect(formatCurrency(9_876_543_210)).toBe('$9.88B');
  });

  it('should handle decimal precision for millions', () => {
    expect(formatCurrency(1_234_567)).toBe('$1.23M');
    expect(formatCurrency(9_876_543)).toBe('$9.88M');
  });

  it('should round correctly for billions', () => {
    expect(formatCurrency(1_010_000_000)).toBe('$1.01B');
    expect(formatCurrency(1_004_000_000)).toBe('$1.00B');
    expect(formatCurrency(1_556_000_000)).toBe('$1.56B');
  });

  it('should round correctly for millions', () => {
    expect(formatCurrency(1_010_000)).toBe('$1.01M');
    expect(formatCurrency(1_004_000)).toBe('$1.00M');
    expect(formatCurrency(1_556_000)).toBe('$1.56M');
  });

  it('should handle very large numbers', () => {
    expect(formatCurrency(999_999_999_999)).toBe('$1000.00B');
  });
});

describe('formatPercent() - percentage formatting', () => {
  it('should format whole numbers as percentages', () => {
    expect(formatPercent(10)).toBe('10.00%');
    expect(formatPercent(50)).toBe('50.00%');
    expect(formatPercent(100)).toBe('100.00%');
  });

  it('should format decimal numbers with two decimal places', () => {
    expect(formatPercent(10.5)).toBe('10.50%');
    expect(formatPercent(25.75)).toBe('25.75%');
    expect(formatPercent(99.99)).toBe('99.99%');
  });

  it('should handle zero', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });

  it('should handle negative percentages', () => {
    expect(formatPercent(-5)).toBe('-5.00%');
    expect(formatPercent(-10.5)).toBe('-10.50%');
    expect(formatPercent(-0.25)).toBe('-0.25%');
  });

  it('should round to two decimal places', () => {
    expect(formatPercent(10.123)).toBe('10.12%');
    expect(formatPercent(10.126)).toBe('10.13%');
    expect(formatPercent(10.125)).toBe('10.13%'); // Banker's rounding or round half up
  });

  it('should handle very small percentages', () => {
    expect(formatPercent(0.01)).toBe('0.01%');
    expect(formatPercent(0.001)).toBe('0.00%');
    expect(formatPercent(0.005)).toBe('0.01%'); // Rounds up
  });

  it('should handle very large percentages', () => {
    expect(formatPercent(1000)).toBe('1000.00%');
    expect(formatPercent(9999.99)).toBe('9999.99%');
  });

  it('should maintain precision for typical KPI values', () => {
    expect(formatPercent(4.43)).toBe('4.43%'); // Quick mortality
    expect(formatPercent(20.6)).toBe('20.60%'); // Reversion rate
    expect(formatPercent(85.2)).toBe('85.20%'); // Utilization
  });

  it('should handle edge cases with many decimal places', () => {
    expect(formatPercent(33.333333)).toBe('33.33%');
    expect(formatPercent(66.666666)).toBe('66.67%');
  });

  it('should format basis points correctly', () => {
    // If working with basis points represented as decimals
    expect(formatPercent(0.01)).toBe('0.01%'); // 1 basis point
    expect(formatPercent(0.1)).toBe('0.10%'); // 10 basis points
    expect(formatPercent(1)).toBe('1.00%'); // 100 basis points
  });

  it('should handle trailing zeros', () => {
    expect(formatPercent(5)).toBe('5.00%');
    expect(formatPercent(5.1)).toBe('5.10%');
    expect(formatPercent(5.00)).toBe('5.00%');
  });
});

describe('Utils integration tests', () => {
  it('should work together for formatting KPI displays', () => {
    // Simulate formatting KPI data as shown in components
    const exposure = 5802000; // $5.8M
    const npaRate = 4.43; // 4.43%

    expect(formatCurrency(exposure)).toBe('$5.80M');
    expect(formatPercent(npaRate)).toBe('4.43%');
  });

  it('should handle edge case of zero values', () => {
    expect(formatCurrency(0)).toBe('$0');
    expect(formatPercent(0)).toBe('0.00%');
  });

  it('should format typical dashboard values correctly', () => {
    // Portfolio Health metrics
    const totalExposure = 5802000000; // $5.8B
    const npaRate = 4.43;
    const parRate = 8.75;
    const utilization = 85.2;

    expect(formatCurrency(totalExposure)).toBe('$5.80B');
    expect(formatPercent(npaRate)).toBe('4.43%');
    expect(formatPercent(parRate)).toBe('8.75%');
    expect(formatPercent(utilization)).toBe('85.20%');
  });

  it('should format CCO KPI values correctly', () => {
    // CCO Dashboard KPIs
    const quickMortality = 4.43;
    const forwardDelinquency = 20.6;
    const vdi = 18.75;
    const concentrationContagion = 5802000000;
    const utilizationStress = 85.2;
    const reversionRate = 20.6;
    const eclSensitivity = 580200000;

    expect(formatPercent(quickMortality)).toBe('4.43%');
    expect(formatPercent(forwardDelinquency)).toBe('20.60%');
    expect(formatPercent(vdi)).toBe('18.75%');
    expect(formatCurrency(concentrationContagion)).toBe('$5.80B');
    expect(formatPercent(utilizationStress)).toBe('85.20%');
    expect(formatPercent(reversionRate)).toBe('20.60%');
    expect(formatCurrency(eclSensitivity)).toBe('$580.20M');
  });
});
