import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { ClimateRiskDetails } from '../../types';

interface PeerComparisonTableProps {
  peers: ClimateRiskDetails['peerComparison'];
}

type SortField = keyof ClimateRiskDetails['peerComparison'][0];
type SortDirection = 'asc' | 'desc';

export default function PeerComparisonTable({ peers }: PeerComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField>('obligor');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPeers = [...peers].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Peer Comparison Table</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-oracle-bgAlt">
            <tr>
              <th
                onClick={() => handleSort('obligor')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 sticky left-0 bg-gray-50 z-10"
              >
                <div className="flex items-center gap-1">
                  Obligor
                  <SortIcon field="obligor" />
                </div>
              </th>
              <th
                onClick={() => handleSort('group')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Group
                  <SortIcon field="group" />
                </div>
              </th>
              <th
                onClick={() => handleSort('orgStructure')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Org Structure
                  <SortIcon field="orgStructure" />
                </div>
              </th>
              <th
                onClick={() => handleSort('counterpartCountry')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Counterpart Country
                  <SortIcon field="counterpartCountry" />
                </div>
              </th>
              <th
                onClick={() => handleSort('counterpartyIndustry')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Counterparty Industry
                  <SortIcon field="counterpartyIndustry" />
                </div>
              </th>
              <th
                onClick={() => handleSort('creditStatus')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Credit Status
                  <SortIcon field="creditStatus" />
                </div>
              </th>
              <th
                onClick={() => handleSort('baselRating')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Basel Rating
                  <SortIcon field="baselRating" />
                </div>
              </th>
              <th
                onClick={() => handleSort('grossExposure')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Gross Exposure
                  <SortIcon field="grossExposure" />
                </div>
              </th>
              <th
                onClick={() => handleSort('totalEmissions')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Total Emissions
                  <SortIcon field="totalEmissions" />
                </div>
              </th>
              <th
                onClick={() => handleSort('financedEmissions')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Financed Emissions
                  <SortIcon field="financedEmissions" />
                </div>
              </th>
              <th
                onClick={() => handleSort('emissionsIntensity')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Emissions Intensity
                  <SortIcon field="emissionsIntensity" />
                </div>
              </th>
              <th
                onClick={() => handleSort('climateRiskScore')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Climate Risk Score
                  <SortIcon field="climateRiskScore" />
                </div>
              </th>
              <th
                onClick={() => handleSort('climateRiskRating')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Climate Risk Rating
                  <SortIcon field="climateRiskRating" />
                </div>
              </th>
              <th
                onClick={() => handleSort('ratingReference')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Rating Reference
                  <SortIcon field="ratingReference" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPeers.map((peer, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-3 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                  {peer.obligor}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{peer.group}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{peer.orgStructure}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{peer.counterpartCountry}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{peer.counterpartyIndustry}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      peer.creditStatus === 'Standard'
                        ? 'bg-green-100 text-green-800'
                        : peer.creditStatus === 'Watchlist'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {peer.creditStatus}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{peer.baselRating}</td>
                <td className="px-3 py-3 text-sm font-medium text-gray-900">
                  {formatCurrency(peer.grossExposure)}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{peer.totalEmissions}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{peer.financedEmissions}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{peer.emissionsIntensity}</td>
                <td className="px-3 py-3 text-sm font-bold text-blue-600">
                  {peer.climateRiskScore.toFixed(1)}
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {peer.climateRiskRating}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      peer.ratingReference === 'Positive'
                        ? 'bg-green-100 text-green-800'
                        : peer.ratingReference === 'Negative'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {peer.ratingReference}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
