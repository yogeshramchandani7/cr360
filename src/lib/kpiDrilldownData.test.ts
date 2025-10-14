import { describe, it, expect } from 'vitest';
import {
  getQuickMortalityCharts,
  getForwardDelinquencyCharts,
  getPBICharts,
  getVDICharts,
  getPDMigrationCharts,
  getConcentrationCharts,
  getUtilizationStressCharts,
  getReversionRateCharts,
  getECLSensitivityCharts,
  getPPHSCharts,
  getChartsForKPI,
} from './kpiDrilldownData';
import type { KPIChart } from '../types';

// Valid filter fields from PortfolioCompany interface
const VALID_FILTER_FIELDS = [
  'segment',
  'region',
  'productType',
  'industry',
  'creditStatus',
  'lineOfBusiness',
  'partyType',
  'assetClass',
  'borrowerExternalRating',
  'borrowerInternalRating',
  'orgStructure',
  'group',
  'securityStatus',
];

// Helper function to validate chart structure
const validateChartStructure = (chart: KPIChart) => {
  expect(chart).toHaveProperty('id');
  expect(chart).toHaveProperty('title');
  expect(chart).toHaveProperty('description');
  expect(chart).toHaveProperty('type');
  expect(chart).toHaveProperty('data');
  expect(chart).toHaveProperty('dataKeys');
  expect(chart).toHaveProperty('filterField');
  expect(chart).toHaveProperty('filterLabel');

  expect(typeof chart.id).toBe('string');
  expect(typeof chart.title).toBe('string');
  expect(typeof chart.description).toBe('string');
  expect(['pie', 'bar', 'line']).toContain(chart.type);
  expect(Array.isArray(chart.data)).toBe(true);
  expect(Array.isArray(chart.dataKeys)).toBe(true);
  expect(typeof chart.filterField).toBe('string');
  expect(typeof chart.filterLabel).toBe('string');
  expect(chart.data.length).toBeGreaterThan(0);
  expect(chart.dataKeys.length).toBeGreaterThan(0);
};

// Helper function to validate filter field is valid
const validateFilterField = (chart: KPIChart) => {
  expect(VALID_FILTER_FIELDS).toContain(chart.filterField);
};

