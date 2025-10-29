import { useState } from 'react';
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

  const renderChart = () => {
    switch (chart.type) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chart.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ label, percentage }) => `${label} (${percentage}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey={chart.dataKeys[0].key}
              onClick={(data, _index, event) => handleChartClick(data, event)}
              cursor="pointer"
            >
              {chart.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => value ? `$${(value / 1000000).toFixed(2)}M` : '0'} />
          </PieChart>
        );

      case 'bar':
        return (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={chart.xAxisKey || 'label'} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip formatter={(value: number) => typeof value === 'number' ? value.toFixed(2) : value} />
            <Legend />
            {chart.dataKeys.map((dataKey, index) => (
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

      case 'line':
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

      case 'area':
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

      default:
        return <div className="flex items-center justify-center h-full text-gray-500">Chart type not supported</div>;
    }
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
          <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
          {chart.description && (
            <p className="text-sm text-gray-600 mt-1">{chart.description}</p>
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
