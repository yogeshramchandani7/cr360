import type { PortfolioCompany } from './mockData';

/**
 * Master Slicer Utilities
 *
 * Provides dimension configurations and aggregation utilities for the
 * MasterSlicerChart component. Supports dynamic slicing by region, segment,
 * product type, party type, and state.
 */

// ============================================================================
// TYPES
// ============================================================================

export type DimensionKey = 'region' | 'segment' | 'productType' | 'partyType' | 'state';
export type MetricType = 'exposure' | 'count' | 'npa' | 'delinquency';
export type ChartType = 'bar' | 'pie';

export interface DimensionConfig {
  key: DimensionKey;
  label: string;
  values: string[];
  filterLabel: string;  // Use {value} as placeholder
  icon: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  percentage: number;
}

// ============================================================================
// DIMENSION CONFIGURATIONS
// ============================================================================

export const DIMENSIONS: Record<DimensionKey, DimensionConfig> = {
  region: {
    key: 'region',
    label: 'Region',
    values: ['NORTH', 'SOUTH', 'EAST', 'WEST'],
    filterLabel: '{value} Region',
    icon: '🌍',
  },
  segment: {
    key: 'segment',
    label: 'Portfolio Segment',
    values: ['RETAIL', 'SME', 'CORPORATE'],
    filterLabel: '{value} Segment',
    icon: '📊',
  },
  productType: {
    key: 'productType',
    label: 'Product Type',
    values: ['Business Loan', 'Home Loan', 'Personal Loan', 'Auto Loan'],
    filterLabel: '{value}',
    icon: '💼',
  },
  partyType: {
    key: 'partyType',
    label: 'Party Type',
    values: ['Corporate', 'SME', 'Large Corporate'],
    filterLabel: '{value}',
    icon: '👥',
  },
  state: {
    key: 'state',
    label: 'State',
    values: ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
    filterLabel: '{value} State',
    icon: '🗺️',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get dimension configuration by key
 */
export function getDimensionConfig(dimension: DimensionKey): DimensionConfig {
  return DIMENSIONS[dimension];
}

/**
 * Get all available dimension keys
 */
export function getAllDimensionKeys(): DimensionKey[] {
  return Object.keys(DIMENSIONS) as DimensionKey[];
}

/**
 * Calculate metric value for a single company based on metric type
 */
function getMetricValue(company: PortfolioCompany, metricType: MetricType): number {
  switch (metricType) {
    case 'exposure':
      return company.creditExposure * 1000000; // Convert to actual currency

    case 'count':
      return 1; // Count each company as 1

    case 'npa':
      // NPA = exposure for non-standard assets
      return company.assetClass !== 'Standard'
        ? company.creditExposure * 1000000
        : 0;

    case 'delinquency':
      // Delinquent exposure = exposure where overdues > 0
      return company.overdues > 0
        ? company.creditExposure * 1000000
        : 0;

    default:
      return 0;
  }
}

// ============================================================================
// AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Aggregate companies by a specified dimension
 *
 * @param companies - Array of portfolio companies to aggregate
 * @param dimension - Dimension to group by (region, segment, etc.)
 * @param metricType - Type of metric to calculate
 * @returns Array of chart data points with label, value, and percentage
 */
export function aggregateByDimension(
  companies: PortfolioCompany[],
  dimension: DimensionKey,
  metricType: MetricType
): ChartDataPoint[] {
  // Handle empty data
  if (companies.length === 0) {
    return [{ label: 'No Data', value: 0, percentage: 0 }];
  }

  // Get dimension configuration
  const config = getDimensionConfig(dimension);

  // Create aggregation map
  const aggregationMap = new Map<string, number>();

  // Initialize all dimension values with 0 (ensures all values appear even if no data)
  config.values.forEach(value => {
    aggregationMap.set(value, 0);
  });

  // Aggregate values
  let totalValue = 0;
  companies.forEach(company => {
    const dimensionValue = company[dimension] as string;
    const metricValue = getMetricValue(company, metricType);

    const currentValue = aggregationMap.get(dimensionValue) || 0;
    aggregationMap.set(dimensionValue, currentValue + metricValue);
    totalValue += metricValue;
  });

  // Convert map to array with percentages
  const dataPoints: ChartDataPoint[] = Array.from(aggregationMap.entries())
    .map(([label, value]) => ({
      label,
      value,
      percentage: totalValue > 0 ? Number(((value / totalValue) * 100).toFixed(1)) : 0,
    }))
    .filter(point => point.value > 0); // Remove zero values for cleaner charts

  // If all values are 0, return "No Data"
  if (dataPoints.length === 0) {
    return [{ label: 'No Data', value: 0, percentage: 0 }];
  }

  // Sort by value descending for better visualization
  return dataPoints.sort((a, b) => b.value - a.value);
}

/**
 * Get unique dimension values present in the dataset
 * (Useful for validating data or building dynamic filters)
 */
export function getUniqueDimensionValues(
  companies: PortfolioCompany[],
  dimension: DimensionKey
): string[] {
  const uniqueValues = new Set<string>();
  companies.forEach(company => {
    const value = company[dimension] as string;
    if (value) {
      uniqueValues.add(value);
    }
  });
  return Array.from(uniqueValues).sort();
}

/**
 * Get metric label for display
 */
export function getMetricLabel(metricType: MetricType): string {
  switch (metricType) {
    case 'exposure':
      return 'Exposure';
    case 'count':
      return 'Company Count';
    case 'npa':
      return 'NPA Amount';
    case 'delinquency':
      return 'Delinquent Exposure';
    default:
      return 'Value';
  }
}

/**
 * Format metric value for display
 */
export function formatMetricValue(value: number, metricType: MetricType): string {
  switch (metricType) {
    case 'exposure':
    case 'npa':
    case 'delinquency':
      // Format as currency in millions/billions
      if (value >= 1000000000) {
        return `$${(value / 1000000000).toFixed(1)}B`;
      } else if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else {
        return `$${(value / 1000).toFixed(0)}K`;
      }

    case 'count':
      return value.toString();

    default:
      return value.toFixed(2);
  }
}
