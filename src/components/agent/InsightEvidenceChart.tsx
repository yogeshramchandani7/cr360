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
  ReferenceLine,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { EvidenceChart } from '../../types';
import KeyHighlightBar from './KeyHighlightBar';
import GeoMap from '../charts/GeoMap';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

interface InsightEvidenceChartProps {
  chart: EvidenceChart;
  onDataClick?: (filterField: string, filterValue: string, filterLabel: string) => void;
}

/**
 * InsightEvidenceChart - Renders evidence charts with key highlight bars
 * Supports multiple chart types for insight drilldown overlays
 */
export default function InsightEvidenceChart({
  chart,
  onDataClick
}: InsightEvidenceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Format value based on config
  const formatValue = (value: number, format?: 'percent' | 'currency' | 'number' | 'heatmap'): string => {
    if (value == null) return 'N/A';

    switch (format) {
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}M`;
      case 'heatmap':
        // For heatmap, return percent format
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
  };

  // Get heatmap background color based on value
  const getHeatmapColor = (value: number): string => {
    const config = chart.config.heatmapConfig;
    if (!config || value === 0) return 'transparent';

    const { minValue = 0, maxValue = 100, colorScale } = config;
    const colors = colorScale || ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'];

    // Normalize value to 0-1 range
    const normalized = Math.min(Math.max((value - minValue) / (maxValue - minValue), 0), 1);

    // Map to color index
    const colorIndex = Math.floor(normalized * (colors.length - 1));

    return colors[colorIndex];
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
        const isStacked = chart.config.series?.some((s: any) => s.stack);
        const hasStackTotals = isStacked && chart.config.series?.length > 0;

        // Calculate totals for each data point if stacked
        const dataWithTotals = hasStackTotals ? chart.data.map((item: any) => {
          const total = chart.config.series?.reduce((sum: number, series: any) => {
            return sum + (Number(item[series.key]) || 0);
          }, 0) || 0;
          return { ...item, __stackTotal: total };
        }) : chart.data;

        // Custom tooltip to show total for stacked bars
        const CustomStackedTooltip = ({ active, payload, label }: any) => {
          if (active && payload && payload.length) {
            const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
            return (
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                <p className="font-semibold text-gray-900 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                  <p key={index} className="text-sm text-gray-600 flex justify-between gap-4">
                    <span style={{ color: entry.color }}>{entry.name}:</span>
                    <span className="font-medium">{formatValue(entry.value, chart.config.yAxis?.format)}</span>
                  </p>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm font-bold text-gray-900 flex justify-between gap-4">
                    <span>Total:</span>
                    <span>{formatValue(total, chart.config.yAxis?.format)}</span>
                  </p>
                </div>
              </div>
            );
          }
          return null;
        };

        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataWithTotals}>
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
              {hasStackTotals ? (
                <Tooltip content={<CustomStackedTooltip />} />
              ) : (
                <Tooltip
                  formatter={(value: any) => formatValue(value, chart.config.yAxis?.format)}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                />
              )}
              {chart.config.showLegend !== false && <Legend />}
              {chart.config.series?.map((series, index) => (
                <Bar
                  key={series.key}
                  dataKey={series.key}
                  name={series.name}
                  fill={series.color || colors[index % colors.length]}
                  stackId={series.stack || undefined}
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
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
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
                    {chart.config.columns?.map((col) => {
                      const cellValue = row[col.key];
                      const isHeatmap = col.format === 'heatmap';
                      const hideZero = isHeatmap && chart.config.heatmapConfig?.hideZeros && cellValue === 0;

                      return (
                        <td
                          key={col.key}
                          className={`px-4 py-3 text-sm whitespace-nowrap ${
                            col.align === 'right' ? 'text-right' :
                            col.align === 'center' ? 'text-center' :
                            'text-left'
                          } ${hoveredIndex === rowIndex ? 'font-medium' : ''}`}
                          style={
                            isHeatmap && !hideZero
                              ? {
                                  backgroundColor: getHeatmapColor(cellValue),
                                  color: cellValue > 8 ? '#ffffff' : '#1f2937',
                                  fontWeight: 500
                                }
                              : {}
                          }
                        >
                          {hideZero ? '' : (col.format && col.format !== 'text' ? formatValue(cellValue, col.format) : cellValue)}
                        </td>
                      );
                    })}
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
                label={{ value: chart.config.yAxisLeft?.label || 'Volume (₹ Cr)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              {/* Right Y-Axis for lines (rates) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: chart.config.yAxisRight?.label || 'Default Rate (%)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              {chart.config.showLegend !== false && <Legend />}
              {/* Reference line if configured */}
              {chart.config.referenceLine && (
                <ReferenceLine
                  x={chart.config.referenceLine.x}
                  y={chart.config.referenceLine.y}
                  yAxisId={chart.config.referenceLine.y ? 'left' : undefined}
                  stroke={chart.config.referenceLine.stroke || '#dc2626'}
                  strokeDasharray={chart.config.referenceLine.strokeDasharray || '3 3'}
                  strokeWidth={2}
                  label={{
                    value: chart.config.referenceLine.label || '',
                    position: chart.config.referenceLine.x ? 'top' : 'right',
                    fill: chart.config.referenceLine.stroke || '#dc2626',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}
                />
              )}
              {/* Render bars from bars array or series array */}
              {(chart.config.bars || []).map((bar: any, index: number) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.name}
                  fill={bar.color || colors[index % colors.length]}
                  yAxisId={bar.axis || 'left'}
                />
              ))}
              {/* Render lines from lines array or series array */}
              {(chart.config.lines || []).map((line: any, index: number) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color || colors[index % colors.length]}
                  strokeWidth={2}
                  yAxisId={line.axis || 'right'}
                  dot={{ r: 4 }}
                />
              ))}
              {/* Fallback to series array for backwards compatibility */}
              {chart.config.series?.map((series: any, index: number) => {
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
                      yAxisId={series.axis || 'right'}
                      dot={{ r: 4 }}
                    />
                  );
                }
                return null;
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'geo-map':
        return (
          <div className="w-full h-[500px]">
            <GeoMap
              data={chart.data}
              config={chart.config}
              onCityClick={(city) => {
                if (chart.filterField && onDataClick) {
                  const cityData = chart.data.find((d: any) => d.city === city);
                  if (cityData) {
                    const filterLabel = chart.filterLabel?.replace('{value}', city) || `${chart.filterField}: ${city}`;
                    onDataClick(chart.filterField, city, filterLabel);
                  }
                }
              }}
            />
          </div>
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
    <div id={`evidence-chart-${chart.id}`} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      {/* Key Highlight Bar */}
      <div className="mb-4">
        <KeyHighlightBar text={chart.keyHighlight} variant="neutral" icon="alert-circle" />
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
