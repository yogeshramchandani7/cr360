import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilterStore, type DrillDownFilter } from './filterStore';

describe('filterStore', () => {
  // Reset store before each test
  beforeEach(() => {
    const { result } = renderHook(() => useFilterStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('initializes with null date range', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.dateFrom).toBeNull();
      expect(result.current.dateTo).toBeNull();
    });

    it('initializes with empty filter arrays', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.regions).toEqual([]);
      expect(result.current.segments).toEqual([]);
      expect(result.current.products).toEqual([]);
      expect(result.current.status).toEqual([]);
    });

    it('initializes with empty global filter arrays', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.lob).toEqual([]);
      expect(result.current.partyType).toEqual([]);
      expect(result.current.rating).toEqual([]);
      expect(result.current.assetClassification).toEqual([]);
    });

    it('initializes with null drillDownFilter', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.drillDownFilter).toBeNull();
    });

    it('initializes with null selectedCompanyId', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.selectedCompanyId).toBeNull();
    });

    it('initializes with null selectedInsightChartId', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.selectedInsightChartId).toBeNull();
    });

    it('hasActiveFilters returns false initially', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.hasActiveFilters()).toBe(false);
    });
  });

  describe('Date Range Filters', () => {
    it('sets date range correctly', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setDateRange('2025-01-01', '2025-12-31');
      });

      expect(result.current.dateFrom).toBe('2025-01-01');
      expect(result.current.dateTo).toBe('2025-12-31');
    });

    it('sets date range to null', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setDateRange('2025-01-01', '2025-12-31');
      });

      act(() => {
        result.current.setDateRange(null, null);
      });

      expect(result.current.dateFrom).toBeNull();
      expect(result.current.dateTo).toBeNull();
    });
  });

  describe('Filter State Setters', () => {
    it('setRegions updates regions array', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setRegions(['NORTH', 'SOUTH']);
      });

      expect(result.current.regions).toEqual(['NORTH', 'SOUTH']);
    });

    it('setSegments updates segments array', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSegments(['RETAIL', 'CORPORATE']);
      });

      expect(result.current.segments).toEqual(['RETAIL', 'CORPORATE']);
    });

    it('setProducts updates products array', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setProducts(['Home Loan', 'Personal Loan']);
      });

      expect(result.current.products).toEqual(['Home Loan', 'Personal Loan']);
    });

    it('setStatus updates status array', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setStatus(['Standard', 'Watchlist']);
      });

      expect(result.current.status).toEqual(['Standard', 'Watchlist']);
    });

    it('setLob updates lob array', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setLob(['LCB', 'MCB']);
      });

      expect(result.current.lob).toEqual(['LCB', 'MCB']);
    });

    it('setPartyType updates partyType array', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setPartyType(['Corporate', 'SME']);
      });

      expect(result.current.partyType).toEqual(['Corporate', 'SME']);
    });

    it('setRating updates rating array', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setRating(['AAA', 'AA']);
      });

      expect(result.current.rating).toEqual(['AAA', 'AA']);
    });

    it('setAssetClassification updates assetClassification array', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setAssetClassification(['Standard', 'Delinquent']);
      });

      expect(result.current.assetClassification).toEqual(['Standard', 'Delinquent']);
    });
  });

  describe('Global Filters', () => {
    it('clearGlobalFilters resets all global filter arrays', () => {
      const { result } = renderHook(() => useFilterStore());

      // Set some global filters
      act(() => {
        result.current.setLob(['LCB']);
        result.current.setPartyType(['Corporate']);
        result.current.setRating(['AAA']);
        result.current.setAssetClassification(['Standard']);
      });

      // Verify filters are set
      expect(result.current.lob).toEqual(['LCB']);
      expect(result.current.partyType).toEqual(['Corporate']);

      // Clear all global filters
      act(() => {
        result.current.clearGlobalFilters();
      });

      // Verify all global filters are empty
      expect(result.current.lob).toEqual([]);
      expect(result.current.partyType).toEqual([]);
      expect(result.current.rating).toEqual([]);
      expect(result.current.assetClassification).toEqual([]);
    });

    it('clearGlobalFilters does not affect other state', () => {
      const { result } = renderHook(() => useFilterStore());

      // Set non-global filters
      act(() => {
        result.current.setRegions(['NORTH']);
        result.current.setSegments(['RETAIL']);
        result.current.setLob(['LCB']);
      });

      act(() => {
        result.current.clearGlobalFilters();
      });

      // Non-global filters should remain
      expect(result.current.regions).toEqual(['NORTH']);
      expect(result.current.segments).toEqual(['RETAIL']);
      // Global filter should be cleared
      expect(result.current.lob).toEqual([]);
    });
  });

  describe('hasActiveFilters', () => {
    it('returns false when no global filters are active', () => {
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('returns true when lob filter is active', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setLob(['LCB']);
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('returns true when partyType filter is active', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setPartyType(['Corporate']);
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('returns true when rating filter is active', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setRating(['AAA']);
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('returns true when assetClassification filter is active', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setAssetClassification(['Standard']);
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('returns true when multiple filters are active', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setLob(['LCB']);
        result.current.setPartyType(['Corporate']);
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('returns false after clearing global filters', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setLob(['LCB']);
      });

      expect(result.current.hasActiveFilters()).toBe(true);

      act(() => {
        result.current.clearGlobalFilters();
      });

      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('does not consider non-global filters', () => {
      const { result } = renderHook(() => useFilterStore());

      // Set non-global filters
      act(() => {
        result.current.setRegions(['NORTH']);
        result.current.setSegments(['RETAIL']);
        result.current.setProducts(['Home Loan']);
        result.current.setStatus(['Standard']);
      });

      // hasActiveFilters should still return false
      expect(result.current.hasActiveFilters()).toBe(false);
    });
  });

  describe('DrillDown Filter', () => {
    const mockDrillDownFilter: DrillDownFilter = {
      field: 'segment',
      value: 'RETAIL',
      label: 'RETAIL',
      source: 'mortality-by-segment',
    };

    it('sets drillDown filter correctly', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setDrillDownFilter(mockDrillDownFilter);
      });

      expect(result.current.drillDownFilter).toEqual(mockDrillDownFilter);
    });

    it('clears drillDown filter', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setDrillDownFilter(mockDrillDownFilter);
      });

      expect(result.current.drillDownFilter).toEqual(mockDrillDownFilter);

      act(() => {
        result.current.clearDrillDownFilter();
      });

      expect(result.current.drillDownFilter).toBeNull();
    });

    it('sets drillDown filter to null explicitly', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setDrillDownFilter(mockDrillDownFilter);
      });

      act(() => {
        result.current.setDrillDownFilter(null);
      });

      expect(result.current.drillDownFilter).toBeNull();
    });

    it('updates drillDown filter with new value', () => {
      const { result } = renderHook(() => useFilterStore());

      const filter1: DrillDownFilter = {
        field: 'segment',
        value: 'RETAIL',
        label: 'RETAIL',
      };

      const filter2: DrillDownFilter = {
        field: 'region',
        value: 'NORTH',
        label: 'NORTH',
      };

      act(() => {
        result.current.setDrillDownFilter(filter1);
      });

      expect(result.current.drillDownFilter).toEqual(filter1);

      act(() => {
        result.current.setDrillDownFilter(filter2);
      });

      expect(result.current.drillDownFilter).toEqual(filter2);
    });

    it('handles drillDown filter without optional source', () => {
      const { result } = renderHook(() => useFilterStore());

      const filter: DrillDownFilter = {
        field: 'productType',
        value: 'Home Loan',
        label: 'Home Loan',
      };

      act(() => {
        result.current.setDrillDownFilter(filter);
      });

      expect(result.current.drillDownFilter).toEqual(filter);
      expect(result.current.drillDownFilter?.source).toBeUndefined();
    });
  });

  describe('Selected Company ID', () => {
    it('sets selected company ID', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedCompanyId('company-123');
      });

      expect(result.current.selectedCompanyId).toBe('company-123');
    });

    it('clears selected company ID', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedCompanyId('company-123');
      });

      act(() => {
        result.current.clearSelectedCompanyId();
      });

      expect(result.current.selectedCompanyId).toBeNull();
    });

    it('sets selected company ID to null explicitly', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedCompanyId('company-123');
      });

      act(() => {
        result.current.setSelectedCompanyId(null);
      });

      expect(result.current.selectedCompanyId).toBeNull();
    });

    it('updates selected company ID', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedCompanyId('company-1');
      });

      expect(result.current.selectedCompanyId).toBe('company-1');

      act(() => {
        result.current.setSelectedCompanyId('company-2');
      });

      expect(result.current.selectedCompanyId).toBe('company-2');
    });
  });

  describe('Selected Insight Chart ID', () => {
    it('sets selected insight chart ID', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedInsightChartId('chart-abc');
      });

      expect(result.current.selectedInsightChartId).toBe('chart-abc');
    });

    it('clears selected insight chart ID', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedInsightChartId('chart-abc');
      });

      act(() => {
        result.current.clearSelectedInsightChartId();
      });

      expect(result.current.selectedInsightChartId).toBeNull();
    });

    it('sets selected insight chart ID to null explicitly', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedInsightChartId('chart-abc');
      });

      act(() => {
        result.current.setSelectedInsightChartId(null);
      });

      expect(result.current.selectedInsightChartId).toBeNull();
    });

    it('updates selected insight chart ID', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedInsightChartId('chart-1');
      });

      expect(result.current.selectedInsightChartId).toBe('chart-1');

      act(() => {
        result.current.setSelectedInsightChartId('chart-2');
      });

      expect(result.current.selectedInsightChartId).toBe('chart-2');
    });
  });

  describe('Reset Functionality', () => {
    it('resets all state to initial values', () => {
      const { result } = renderHook(() => useFilterStore());

      // Set all kinds of state
      act(() => {
        result.current.setDateRange('2025-01-01', '2025-12-31');
        result.current.setRegions(['NORTH', 'SOUTH']);
        result.current.setSegments(['RETAIL']);
        result.current.setProducts(['Home Loan']);
        result.current.setStatus(['Standard']);
        result.current.setLob(['LCB']);
        result.current.setPartyType(['Corporate']);
        result.current.setRating(['AAA']);
        result.current.setAssetClassification(['Standard']);
        result.current.setDrillDownFilter({
          field: 'segment',
          value: 'RETAIL',
          label: 'RETAIL',
        });
        result.current.setSelectedCompanyId('company-123');
        result.current.setSelectedInsightChartId('chart-abc');
      });

      // Verify state is set
      expect(result.current.dateFrom).not.toBeNull();
      expect(result.current.regions.length).toBeGreaterThan(0);
      expect(result.current.lob.length).toBeGreaterThan(0);

      // Reset all state
      act(() => {
        result.current.reset();
      });

      // Verify all state is back to initial
      expect(result.current.dateFrom).toBeNull();
      expect(result.current.dateTo).toBeNull();
      expect(result.current.regions).toEqual([]);
      expect(result.current.segments).toEqual([]);
      expect(result.current.products).toEqual([]);
      expect(result.current.status).toEqual([]);
      expect(result.current.lob).toEqual([]);
      expect(result.current.partyType).toEqual([]);
      expect(result.current.rating).toEqual([]);
      expect(result.current.assetClassification).toEqual([]);
      expect(result.current.drillDownFilter).toBeNull();
      expect(result.current.selectedCompanyId).toBeNull();
      expect(result.current.selectedInsightChartId).toBeNull();
    });

    it('hasActiveFilters returns false after reset', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setLob(['LCB']);
      });

      expect(result.current.hasActiveFilters()).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.hasActiveFilters()).toBe(false);
    });
  });

  describe('Complex Scenarios', () => {
    it('handles multiple filter updates in sequence', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setLob(['LCB']);
      });

      act(() => {
        result.current.setPartyType(['Corporate']);
      });

      act(() => {
        result.current.setRating(['AAA', 'AA']);
      });

      expect(result.current.lob).toEqual(['LCB']);
      expect(result.current.partyType).toEqual(['Corporate']);
      expect(result.current.rating).toEqual(['AAA', 'AA']);
      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('handles clearing individual filters', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setLob(['LCB', 'MCB']);
        result.current.setPartyType(['Corporate']);
      });

      expect(result.current.hasActiveFilters()).toBe(true);

      act(() => {
        result.current.setLob([]);
      });

      expect(result.current.lob).toEqual([]);
      expect(result.current.partyType).toEqual(['Corporate']);
      expect(result.current.hasActiveFilters()).toBe(true);

      act(() => {
        result.current.setPartyType([]);
      });

      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('handles drilldown filter alongside global filters', () => {
      const { result } = renderHook(() => useFilterStore());

      const drillDownFilter: DrillDownFilter = {
        field: 'segment',
        value: 'RETAIL',
        label: 'RETAIL',
      };

      act(() => {
        result.current.setLob(['LCB']);
        result.current.setDrillDownFilter(drillDownFilter);
      });

      expect(result.current.lob).toEqual(['LCB']);
      expect(result.current.drillDownFilter).toEqual(drillDownFilter);
      expect(result.current.hasActiveFilters()).toBe(true);

      act(() => {
        result.current.clearDrillDownFilter();
      });

      expect(result.current.drillDownFilter).toBeNull();
      expect(result.current.lob).toEqual(['LCB']);
      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('handles company and chart selection together', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setSelectedCompanyId('company-123');
        result.current.setSelectedInsightChartId('chart-abc');
      });

      expect(result.current.selectedCompanyId).toBe('company-123');
      expect(result.current.selectedInsightChartId).toBe('chart-abc');

      act(() => {
        result.current.clearSelectedCompanyId();
      });

      expect(result.current.selectedCompanyId).toBeNull();
      expect(result.current.selectedInsightChartId).toBe('chart-abc');
    });
  });
});
