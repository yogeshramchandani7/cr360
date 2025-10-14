import { Search } from 'lucide-react';
import type { RiskDetails } from '../../types';

interface CreditRiskRepoCardProps {
  riskRepo: RiskDetails['creditRiskRepo'];
}

export default function CreditRiskRepoCard({ riskRepo }: CreditRiskRepoCardProps) {
  const getRiskLevelColor = (riskLevel: RiskDetails['creditRiskRepo']['riskLevel']) => {
    switch (riskLevel) {
      case 'Critical Risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High Risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium Risk':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low Risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: 'Strong' | 'Moderate' | 'Weak') => {
    switch (confidence) {
      case 'Strong':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Moderate':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Weak':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Risk Repo</h3>

      {/* Risk Level Badge */}
      <div className="mb-6">
        <span
          className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold border-2 ${getRiskLevelColor(
            riskRepo.riskLevel
          )}`}
        >
          {riskRepo.riskLevel} Detected
        </span>
      </div>

      {/* Company Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Common Name</span>
          <span className="text-base font-medium text-gray-900">{riskRepo.commonName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Search run on:</span>
          <span className="text-base text-gray-900">
            {new Date(riskRepo.searchDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Risk Factors */}
      {riskRepo.riskFactors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Risk Factors</h4>
          <div className="space-y-2">
            {riskRepo.riskFactors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${getConfidenceColor(
                    factor.confidence
                  )}`}
                >
                  {factor.confidence}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Sources */}
      {riskRepo.dataSources.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
            Data Sources (Any Confidence Level)
          </h4>
          <div className="flex flex-wrap gap-2">
            {riskRepo.dataSources.map((source, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-white"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs">Q</span>
          </div>
          <span className="text-xs text-gray-500">Quantifind GraphyteSearch © 2023</span>
        </div>
      </div>
    </div>
  );
}
