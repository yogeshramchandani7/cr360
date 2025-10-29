import { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { getInsightsForKPI } from '../lib/kpiInsights';
import InsightCard from './InsightCard';
import { cn } from '../lib/utils';

interface InsightSectionProps {
  kpiId: string;
}

export default function InsightSection({ kpiId }: InsightSectionProps) {
  const [isSectionExpanded, setIsSectionExpanded] = useState(false);
  const insights = getInsightsForKPI(kpiId);

  if (insights.length === 0) return null;

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm px-4 py-4">
        {/* Section Toggle Button */}
        <button
          onClick={() => setIsSectionExpanded(!isSectionExpanded)}
          className="flex items-center justify-between w-full group hover:bg-blue-100/50 rounded-lg p-2 -m-2 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Lightbulb className="w-7 h-7 text-yellow-500 fill-yellow-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">Insights</span>
            <span className="px-2.5 py-0.5 bg-blue-600 text-white text-sm font-bold rounded-full shadow-sm">
              {insights.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
              {isSectionExpanded ? 'Hide' : 'View All'}
            </span>
            <ChevronDown className={cn(
              "w-5 h-5 text-blue-600 transition-transform duration-200",
              isSectionExpanded && "rotate-180"
            )} />
          </div>
        </button>

        {/* Insights Grid - Collapsed by Default */}
        {isSectionExpanded && (
          <div className="mt-4 space-y-3">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
