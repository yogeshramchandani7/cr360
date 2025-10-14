import type { ClimateRiskDetails } from '../../types';

interface ClimateRiskScoreCardProps {
  score: ClimateRiskDetails['climateRiskScore'];
}

export default function ClimateRiskScoreCard({ score }: ClimateRiskScoreCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Climate Risk Score</h3>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">ISIN</p>
          <p className="text-sm font-medium text-gray-900">{score.isin}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">Counterparty Country</p>
          <p className="text-sm font-medium text-gray-900">{score.counterpartyCountry}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">Counterparty Industry</p>
          <p className="text-sm font-medium text-gray-900">{score.counterpartyIndustry}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">Climate Risk Score</p>
          <p className="text-xl font-bold text-blue-600">{score.climateRiskScore.toFixed(1)}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">Climate Rating</p>
          <p className="text-xl font-bold text-green-600">{score.climateRating}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">Rating Reference</p>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              score.ratingReference === 'Positive'
                ? 'bg-green-100 text-green-800'
                : score.ratingReference === 'Negative'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {score.ratingReference}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2">Industry Average Score</p>
          <p className="text-lg font-semibold text-gray-900">{score.industryAverageScore.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}
