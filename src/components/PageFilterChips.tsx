import { X } from 'lucide-react';
import { useFilterStore } from '../stores/filterStore';
import type { PageFilter } from '../types';

interface PageFilterChipsProps {
  page: string;
}

// Stable empty array to prevent unnecessary re-renders
const EMPTY_FILTERS: PageFilter[] = [];

export default function PageFilterChips({ page }: PageFilterChipsProps) {
  // Get ALL page filters object (subscribe to entire object to ensure re-renders on any change)
  const allPageFilters = useFilterStore((state) => state.pageFilters);
  const removePageFilter = useFilterStore((state) => state.removePageFilter);

  // Extract page-specific filters inside component (not in selector)
  const filters = allPageFilters[page] ?? EMPTY_FILTERS;

  // Don't render anything if no filters
  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-blue-900">Active Filters:</span>
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-sm font-medium border border-blue-200"
          >
            <span>{filter.label}</span>
            <button
              onClick={() => removePageFilter(page, filter.id)}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      {filters.length > 0 && (
        <p className="text-xs text-blue-700 mt-2">
          Showing data filtered by {filters.length} condition{filters.length > 1 ? 's' : ''}.
          {filters.length > 1 && ' All conditions must match (AND logic).'}
        </p>
      )}
    </div>
  );
}
