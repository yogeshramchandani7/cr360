import type { ClimateRiskDetails } from '../../types';

interface ClimateRiskReportCardProps {
  report: ClimateRiskDetails['climateRiskReport'];
}

export default function ClimateRiskReportCard({ report }: ClimateRiskReportCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Climate Risk Report</h3>

      <div className="border-2 border-gray-200 rounded-lg p-4">
        {/* Header */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">{report.companyName}</p>
              <p className="text-sm text-gray-600">Industry - {report.industry}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{report.climateRating}</p>
              <p className="text-sm text-gray-600">Climate Rating</p>
            </div>
          </div>
        </div>

        {/* Score and Rating */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Climate Score</p>
            <p className="text-2xl font-bold text-blue-600">{report.climateScore.toFixed(1)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Rating</p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                report.rating === 'Positive'
                  ? 'bg-green-100 text-green-800'
                  : report.rating === 'Negative'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {report.rating}
            </span>
          </div>
        </div>

        {/* Key Risk Factors */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-red-700 mb-2">Key Risk Factors:</p>
          <ul className="space-y-1">
            {report.keyRiskFactors.map((factor, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-sm text-gray-700">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Positives */}
        <div>
          <p className="text-sm font-semibold text-green-700 mb-2">Top Positives:</p>
          <ul className="space-y-1">
            {report.topPositives.map((positive, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span className="text-sm text-gray-700">{positive}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
