import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { SectorBenchmarkRow } from '../../types';
import { useFilterStore } from '../../stores/filterStore';
import ChartActionDropdown from '../ChartActionDropdown';

interface SectorBenchmarkingTableProps {
  data: SectorBenchmarkRow[];
  title: string;
  description?: string;
  kpiId: string;
}

interface DropdownState {
  visible: boolean;
  x: number;
  y: number;
  filterData: {
    field: string;
    value: string;
    label: string;
    source: string;
  } | null;
}

export default function SectorBenchmarkingTable({
  data,
  title,
  description,
  kpiId,
}: SectorBenchmarkingTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const setDrillDownFilter = useFilterStore((state) => state.setDrillDownFilter);
  const addPageFilter = useFilterStore((state) => state.addPageFilter);
  const [dropdownState, setDropdownState] = useState<DropdownState>({
    visible: false,
    x: 0,
    y: 0,
    filterData: null,
  });

  const handleRowClick = (row: SectorBenchmarkRow, event: React.MouseEvent) => {
    // Show dropdown at mouse position
    setDropdownState({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      filterData: {
        field: 'industry',
        value: row.sector,
        label: `Sector: ${row.sector}`,
        source: `KPI Drilldown - ${kpiId} - ${title}`,
      },
    });
  };

  const handleDropdownSelect = (optionId: string) => {
    if (!dropdownState.filterData) return;

    if (optionId === 'counterparties') {
      // Navigate to portfolio with drilldown filter
      setDrillDownFilter(dropdownState.filterData);
      navigate('/customer');
    } else if (optionId === 'apply-filter') {
      // Apply filter to current page
      addPageFilter(location.pathname, {
        field: dropdownState.filterData.field,
        value: dropdownState.filterData.value,
        label: dropdownState.filterData.label,
        source: dropdownState.filterData.source,
      });
    }

    // Close dropdown
    setDropdownState({ visible: false, x: 0, y: 0, filterData: null });
  };

  const handleDropdownClose = () => {
    setDropdownState({ visible: false, x: 0, y: 0, filterData: null });
  };

  const getGapColor = (gap: number) => {
    if (gap > 3) return 'text-red-600 font-bold';
    if (gap > 1.5) return 'text-orange-600 font-semibold';
    if (gap < 0) return 'text-green-600 font-semibold';
    return 'text-gray-700';
  };

  const getSentimentBadgeStyle = (sentiment: 'negative' | 'neutral' | 'positive') => {
    switch (sentiment) {
      case 'negative':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'positive':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-oracle-border">
      {/* Header */}
      <div className="p-6 border-b border-oracle-border">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sector
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bank CMI
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                CRISIL/ICRA Index
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Gap
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Concentration
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sentiment & Outlook
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={(e) => handleRowClick(row, e)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.sector}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                  {row.bankCMI.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                  {row.crisilIndex.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={getGapColor(row.gap)}>
                    {row.gap > 0 ? '+' : ''}
                    {row.gap.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                  {row.concentration}%
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentBadgeStyle(
                        row.sentiment
                      )}`}
                    >
                      {row.sentimentText}
                    </span>
                    <span className="text-xs text-gray-500">
                      {row.outlookDescription}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Click on any sector to view related counterparties or apply filters
        </p>
      </div>

      {/* Dropdown for filtering */}
      {dropdownState.visible && (
        <ChartActionDropdown
          position={{ x: dropdownState.x, y: dropdownState.y }}
          onSelect={handleDropdownSelect}
          onClose={handleDropdownClose}
        />
      )}
    </div>
  );
}
