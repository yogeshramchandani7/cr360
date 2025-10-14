import type { KYCComplianceDetails } from '../../types';

interface RiskSummaryPanelProps {
  summary: KYCComplianceDetails['riskSummary'];
}

export default function RiskSummaryPanel({ summary }: RiskSummaryPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Summary</h3>

      <div className="space-y-4">
        {/* Details */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Details</p>
          <p
            className={`font-semibold ${
              summary.details.includes('Risk Detected') ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {summary.details}
          </p>
        </div>

        {/* Profile Risk */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Profile Risk</p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              summary.profileRisk === 'High'
                ? 'bg-red-100 text-red-800'
                : summary.profileRisk === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {summary.profileRisk}
          </span>
        </div>

        {/* Risk Factors */}
        {summary.riskFactors.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Risk Factors:</p>
            <ul className="space-y-2">
              {summary.riskFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-sm text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.riskFactors.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 text-center">No risk factors identified</p>
          </div>
        )}
      </div>
    </div>
  );
}
