import { useState } from 'react';
import { ChevronDown, AlertTriangle, Info, TrendingUp, AlertCircle, Filter, Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import type { KPIInsight } from '../types';
import { cn } from '../lib/utils';
import { useFilterStore } from '../stores/filterStore';

interface InsightCardProps {
  insight: KPIInsight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const location = useLocation();
  const { addPageFilter, clearPageFilters } = useFilterStore();

  const severityStyles = {
    critical: 'bg-red-100 text-red-700 border-red-300',
    warning: 'bg-amber-100 text-amber-700 border-amber-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300'
  };

  const SeverityIcon = insight.severity === 'critical' || insight.severity === 'warning'
    ? AlertTriangle
    : Info;

  // Handler for applying filters from insight
  const handleApplyFilters = () => {
    if (!insight.filters || insight.filters.length === 0) return;

    // Clear existing page filters first
    clearPageFilters(location.pathname);

    // Apply all insight filters
    insight.filters.forEach(filter => {
      addPageFilter(location.pathname, {
        field: filter.field,
        value: filter.value,
        label: filter.label,
        source: filter.source
      });
    });

    // Visual feedback
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 2000);
  };

  // Check if filters are available
  const hasFilters = insight.filters && insight.filters.length > 0;
  const filterCount = insight.filters?.length || 0;

  return (
    <div className={cn(
      "border-l-4 rounded-lg shadow-sm bg-white",
      insight.severity === 'critical' ? 'border-l-red-500' :
      insight.severity === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'
    )}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 shadow-sm",
            severityStyles[insight.severity]
          )}>
            <SeverityIcon className="w-4 h-4" />
            {insight.severity}
          </span>
          <h3 className="font-bold text-lg text-gray-900 text-left">{insight.theme}</h3>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-gray-500 transition-transform duration-200",
          isExpanded && "rotate-180"
        )} />
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
          {/* Key Insights */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Key Insights</h4>
            </div>
            <ul className="space-y-2">
              {insight.keyInsights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-800">
                  <span className="text-blue-600 mt-1 font-bold flex-shrink-0">→</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Implication */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wide">Implication</h4>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed font-medium">{insight.implication}</p>
          </div>

          {/* Apply Filters Button */}
          {hasFilters && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleApplyFilters}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm",
                  isApplying
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95"
                )}
              >
                {isApplying ? (
                  <>
                    <Check className="w-4 h-4" />
                    Filters Applied
                  </>
                ) : (
                  <>
                    <Filter className="w-4 h-4" />
                    Apply Filters ({filterCount})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
