import type { RiskDetails } from '../../types';

interface RiskClassificationCardProps {
  classification: RiskDetails['borrowerRiskClassification'];
}

export default function RiskClassificationCard({ classification }: RiskClassificationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Borrower Risk Classification & Status
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Credit Status</p>
          <p className="text-base font-medium text-gray-900">{classification.creditStatus}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Asset Classification</p>
          <p className="text-base font-medium text-gray-900">{classification.assetClassification}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Stage Classification</p>
          <p className="text-base font-medium text-gray-900">{classification.stageClassification}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Delinquent Flag</p>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              classification.delinquentFlag === 'Yes'
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {classification.delinquentFlag}
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Watchlist Flag</p>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              classification.watchlistFlag === 'Yes'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {classification.watchlistFlag}
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Security Status</p>
          <p className="text-base font-medium text-gray-900">{classification.securityStatus}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Guarantor Status</p>
          <p className="text-base font-medium text-gray-900">{classification.guarantorStatus}</p>
        </div>
      </div>
    </div>
  );
}
