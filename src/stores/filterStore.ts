import { create } from 'zustand';
import type { FilterState, GlobalFilterState } from '../types';

export interface DrillDownFilter {
  field: string;
  value: string;
  label: string;
  source?: string; // Optional: which chart/section triggered the drill-down
}

interface FilterStore extends FilterState, GlobalFilterState {
  drillDownFilter: DrillDownFilter | null;
  selectedCompanyId: string | null;
  selectedInsightChartId: string | null;
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
  reset: () => set({ ...initialState, ...initialGlobalFilters, drillDownFilter: null, selectedCompanyId: null, selectedInsightChartId: null }),
}));
