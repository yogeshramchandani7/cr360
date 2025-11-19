import { FileText, BarChart2 } from 'lucide-react';
import type { EvidenceChart, RiskItem } from '../../types';
import AgentAnalysisEvidenceChart from './AgentAnalysisEvidenceChart';
import { generatePostActionCharts } from '../../lib/agentAnalysisHelpers';

interface AgentAnalysisEvidenceProps {
  charts: EvidenceChart[];
  hasSourceInsight: boolean;
  riskItemStatus: RiskItem['status'];
  riskItem: RiskItem;
}

/**
 * AgentAnalysisEvidence - Evidence section displaying supporting charts
 * Shows evidence from source insight or generates mock evidence
 * For completed/closed items, displays Pre Action vs Post Action comparison
 */
export default function AgentAnalysisEvidence({
  charts,
  hasSourceInsight,
  riskItemStatus,
  riskItem
}: AgentAnalysisEvidenceProps) {
  const showPrePostLayout = riskItemStatus === 'closed' || riskItemStatus === 'completed';

  // Generate Post Action charts with updated titles, highlights, and timeline markers
  const preActionCharts = charts;
  const postActionCharts = showPrePostLayout ? generatePostActionCharts(charts, riskItem) : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            {hasSourceInsight ? (
              <FileText className="w-6 h-6 text-blue-600" />
            ) : (
              <BarChart2 className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Evidence
            </h2>
            <p className="text-sm text-gray-600">
              {hasSourceInsight
                ? 'Charts and data from the source insight that triggered this action'
                : 'Generated analysis charts and timeline data for this risk action item'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="p-6">
        {charts.length > 0 ? (
          <>
            {showPrePostLayout ? (
              /* Pre Action vs Post Action Layout for Completed/Closed Items */
              <div className="space-y-6">
                {/* Column Headers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Pre Action</h3>
                    <p className="text-sm text-gray-600">Evidence before intervention</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Post Action</h3>
                    <p className="text-sm text-gray-600">Results after intervention</p>
                  </div>
                </div>

                {/* Chart Pairs - Each row contains Pre and Post for same chart */}
                {preActionCharts.map((preChart, index) => (
                  <div key={preChart.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AgentAnalysisEvidenceChart chart={preChart} />
                    <div className="bg-gray-100 rounded-xl p-3">
                      <AgentAnalysisEvidenceChart chart={postActionCharts[index]} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Standard Layout for Open/In-Progress Items */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts.map((chart) => (
                  <AgentAnalysisEvidenceChart key={chart.id} chart={chart} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <BarChart2 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No evidence charts available for this item</p>
          </div>
        )}
      </div>
    </div>
  );
}
