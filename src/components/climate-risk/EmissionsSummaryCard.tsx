import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ClimateRiskDetails } from '../../types';

interface EmissionsSummaryCardProps {
  emissions: ClimateRiskDetails['emissionsSummary'];
}

export default function EmissionsSummaryCard({ emissions }: EmissionsSummaryCardProps) {
  // Data for bar chart
  const barChartData = [
    { name: 'Total Emissions', value: emissions.totalEmissions },
    { name: 'Financed Emissions', value: emissions.financedEmissions },
  ];

  // Data for pie chart
  const pieChartData = [
    { name: 'Scope 1 Emissions', value: emissions.scope1 },
    { name: 'Scope 2 Emissions', value: emissions.scope2 },
    { name: 'Scope 3 Emissions', value: emissions.scope3 },
  ];

  const COLORS = ['#3b82f6', '#f97316', '#22c55e'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions Summary</h3>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total Emissions - tCO2e (mt)</p>
          <p className="text-xl font-bold text-gray-900">{emissions.totalEmissions}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Scope 1</p>
          <p className="text-xl font-bold text-blue-600">{emissions.scope1}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Scope 2</p>
          <p className="text-xl font-bold text-orange-600">{emissions.scope2}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Scope 3</p>
          <p className="text-xl font-bold text-green-600">{emissions.scope3}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Financed Emissions</p>
          <p className="text-xl font-bold text-purple-600">{emissions.financedEmissions}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">% of Total Financed Emissions</p>
          <p className="text-xl font-bold text-gray-900">{emissions.percentOfTotalFinancedEmissions.toFixed(2)}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">WACI (emissions intensity)</p>
          <p className="text-xl font-bold text-gray-900">{emissions.waci}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Industry Average (Emission Intensity)</p>
          <p className="text-xl font-bold text-gray-900">{emissions.industryAverageIntensity}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Total Emissions vs Financed Emissions</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Emissions Break Up</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
