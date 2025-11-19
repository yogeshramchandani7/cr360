import { ChevronDown } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  keyInsights?: string[];
  isExpanded: boolean;
  onEvidenceClick: () => void;
  onDrilldown?: () => void;
}

export default function InsightCard({
  title,
  description,
  severity,
  keyInsights = [],
  isExpanded,
  onEvidenceClick,
  onDrilldown,
}: InsightCardProps) {
  const getSeverityColor = () => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      case 'info':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4 hover:border-gray-300 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Severity Dot + Content */}
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-3 h-3 rounded-full ${getSeverityColor()} mt-1.5 flex-shrink-0`} />
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

            {/* Expanded Content - Key Insights */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}
            >
              {keyInsights.length > 0 && (
                <div className="space-y-2 pl-2">
                  {keyInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">→</span>
                      <p className="text-sm text-gray-600 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Facts Button */}
        <button
          onClick={onEvidenceClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors uppercase tracking-wide flex-shrink-0"
        >
          Facts
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Evidence Button - Only show when expanded */}
      {isExpanded && onDrilldown && (
        <div className="flex justify-end mt-4">
          <button
            onClick={onDrilldown}
            className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 hover:bg-teal-600 rounded-md transition-colors"
          >
            Evidence
          </button>
        </div>
      )}
    </div>
  );
}
