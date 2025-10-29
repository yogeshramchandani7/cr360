import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { HeatmapCellData } from '../../types';
import { useFilterStore } from '../../stores/filterStore';
import ChartActionDropdown from '../ChartActionDropdown';

interface DeteriorationHeatmapProps {
  data: HeatmapCellData[];
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

type Dimension = 'sector' | 'region' | 'product';

export default function DeteriorationHeatmap({
  data,
  title,
  description,
  kpiId,
}: DeteriorationHeatmapProps) {
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

  // Allow users to select which dimensions to show
  const [rowDimension, setRowDimension] = useState<Dimension>('sector');
  const [colDimension, setColDimension] = useState<Dimension>('region');

  // Organize data into a grid
  const { rows, cols, grid } = useMemo(() => {
    const rowsSet = new Set<string>();
    const colsSet = new Set<string>();
    const gridMap = new Map<string, HeatmapCellData>();

    data.forEach((cell) => {
      const rowKey = cell[rowDimension];
      const colKey = cell[colDimension];
      rowsSet.add(rowKey);
      colsSet.add(colKey);
      gridMap.set(`${rowKey}|${colKey}`, cell);
    });

    return {
      rows: Array.from(rowsSet).sort(),
      cols: Array.from(colsSet).sort(),
      grid: gridMap,
    };
  }, [data, rowDimension, colDimension]);

  const handleCellClick = (cell: HeatmapCellData, event: React.MouseEvent) => {
    // Show dropdown at mouse position
    setDropdownState({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      filterData: {
        field: rowDimension === 'sector' ? 'industry' : rowDimension === 'region' ? 'region' : 'productType',
        value: cell[rowDimension],
        label: `${rowDimension.charAt(0).toUpperCase() + rowDimension.slice(1)}: ${cell[rowDimension]}`,
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

  const getCellStyle = (cell: HeatmapCellData | undefined) => {
    if (!cell) return { backgroundColor: '#f9fafb', color: '#9ca3af' };
    return {
      backgroundColor: cell.color,
      color: '#ffffff',
      fontWeight: 'bold' as const,
    };
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

      <div className="bg-white rounded-lg p-6 border border-oracle-border hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>

        {/* Dimension Selectors */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Rows:</label>
            <select
              value={rowDimension}
              onChange={(e) => setRowDimension(e.target.value as Dimension)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="sector">Sector</option>
              <option value="region">Region</option>
              <option value="product">Product</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Columns:</label>
            <select
              value={colDimension}
              onChange={(e) => setColDimension(e.target.value as Dimension)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="sector">Sector</option>
              <option value="region">Region</option>
              <option value="product">Product</option>
            </select>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700 sticky left-0 z-10">
                  {rowDimension.charAt(0).toUpperCase() + rowDimension.slice(1)}
                </th>
                {cols.map((col) => (
                  <th
                    key={col}
                    className="border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700 text-center min-w-[100px]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  <td className="border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 sticky left-0 z-10">
                    {row}
                  </td>
                  {cols.map((col) => {
                    const cell = grid.get(`${row}|${col}`);
                    return (
                      <td
                        key={`${row}|${col}`}
                        className="border border-gray-300 px-3 py-2 text-center cursor-pointer hover:opacity-80 transition-opacity"
                        style={getCellStyle(cell)}
                        onClick={(e) => cell && handleCellClick(cell, e)}
                      >
                        {cell ? (
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold">{cell.deteriorationRate.toFixed(2)}%</span>
                            <span className="text-xs opacity-90">${(cell.exposure / 1000000).toFixed(2)}M</span>
                          </div>
                        ) : (
                          <span className="text-xs">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <span className="font-medium text-gray-700">Deterioration Rate:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-gray-600">&lt; 5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
            <span className="text-gray-600">5-8%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-gray-600">8-12%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-gray-600">&gt; 12%</span>
          </div>
        </div>

        {/* Clickable Indicator */}
        <p className="text-xs text-gray-500 mt-3 text-center italic">
          💡 Click on cells for more options
        </p>
      </div>
    </>
  );
}
