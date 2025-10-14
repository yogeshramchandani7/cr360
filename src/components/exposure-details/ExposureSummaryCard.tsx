import type { ExposureDetails } from '../../types';

interface ExposureSummaryCardProps {
  summary: ExposureDetails['exposureSummary'];
}

export default function ExposureSummaryCard({ summary }: ExposureSummaryCardProps) {
  const formatCurrency = (value: number) => `₹${value.toFixed(2)} Cr`;
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Exposure Summary</h3>

      {/* Top Metrics */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Exposure</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(summary.totalExposure)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Proportion of total Banks Exposure</p>
            <p className="text-3xl font-bold text-blue-600">{formatPercentage(summary.proportionOfBankExposure)}</p>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Credit Limit</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.creditLimit)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Drawing Limit</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.drawingLimit)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Credit Exposure</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.creditExposure)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Undrawn Exposure</p>
          <p className="text-lg font-semibold text-green-600">{formatCurrency(summary.undrawnExposure)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Gross Credit Exposure</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.grossCreditExposure)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Overdues</p>
          <p className={`text-lg font-semibold ${summary.overdues > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(summary.overdues)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">DPD</p>
          <p className={`text-lg font-semibold ${summary.dpd > 30 ? 'text-red-600' : summary.dpd > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {summary.dpd} days
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Credit Status</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            summary.creditStatus === 'Standard'
              ? 'bg-green-100 text-green-800'
              : summary.creditStatus === 'Watchlist'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {summary.creditStatus}
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Asset Classification</p>
          <p className="text-lg font-semibold text-gray-900">{summary.assetClassification}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">ECL</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.ecl)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Security Value</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.securityValue)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">RWA</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.rwa)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Total EMI</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalEmi)}</p>
        </div>
      </div>
    </div>
  );
}
