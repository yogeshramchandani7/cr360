import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { mockHistoricalDelinquencyMatrix } from '../lib/mockData';
import { formatCurrency, cn } from '../lib/utils';

export default function DelinquencyMatrixWithSlider() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(mockHistoricalDelinquencyMatrix.length - 1);

  const currentData = mockHistoricalDelinquencyMatrix[selectedMonthIndex];
  const previousData = selectedMonthIndex > 0 ? mockHistoricalDelinquencyMatrix[selectedMonthIndex - 1] : null;

  const getHeatColor = (exposure: number) => {
    if (exposure > 15000000) return 'bg-red-100 text-red-900';
    if (exposure > 10000000) return 'bg-orange-100 text-orange-900';
    if (exposure > 5000000) return 'bg-yellow-100 text-yellow-900';
    return 'bg-green-50 text-green-900';
  };

  const calculateDelta = (currentValue: number, previousValue: number | undefined) => {
    if (!previousValue || previousValue === 0) return null;
    const percentChange = ((currentValue - previousValue) / previousValue) * 100;
    return percentChange;
  };

  const getDeltaColor = (delta: number) => {
    if (delta > 10) return 'text-red-600';
    if (delta > 5) return 'text-orange-600';
    if (delta < -5) return 'text-green-600';
    return 'text-gray-600';
  };

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return '↑';
    if (delta < 0) return '↓';
    return '→';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-oracle-border">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Delinquency Matrix Trends</h3>
          <span className="text-sm font-medium text-gray-700">{currentData.month}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Slide to view historical delinquency patterns across regions and aging buckets
        </p>

        {/* Time Slider */}
        <div className="px-2 py-6">
          <Slider
            min={0}
            max={mockHistoricalDelinquencyMatrix.length - 1}
            value={selectedMonthIndex}
            onChange={(value) => setSelectedMonthIndex(value as number)}
            marks={mockHistoricalDelinquencyMatrix.reduce((acc, item, index) => {
              // Only show marks for every 2 months to avoid overcrowding
              if (index % 2 === 0 || index === mockHistoricalDelinquencyMatrix.length - 1) {
                acc[index] = item.month;
              }
              return acc;
            }, {} as Record<number, string>)}
            step={1}
            railStyle={{ backgroundColor: '#e5e7eb', height: 4 }}
            trackStyle={{ backgroundColor: '#3b82f6', height: 4 }}
            handleStyle={{
              borderColor: '#3b82f6',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              width: 20,
              height: 20,
              marginTop: -8,
            }}
            dotStyle={{
              borderColor: '#d1d5db',
              backgroundColor: '#ffffff',
              width: 8,
              height: 8,
              bottom: -2,
            }}
            activeDotStyle={{
              borderColor: '#3b82f6',
            }}
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-oracle-border">
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Region</th>
              {currentData.buckets.map((bucket) => (
                <th key={bucket} className="text-center p-3 text-sm font-semibold text-gray-900">
                  {bucket}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.data.map((row) => {
              const previousRow = previousData?.data.find((r) => r.region === row.region);

              return (
                <tr key={row.region} className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-900">{row.region}</td>
                  {currentData.buckets.map((bucket) => {
                    const cellData = row[bucket as keyof typeof row] as { count: number; exposure: number };
                    const previousCellData = previousRow?.[bucket as keyof typeof row] as { count: number; exposure: number } | undefined;
                    const exposureDelta = previousCellData ? calculateDelta(cellData.exposure, previousCellData.exposure) : null;

                    return (
                      <td
                        key={bucket}
                        className={cn(
                          'p-3 text-center transition-all',
                          getHeatColor(cellData.exposure)
                        )}
                      >
                        <div className="text-sm font-semibold">{cellData.count}</div>
                        <div className="text-xs">{formatCurrency(cellData.exposure)}</div>
                        {exposureDelta !== null && (
                          <div className={cn('text-xs font-medium mt-1', getDeltaColor(exposureDelta))}>
                            {getDeltaIcon(exposureDelta)} {Math.abs(exposureDelta).toFixed(1)}%
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span className="font-medium">Heat Map:</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-50 border border-gray-200 rounded"></div>
            <span>&lt;₹5M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 border border-gray-200 rounded"></div>
            <span>₹5-10M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-100 border border-gray-200 rounded"></div>
            <span>₹10-15M</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100 border border-gray-200 rounded"></div>
            <span>&gt;₹15M</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium">Trend:</span>
          <span className="text-green-600">↓ Improving</span>
          <span className="text-red-600">↑ Deteriorating</span>
          <span className="text-gray-600">→ Stable</span>
        </div>
      </div>

      {/* Summary Insights */}
      {previousData && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Month-over-Month Insights</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {currentData.data.map((row) => {
              const previousRow = previousData.data.find((r) => r.region === row.region);
              const currentTotal = currentData.buckets.reduce((sum, bucket) => {
                const cellData = row[bucket as keyof typeof row] as { count: number; exposure: number };
                return sum + cellData.exposure;
              }, 0);
              const previousTotal = previousRow
                ? currentData.buckets.reduce((sum, bucket) => {
                    const cellData = previousRow[bucket as keyof typeof row] as { count: number; exposure: number };
                    return sum + cellData.exposure;
                  }, 0)
                : 0;
              const delta = calculateDelta(currentTotal, previousTotal);

              return (
                <div key={row.region} className="flex items-center justify-between">
                  <span className="font-medium text-blue-900">{row.region}:</span>
                  {delta !== null && (
                    <span className={cn('font-semibold', getDeltaColor(delta))}>
                      {getDeltaIcon(delta)} {Math.abs(delta).toFixed(1)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
