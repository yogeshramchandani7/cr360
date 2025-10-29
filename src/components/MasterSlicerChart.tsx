import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import type { PortfolioCompany } from '../lib/mockData';
import {
  aggregateByDimension,
  formatMetricValue,
  getMetricLabel,
  getDimensionConfig,
  type DimensionKey,
  type MetricType,
  type ChartType,
} from '../lib/masterSlicerUtils';
import { useFilterStore } from '../stores/filterStore';
import DimensionDropdown from './DimensionDropdown';
import ChartActionDropdown from './ChartActionDropdown';

/**
 * MasterSlicerChart Component
 *
 * A flexible, reusable chart component that can dynamically switch between
 * dimensions (Region, Segment, Product Type, Party Type, State) and
 * chart types (Bar, Pie).
 *
 * Features:
 * - Chart Type Dropdown (Bar/Pie)
 * - Dimension Dropdown with hover preview
 * - Context-specific metrics (exposure, count, NPA, delinquency)
 * - Click-to-filter integration
 * - Responsive design
 */

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

interface MasterSlicerChartProps {
  data: PortfolioCompany[];
  title?: string;
  description?: string;
  defaultChartType?: ChartType;
  defaultDimension?: DimensionKey;
  metricType: MetricType;
  source?: string;
  kpiId?: string;
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

export default function MasterSlicerChart({
  data,
  title,
  description,
  defaultChartType = 'bar',
  defaultDimension = 'region',
  metricType,
  source = 'Master Slicer Chart',
  kpiId = '',
}: MasterSlicerChartProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const setDrillDownFilter = useFilterStore((state) => state.setDrillDownFilter);
  const addPageFilter = useFilterStore((state) => state.addPageFilter);

  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [dimension, setDimension] = useState<DimensionKey>(defaultDimension);
  const [dropdownState, setDropdownState] = useState<DropdownState>({
    visible: false,
    x: 0,
    y: 0,
    filterData: null,
  });

  // Get dimension configuration
  const dimensionConfig = getDimensionConfig(dimension);

  // Aggregate data by selected dimension
  const chartData = useMemo(() => {
    return aggregateByDimension(data, dimension, metricType);
  }, [data, dimension, metricType]);

  // Generate dynamic title if not provided
  const chartTitle = title || `${getMetricLabel(metricType)} by ${dimensionConfig.label}`;
  const chartDescription =
    description ||
    `Distribution of ${getMetricLabel(metricType).toLowerCase()} across ${dimensionConfig.label.toLowerCase()}`;

  // Handle chart click - show dropdown menu
  const handleChartClick = (data: any, event: any) => {
    // Don't show dropdown if clicking on "No Data" placeholder or empty data
    if (!data || !data.label || data.label === 'No Data' || data.value === 0) {
      return;
    }

    // Create filter label by replacing {value} placeholder
    const filterLabel = dimensionConfig.filterLabel.replace('{value}', data.label);

    // Show dropdown at mouse position
    setDropdownState({
      visible: true,
      x: event.clientX || 0,
      y: event.clientY || 0,
      filterData: {
        field: dimension,
        value: data.label,
        label: filterLabel,
        source: `${source} - ${chartTitle}`,
      },
    });
  };

  // Handle dropdown selection
  const handleDropdownSelect = (optionId: string) => {
    if (!dropdownState.filterData) return;

    if (optionId === 'counterparties') {
      // Navigate to portfolio view with drilldown filter
      setDrillDownFilter(dropdownState.filterData);
      navigate('/portfolio');
    } else if (optionId === 'apply-filter') {
      // Apply filter to current page
      addPageFilter(location.pathname, {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        field: dropdownState.filterData.field,
        value: dropdownState.filterData.value,
        label: dropdownState.filterData.label,
        source: dropdownState.filterData.source,
        timestamp: Date.now(),
      });
    }

    setDropdownState({ visible: false, x: 0, y: 0, filterData: null });
  };

  // Handle dropdown close
  const handleDropdownClose = () => {
    setDropdownState({ visible: false, x: 0, y: 0, filterData: null });
  };

  // Render chart based on selected type
  const renderChart = () => {
    if (chartType === 'pie') {
      return (
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ label, percentage }) => `${label} (${percentage}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            onClick={(data, _index, event) => handleChartClick(data, event)}
            cursor="pointer"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatMetricValue(value, metricType)}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
          />
        </PieChart>
      );
    }

    // Bar Chart
    return (
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" stroke="#6b7280" />
        <YAxis stroke="#6b7280" tickFormatter={(value) => formatMetricValue(value, metricType)} />
        <Tooltip
          formatter={(value: number) => formatMetricValue(value, metricType)}
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
        />
        <Bar
          dataKey="value"
          fill="#3b82f6"
          onClick={(data, _index, event) => handleChartClick(data, event)}
          cursor="pointer"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    );
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

      {/* Main Chart Card */}
      <div className="bg-white rounded-lg border border-oracle-border shadow-sm p-6">
        {/* Header with Title and Controls */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{chartTitle}</h3>
            <p className="text-sm text-gray-600">{chartDescription}</p>
          </div>

          {/* Control Dropdowns */}
          <div className="flex items-center gap-3 ml-4">
            {/* Chart Type Dropdown */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  chartType === 'bar'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Bar Chart"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Bar</span>
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  chartType === 'pie'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Pie Chart"
              >
                <PieChartIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Pie</span>
              </button>
            </div>

            {/* Dimension Dropdown */}
            <DimensionDropdown value={dimension} onChange={setDimension} />
          </div>
        </div>

        {/* Chart Container */}
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>

        {/* Footer Hint */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            💡 Click on chart elements for more options
          </p>
        </div>
      </div>
    </>
  );
}