// Helper function to validate data keys structure
const validateDataKeys = (chart: KPIChart) => {
  chart.dataKeys.forEach((dataKey) => {
    expect(dataKey).toHaveProperty('key');
    expect(dataKey).toHaveProperty('name');
    expect(dataKey).toHaveProperty('color');
    expect(typeof dataKey.key).toBe('string');
    expect(typeof dataKey.name).toBe('string');
    expect(typeof dataKey.color).toBe('string');
    // Validate color is hex format
    expect(dataKey.color).toMatch(/^#[0-9a-f]{6}$/i);
  });
};

describe('kpiDrilldownData', () => {
  describe('getQuickMortalityCharts', () => {
    const charts = getQuickMortalityCharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: Early Delinquency by Segment uses segment filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('mortality-by-segment');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('segment');
      expect(chart.data.every((d) => ['RETAIL', 'SME', 'CORPORATE'].includes(d.label))).toBe(true);
    });

    it('chart 2: Mortality Rate by Product Type uses productType filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('mortality-by-product');
      expect(chart.type).toBe('bar');
      expect(chart.filterField).toBe('productType');
      expect(chart.xAxisKey).toBe('label');
      expect(chart.yAxisKey).toBe('value');
    });

    it('chart 3: Early Delinquency by Region uses region filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('mortality-by-region');
      expect(chart.type).toBe('bar');
      expect(chart.filterField).toBe('region');
      expect(chart.data.every((d) => ['NORTH', 'SOUTH', 'EAST', 'WEST'].includes(d.label))).toBe(true);
    });
  });

  describe('getForwardDelinquencyCharts', () => {
    const charts = getForwardDelinquencyCharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: Forecast by Segment uses segment filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('forecast-by-segment');
      expect(chart.filterField).toBe('segment');
      expect(chart.dataKeys).toHaveLength(2); // Current and forecast
    });

    it('chart 2: Forecast by Industry uses industry filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('forecast-by-industry');
      expect(chart.filterField).toBe('industry');
    });

    it('chart 3: Watchlist Distribution uses creditStatus filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('watchlist-distribution');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('creditStatus');
    });
  });

  describe('getPBICharts', () => {
    const charts = getPBICharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: Behavior Risk by Credit Status uses creditStatus filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('pbi-credit-status');
      expect(chart.filterField).toBe('creditStatus');
    });

    it('chart 2: Early Warning Signals by Segment uses segment filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('pbi-by-segment');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('segment');
    });

    it('chart 3: Behavior Risk by Product uses productType filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('pbi-by-product');
      expect(chart.filterField).toBe('productType');
    });
  });

  describe('getVDICharts', () => {
    const charts = getVDICharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: Vintage Deterioration by Segment uses segment filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('vdi-by-segment');
      expect(chart.filterField).toBe('segment');
      expect(chart.dataKeys).toHaveLength(2); // Current and baseline
    });

    it('chart 2: VDI by Org Structure uses orgStructure filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('vdi-by-org');
      expect(chart.filterField).toBe('orgStructure');
    });

    it('chart 3: Recent Vintage Credit Status uses creditStatus filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('vdi-status-split');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('creditStatus');
    });
  });

  describe('getPDMigrationCharts', () => {
    const charts = getPDMigrationCharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: Rating Migration uses borrowerExternalRating filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('migration-by-rating');
      expect(chart.filterField).toBe('borrowerExternalRating');
      expect(chart.filterLabel).toBe('{value} Rating');
      expect(chart.dataKeys).toHaveLength(2); // Upgrades and downgrades
    });

    it('chart 2: Downgrade Exposure by Segment uses segment filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('migration-by-segment');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('segment');
    });

    it('chart 3: Credit Status Migrations uses creditStatus filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('status-migration');
      expect(chart.filterField).toBe('creditStatus');
    });
  });

  describe('getConcentrationCharts', () => {
    const charts = getConcentrationCharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: Industry Concentration uses industry filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('concentration-by-industry');
      expect(chart.filterField).toBe('industry');
    });

    it('chart 2: Group Contagion Exposure uses group filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('group-exposure');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('group');
    });

    it('chart 3: Concentration by Party Type uses partyType filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('party-type-concentration');
      expect(chart.filterField).toBe('partyType');
    });
  });

  describe('getUtilizationStressCharts', () => {
    const charts = getUtilizationStressCharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: Utilization by LOB uses lineOfBusiness filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('utilization-by-lob');
      expect(chart.filterField).toBe('lineOfBusiness');
      expect(chart.data.every((d) => ['LCB', 'MCB', 'SCB'].includes(d.label))).toBe(true);
    });

    it('chart 2: Stress by Product uses productType filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('stress-by-product');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('productType');
    });

    it('chart 3: Credit Status of High Utilization uses creditStatus filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('utilization-credit-status');
      expect(chart.filterField).toBe('creditStatus');
    });
  });

  describe('getReversionRateCharts', () => {
    const charts = getReversionRateCharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: Reversion by Asset Class uses assetClass filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('reversion-by-asset-class');
      expect(chart.filterField).toBe('assetClass');
      expect(chart.data.every((d) => ['Standard', 'Delinquent'].includes(d.label))).toBe(true);
    });

    it('chart 2: Reversion by Product Type uses productType filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('reversion-by-product');
      expect(chart.filterField).toBe('productType');
    });

    it('chart 3: Current Credit Status Distribution uses creditStatus filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('reversion-status');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('creditStatus');
    });
  });

  describe('getECLSensitivityCharts', () => {
    const charts = getECLSensitivityCharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: ECL Exposure by Segment uses segment filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('ecl-by-segment');
      expect(chart.filterField).toBe('segment');
    });

    it('chart 2: ECL Provisioning by Credit Status uses creditStatus filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('ecl-by-status');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('creditStatus');
    });

    it('chart 3: ECL Sensitivity by Industry uses industry filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('ecl-by-industry');
      expect(chart.filterField).toBe('industry');
    });
  });

  describe('getPPHSCharts', () => {
    const charts = getPPHSCharts();

    it('returns 3 charts', () => {
      expect(charts).toHaveLength(3);
    });

    it('all charts have valid structure', () => {
      charts.forEach((chart) => {
        validateChartStructure(chart);
        validateFilterField(chart);
        validateDataKeys(chart);
      });
    });

    it('chart 1: Health Score by Segment uses segment filter', () => {
      const chart = charts[0];
      expect(chart.id).toBe('pphs-by-segment');
      expect(chart.filterField).toBe('segment');
      expect(chart.dataKeys).toHaveLength(2); // Current and benchmark
    });

    it('chart 2: Portfolio Health by Credit Status uses creditStatus filter', () => {
      const chart = charts[1];
      expect(chart.id).toBe('pphs-by-status');
      expect(chart.filterField).toBe('creditStatus');
    });

    it('chart 3: Portfolio Health by External Rating uses borrowerExternalRating filter', () => {
      const chart = charts[2];
      expect(chart.id).toBe('pphs-by-rating');
      expect(chart.type).toBe('pie');
      expect(chart.filterField).toBe('borrowerExternalRating');
      expect(chart.filterLabel).toBe('{value} Rating');
    });
  });

  describe('getChartsForKPI - mapper function', () => {
    it('returns charts for quick_mortality KPI', () => {
      const charts = getChartsForKPI('quick_mortality');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('mortality-by-segment');
    });

    it('returns charts for forward_delinquency KPI', () => {
      const charts = getChartsForKPI('forward_delinquency');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('forecast-by-segment');
    });

    it('returns charts for pbi KPI', () => {
      const charts = getChartsForKPI('pbi');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('pbi-credit-status');
    });

    it('returns charts for vdi KPI', () => {
      const charts = getChartsForKPI('vdi');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('vdi-by-segment');
    });

    it('returns charts for net_pd_migration KPI', () => {
      const charts = getChartsForKPI('net_pd_migration');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('migration-by-rating');
    });

    it('returns charts for concentration_contagion KPI', () => {
      const charts = getChartsForKPI('concentration_contagion');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('concentration-by-industry');
    });

    it('returns charts for utilization_stress KPI', () => {
      const charts = getChartsForKPI('utilization_stress');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('utilization-by-lob');
    });

    it('returns charts for reversion_rate KPI', () => {
      const charts = getChartsForKPI('reversion_rate');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('reversion-by-asset-class');
    });

    it('returns charts for ecl_sensitivity KPI', () => {
      const charts = getChartsForKPI('ecl_sensitivity');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('ecl-by-segment');
    });

    it('returns charts for pphs KPI', () => {
      const charts = getChartsForKPI('pphs');
      expect(charts).toHaveLength(3);
      expect(charts[0].id).toBe('pphs-by-segment');
    });

    it('returns empty array for unknown KPI ID', () => {
      const charts = getChartsForKPI('unknown_kpi');
      expect(charts).toEqual([]);
    });

    it('returns empty array for invalid KPI ID', () => {
      const charts = getChartsForKPI('');
      expect(charts).toEqual([]);
    });

    it('handles all 10 KPI IDs correctly', () => {
      const kpiIds = [
        'quick_mortality',
        'forward_delinquency',
        'pbi',
        'vdi',
        'net_pd_migration',
        'concentration_contagion',
        'utilization_stress',
        'reversion_rate',
        'ecl_sensitivity',
        'pphs',
      ];

      kpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        expect(charts.length).toBeGreaterThan(0);
        expect(charts.length).toBeLessThanOrEqual(4);
      });
    });
  });

  describe('Chart data integrity', () => {
    const allKpiIds = [
      'quick_mortality',
      'forward_delinquency',
      'pbi',
      'vdi',
      'net_pd_migration',
      'concentration_contagion',
      'utilization_stress',
      'reversion_rate',
      'ecl_sensitivity',
      'pphs',
    ];

    it('all charts have unique IDs within their KPI', () => {
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        const chartIds = charts.map((c) => c.id);
        const uniqueIds = new Set(chartIds);
        expect(uniqueIds.size).toBe(chartIds.length);
      });
    });

    it('all charts have non-empty titles and descriptions', () => {
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          expect(chart.title.length).toBeGreaterThan(0);
          if (chart.description) {
            expect(chart.description.length).toBeGreaterThan(0);
          }
        });
      });
    });

    it('all pie charts have percentage values', () => {
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          if (chart.type === 'pie') {
            chart.data.forEach((dataPoint: any) => {
              expect(dataPoint).toHaveProperty('percentage');
              expect(typeof dataPoint.percentage).toBe('number');
              expect(dataPoint.percentage).toBeGreaterThanOrEqual(0);
              expect(dataPoint.percentage).toBeLessThanOrEqual(100);
            });
          }
        });
      });
    });

    it('all bar charts with xAxisKey have correct structure', () => {
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          if (chart.type === 'bar' && chart.xAxisKey) {
            chart.data.forEach((dataPoint: any) => {
              expect(dataPoint).toHaveProperty(chart.xAxisKey!);
            });
          }
        });
      });
    });

    it('all charts have labels in data points', () => {
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          chart.data.forEach((dataPoint: any) => {
            expect(dataPoint).toHaveProperty('label');
            expect(typeof dataPoint.label).toBe('string');
            expect(dataPoint.label.length).toBeGreaterThan(0);
          });
        });
      });
    });

    it('all dataKeys reference existing keys in data', () => {
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          chart.dataKeys.forEach((dataKey) => {
            // At least one data point should have this key
            const hasKey = chart.data.some((dataPoint: any) =>
              dataPoint.hasOwnProperty(dataKey.key)
            );
            expect(hasKey).toBe(true);
          });
        });
      });
    });

    it('filter labels have correct format', () => {
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          expect(chart.filterLabel).toMatch(/\{value\}/);
        });
      });
    });

    it('all numeric values in data are valid numbers', () => {
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          chart.data.forEach((dataPoint: any) => {
            Object.values(dataPoint).forEach((value) => {
              if (typeof value === 'number') {
                expect(isFinite(value)).toBe(true);
                expect(isNaN(value)).toBe(false);
              }
            });
          });
        });
      });
    });
  });

  describe('Filter field validation', () => {
    const allKpiIds = [
      'quick_mortality',
      'forward_delinquency',
      'pbi',
      'vdi',
      'net_pd_migration',
      'concentration_contagion',
      'utilization_stress',
      'reversion_rate',
      'ecl_sensitivity',
      'pphs',
    ];

    it('all filter fields are valid PortfolioCompany fields', () => {
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          expect(VALID_FILTER_FIELDS).toContain(chart.filterField);
        });
      });
    });

    it('segment filter values match expected enum', () => {
      const validSegments = ['RETAIL', 'SME', 'CORPORATE'];
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          if (chart.filterField === 'segment') {
            chart.data.forEach((dataPoint: any) => {
              if (validSegments.includes(dataPoint.label)) {
                expect(validSegments).toContain(dataPoint.label);
              }
            });
          }
        });
      });
    });

    it('region filter values match expected enum', () => {
      const validRegions = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          if (chart.filterField === 'region') {
            chart.data.forEach((dataPoint: any) => {
              if (validRegions.includes(dataPoint.label)) {
                expect(validRegions).toContain(dataPoint.label);
              }
            });
          }
        });
      });
    });

    it('lineOfBusiness filter values match expected enum', () => {
      const validLOBs = ['LCB', 'MCB', 'SCB'];
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          if (chart.filterField === 'lineOfBusiness') {
            chart.data.forEach((dataPoint: any) => {
              expect(validLOBs).toContain(dataPoint.label);
            });
          }
        });
      });
    });

    it('creditStatus filter values match expected values', () => {
      const validStatuses = ['Standard', 'Watchlist', 'Delinquent'];
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          if (chart.filterField === 'creditStatus') {
            chart.data.forEach((dataPoint: any) => {
              expect(validStatuses).toContain(dataPoint.label);
            });
          }
        });
      });
    });

    it('assetClass filter values match expected values', () => {
      const validAssetClasses = ['Standard', 'Delinquent'];
      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        charts.forEach((chart) => {
          if (chart.filterField === 'assetClass') {
            chart.data.forEach((dataPoint: any) => {
              expect(validAssetClasses).toContain(dataPoint.label);
            });
          }
        });
      });
    });
  });

  describe('Chart count validation', () => {
    it('total of 30 charts across all 10 KPIs', () => {
      const allKpiIds = [
        'quick_mortality',
        'forward_delinquency',
        'pbi',
        'vdi',
        'net_pd_migration',
        'concentration_contagion',
        'utilization_stress',
        'reversion_rate',
        'ecl_sensitivity',
        'pphs',
      ];

      const totalCharts = allKpiIds.reduce((sum, kpiId) => {
        return sum + getChartsForKPI(kpiId).length;
      }, 0);

      expect(totalCharts).toBe(30);
    });

    it('each KPI has exactly 3 charts', () => {
      const allKpiIds = [
        'quick_mortality',
        'forward_delinquency',
        'pbi',
        'vdi',
        'net_pd_migration',
        'concentration_contagion',
        'utilization_stress',
        'reversion_rate',
        'ecl_sensitivity',
        'pphs',
      ];

      allKpiIds.forEach((kpiId) => {
        const charts = getChartsForKPI(kpiId);
        expect(charts).toHaveLength(3);
      });
    });
  });
});
