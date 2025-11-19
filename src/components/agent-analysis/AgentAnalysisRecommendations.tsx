import { useState } from 'react';
import { Sparkles, CheckCircle, ArrowRight, X } from 'lucide-react';
import { format } from 'date-fns';
import type { RiskItem } from '../../types';
import { useRiskHubStore } from '../../stores/riskHubStore';

interface AgentAnalysisRecommendationsProps {
  riskItem: RiskItem;
}

/**
 * AgentAnalysisRecommendations - Status briefing section
 * Shows status update and outcome summary for completed/closed risk items
 */
export default function AgentAnalysisRecommendations({
  riskItem,
}: AgentAnalysisRecommendationsProps) {
  const [showNextActionsModal, setShowNextActionsModal] = useState(false);
  const updateItem = useRiskHubStore((state) => state.updateItem);

  const handleCloseItem = () => {
    updateItem(riskItem.id, { status: 'closed' });
  };

  const handleViewNextActions = () => {
    setShowNextActionsModal(true);
  };

  return (
    <>
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Agent Briefing
            </h2>
            <p className="text-sm text-gray-600">
              Updated analysis based on current status and context
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Status Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Status
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            The action was marked {riskItem.status} on{' '}
            {format(new Date(riskItem.updatedAt || riskItem.createdAt), 'dd MMM yy')}.
            In the last 30 days post the actions were executed, default rates in loans made with Income Policy Exception
            have come down to 5% from 8.7% and is steadily decreasing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={handleCloseItem}
            disabled={riskItem.status === 'closed'}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {riskItem.status === 'closed' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Item Closed
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Close Item
              </>
            )}
          </button>

          <button
            onClick={handleViewNextActions}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            View Next Actions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    {/* Next Actions Modal */}
    {showNextActionsModal && (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowNextActionsModal(false)}
        />
        <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              How to improve these Metrics more
            </h2>
            <button
              onClick={() => setShowNextActionsModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-gray-700">
              How to improve these Metrics more
            </p>
          </div>
        </div>
      </>
    )}
    </>
  );
}
