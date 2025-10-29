import { create } from 'zustand';
import type { FilterState, GlobalFilterState, PageFilter } from '../types';

export interface DrillDownFilter {
  field: string;
  value: string;
  label: string;
  source?: string; // Optional: which chart/section triggered the drill-down
}

const PAGE_FILTERS_STORAGE_KEY = 'cr360_page_filters';

// Helper function to load page filters from localStorage
const loadPageFiltersFromStorage = (): Record<string, PageFilter[]> => {
  try {
    const stored = localStorage.getItem(PAGE_FILTERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load page filters from localStorage:', error);
  }
  return {};
};

// Helper function to save page filters to localStorage
const savePageFiltersToStorage = (pageFilters: Record<string, PageFilter[]>) => {
  try {
    localStorage.setItem(PAGE_FILTERS_STORAGE_KEY, JSON.stringify(pageFilters));
  } catch (error) {
    console.error('Failed to save page filters to localStorage:', error);
  }
};

interface FilterStore extends FilterState, GlobalFilterState {
  drillDownFilter: DrillDownFilter | null;
  selectedCompanyId: string | null;
  selectedInsightChartId: string | null;
  pageFilters: Record<string, PageFilter[]>;
  setDateRange: (from: string | null, to: string | null) => void;
  setRegions: (regions: string[]) => void;
  setSegments: (segments: string[]) => void;
  setProducts: (products: string[]) => void;
  setStatus: (status: string[]) => void;
  setLob: (lob: string[]) => void;
  setPartyType: (partyType: string[]) => void;
  setRating: (rating: string[]) => void;
  setAssetClassification: (assetClassification: string[]) => void;
  clearGlobalFilters: () => void;
  hasActiveFilters: () => boolean;
  setDrillDownFilter: (filter: DrillDownFilter | null) => void;
  clearDrillDownFilter: () => void;
  setSelectedCompanyId: (companyId: string | null) => void;
  clearSelectedCompanyId: () => void;
  setSelectedInsightChartId: (chartId: string | null) => void;
  clearSelectedInsightChartId: () => void;
  addPageFilter: (page: string, filter: Omit<PageFilter, 'id' | 'timestamp'>) => void;
  removePageFilter: (page: string, filterId: string) => void;
  getPageFilters: (page: string) => PageFilter[];
  clearPageFilters: (page: string) => void;
  reset: () => void;
}

const initialState: FilterState = {
  dateFrom: null,
  dateTo: null,
  regions: [],
  segments: [],
  products: [],
  status: [],
};

const initialGlobalFilters: GlobalFilterState = {
  lob: [],
  partyType: [],
  rating: [],
  assetClassification: [],
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...initialState,
  ...initialGlobalFilters,
  drillDownFilter: null,
  selectedCompanyId: null,
  selectedInsightChartId: null,
  pageFilters: loadPageFiltersFromStorage(),
  setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),
  setRegions: (regions) => set({ regions }),
  setSegments: (segments) => set({ segments }),
  setProducts: (products) => set({ products }),
  setStatus: (status) => set({ status }),
  setLob: (lob) => set({ lob }),
  setPartyType: (partyType) => set({ partyType }),
  setRating: (rating) => set({ rating }),
  setAssetClassification: (assetClassification) => set({ assetClassification }),
  clearGlobalFilters: () => set(initialGlobalFilters),
  hasActiveFilters: () => {
    const state = get();
    return state.lob.length > 0 ||
           state.partyType.length > 0 ||
           state.rating.length > 0 ||
           state.assetClassification.length > 0;
  },
  setDrillDownFilter: (filter) => set({ drillDownFilter: filter }),
  clearDrillDownFilter: () => set({ drillDownFilter: null }),
  setSelectedCompanyId: (companyId) => set({ selectedCompanyId: companyId }),
  clearSelectedCompanyId: () => set({ selectedCompanyId: null }),
  setSelectedInsightChartId: (chartId) => set({ selectedInsightChartId: chartId }),
  clearSelectedInsightChartId: () => set({ selectedInsightChartId: null }),
  addPageFilter: (page, filter) => {
    const state = get();
    const currentPageFilters = state.pageFilters[page] || [];

    // Create new filter with id and timestamp
    const newFilter: PageFilter = {
      ...filter,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add to page filters
    const updatedPageFilters = {
      ...state.pageFilters,
      [page]: [...currentPageFilters, newFilter],
    };

    // Update state and localStorage
    set({ pageFilters: updatedPageFilters });
    savePageFiltersToStorage(updatedPageFilters);
  },
  removePageFilter: (page, filterId) => {
    const state = get();
    const currentPageFilters = state.pageFilters[page] || [];

    // Remove filter by id
    const updatedPageFilters = {
      ...state.pageFilters,
      [page]: currentPageFilters.filter(f => f.id !== filterId),
    };

    // Clean up empty page arrays
    if (updatedPageFilters[page].length === 0) {
      delete updatedPageFilters[page];
    }

    // Update state and localStorage
    set({ pageFilters: updatedPageFilters });
    savePageFiltersToStorage(updatedPageFilters);
  },
  getPageFilters: (page) => {
    const state = get();
    return state.pageFilters[page] || [];
  },
  clearPageFilters: (page) => {
    const state = get();
    const updatedPageFilters = { ...state.pageFilters };
    delete updatedPageFilters[page];

    // Update state and localStorage
    set({ pageFilters: updatedPageFilters });
    savePageFiltersToStorage(updatedPageFilters);
  },
  reset: () => set({
    ...initialState,
    ...initialGlobalFilters,
    drillDownFilter: null,
    selectedCompanyId: null,
    selectedInsightChartId: null,
    pageFilters: {},
  }),
}));
