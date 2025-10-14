import type { ProfitabilityDetails } from '../../types';

interface ProfitabilityMetricsCardProps {
  metrics: ProfitabilityDetails['profitabilityMetrics'];
}

export default function ProfitabilityMetricsCard({ metrics }: ProfitabilityMetricsCardProps) {
  const formatCurrency = (value: number) => `₹${value.toFixed(2)} Cr`;
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Profitability Metrics</h3>

      <div className="grid grid-cols-4 gap-4">
        {/* Row 1 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase mb-2">Total Income</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.totalIncome)}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase mb-2">Total Expenditure</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(metrics.totalExpenditure)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase mb-2">Net Fee Income</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(metrics.netFeeIncome)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase mb-2">Net Income</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(metrics.netIncome)}</p>
        </div>

        {/* Row 2 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase mb-2">Net Interest Margin</p>
          <p className="text-xl font-bold text-blue-600">
            {formatPercentage(metrics.netInterestMargin)}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase mb-2">Return on Total Assets</p>
          <p className="text-xl font-bold text-purple-600">
            {formatPercentage(metrics.returnOnTotalAssets)}
          </p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase mb-2">Return on Equity</p>
          <p className="text-xl font-bold text-indigo-600">
            {formatPercentage(metrics.returnOnEquity)}
          </p>
        </div>

        <div className="bg-teal-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 uppercase mb-2">Risk Adjusted Return on Capital</p>
          <p className="text-xl font-bold text-teal-600">
            {formatPercentage(metrics.riskAdjustedReturnOnCapital)}
          </p>
        </div>
      </div>
    </div>
  );
}
