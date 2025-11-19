import { useState } from 'react';
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
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  ComposedChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { EvidenceChart } from '../../types';
import AgentAnalysisKeyHighlight from './AgentAnalysisKeyHighlight';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

interface AgentAnalysisEvidenceChartProps {
  chart: EvidenceChart;
  onDataClick?: (filterField: string, filterValue: string, filterLabel: string) => void;
}

/**
 * AgentAnalysisEvidenceChart - Renders evidence charts for agent analysis page
 * Supports multiple chart types with key highlight bars
 */
export default function AgentAnalysisEvidenceChart({
  chart,
  onDataClick
}: AgentAnalysisEvidenceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Find x-axis value closest to timeline marker date
  const getTimelineMarkerX = (): string | number | undefined => {
    if (!chart.timelineMarker || !chart.data || chart.data.length === 0) {
      return undefined;
    }

    const xKey = chart.config.xAxis?.key || 'label';

    // For time-based data, find the closest data point
    // Using the middle point as a simple approximation for demo
    const middleIndex = Math.floor(chart.data.length / 2);
    return chart.data[middleIndex]?.[xKey];
  };

  // Format value based on config
  const formatValue = (value: number, format?: 'percent' | 'currency' | 'number'): string => {
    if (value == null) return 'N/A';

    switch (format) {
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}M`;
      case 'number':
      default:
        return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    }
  };

  // Handle click on chart elements
  const handleChartClick = (data: any) => {
    if (onDataClick && chart.filterField) {
      const value = data[chart.filterField] || data.name || data[chart.config.xAxis?.key || 'label'];
      const label = chart.filterLabel?.replace('{value}', value) || `${chart.filterField}: ${value}`;
      onDataClick(chart.filterField, value, label);
    }
  };

  // Render appropriate chart based on type
  const renderChart = () => {
    const colors = chart.config.colors || CHART_COLORS;

    switch (chart.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" opacity={chart.config.showGrid !== false ? 1 : 0} />
              <XAxis
                dataKey={chart.config.xAxis?.key || 'label'}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatValue(value, chart.config.yAxis?.format)}
              />
              <Tooltip
                formatter={(value: any) => formatValue(value, chart.config.yAxis?.format)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              {chart.config.showLegend !== false && <Legend />}
              {chart.timelineMarker && getTimelineMarkerX() && (
                <ReferenceLine
                  x={getTimelineMarkerX()}
                  stroke="#6366f1"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: chart.timelineMarker.label,
                    position: 'top',
                    fill: '#6366f1',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
              )}
              {chart.config.series?.map((series, index) => (
                <Bar
                  key={series.key}
                  dataKey={series.key}
                  name={series.name}
                  fill={series.color || colors[index % colors.length]}
                  onClick={handleChartClick}
                  cursor="pointer"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
      case 'area':
        const ChartComponent = chart.chartType === 'line' ? LineChart : AreaChart;
        const DataComponent = chart.chartType === 'line' ? Line : Area;

        return (
          <ResponsiveContainer width="100%" height={300}>
            <ChartComponent data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={chart.config.xAxis?.key || 'label'}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatValue(value, chart.config.yAxis?.format)}
              />
              <Tooltip
                formatter={(value: any) => formatValue(value, chart.config.yAxis?.format)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              {chart.config.showLegend !== false && <Legend />}
              {chart.timelineMarker && getTimelineMarkerX() && (
                <ReferenceLine
                  x={getTimelineMarkerX()}
                  stroke="#6366f1"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: chart.timelineMarker.label,
                    position: 'top',
                    fill: '#6366f1',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
              )}
              {chart.config.series?.map((series, index) => (
                <DataComponent
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.name}
                  stroke={series.color || colors[index % colors.length]}
                  fill={chart.chartType === 'area' ? series.color || colors[index % colors.length] : undefined}
                  strokeWidth={2}
                />
              ))}
            </ChartComponent>
          </ResponsiveContainer>
        );

      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                dataKey={chart.config.series?.[0]?.key || 'value'}
                nameKey={chart.config.xAxis?.key || 'name'}
                cx="50%"
                cy="50%"
                innerRadius={chart.chartType === 'donut' ? '50%' : 0}
                outerRadius="70%"
                label={(entry: any) => `${entry.name}: ${formatValue(entry.value as number, chart.config.yAxis?.format)}`}
                onClick={handleChartClick}
                cursor="pointer"
              >
                {chart.data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => formatValue(value, chart.config.yAxis?.format)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              {chart.config.showLegend !== false && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={chart.config.xAxis?.key || 'x'}
                name={chart.config.xAxis?.label || 'X'}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey={chart.config.yAxis?.key || 'y'}
                name={chart.config.yAxis?.label || 'Y'}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              {chart.config.showLegend !== false && <Legend />}
              {chart.config.series?.map((series, index) => (
                <Scatter
                  key={series.key}
                  name={series.name}
                  data={chart.data}
                  fill={series.color || colors[index % colors.length]}
                  onClick={handleChartClick}
                  cursor="pointer"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chart.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={chart.config.xAxis?.key || 'label'} tick={{ fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              {chart.config.showLegend !== false && <Legend />}
              {chart.config.series?.map((series, index) => (
                <Radar
                  key={series.key}
                  name={series.name}
                  dataKey={series.key}
                  stroke={series.color || colors[index % colors.length]}
                  fill={series.color || colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {chart.config.columns?.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                        col.align === 'right' ? 'text-right' :
                        col.align === 'center' ? 'text-center' :
                        'text-left'
                      }`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chart.data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleChartClick(row)}
                    onMouseEnter={() => setHoveredIndex(rowIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {chart.config.columns?.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-sm text-gray-900 whitespace-nowrap ${
                          col.align === 'right' ? 'text-right' :
                          col.align === 'center' ? 'text-center' :
                          'text-left'
                        } ${hoveredIndex === rowIndex ? 'font-medium' : ''}`}
                      >
                        {col.format && col.format !== 'text' ? formatValue(row[col.key], col.format) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'gauge':
        // Simple gauge representation using a progress arc
        const gaugeData = chart.data[0] || {};
        const value = gaugeData.value || 0;
        const max = gaugeData.max || 100;
        const percentage = (value / max) * 100;

        return (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Progress arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[0]}
                  strokeWidth="8"
                  strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {formatValue(value, chart.config.yAxis?.format)}
                </span>
                <span className="text-sm text-gray-500 mt-1">{gaugeData.label || 'Current'}</span>
              </div>
            </div>
          </div>
        );

      case 'dual-axis':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={chart.config.xAxis?.key || 'label'}
                tick={{ fontSize: 12 }}
              />
              {/* Left Y-Axis for bars (volume) */}
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{ value: 'Volume ($ M)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              {/* Right Y-Axis for lines (rates) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: 'Default Rate (%)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              {chart.config.showLegend !== false && <Legend />}
              {chart.timelineMarker && getTimelineMarkerX() && (
                <ReferenceLine
                  x={getTimelineMarkerX()}
                  stroke="#6366f1"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: chart.timelineMarker.label,
                    position: 'top',
                    fill: '#6366f1',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
              )}
              {chart.config.series?.map((series, index) => {
                if (series.type === 'bar') {
                  return (
                    <Bar
                      key={series.key}
                      dataKey={series.key}
                      name={series.name}
                      fill={series.color || colors[index % colors.length]}
                      yAxisId="left"
                    />
                  );
                } else if (series.type === 'line') {
                  return (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      name={series.name}
                      stroke={series.color || colors[index % colors.length]}
                      strokeWidth={2}
                      yAxisId="right"
                      dot={{ r: 4 }}
                    />
                  );
                }
                return null;
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Chart type "{chart.chartType}" not yet implemented
          </div>
        );
    }
  };

  return (
    <div
      id={`evidence-chart-${chart.id}`}
      className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm"
    >
      {/* Key Highlight Bar */}
      <div className="mb-4">
        <AgentAnalysisKeyHighlight text={chart.keyHighlight} variant="neutral" icon="alert-circle" />
      </div>

      {/* Chart Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{chart.title}</h3>

      {/* Chart */}
      <div className="w-full">
        {renderChart()}
      </div>
    </div>
  );
}
