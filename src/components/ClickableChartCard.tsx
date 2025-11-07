import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { KPIChart } from '../types';
import { useFilterStore } from '../stores/filterStore';
import ChartActionDropdown from './ChartActionDropdown';
import ChartTypeSwitcher, { type ChartDisplayType } from './ChartTypeSwitcher';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

interface ClickableChartCardProps {
  chart: KPIChart;
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

/**
 * Check if a chart is eligible for type switching (bar <-> pie)
 * Both bar and pie charts with categorical data (non-time-series) are eligible
 */
function isChartTypeToggleable(chart: KPIChart): boolean {
  // Allow both bar AND pie charts to be toggled
  if (chart.type !== 'bar' && chart.type !== 'pie') return false;

  // Exclude time-series charts (they have time-based x-axis)
  const timeKeywords = ['month', 'date', 'vintage', 'period', 'year', 'quarter'];
  const xAxisKey = chart.xAxisKey || 'label';
  const hasTimeAxis = timeKeywords.some(keyword =>
    xAxisKey.toLowerCase().includes(keyword)
  );

  return !hasTimeAxis;
}

/**
 * Convert bar chart data to pie chart format
 * Handles both single-metric and multi-metric datasets
 */
function convertBarDataToPieData(
  data: any[],
  selectedMetricKey: string
): any[] {
  // Filter out invalid data
  const validData = data.filter(item =>
    item[selectedMetricKey] != null &&
    item[selectedMetricKey] > 0
  );

  // Calculate total for percentage
  const total = validData.reduce((sum, item) => sum + item[selectedMetricKey], 0);

  // Transform to pie format
  return validData.map(item => ({
    label: item.label || item.name || 'Unknown',
    value: item[selectedMetricKey],
    percentage: total > 0 ? Math.round((item[selectedMetricKey] / total) * 100) : 0,
  }));
}

/**
 * Convert pie chart data to bar chart format
 * Allows switching from pie back to bar view
 */
function convertPieDataToBarData(pieData: any[]): any[] {
  // Pie data already has label and value, just ensure it matches bar format
  return pieData.map(item => ({
    label: item.label || item.name || 'Unknown',
    value: item.value,
    // Preserve any other fields
    ...item
  }));
}

export default function ClickableChartCard({ chart, kpiId }: ClickableChartCardProps) {
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

  // State for chart type with localStorage persistence
  const [displayType, setDisplayType] = useState<ChartDisplayType>(() => {
    // Only load from localStorage if chart is toggleable
    if (!isChartTypeToggleable(chart)) return chart.type as ChartDisplayType;

    const saved = localStorage.getItem(`chart-type-${chart.id}`);
    return (saved === 'pie' || saved === 'bar') ? saved : chart.type as ChartDisplayType;
  });

  // State for selected metric (for multi-metric charts in pie mode)
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>(
    chart.dataKeys[0]?.key || 'value'
  );

  // Determine if this chart can be toggled
  const canToggleType = useMemo(() => isChartTypeToggleable(chart), [chart]);

  // Check if this is a multi-metric chart
  const isMultiMetric = useMemo(() => chart.dataKeys.length > 1, [chart.dataKeys]);

  // Handle chart type change
  const handleTypeChange = (newType: ChartDisplayType) => {
    setDisplayType(newType);
    localStorage.setItem(`chart-type-${chart.id}`, newType);
  };

  const handleChartClick = (data: any, event: any) => {
    // Don't show dropdown if clicking on "No Data" placeholder or empty data
    if (!data || !data.label || data.label === 'No Data' || data.value === 0) {
      return;
    }

    // Create filter label by replacing {value} placeholder with actual value
    const filterLabel = chart.filterLabel.replace('{value}', data.label);

    // Show dropdown at mouse position
    setDropdownState({
      visible: true,
      x: event.clientX || 0,
      y: event.clientY || 0,
      filterData: {
        field: chart.filterField,
        value: data.label,
        label: filterLabel,
        source: `KPI Drilldown - ${kpiId} - ${chart.title}`,
      },
    });
  };

  const handleDropdownSelect = (optionId: string) => {
    if (!dropdownState.filterData) return;

    if (optionId === 'counterparties') {
      // Navigate to portfolio with drilldown filter (current behavior)
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

  const renderChart = () => {
    // If displaying as pie (either original pie or converted from bar)
    if (displayType === 'pie') {
      // For original pie charts or converted bar charts
      const pieData = chart.type === 'pie'
        ? chart.data
        : convertBarDataToPieData(chart.data, selectedMetricKey);

      return (
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ label, percentage }) => `${label} (${percentage}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            onClick={(data, _index, event) => handleChartClick(data, event)}
            cursor="pointer"
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => value ? `$${(value / 1000000).toFixed(2)}M` : '0'} />
        </PieChart>
      );
    }

    // If displaying as bar (either original bar or converted from pie)
    if (displayType === 'bar') {
      // For original bar charts or converted pie charts
      const barData = chart.type === 'bar'
        ? chart.data
        : convertPieDataToBarData(chart.data);

      // For converted pie charts, use 'value' as the data key
      const barDataKeys = chart.type === 'bar'
        ? chart.dataKeys
        : [{ key: 'value', name: 'Value', color: CHART_COLORS[0] }];

      return (
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={chart.xAxisKey || 'label'} stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip formatter={(value: number) => typeof value === 'number' ? value.toFixed(2) : value} />
          <Legend />
          {barDataKeys.map((dataKey, index) => (
            <Bar
              key={dataKey.key}
              dataKey={dataKey.key}
              name={dataKey.name}
              fill={dataKey.color || CHART_COLORS[index % CHART_COLORS.length]}
              onClick={(data, _index, event) => handleChartClick(data, event)}
              cursor="pointer"
            />
          ))}
        </BarChart>
      );
    }

    // Render line charts (no conversion)
    if (chart.type === 'line') {
      return (
        <LineChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={chart.xAxisKey || 'label'} stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip formatter={(value: number) => typeof value === 'number' ? value.toFixed(2) : value} />
          <Legend />
          {chart.dataKeys.map((dataKey, index) => (
            <Line
              key={dataKey.key}
              type="monotone"
              dataKey={dataKey.key}
              name={dataKey.name}
              stroke={dataKey.color || CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2}
              onClick={((data: any, _index: number, event: React.MouseEvent) => handleChartClick(data, event)) as any}
              cursor="pointer"
            />
          ))}
        </LineChart>
      );
    }

    // Render area charts (no conversion)
    if (chart.type === 'area') {
      return (
        <AreaChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={chart.xAxisKey || 'label'} stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip formatter={(value: number) => typeof value === 'number' ? value.toFixed(2) : value} />
          <Legend />
          {chart.dataKeys.map((dataKey, index) => (
            <Area
              key={dataKey.key}
              type="monotone"
              dataKey={dataKey.key}
              name={dataKey.name}
              stroke={dataKey.color || CHART_COLORS[index % CHART_COLORS.length]}
              fill={dataKey.color || CHART_COLORS[index % CHART_COLORS.length]}
              fillOpacity={0.6}
              onClick={((data: any, _index: number, event: React.MouseEvent) => handleChartClick(data, event)) as any}
              cursor="pointer"
            />
          ))}
        </AreaChart>
      );
    }

    // Default fallback
    return <div className="flex items-center justify-center h-full text-gray-500">Chart type not supported</div>;
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
        {/* Chart Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
              {chart.description && (
                <p className="text-sm text-gray-600 mt-1">{chart.description}</p>
              )}
            </div>

            {/* Chart Type Switcher - Only show for toggleable bar charts */}
            {canToggleType && (
              <div className="flex-shrink-0">
                <ChartTypeSwitcher
                  currentType={displayType}
                  onTypeChange={handleTypeChange}
                />
              </div>
            )}
          </div>

          {/* Metric Selector - Only show for multi-metric charts in pie mode */}
          {canToggleType && displayType === 'pie' && isMultiMetric && (
            <div className="mt-3">
              <label className="text-xs text-gray-600 mr-2">Show:</label>
              <select
                value={selectedMetricKey}
                onChange={(e) => setSelectedMetricKey(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-oracle-primary"
              >
                {chart.dataKeys.map((dataKey) => (
                  <option key={dataKey.key} value={dataKey.key}>
                    {dataKey.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Chart Container */}
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>

        {/* Clickable Indicator */}
        <p className="text-xs text-gray-500 mt-3 text-center italic">
          💡 Click on chart elements for more options
        </p>
      </div>
    </>
  );
}
