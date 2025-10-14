import { useFilterStore } from '../stores/filterStore';
import { mockPortfolioCompanies } from '../lib/mockData';
import { getUniqueFilterValues } from '../lib/filterUtils';
import MultiSelect from './MultiSelect';

export default function FilterBar() {
  const lob = useFilterStore((state) => state.lob);
  const partyType = useFilterStore((state) => state.partyType);
  const rating = useFilterStore((state) => state.rating);
  const assetClassification = useFilterStore((state) => state.assetClassification);

  const setLob = useFilterStore((state) => state.setLob);
  const setPartyType = useFilterStore((state) => state.setPartyType);
  const setRating = useFilterStore((state) => state.setRating);
  const setAssetClassification = useFilterStore((state) => state.setAssetClassification);
  const clearGlobalFilters = useFilterStore((state) => state.clearGlobalFilters);
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);

  // Get unique filter options from data
  const filterOptions = getUniqueFilterValues(mockPortfolioCompanies);

  const hasFilters = hasActiveFilters();

  return (
    <div className="bg-oracle-bgAlt border-b border-oracle-border px-6 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mr-2">Filters:</span>

        <MultiSelect
          label="LOB"
          options={filterOptions.lob}
          selected={lob}
          onChange={setLob}
          placeholder="All"
        />

        <MultiSelect
          label="Party Type"
          options={filterOptions.partyType}
          selected={partyType}
          onChange={setPartyType}
          placeholder="All"
        />

        <MultiSelect
          label="Rating"
          options={filterOptions.rating}
          selected={rating}
          onChange={setRating}
          placeholder="All"
        />

        <MultiSelect
          label="Asset Classification"
          options={filterOptions.assetClassification}
          selected={assetClassification}
          onChange={setAssetClassification}
          placeholder="All"
        />

        {hasFilters && (
          <button
            onClick={clearGlobalFilters}
            className="ml-auto px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors border border-gray-300"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
