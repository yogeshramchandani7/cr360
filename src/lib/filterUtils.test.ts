import { describe, it, expect } from 'vitest';
import {
  applyGlobalFilters,
  calculateFilteredKPIs,
  calculateFilteredBreakdowns,
  calculateFilteredDelinquencyMatrix,
  calculateFilteredTopExposures,
  calculateFilteredTrends,
  getUniqueFilterValues,
} from './filterUtils';
import type { PortfolioCompany } from './mockData';
import type { GlobalFilterState } from '../types';

// Mock portfolio companies for testing
const mockCompanies: PortfolioCompany[] = [
  {
    id: 'company-1',
    customerName: 'Company A',
    custId: 1001,
    partyType: 'Corporate',
    group: 'Group A',
    parentId: null,
    orgStructure: 'Bangalore LCB',
    lineOfBusiness: 'LCB',
    industry: 'IT Services',
    productType: 'Business Loan',
    region: 'NORTH',
    segment: 'CORPORATE',
    creditLimit: 1000,
    grossCreditExposure: 900,
    creditExposure: 850,
    undrawnExposure: 150,
    overdues: 0,
    creditStatus: 'Standard',
    assetClass: 'Standard',
    borrowerExternalRating: 'AAA',
    borrowerInternalRating: 'YLC3',
    borrowerCreditScore: 750,
    riskGrade: 'AAA',
    stageClassification: 1,
    securityStatus: 'Secured',
    securityValue: 1000,
  },
  {
    id: 'company-2',
    customerName: 'Company B',
    custId: 1002,
    partyType: 'SME',
    group: 'Group B',
    parentId: null,
    orgStructure: 'Chennai MCB',
    lineOfBusiness: 'MCB',
    industry: 'Logistics',
    productType: 'Home Loan',
    region: 'SOUTH',
    segment: 'SME',
    creditLimit: 500,
    grossCreditExposure: 450,
    creditExposure: 400,
    undrawnExposure: 100,
    overdues: 15,
    creditStatus: 'Watchlist',
    assetClass: 'Standard',
    borrowerExternalRating: 'AA',
    borrowerInternalRating: 'YMR1',
    borrowerCreditScore: 700,
    riskGrade: 'AA',
    stageClassification: 1,
    securityStatus: 'Secured',
    securityValue: 500,
  },
  {
    id: 'company-3',
    customerName: 'Company C',
    custId: 1003,
    partyType: 'Large Corporate',
    group: 'Group C',
    parentId: null,
    orgStructure: 'Mumbai LCB',
    lineOfBusiness: 'LCB',
    industry: 'Steel',
    productType: 'Personal Loan',
    region: 'EAST',
    segment: 'CORPORATE',
    creditLimit: 800,
    grossCreditExposure: 750,
    creditExposure: 700,
    undrawnExposure: 100,
    overdues: 95,
    creditStatus: 'Delinquent',
    assetClass: 'Delinquent',
    borrowerExternalRating: 'BBB',
    borrowerInternalRating: 'YHR1',
    borrowerCreditScore: 650,
    riskGrade: 'BBB',
    stageClassification: 2,
    securityStatus: 'Part Secured',
    securityValue: 400,
  },
  {
    id: 'company-4',
    customerName: 'Company D',
    custId: 1004,
    partyType: 'Corporate',
    group: 'Group D',
    parentId: null,
    orgStructure: 'Delhi LCB',
    lineOfBusiness: 'SCB',
    industry: 'Telecom',
    productType: 'Auto Loan',
    region: 'WEST',
    segment: 'RETAIL',
    creditLimit: 600,
    grossCreditExposure: 550,
    creditExposure: 500,
    undrawnExposure: 100,
    overdues: 0,
    creditStatus: 'Standard',
    assetClass: 'Standard',
    borrowerExternalRating: 'A',
    borrowerInternalRating: 'YLC5',
    borrowerCreditScore: 720,
    riskGrade: 'A',
    stageClassification: 1,
    securityStatus: 'Clean',
    securityValue: 0,
  },
];

