import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ExposureDetails } from '../../types';

interface ExposureTrendsChartProps {
  trends: ExposureDetails['exposureTrends'];
}

export default function ExposureTrendsChart({ trends }: ExposureTrendsChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Exposure Trends</h3>
        <select className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Measure</option>
          <option>Amount (Cr)</option>
          <option>Percentage</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={trends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
            formatter={(value: number) => `₹${value.toFixed(2)} Cr`}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="creditLimit"
            stroke="#fb923c"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Credit Limit"
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="drawnLimit"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Drawn Limit"
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="creditExposure"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Credit Exposure"
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="overDrawings"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Over Drawings"
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="undrawn"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Undrawn"
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
