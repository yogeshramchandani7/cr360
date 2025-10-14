import type { ClimateRiskDetails } from '../../types';

interface PeerComparisonDimensionsTableProps {
  dimensions: ClimateRiskDetails['peerComparisonDimensions'];
}

export default function PeerComparisonDimensionsTable({ dimensions }: PeerComparisonDimensionsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions for Grouping</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Industry Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Obligor Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Class
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exposure Band
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Geography
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Org Structure
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{dimensions.industryType}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{dimensions.obligorType}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{dimensions.assetClass}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{dimensions.exposureBand}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{dimensions.creditRating}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{dimensions.geography}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{dimensions.creditScore}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{dimensions.orgStructure}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
