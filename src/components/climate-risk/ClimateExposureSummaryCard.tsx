import type { ClimateRiskDetails } from '../../types';

interface ClimateExposureSummaryCardProps {
  exposure: ClimateRiskDetails['exposureSummary'];
}

export default function ClimateExposureSummaryCard({ exposure }: ClimateExposureSummaryCardProps) {
  const formatCurrency = (value: number) => `₹${value.toFixed(2)} Cr`;
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Exposure Summary</h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Gross Exposure</p>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(exposure.grossExposure)}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">% of Total Exposure</p>
          <p className="text-3xl font-bold text-purple-600">{formatPercentage(exposure.percentOfTotalExposure)}</p>
        </div>
      </div>
    </div>
  );
}
