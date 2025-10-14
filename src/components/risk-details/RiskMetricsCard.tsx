import type { RiskDetails } from '../../types';

interface RiskMetricsCardProps {
  metrics: RiskDetails['riskMetrics'];
}

export default function RiskMetricsCard({ metrics }: RiskMetricsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Probability of Default</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.probabilityOfDefault}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Loss Given Default</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.lossGivenDefault}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Total Exposure at Default</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalExposureAtDefault}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Expected Credit Loss</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.expectedCreditLoss}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Loan to Value Ratio</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.loanToValueRatio}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Risk Weight</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.riskWeight}</p>
        </div>
      </div>
    </div>
  );
}
