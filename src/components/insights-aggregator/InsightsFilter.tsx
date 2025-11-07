import { X } from 'lucide-react';
import { getKPIDisplayName } from '../../lib/kpiInsights';

interface InsightsFilterProps {
  severityFilter: string;
  kpiFilter: string;
  sortBy: string;
  onSeverityChange: (severity: string) => void;
  onKpiChange: (kpi: string) => void;
  onSortChange: (sort: string) => void;
  onClear: () => void;
  availableKpis: string[];
}

export default function InsightsFilter({
  severityFilter,
  kpiFilter,
  sortBy,
  onSeverityChange,
  onKpiChange,
  onSortChange,
  onClear,
  availableKpis
}: InsightsFilterProps) {
  const hasActiveFilters = severityFilter !== 'all' || kpiFilter !== 'all' || sortBy !== 'severity';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Filter & Sort Insights
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Severity Filter */}
        <div>
          <label htmlFor="severity-filter" className="block text-xs font-medium text-gray-700 mb-2">
            Severity
          </label>
          <select
            id="severity-filter"
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>

        {/* KPI Filter */}
        <div>
          <label htmlFor="kpi-filter" className="block text-xs font-medium text-gray-700 mb-2">
            KPI
          </label>
          <select
            id="kpi-filter"
            value={kpiFilter}
            onChange={(e) => onKpiChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">All KPIs</option>
            {availableKpis.map(kpiId => (
              <option key={kpiId} value={kpiId}>
                {getKPIDisplayName(kpiId)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sort-by" className="block text-xs font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="severity">Severity (Critical First)</option>
            <option value="timestamp">Newest First</option>
            <option value="kpi">KPI Name</option>
          </select>
        </div>
      </div>
    </div>
  );
}
