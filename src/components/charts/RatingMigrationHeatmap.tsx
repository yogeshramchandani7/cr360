import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RatingMigrationMatrix } from '../../types';
import type { PortfolioCompany } from '../../lib/mockData';
import { useFilterStore } from '../../stores/filterStore';
import ChartActionDropdown from '../ChartActionDropdown';
import { generateRatingMigrationMatrix } from '../../lib/mockCCOData';

interface RatingMigrationHeatmapProps {
  data: RatingMigrationMatrix;
  title: string;
  description?: string;
  kpiId: string;
  companies?: PortfolioCompany[];
  onRatingTypeChange?: (ratingType: 'external' | 'internal') => void;
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

export default function RatingMigrationHeatmap({
  data: initialData,
  title,
  description,
  kpiId,
  companies,
  onRatingTypeChange,
}: RatingMigrationHeatmapProps) {
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

  const [selectedRatingType, setSelectedRatingType] = useState<'external' | 'internal'>(initialData.ratingType);
  const [currentData, setCurrentData] = useState<RatingMigrationMatrix>(initialData);

  useEffect(() => {
    const newData = generateRatingMigrationMatrix(companies, selectedRatingType);
    setCurrentData(newData);
  }, [selectedRatingType, companies]);

  const getCellColor = (notchChange: number, count: number): string => {
    if (count === 0) return 'bg-gray-50';
    if (notchChange === 0) return 'bg-gray-100';
    if (notchChange > 0) {
      if (notchChange >= 3) return 'bg-green-600 text-white';
      if (notchChange === 2) return 'bg-green-500 text-white';
      return 'bg-green-300';
    }
    if (notchChange <= -3) return 'bg-red-600 text-white';
    if (notchChange === -2) return 'bg-red-500 text-white';
    return 'bg-red-300';
  };

  const handleRatingTypeChange = (newType: 'external' | 'internal') => {
    setSelectedRatingType(newType);
    if (onRatingTypeChange) {
      onRatingTypeChange(newType);
    }
  };

  const handleCellClick = (fromRating: string, toRating: string, event: React.MouseEvent) => {
    setDropdownState({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      filterData: {
        field: selectedRatingType === 'external' ? 'borrowerExternalRating' : 'borrowerInternalRating',
        value: toRating,
        label: `Current Rating: ${toRating}`,
        source: `KPI Drilldown - ${kpiId} - ${title}`,
      },
    });
  };

  const handleDropdownSelect = (optionId: string) => {
    if (!dropdownState.filterData) return;

    if (optionId === 'counterparties') {
      setDrillDownFilter(dropdownState.filterData);
      navigate('/customer');
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

  const formatExposure = (value: number): string => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}B`;
    return `$${value.toFixed(0)}M`;
  };

  return (
    <>
      {dropdownState.visible && dropdownState.filterData && (
        <ChartActionDropdown
          position={{ x: dropdownState.x, y: dropdownState.y }}
          onSelect={handleDropdownSelect}
          onClose={handleDropdownClose}
        />
      )}

      <div className="bg-white rounded-lg p-6 border border-oracle-border hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Rating Type:</label>
            <select
              value={selectedRatingType}
              onChange={(e) => handleRatingTypeChange(e.target.value as 'external' | 'internal')}
              className="px-3 py-1.5 text-sm border border-oracle-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-oracle-red"
            >
              <option value="external">External Rating</option>
              <option value="internal">Internal Rating</option>
            </select>
          </div>
        </div>

        <div className="w-full">
          <table className="border-collapse w-full table-fixed">
            <thead>
              <tr>
                <th className="border border-oracle-border bg-oracle-bg p-2 text-xs font-semibold text-gray-700 w-24">
                  From / To
                </th>
                {currentData.ratings.map((toRating) => (
                  <th
                    key={toRating}
                    className="border border-oracle-border bg-oracle-bg p-2 text-xs font-semibold text-gray-700"
                  >
                    {toRating}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.ratings.map((fromRating) => (
                <tr key={fromRating}>
                  <td className="border border-oracle-border bg-oracle-bg p-2 text-xs font-semibold text-gray-700 w-24">
                    {fromRating}
                  </td>
                  {currentData.ratings.map((toRating) => {
                    const cell = currentData.cells.find(
                      (c) => c.fromRating === fromRating && c.toRating === toRating
                    );

                    if (!cell || cell.count === 0) {
                      return (
                        <td
                          key={toRating}
                          className="border border-oracle-border bg-gray-50 p-2 text-center"
                        >
                          <span className="text-xs text-gray-400">-</span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={toRating}
                        className={`border border-oracle-border p-2 text-center cursor-pointer hover:opacity-80 transition-opacity ${getCellColor(
                          cell.notchChange,
                          cell.count
                        )}`}
                        onClick={(e) => handleCellClick(fromRating, toRating, e)}
                        title={`${cell.count} companies migrated from ${fromRating} to ${toRating}\nTotal Exposure: ${formatExposure(cell.exposure)}`}
                      >
                        <div className="text-xs font-semibold">{cell.count}</div>
                        <div className="text-[10px] mt-0.5">{formatExposure(cell.exposure)}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="bg-white border border-oracle-border rounded-lg p-3">
            <div className="text-xs text-gray-600">Total Companies</div>
            <div className="text-xl font-bold text-gray-900">{currentData.totalCompanies}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {formatExposure(currentData.totalExposure)} exposure
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs text-green-700 font-medium">Upgraded</div>
            <div className="text-xl font-bold text-green-900">{currentData.upgraded.count}</div>
            <div className="text-[10px] text-green-600 mt-0.5">
              {currentData.upgraded.percentage.toFixed(1)}% • {formatExposure(currentData.upgraded.exposure)}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-700 font-medium">Unchanged</div>
            <div className="text-xl font-bold text-gray-900">{currentData.unchanged.count}</div>
            <div className="text-[10px] text-gray-600 mt-0.5">
              {currentData.unchanged.percentage.toFixed(1)}% • {formatExposure(currentData.unchanged.exposure)}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-xs text-red-700 font-medium">Downgraded</div>
            <div className="text-xl font-bold text-red-900">{currentData.downgraded.count}</div>
            <div className="text-[10px] text-red-600 mt-0.5">
              {currentData.downgraded.percentage.toFixed(1)}% • {formatExposure(currentData.downgraded.exposure)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6 text-xs text-gray-600">
          <div className="font-semibold">Color Legend:</div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>Major Upgrade (3+ notches)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <span>Minor Upgrade (1-2 notches)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded border border-gray-300"></div>
            <span>No Change</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-300 rounded"></div>
            <span>Minor Downgrade (1-2 notches)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Major Downgrade (3+ notches)</span>
          </div>
        </div>
      </div>
    </>
  );
}
