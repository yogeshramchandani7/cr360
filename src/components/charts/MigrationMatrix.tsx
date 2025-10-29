import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import type { MigrationMatrixData } from '../../types';
import { useFilterStore } from '../../stores/filterStore';
import ChartActionDropdown from '../ChartActionDropdown';

interface MigrationMatrixProps {
  data: MigrationMatrixData[];
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

export default function MigrationMatrix({
  data,
  title,
  description,
  kpiId,
}: MigrationMatrixProps) {
  console.log('📊 MigrationMatrix MOUNTED', {
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

  const handleRowClick = (row: MigrationMatrixData, event: React.MouseEvent) => {
    // Extract the actual value from the attribute (e.g., "Segment: CORPORATE" -> "CORPORATE")
    const value = row.attribute.split(': ')[1];

    // Map attribute type to filter field
    const fieldMap: Record<string, string> = {
      segment: 'segment',
      industry: 'industry',
      rating: 'borrowerExternalRating',
      region: 'region',
    };

    setDropdownState({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      filterData: {
        field: fieldMap[row.attributeType] || row.attributeType,
        value,
        label: row.attribute,
        source: `KPI Drilldown - ${kpiId} - ${title}`,
      },
    });
  };

  const handleDropdownSelect = (optionId: string) => {
    if (!dropdownState.filterData) return;

    if (optionId === 'counterparties') {
      setDrillDownFilter(dropdownState.filterData);
      navigate('/portfolio');
    } else if (optionId === 'apply-filter') {
      addPageFilter(location.pathname, {
        field: dropdownState.filterData.field,
        value: dropdownState.filterData.value,
        label: dropdownState.filterData.label,
        source: dropdownState.filterData.source,
      });
    }

    setDropdownState({ visible: false, x: 0, y: 0, filterData: null });
  };

  const handleDropdownClose = () => {
    setDropdownState({ visible: false, x: 0, y: 0, filterData: null });
  };

  const getSeverityColor = (percentage: number) => {
    if (percentage > 15) return 'bg-red-100 text-red-700 font-bold';
    if (percentage > 10) return 'bg-orange-100 text-orange-700 font-semibold';
    if (percentage > 5) return 'bg-amber-100 text-amber-700 font-medium';
    return 'bg-green-100 text-green-700';
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

      <div className="bg-white rounded-lg p-6 border-4 border-blue-500 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>

        {/* Migration Matrix Table */}
        <div className="overflow-x-auto" style={{ minHeight: '200px', background: 'lightgreen' }}>
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
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Attribute</th>
                <th className="text-center px-4 py-3 text-sm font-bold text-gray-700">Total Exposure</th>
                <th className="text-center px-4 py-3 text-sm font-bold text-gray-700 bg-amber-50" colSpan={3}>
                  Downgrade Ladder
                </th>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-300">
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-600"></th>
                <th className="text-center px-4 py-2 text-xs font-medium text-gray-600"></th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50">
                  ≥1 Notch
                </th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-orange-700 bg-orange-50">
                  ≥2 Notches
                </th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-red-700 bg-red-50">
                  ≥3 Notches
                </th>
              </tr>
            </thead>
            <tbody style={{ display: 'table-row-group', visibility: 'visible', background: 'lightpink' }}>
              {safeData.length > 0 ? (
                safeData.map((row) => {
                  console.log('📝 Rendering row:', row.attribute);
                  return (
                  <tr
                    key={row.attribute}
                    onClick={(e) => handleRowClick(row, e)}
                    className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                    style={{ display: 'table-row', visibility: 'visible', minHeight: '50px' }}
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900" style={{ display: 'table-cell', visibility: 'visible', fontSize: '18px', color: 'black', fontWeight: 'bold' }}>{row.attribute}</td>
                    <td className="px-4 py-3 text-sm text-center font-medium">
                      ${(row.totalExposure / 1000).toFixed(2)}B
                    </td>
                    <td className="px-4 py-3 text-sm text-center bg-amber-50">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(row.downgrade1Notch.percentage)}`}>
                          {row.downgrade1Notch.percentage}%
                        </span>
                        <span className="text-xs text-gray-600">
                          {row.downgrade1Notch.count} accounts
                        </span>
                        <span className="text-xs text-gray-500">
                          ${(row.downgrade1Notch.exposure / 1000).toFixed(2)}B
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center bg-orange-50">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(row.downgrade2Notch.percentage)}`}>
                          {row.downgrade2Notch.percentage}%
                        </span>
                        <span className="text-xs text-gray-600">
                          {row.downgrade2Notch.count} accounts
                        </span>
                        <span className="text-xs text-gray-500">
                          ${(row.downgrade2Notch.exposure / 1000).toFixed(2)}B
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center bg-red-50">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(row.downgrade3Notch.percentage)}`}>
                          {row.downgrade3Notch.percentage}%
                        </span>
                        <span className="text-xs text-gray-600">
                          {row.downgrade3Notch.count} accounts
                        </span>
                        <span className="text-xs text-gray-500">
                          ${(row.downgrade3Notch.exposure / 1000).toFixed(2)}B
                        </span>
                      </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <>
                  {console.log('⚠️ NO DATA - Showing fallback')}
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center">
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

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-amber-50 rounded p-3 border border-amber-200">
            <div className="text-xs text-amber-700 font-medium">Total ≥1 Notch</div>
            <div className="text-lg font-bold text-amber-900">
              {data.reduce((sum, row) => sum + row.downgrade1Notch.count, 0)} accounts
            </div>
          </div>
          <div className="bg-orange-50 rounded p-3 border border-orange-200">
            <div className="text-xs text-orange-700 font-medium">Total ≥2 Notches</div>
            <div className="text-lg font-bold text-orange-900">
              {data.reduce((sum, row) => sum + row.downgrade2Notch.count, 0)} accounts
            </div>
          </div>
          <div className="bg-red-50 rounded p-3 border border-red-200">
            <div className="text-xs text-red-700 font-medium">Total ≥3 Notches</div>
            <div className="text-lg font-bold text-red-900">
              {data.reduce((sum, row) => sum + row.downgrade3Notch.count, 0)} accounts
            </div>
          </div>
        </div>

        {/* Clickable Indicator */}
        <p className="text-xs text-gray-500 mt-3 text-center italic">
          💡 Click on rows for more options
        </p>
      </div>
    </>
  );
}
