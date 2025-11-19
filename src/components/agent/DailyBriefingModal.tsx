import { X, TrendingUp, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { getAllKPIInsights } from '../../lib/kpiInsights';
import { generateMacroInsights } from '../../lib/macroInsightsGenerator';
import { generateInsightsBriefing } from '../../lib/insightsBriefingGenerator';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyBriefingModal({ isOpen, onClose }: DailyBriefingModalProps) {
  if (!isOpen) return null;

  const kpiInsights = getAllKPIInsights();
  const macroInsights = generateMacroInsights();
  const briefing = generateInsightsBriefing(kpiInsights, macroInsights);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-2xl">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Daily Briefing</h2>
                    <p className="text-sm text-blue-100">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-bold text-red-900 uppercase tracking-wide">
                      Critical
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-red-700">
                    {briefing.overview.criticalCount}
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                      Warning
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-amber-700">
                    {briefing.overview.warningCount}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                      Info
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">
                    {briefing.overview.infoCount}
                  </p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Executive Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {briefing.overview}
                </p>
              </div>

              {/* Critical Issues */}
              {briefing.criticalIssues.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Critical Issues
                  </h3>
                  <ul className="space-y-3">
                    {briefing.criticalIssues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1 flex-shrink-0">→</span>
                        <span className="text-gray-800">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {briefing.warnings.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Warnings
                  </h3>
                  <ul className="space-y-3">
                    {briefing.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-amber-600 font-bold mt-1 flex-shrink-0">→</span>
                        <span className="text-gray-800">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Observations */}
              {briefing.observations.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Key Observations
                  </h3>
                  <ul className="space-y-3">
                    {briefing.observations.map((observation, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold mt-1 flex-shrink-0">→</span>
                        <span className="text-gray-800">{observation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Assessment */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-4">
                  Risk Assessment
                </h3>
                <p className="text-gray-800 leading-relaxed">
                  {briefing.riskAssessment}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Generated by ORA • {new Date().toLocaleTimeString()}
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
