import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { mockPortfolioWaterfallData } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';

interface DrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  data: Array<{ segment: string; amount: number; count: number }>;
}

const DrilldownModal = ({ isOpen, onClose, category, data }: DrilldownModalProps) => {
  if (!isOpen) return null;

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{category} Breakdown</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-700 font-medium mb-1">Total Amount</div>
            <div className="text-lg font-bold text-blue-900">{formatCurrency(total)}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-xs text-purple-700 font-medium mb-1">Total Count</div>
            <div className="text-lg font-bold text-purple-900">{totalCount.toLocaleString()}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Segment</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900">Amount</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900">Count</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900">% of Total</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900">Avg Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-900">{item.segment}</td>
                  <td className="p-3 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="p-3 text-sm text-right text-gray-700">
                    {item.count.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm text-right text-gray-700">
                    {((item.amount / total) * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-sm text-right text-gray-700">
                    {formatCurrency(item.amount / item.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function PortfolioWaterfallChart() {
  const [drilldownModal, setDrilldownModal] = useState<{
    isOpen: boolean;
    category: string;
    data: Array<{ segment: string; amount: number; count: number }>;
  }>({
    isOpen: false,
    category: '',
    data: [],
  });

  // Calculate cumulative values for waterfall positioning
  const waterfallData = mockPortfolioWaterfallData.data.map((item, index, arr) => {
    if (item.type === 'total') {
      return {
        ...item,
        displayValue: item.value,
        stackStart: 0,
        stackEnd: item.value,
      };
    }

    // Calculate cumulative position for non-total items
    let cumulativeValue = arr[0].value; // Start with opening balance
    for (let i = 1; i < index; i++) {
      if (arr[i].type !== 'total') {
        cumulativeValue += arr[i].value;
      }
    }

    return {
      ...item,
      displayValue: Math.abs(item.value),
      stackStart: item.value > 0 ? cumulativeValue : cumulativeValue + item.value,
      stackEnd: item.value > 0 ? cumulativeValue + item.value : cumulativeValue,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const hasDrilldown = mockPortfolioWaterfallData.drilldownData[data.category as keyof typeof mockPortfolioWaterfallData.drilldownData];

      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.category}</p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Amount:</span> {formatCurrency(data.value)}
          </p>
          {data.type !== 'total' && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Change:</span>{' '}
              <span className={data.value > 0 ? 'text-green-600' : 'text-red-600'}>
                {data.value > 0 ? '+' : ''}
                {((data.value / waterfallData[0].value) * 100).toFixed(2)}%
              </span>
            </p>
          )}
          {hasDrilldown && (
            <p className="text-xs text-blue-600 mt-2 font-medium">Click to view breakdown</p>
          )}
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    const drilldownData = mockPortfolioWaterfallData.drilldownData[data.category as keyof typeof mockPortfolioWaterfallData.drilldownData];
    if (drilldownData) {
      setDrilldownModal({
        isOpen: true,
        category: data.category,
        data: drilldownData,
      });
    }
  };

  const netChange = waterfallData[waterfallData.length - 1].value - waterfallData[0].value;
  const netChangePercent = (netChange / waterfallData[0].value) * 100;

  return (
    <div className="bg-white rounded-lg p-6 border border-oracle-border">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Portfolio Composition Waterfall
          </h3>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{mockPortfolioWaterfallData.previousPeriod}</span>
            {' → '}
            <span className="font-medium">{mockPortfolioWaterfallData.period}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Month-over-month portfolio changes showing inflows, outflows, and net movement. Click
          bars with drilldown data for detailed breakdowns.
        </p>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-700 font-medium mb-1">Opening Balance</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(waterfallData[0].value)}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-700 font-medium mb-1">Closing Balance</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(waterfallData[waterfallData.length - 1].value)}
            </div>
          </div>
          <div
            className={`${
              netChange > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            } border rounded-lg p-3`}
          >
            <div
              className={`text-xs font-medium mb-1 ${
                netChange > 0 ? 'text-green-700' : 'text-red-700'
              }`}
            >
              Net Change
            </div>
            <div
              className={`text-lg font-bold ${netChange > 0 ? 'text-green-900' : 'text-red-900'}`}
            >
              {netChange > 0 ? '+' : ''}
              {formatCurrency(netChange)}
            </div>
          </div>
          <div
            className={`${
              netChange > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            } border rounded-lg p-3`}
          >
            <div
              className={`text-xs font-medium mb-1 ${
                netChange > 0 ? 'text-green-700' : 'text-red-700'
              }`}
            >
              % Change
            </div>
            <div
              className={`text-lg font-bold ${netChange > 0 ? 'text-green-900' : 'text-red-900'}`}
            >
              {netChangePercent > 0 ? '+' : ''}
              {netChangePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Waterfall Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12, fill: '#374151' }}
          />
          <YAxis
            tickFormatter={(value) => `₹${(value / 1000000000).toFixed(1)}B`}
            tick={{ fontSize: 12, fill: '#374151' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Legend
            verticalAlign="top"
            height={36}
            content={() => (
              <div className="flex items-center justify-center gap-6 text-xs text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span>Total/Opening</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Increase</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Decrease</span>
                </div>
              </div>
            )}
          />

          {/* Invisible bar for stacking (to position bars at correct height) */}
          <Bar dataKey="stackStart" stackId="a" fill="transparent" />

          {/* Visible bar showing the actual value */}
          <Bar
            dataKey="displayValue"
            stackId="a"
            onClick={handleBarClick}
            cursor="pointer"
            radius={[4, 4, 0, 0]}
          >
            {waterfallData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={mockPortfolioWaterfallData.drilldownData[entry.category as keyof typeof mockPortfolioWaterfallData.drilldownData] ? 0.9 : 0.7}
              />
            ))}
            <LabelList
              dataKey="displayValue"
              position="top"
              formatter={(value: any) => `₹${(value / 1000000).toFixed(0)}M`}
              style={{ fontSize: 11, fontWeight: 600, fill: '#374151' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Key Movements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
          <div>
            <strong>Largest Inflow:</strong> New Loans (+{formatCurrency(125000000)})
          </div>
          <div>
            <strong>Largest Outflow:</strong> Repayments (-{formatCurrency(85000000)})
          </div>
          <div>
            <strong>Total Inflows:</strong>{' '}
            {formatCurrency(
              waterfallData
                .filter((d) => d.type === 'increase')
                .reduce((sum, d) => sum + d.value, 0)
            )}
          </div>
          <div>
            <strong>Total Outflows:</strong>{' '}
            {formatCurrency(
              Math.abs(
                waterfallData
                  .filter((d) => d.type === 'decrease')
                  .reduce((sum, d) => sum + d.value, 0)
              )
            )}
          </div>
        </div>
      </div>

      {/* Drilldown Modal */}
      <DrilldownModal
        isOpen={drilldownModal.isOpen}
        onClose={() => setDrilldownModal({ isOpen: false, category: '', data: [] })}
        category={drilldownModal.category}
        data={drilldownModal.data}
      />
    </div>
  );
}
