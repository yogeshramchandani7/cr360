import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, AlertTriangle, Sparkles, Activity, ChevronRight } from 'lucide-react';
import { useFilterStore } from '../stores/filterStore';
import { getInsightsByChartId } from '../lib/mockData';
import type { Insight } from '../types';

const chartNames: Record<string, string> = {
  'portfolio-trends': '12-Month Trends',
  'regional-breakdown': 'Regional Breakdown',
  'product-mix': 'Product Mix',
  'delinquency-matrix': 'Delinquency Matrix',
  'top-exposures': 'Top 20 Exposures',
};

const getCategoryIcon = (category: Insight['category']) => {
  switch (category) {
    case 'trend':
      return TrendingUp;
    case 'risk':
      return AlertTriangle;
    case 'opportunity':
      return Sparkles;
    case 'anomaly':
      return Activity;
    default:
      return Sparkles;
  }
};

const getSeverityStyles = (severity: Insight['severity']) => {
  switch (severity) {
    case 'critical':
      return 'border-l-4 border-red-500 bg-red-50';
    case 'warning':
      return 'border-l-4 border-yellow-500 bg-yellow-50';
    case 'info':
      return 'border-l-4 border-blue-500 bg-blue-50';
    default:
      return 'border-l-4 border-gray-500 bg-gray-50';
  }
};

const getSeverityIconColor = (severity: Insight['severity']) => {
  switch (severity) {
    case 'critical':
      return 'text-red-600';
    case 'warning':
      return 'text-yellow-600';
    case 'info':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

const getCategoryBadgeStyles = (category: Insight['category']) => {
  switch (category) {
    case 'trend':
      return 'bg-blue-100 text-blue-800';
    case 'risk':
      return 'bg-red-100 text-red-800';
    case 'opportunity':
      return 'bg-green-100 text-green-800';
    case 'anomaly':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface InsightCardProps {
  insight: Insight;
  onDrillDown?: (insight: Insight) => void;
}

function InsightCard({ insight, onDrillDown }: InsightCardProps) {
  const Icon = getCategoryIcon(insight.category);
  const isClickable = !!insight.filter;

  const handleClick = () => {
    if (isClickable && onDrillDown) {
      onDrillDown(insight);
    }
  };

  return (
    <div
      className={`rounded-lg p-4 ${getSeverityStyles(insight.severity)} ${
        isClickable ? 'cursor-pointer hover:shadow-md transition-all' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getSeverityIconColor(insight.severity)}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryBadgeStyles(insight.category)}`}>
              {insight.category}
            </span>
            {isClickable && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium ml-auto">
                View Details
                <ChevronRight className="w-3 h-3" />
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-3">{insight.description}</p>

          {insight.metrics && insight.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200">
              {insight.metrics.map((metric, idx) => (
                <div key={idx}>
                  <p className="text-xs text-gray-600">{metric.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InsightsDrawer() {
  const navigate = useNavigate();
  const selectedInsightChartId = useFilterStore((state) => state.selectedInsightChartId);
  const clearSelectedInsightChartId = useFilterStore((state) => state.clearSelectedInsightChartId);
  const setDrillDownFilter = useFilterStore((state) => state.setDrillDownFilter);

  const insights = selectedInsightChartId ? getInsightsByChartId(selectedInsightChartId) : [];
  const chartName = selectedInsightChartId ? chartNames[selectedInsightChartId] || 'Chart' : '';

  // Handle insight drill-down
  const handleInsightDrillDown = (insight: Insight) => {
    if (!insight.filter) return;

    // Set drill-down filter
    setDrillDownFilter({
      field: insight.filter.field,
      value: insight.filter.value,
      label: insight.filter.label,
      source: `AI Insights - ${insight.title}`,
    });

    // Close drawer
    clearSelectedInsightChartId();

    // Navigate to portfolio view
    navigate('/portfolio');
  };

  // Group insights by category
  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.category]) {
      acc[insight.category] = [];
    }
    acc[insight.category].push(insight);
    return acc;
  }, {} as Record<string, Insight[]>);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedInsightChartId) {
        clearSelectedInsightChartId();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedInsightChartId, clearSelectedInsightChartId]);

  if (!selectedInsightChartId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={clearSelectedInsightChartId}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-[70vw] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">AI Insights</h2>
              <p className="text-sm text-blue-100 mt-0.5">{chartName}</p>
            </div>
          </div>
          <button
            onClick={clearSelectedInsightChartId}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {insights.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No insights available for this chart.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Display insights grouped by category */}
              {Object.entries(groupedInsights).map(([category, categoryInsights]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="capitalize">{category}</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                      {categoryInsights.length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {categoryInsights.map((insight) => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        onDrillDown={handleInsightDrillDown}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            AI-powered insights generated based on portfolio data and historical trends
            <br />
            <span className="text-blue-600 font-medium">Click on insights with filters to view related companies</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
