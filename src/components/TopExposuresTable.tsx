import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent } from '../lib/utils';

export interface TopExposureRow {
  // Standard fields
  rank: number;
  borrowerName: string;
  accountNumber: string;
  exposureAmount: number;
  percentOfPortfolio: number;
  productType: string;
  region: string;
  riskGrade: string;
  utilization: number;

  // Migration fields (optional)
  previousRating?: string;
  currentRating?: string;
  notchesChanged?: number;
  migrationDate?: string;
  migrationDirection?: 'upgrade' | 'downgrade' | 'stable';

  // Optional NPA/Delinquent fields
  npaAmount?: number;
  delinquentAmount?: number;
}

interface TopExposuresTableProps {
  data: TopExposureRow[];
  title?: string;
  defaultLimit?: 10 | 20 | 50;
  showMigrationColumns?: boolean;
  onRowClick?: (row: TopExposureRow) => void;
  loading?: boolean;
}

export default function TopExposuresTable({
  data,
  title = 'Top Exposures',
  defaultLimit = 20,
  showMigrationColumns = false,
  onRowClick,
  loading = false,
}: TopExposuresTableProps) {
  const navigate = useNavigate();
  const [limit, setLimit] = useState<number>(defaultLimit);

  // Slice data based on limit
  const displayData = data.slice(0, limit);

  const handleCompanyClick = (borrowerName: string) => {
    // Navigate to company profile or search
    navigate(`/portfolio?search=${encodeURIComponent(borrowerName)}`);
  };

  const getRatingBadgeColor = (rating: string) => {
    const firstChar = rating.charAt(0);
    if (firstChar === 'A') return 'bg-green-100 text-green-800';
    if (firstChar === 'B') return 'bg-yellow-100 text-yellow-800';
    if (firstChar === 'C') return 'bg-orange-100 text-orange-800';
    if (firstChar === 'D') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-oracle-border">
      {/* Header with dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm font-medium text-gray-700">
            Show top:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border border-oracle-border rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-oracle-primary focus:border-oracle-primary transition-colors"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-oracle-bgAlt border-b border-oracle-border">
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Rank</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Borrower</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Account</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-900">Exposure</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-900">% of Portfolio</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Product</th>
              <th className="text-center p-3 text-sm font-semibold text-gray-900">Region</th>
              <th className="text-center p-3 text-sm font-semibold text-gray-900">Risk Grade</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-900">Utilization</th>

              {/* Migration columns */}
              {showMigrationColumns && (
                <>
                  <th className="text-center p-3 text-sm font-semibold text-gray-900">Previous Rating</th>
                  <th className="text-center p-3 text-sm font-semibold text-gray-900">Current Rating</th>
                  <th className="text-center p-3 text-sm font-semibold text-gray-900">Notches ↓/↑</th>
                  <th className="text-center p-3 text-sm font-semibold text-gray-900">Migration Date</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={showMigrationColumns ? 13 : 9} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={showMigrationColumns ? 13 : 9} className="p-6 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              displayData.map((row) => (
                <tr
                  key={row.rank}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  <td className="p-3 text-sm font-medium text-gray-900">{row.rank}</td>
                  <td className="p-3 text-sm">
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompanyClick(row.borrowerName);
                      }}
                    >
                      {row.borrowerName}
                    </button>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{row.accountNumber}</td>
                  <td className="p-3 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(row.exposureAmount)}
                  </td>
                  <td className="p-3 text-sm text-right text-gray-900">
                    {formatPercent(row.percentOfPortfolio)}
                  </td>
                  <td className="p-3 text-sm text-gray-900">{row.productType}</td>
                  <td className="p-3 text-sm text-center text-gray-900">{row.region}</td>
                  <td className="p-3 text-sm text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRatingBadgeColor(row.riskGrade)}`}>
                      {row.riskGrade}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-right text-gray-900">
                    {formatPercent(row.utilization)}
                  </td>

                  {/* Migration columns */}
                  {showMigrationColumns && (
                    <>
                      {/* Previous Rating */}
                      <td className="p-3 text-sm text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRatingBadgeColor(row.previousRating || 'N/A')}`}>
                          {row.previousRating || 'N/A'}
                        </span>
                      </td>

                      {/* Current Rating */}
                      <td className="p-3 text-sm text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRatingBadgeColor(row.currentRating || row.riskGrade)}`}>
                          {row.currentRating || row.riskGrade}
                        </span>
                      </td>

                      {/* Notches Changed */}
                      <td className="p-3 text-sm text-center">
                        {row.notchesChanged !== undefined && row.notchesChanged !== 0 ? (
                          row.notchesChanged < 0 ? (
                            <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                              <TrendingDown className="w-4 h-4" />
                              {Math.abs(row.notchesChanged)} ↓
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                              <TrendingUp className="w-4 h-4" />
                              {row.notchesChanged} ↑
                            </span>
                          )
                        ) : (
                          <span className="text-gray-500 text-xs">No change</span>
                        )}
                      </td>

                      {/* Migration Date */}
                      <td className="p-3 text-sm text-center text-gray-600">
                        {row.migrationDate ? new Date(row.migrationDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : '-'}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      {displayData.length > 0 && (
        <p className="text-xs text-gray-500 mt-4">
          Showing {displayData.length} of {data.length} total rows.
          {showMigrationColumns && ' Rating changes highlighted in red (downgrades) and green (upgrades).'}
        </p>
      )}
    </div>
  );
}
