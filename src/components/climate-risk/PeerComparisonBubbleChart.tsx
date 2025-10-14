import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import type { ClimateRiskDetails } from '../../types';

interface PeerComparisonBubbleChartProps {
  peers: ClimateRiskDetails['peerComparison'];
}

export default function PeerComparisonBubbleChart({ peers }: PeerComparisonBubbleChartProps) {
  // Transform data for scatter chart
  const chartData = peers.map(peer => ({
    x: peer.grossExposure,
    y: peer.emissionsIntensity,
    z: peer.climateRiskScore * 20, // Scale for bubble size
    name: peer.obligor,
    rating: peer.climateRiskRating,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Peer Comparison Climate Perspective</h3>

      {/* Legend */}
      <div className="mb-4 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 font-medium mb-1">X AXIS</p>
            <p className="text-gray-900">Gross Exposure</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-1">Y AXIS</p>
            <p className="text-gray-900">Emissions Intensity</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-1">BUBBLE SIZE</p>
            <p className="text-gray-900">Climate Risk Score</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Indicating below and above benchmark
        </p>
      </div>

      {/* Bubble Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Gross Exposure"
            label={{ value: 'Gross Exposure (₹ Cr)', position: 'bottom', offset: 40 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Emissions Intensity"
            label={{ value: 'Emissions Intensity', angle: -90, position: 'left', offset: 40 }}
            tick={{ fontSize: 12 }}
          />
          <ZAxis type="number" dataKey="z" range={[50, 400]} name="Climate Risk Score" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white border border-oracle-border rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
                    <p className="text-sm text-gray-700">Exposure: ₹{data.x.toFixed(2)} Cr</p>
                    <p className="text-sm text-gray-700">Emissions: {data.y}</p>
                    <p className="text-sm text-gray-700">Risk Score: {(data.z / 20).toFixed(1)}</p>
                    <p className="text-sm text-gray-700">Rating: {data.rating}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Peers" data={chartData} fill="#3b82f6" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
