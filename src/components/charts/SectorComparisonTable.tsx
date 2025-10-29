import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { SectorComparisonData } from '../../types';
import { useFilterStore } from '../../stores/filterStore';
import ChartActionDropdown from '../ChartActionDropdown';

interface SectorComparisonTableProps {
  data: SectorComparisonData[];
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

export default function SectorComparisonTable({
  data,
  title,
  description,
  kpiId,
}: SectorComparisonTableProps) {
  console.log('🏢 SectorComparisonTable MOUNTED', {
    title,
    dataType: typeof data,
    isArray: Array.isArray(data),
    dataLength: data?.length,
    dataTruthy: !!data,
    dataPreview: data?.slice(0, 2),
    fullData: JSON.stringify(data),
    kpiId
  });

  // Force data to array
  const safeData = Array.isArray(data) ? data : [];
  console.log('🔧 Safe data:', { length: safeData.length, items: safeData });

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

  const handleRowClick = (row: SectorComparisonData, event: React.MouseEvent) => {
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
      navigate('/portfolio');
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
    if (gap > 0) return 'text-amber-600 font-semibold';
    return 'text-green-600 font-semibold';
  };

  const getGapIcon = (gap: number) => {
    if (gap > 0) return <TrendingUp className="w-4 h-4 inline ml-1" />;
    return <TrendingDown className="w-4 h-4 inline ml-1" />;
  };

  return (
    <>
      {/* Chart Action Dropdown */}
      {dropdownState.visible && (
        <ChartActionDropdown
          position={{ x: dropdownState.x, y: dropdownState.y }}
          onSelect={handleDropdownSelect}
          onClose={handleDropdownClose}
        />
      )}

      <div className="bg-white rounded-lg p-6 border-4 border-red-500 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto" style={{ minHeight: '200px', background: 'lightblue' }}>
          <table
            className="w-full border-collapse"
            style={{
              display: 'table',
              visibility: 'visible',
              tableLayout: 'auto',
              width: '100%'
            }}
          >
            <thead style={{ display: 'table-header-group', visibility: 'visible' }}>
              <tr className="bg-gray-100 border-b-2 border-gray-300" style={{ display: 'table-row', visibility: 'visible' }}>
                <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Sector</th>
                <th className="text-center px-4 py-3 text-sm font-bold text-gray-700">Bank CMI</th>
                <th className="text-center px-4 py-3 text-sm font-bold text-gray-700">CRISIL/ICRA Index</th>
                <th className="text-center px-4 py-3 text-sm font-bold text-gray-700">Gap</th>
                <th className="text-center px-4 py-3 text-sm font-bold text-gray-700">Concentration</th>
                <th className="text-center px-4 py-3 text-sm font-bold text-gray-700">Sentiment & Outlook</th>
                <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Commentary</th>
              </tr>
            </thead>
            <tbody style={{ display: 'table-row-group', visibility: 'visible', background: 'lightyellow' }}>
              {safeData.length > 0 ? (
                safeData.map((row) => {
                  console.log('📝 Rendering row:', row.sector);
                  return (
                  <tr
                    key={row.sector}
                    onClick={(e) => handleRowClick(row, e)}
                    className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                    style={{ display: 'table-row', visibility: 'visible', minHeight: '50px' }}
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900" style={{ display: 'table-cell', visibility: 'visible', fontSize: '18px', color: 'black', fontWeight: 'bold' }}>{row.sector}</td>
                    <td className="px-4 py-3 text-sm text-center font-medium">{row.bankCMI.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-center font-medium">{row.crisilIndex.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-sm text-center ${getGapColor(row.gap)}`}>
                      {row.gap > 0 ? '+' : ''}{row.gap.toFixed(2)}
                      {getGapIcon(row.gap)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-medium">{row.concentration.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{row.sentimentIcon}</span>
                        <span className="text-xs text-gray-600 italic">{row.outlook}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.commentary}</td>
                  </tr>
                  );
                })
              ) : (
                <>
                  {console.log('⚠️ NO DATA - Showing fallback')}
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center">
                      <div className="text-2xl font-bold text-red-600 bg-yellow-100 p-4">
                        NO DATA AVAILABLE - safeData.length = {safeData.length}
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Clickable Indicator */}
        <p className="text-xs text-gray-500 mt-3 text-center italic">
          💡 Click on rows for more options
        </p>
      </div>
    </>
  );
}
