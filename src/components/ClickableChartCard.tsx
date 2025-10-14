import { useNavigate } from 'react-router-dom';
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

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

interface ClickableChartCardProps {
  chart: KPIChart;
  kpiId: string;
}

export default function ClickableChartCard({ chart, kpiId }: ClickableChartCardProps) {
  const navigate = useNavigate();
  const setDrillDownFilter = useFilterStore((state) => state.setDrillDownFilter);

  const handleChartClick = (data: any) => {
    // Don't navigate if clicking on "No Data" placeholder or empty data
    if (!data || !data.label || data.label === 'No Data' || data.value === 0) {
      return;
    }

    // Create filter label by replacing {value} placeholder with actual value
    const filterLabel = chart.filterLabel.replace('{value}', data.label);

    // Set the drilldown filter
    setDrillDownFilter({
      field: chart.filterField,
      value: data.label,
      label: filterLabel,
      source: `KPI Drilldown - ${kpiId} - ${chart.title}`,
    });

    // Navigate to portfolio view
    navigate('/portfolio');
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
              onClick={handleChartClick}
              cursor="pointer"
            >
              {chart.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => value ? `$${(value / 1000000).toFixed(1)}M` : '0'} />
          </PieChart>
        );

      case 'bar':
        return (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={chart.xAxisKey || 'label'} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            {chart.dataKeys.map((dataKey, index) => (
              <Bar
                key={dataKey.key}
                dataKey={dataKey.key}
                name={dataKey.name}
                fill={dataKey.color || CHART_COLORS[index % CHART_COLORS.length]}
                onClick={handleChartClick}
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
            <Tooltip />
            <Legend />
            {chart.dataKeys.map((dataKey, index) => (
              <Line
                key={dataKey.key}
                type="monotone"
                dataKey={dataKey.key}
                name={dataKey.name}
                stroke={dataKey.color || CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
                onClick={handleChartClick}
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
            <Tooltip />
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
                onClick={handleChartClick}
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
        💡 Click on chart elements to view companies in Portfolio
      </p>
    </div>
  );
}
