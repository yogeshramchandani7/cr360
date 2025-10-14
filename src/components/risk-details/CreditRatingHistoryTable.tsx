import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { RiskDetails } from '../../types';

interface CreditRatingHistoryTableProps {
  history: RiskDetails['creditRatingHistory'];
}

type SortField = 'date' | 'ratingType' | 'ratingSource' | 'creditRating' | 'creditOutlook';
type SortDirection = 'asc' | 'desc';

export default function CreditRatingHistoryTable({ history }: CreditRatingHistoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedHistory = [...history].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortField === 'date') {
      return sortDirection === 'asc'
        ? new Date(aVal).getTime() - new Date(bVal).getTime()
        : new Date(bVal).getTime() - new Date(aVal).getTime();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Rating History</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon field="date" />
                </div>
              </th>
              <th
                onClick={() => handleSort('ratingType')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Rating Type
                  <SortIcon field="ratingType" />
                </div>
              </th>
              <th
                onClick={() => handleSort('ratingSource')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Rating Source
                  <SortIcon field="ratingSource" />
                </div>
              </th>
              <th
                onClick={() => handleSort('creditRating')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Credit Rating
                  <SortIcon field="creditRating" />
                </div>
              </th>
              <th
                onClick={() => handleSort('creditOutlook')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Credit Outlook
                  <SortIcon field="creditOutlook" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedHistory.map((entry, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {new Date(entry.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.ratingType}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.ratingSource}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {entry.creditRating}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.creditOutlook}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
