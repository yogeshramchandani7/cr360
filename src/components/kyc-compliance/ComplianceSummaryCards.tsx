import type { KYCComplianceDetails } from '../../types';

interface ComplianceSummaryCardsProps {
  summary: KYCComplianceDetails['complianceSummary'];
}

export default function ComplianceSummaryCards({ summary }: ComplianceSummaryCardsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Summary</h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Case Details */}
        <button className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all text-left">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Case Details</h4>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-gray-900">{summary.caseDetails.totalCases}</p>
              <p className="text-xs text-gray-600">Total Cases</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div>
                <p className="text-lg font-semibold text-orange-600">
                  {summary.caseDetails.openCases}
                </p>
                <p className="text-xs text-gray-600">Open</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-green-600">
                  {summary.caseDetails.closedCases}
                </p>
                <p className="text-xs text-gray-600">Closed</p>
              </div>
            </div>
          </div>
        </button>

        {/* Events */}
        <button className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all text-left">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Events</h4>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-gray-900">{summary.events.totalEvents}</p>
              <p className="text-xs text-gray-600">Total Events</p>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-lg font-semibold text-blue-600">{summary.events.recentEvents}</p>
              <p className="text-xs text-gray-600">Recent Events</p>
            </div>
          </div>
        </button>

        {/* SARs */}
        <button className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all text-left">
          <h4 className="text-sm font-medium text-gray-700 mb-4">SARs</h4>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-gray-900">{summary.sars.totalSARs}</p>
              <p className="text-xs text-gray-600">Total SARs</p>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-lg font-semibold text-red-600">{summary.sars.pendingSARs}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
