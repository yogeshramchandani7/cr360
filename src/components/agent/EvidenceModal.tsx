import { X } from 'lucide-react';
import type { KPIInsight, MacroInsight } from '../../types';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: KPIInsight | MacroInsight | null;
}

export default function EvidenceModal({ isOpen, onClose, insight }: EvidenceModalProps) {
  if (!isOpen || !insight) return null;

  // Helper to check if insight is KPIInsight
  const isKPIInsight = (ins: KPIInsight | MacroInsight): ins is KPIInsight => {
    return 'kpiId' in ins;
  };

  const title = 'theme' in insight ? insight.theme : 'Insight';
  const keyInsights = isKPIInsight(insight) ? insight.keyInsights : [];
  const implication = 'implication' in insight ? insight.implication : '';
  const actions = isKPIInsight(insight) ? insight.croActions : [];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Evidence Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Insight Title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  insight.severity === 'critical'
                    ? 'bg-red-500'
                    : insight.severity === 'warning'
                    ? 'bg-orange-500'
                    : 'bg-blue-400'
                }`}
              />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {insight.severity} Severity
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          </div>

          {/* Key Insights */}
          {keyInsights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Insights</h4>
              <ul className="space-y-2">
                {keyInsights.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-oracle-primary font-bold mt-0.5">•</span>
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Implication */}
          {implication && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Implication</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{implication}</p>
            </div>
          )}

          {/* CRO Action Items */}
          {actions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommended Actions</h4>
              <ul className="space-y-2">
                {actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-oracle-primary font-bold mt-0.5">•</span>
                    <span className="text-sm text-gray-600">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filters */}
          {isKPIInsight(insight) && insight.filters && insight.filters.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Filter Context</h4>
              <div className="flex flex-wrap gap-2">
                {insight.filters.map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {filter.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