describe('filterUtils', () => {
  describe('applyGlobalFilters', () => {
    it('returns all companies when no filters are applied', () => {
      const filters: GlobalFilterState = {
        lob: [],
        partyType: [],
        rating: [],
        assetClassification: [],
      };

      const result = applyGlobalFilters(mockCompanies, filters);

      expect(result).toHaveLength(4);
      expect(result).toEqual(mockCompanies);
    });

    it('filters by LOB correctly', () => {
      const filters: GlobalFilterState = {
        lob: ['LCB'],
        partyType: [],
        rating: [],
        assetClassification: [],
      };

      const result = applyGlobalFilters(mockCompanies, filters);

      expect(result).toHaveLength(2);
      expect(result.every((c) => c.lineOfBusiness === 'LCB')).toBe(true);
    });

    it('filters by Party Type correctly', () => {
      const filters: GlobalFilterState = {
        lob: [],
        partyType: ['Corporate'],
        rating: [],
        assetClassification: [],
      };

      const result = applyGlobalFilters(mockCompanies, filters);

      expect(result).toHaveLength(2);
      expect(result.every((c) => c.partyType === 'Corporate')).toBe(true);
    });

    it('filters by Rating correctly', () => {
      const filters: GlobalFilterState = {
        lob: [],
        partyType: [],
        rating: ['AAA', 'AA'],
        assetClassification: [],
      };

      const result = applyGlobalFilters(mockCompanies, filters);

      expect(result).toHaveLength(2);
      expect(result.every((c) => ['AAA', 'AA'].includes(c.borrowerExternalRating))).toBe(true);
    });

    it('filters by Asset Classification correctly', () => {
      const filters: GlobalFilterState = {
        lob: [],
        partyType: [],
        rating: [],
        assetClassification: ['Delinquent'],
      };

      const result = applyGlobalFilters(mockCompanies, filters);

      expect(result).toHaveLength(1);
      expect(result[0].assetClass).toBe('Delinquent');
    });

    it('applies multiple filters with AND logic', () => {
      const filters: GlobalFilterState = {
        lob: ['LCB'],
        partyType: ['Corporate'],
        rating: [],
        assetClassification: [],
      };

      const result = applyGlobalFilters(mockCompanies, filters);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('company-1');
    });

    it('applies OR logic within each filter', () => {
      const filters: GlobalFilterState = {
        lob: ['LCB', 'MCB'],
        partyType: [],
        rating: [],
        assetClassification: [],
      };

      const result = applyGlobalFilters(mockCompanies, filters);

      expect(result).toHaveLength(3);
      expect(result.every((c) => ['LCB', 'MCB'].includes(c.lineOfBusiness))).toBe(true);
    });

    it('returns empty array when no companies match filters', () => {
      const filters: GlobalFilterState = {
        lob: ['NonExistentLOB'],
        partyType: [],
        rating: [],
        assetClassification: [],
      };

      const result = applyGlobalFilters(mockCompanies, filters);

      expect(result).toHaveLength(0);
    });

    it('does not mutate the original array', () => {
      const filters: GlobalFilterState = {
        lob: ['LCB'],
        partyType: [],
        rating: [],
        assetClassification: [],
      };

      const originalLength = mockCompanies.length;
      applyGlobalFilters(mockCompanies, filters);

      expect(mockCompanies).toHaveLength(originalLength);
    });
  });

  describe('calculateFilteredKPIs', () => {
    it('calculates NPA correctly', () => {
      const result = calculateFilteredKPIs(mockCompanies);

      // Company C is delinquent with 700 Cr exposure
      // Total exposure: (850 + 400 + 700 + 500) * 1M = 2,450M
      // NPA exposure: 700M
      // NPA %: (700 / 2450) * 100 ≈ 28.57%
      expect(result.npa.value).toBeCloseTo(28.57, 0);
      expect(result.npa.unit).toBe('percent');
    });

    it('calculates total exposure correctly', () => {
      const result = calculateFilteredKPIs(mockCompanies);

      // (850 + 400 + 700 + 500) * 1M = 2,450,000,000
      expect(result.totalExposure.value).toBe(2450000000);
      expect(result.totalExposure.unit).toBe('currency');
    });

    it('calculates PAR correctly', () => {
      const result = calculateFilteredKPIs(mockCompanies);

      // Companies with overdues or watchlist/delinquent: B, C
      // PAR exposure: (400 + 700) * 1M = 1,100M
      // PAR %: (1100 / 2450) * 100 ≈ 44.90%
      expect(result.par.value).toBeCloseTo(44.90, 0);
    });

    it('calculates delinquency correctly', () => {
      const result = calculateFilteredKPIs(mockCompanies);

      // Companies with overdues: B, C (2 out of 4)
      // Delinquency %: (2 / 4) * 100 = 50%
      expect(result.delinquency.value).toBe(50);
    });

    it('calculates utilization correctly', () => {
      const result = calculateFilteredKPIs(mockCompanies);

      // Total credit limit: (1000 + 500 + 800 + 600) * 1M = 2,900M
      // Total exposure: 2,450M
      // Utilization: (2450 / 2900) * 100 ≈ 84.48%
      expect(result.utilization.value).toBeCloseTo(84.48, 0);
    });

    it('returns zero values for empty companies array', () => {
      const result = calculateFilteredKPIs([]);

      expect(result.npa.value).toBe(0);
      expect(result.totalExposure.value).toBe(0);
      expect(result.par.value).toBe(0);
      expect(result.delinquency.value).toBe(0);
      expect(result.utilization.value).toBe(0);
    });

    it('sets correct threshold status for NPA', () => {
      const result = calculateFilteredKPIs(mockCompanies);

      expect(result.npa.threshold).toBeDefined();
      expect(result.npa.threshold?.green).toBe(3.0);
      expect(result.npa.threshold?.amber).toBe(5.0);
      // With 28.57% NPA, status should be 'red'
      expect(result.npa.threshold?.status).toBe('red');
    });

    it('calculates RAROC based on credit score', () => {
      const result = calculateFilteredKPIs(mockCompanies);

      // Average credit score: (750 + 700 + 650 + 720) / 4 = 705
      // RAROC: (705 / 850) * 25 ≈ 20.74%
      expect(result.raroc.value).toBeCloseTo(20.74, 0);
      expect(result.raroc.unit).toBe('percent');
    });
  });

  describe('calculateFilteredBreakdowns', () => {
    it('calculates regional breakdown correctly', () => {
      const result = calculateFilteredBreakdowns(mockCompanies);

      expect(result.region).toHaveLength(4);

      const north = result.region.find((r) => r.label === 'NORTH');
      expect(north).toBeDefined();
      expect(north?.value).toBe(850000000); // 850 Cr * 1M
      expect(north?.percentage).toBeCloseTo(34.7, 0);
    });

    it('calculates product breakdown correctly', () => {
      const result = calculateFilteredBreakdowns(mockCompanies);

      expect(result.product).toHaveLength(4);

      const businessLoan = result.product.find((p) => p.label === 'Business Loan');
      expect(businessLoan).toBeDefined();
      expect(businessLoan?.value).toBe(850000000);
    });

    it('returns placeholder for empty companies array', () => {
      const result = calculateFilteredBreakdowns([]);

      expect(result.region).toEqual([{ label: 'No Data', value: 0, percentage: 0 }]);
      expect(result.product).toEqual([{ label: 'No Data', value: 0, percentage: 0 }]);
    });

    it('calculates percentages that sum to 100', () => {
      const result = calculateFilteredBreakdowns(mockCompanies);

      const regionPercentageSum = result.region.reduce((sum, r) => sum + r.percentage, 0);
      const productPercentageSum = result.product.reduce((sum, p) => sum + p.percentage, 0);

      expect(regionPercentageSum).toBeCloseTo(100, 0);
      expect(productPercentageSum).toBeCloseTo(100, 0);
    });
  });

  describe('calculateFilteredDelinquencyMatrix', () => {
    it('creates matrix with correct structure', () => {
      const result = calculateFilteredDelinquencyMatrix(mockCompanies);

      expect(result.rows).toEqual(['NORTH', 'SOUTH', 'EAST', 'WEST']);
      expect(result.buckets).toEqual(['current', '0-30', '31-60', '61-90', '91-180', '180+']);
      expect(result.data).toHaveLength(4);
    });

    it('categorizes overdues into correct buckets', () => {
      const result = calculateFilteredDelinquencyMatrix(mockCompanies);

      const eastRegion = result.data.find((d) => d.region === 'EAST');
      expect(eastRegion).toBeDefined();

      // Company C in EAST region has 95 overdues (91-180 bucket)
      expect(eastRegion['91-180']).toEqual({
        count: 1,
        exposure: 700000000,
      });
    });

    it('correctly identifies current (no overdues) accounts', () => {
      const result = calculateFilteredDelinquencyMatrix(mockCompanies);

      const northRegion = result.data.find((d) => d.region === 'NORTH');
      expect(northRegion?.current).toEqual({
        count: 1,
        exposure: 850000000,
      });
    });

    it('handles regions with no companies', () => {
      const singleCompany = [mockCompanies[0]];
      const result = calculateFilteredDelinquencyMatrix(singleCompany);

      const southRegion = result.data.find((d) => d.region === 'SOUTH');
      expect(southRegion).toBeDefined();
      expect(southRegion?.current.count).toBe(0);
    });
  });

  describe('calculateFilteredTopExposures', () => {
    it('returns companies sorted by exposure descending', () => {
      const result = calculateFilteredTopExposures(mockCompanies);

      expect(result).toHaveLength(4);
      expect(result[0].borrowerName).toBe('Company A'); // 850 Cr
      expect(result[1].borrowerName).toBe('Company C'); // 700 Cr
      expect(result[2].borrowerName).toBe('Company D'); // 500 Cr
      expect(result[3].borrowerName).toBe('Company B'); // 400 Cr
    });

    it('limits results to specified count', () => {
      const result = calculateFilteredTopExposures(mockCompanies, 2);

      expect(result).toHaveLength(2);
      expect(result[0].borrowerName).toBe('Company A');
      expect(result[1].borrowerName).toBe('Company C');
    });

    it('assigns correct ranks', () => {
      const result = calculateFilteredTopExposures(mockCompanies);

      expect(result[0].rank).toBe(1);
      expect(result[1].rank).toBe(2);
      expect(result[2].rank).toBe(3);
      expect(result[3].rank).toBe(4);
    });

    it('calculates portfolio percentage correctly', () => {
      const result = calculateFilteredTopExposures(mockCompanies);

      // Company A: 850M / 2450M * 100 ≈ 34.69%
      expect(result[0].percentOfPortfolio).toBeCloseTo(34.69, 0);
    });

    it('calculates utilization correctly', () => {
      const result = calculateFilteredTopExposures(mockCompanies);

      // Company A: 850 / 1000 * 100 = 85%
      expect(result[0].utilization).toBe(85);
    });

    it('generates unique account numbers', () => {
      const result = calculateFilteredTopExposures(mockCompanies);

      const accountNumbers = result.map((r) => r.accountNumber);
      const uniqueNumbers = new Set(accountNumbers);
      expect(uniqueNumbers.size).toBe(accountNumbers.length);
    });
  });

  describe('calculateFilteredTrends', () => {
    it('generates 12 months of trend data', () => {
      const result = calculateFilteredTrends(mockCompanies);

      expect(result).toHaveLength(12);
    });

    it('includes required fields in each data point', () => {
      const result = calculateFilteredTrends(mockCompanies);

      result.forEach((dataPoint) => {
        expect(dataPoint).toHaveProperty('month');
        expect(dataPoint).toHaveProperty('npa');
        expect(dataPoint).toHaveProperty('par');
        expect(dataPoint).toHaveProperty('exposure');
      });
    });

    it('generates month labels in correct format', () => {
      const result = calculateFilteredTrends(mockCompanies);

      expect(result[0].month).toMatch(/^[A-Z][a-z]{2}$/); // e.g., "Jan", "Feb"
    });

    it('generates positive exposure values', () => {
      const result = calculateFilteredTrends(mockCompanies);

      result.forEach((dataPoint) => {
        expect(dataPoint.exposure).toBeGreaterThan(0);
      });
    });

    it('generates non-negative NPA and PAR values', () => {
      const result = calculateFilteredTrends(mockCompanies);

      result.forEach((dataPoint) => {
        expect(dataPoint.npa).toBeGreaterThanOrEqual(0);
        expect(dataPoint.par).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('getUniqueFilterValues', () => {
    it('extracts unique LOB values', () => {
      const result = getUniqueFilterValues(mockCompanies);

      expect(result.lob).toEqual(['LCB', 'MCB', 'SCB']);
    });

    it('extracts unique Party Type values', () => {
      const result = getUniqueFilterValues(mockCompanies);

      expect(result.partyType).toEqual(['Corporate', 'Large Corporate', 'SME']);
    });

    it('extracts unique Rating values', () => {
      const result = getUniqueFilterValues(mockCompanies);

      expect(result.rating).toEqual(['A', 'AA', 'AAA', 'BBB']);
    });

    it('extracts unique Asset Classification values', () => {
      const result = getUniqueFilterValues(mockCompanies);

      expect(result.assetClassification).toEqual(['Delinquent', 'Standard']);
    });

    it('returns sorted arrays', () => {
      const result = getUniqueFilterValues(mockCompanies);

      // Check that each array is sorted
      expect(result.lob).toEqual([...result.lob].sort());
      expect(result.partyType).toEqual([...result.partyType].sort());
      expect(result.rating).toEqual([...result.rating].sort());
      expect(result.assetClassification).toEqual([...result.assetClassification].sort());
    });

    it('handles empty companies array', () => {
      const result = getUniqueFilterValues([]);

      expect(result.lob).toEqual([]);
      expect(result.partyType).toEqual([]);
      expect(result.rating).toEqual([]);
      expect(result.assetClassification).toEqual([]);
    });
  });
});
