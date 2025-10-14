import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockLoans, mockPortfolioCompanies, getInsightCountByChartId } from '../lib/mockData';
import { formatCurrency, formatPercent, cn } from '../lib/utils';
import { useFilterStore } from '../stores/filterStore';
import {
  applyGlobalFilters,
  calculateFilteredBreakdowns,
  calculateFilteredDelinquencyMatrix,
  calculateFilteredTopExposures,
  calculateFilteredTrends
} from '../lib/filterUtils';
import InsightsDrawer from '../components/InsightsDrawer';
import InsightButton from '../components/InsightButton';
import AdvancedKPIBar from '../components/AdvancedKPIBar';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function Dashboard() {
  const navigate = useNavigate();
  const setDrillDownFilter = useFilterStore((state) => state.setDrillDownFilter);
  const setSelectedInsightChartId = useFilterStore((state) => state.setSelectedInsightChartId);
  const [selectedCell, setSelectedCell] = useState<{
    region: string;
    bucket: string;
  } | null>(null);

  // Read global filters from store - use individual selectors to prevent infinite loop
  const lob = useFilterStore((state) => state.lob);
  const partyType = useFilterStore((state) => state.partyType);
  const rating = useFilterStore((state) => state.rating);
  const assetClassification = useFilterStore((state) => state.assetClassification);

  // Calculate filtered data based on global filters
  const filteredData = useMemo(() => {
    const globalFilters = { lob, partyType, rating, assetClassification };
    const companies = applyGlobalFilters(mockPortfolioCompanies, globalFilters);
    return {
      companies,
      trends: calculateFilteredTrends(companies),
      breakdowns: calculateFilteredBreakdowns(companies),
      delinquencyMatrix: calculateFilteredDelinquencyMatrix(companies),
      topExposures: calculateFilteredTopExposures(companies),
    };
  }, [lob, partyType, rating, assetClassification]);

  const getHeatColor = (exposure: number) => {
    if (exposure > 15000000) return 'bg-red-100 text-red-900';
    if (exposure > 10000000) return 'bg-orange-100 text-orange-900';
    if (exposure > 5000000) return 'bg-yellow-100 text-yellow-900';
    return 'bg-green-50 text-green-900';
  };

  const filteredLoans = selectedCell
    ? mockLoans.filter(
        (loan) =>
          loan.region === selectedCell.region && loan.bucket === selectedCell.bucket
      )
    : [];

  const handleRegionClick = (data: any) => {
    // Don't navigate if clicking on "No Data" placeholder
    if (!data || !data.label || data.label === 'No Data' || data.value === 0) {
      return;
    }
    setDrillDownFilter({
      field: 'region',
      value: data.label,
      label: `${data.label} Region`,
      source: 'Dashboard - Region Pie Chart',
    });
    navigate('/portfolio');
  };

  const handleProductClick = (data: any) => {
    // Don't navigate if clicking on "No Data" placeholder
    if (!data || !data.label || data.label === 'No Data' || data.value === 0) {
      return;
    }
    setDrillDownFilter({
      field: 'productType',
      value: data.label,
      label: `${data.label}`,
      source: 'Dashboard - Product Bar Chart',
    });
    navigate('/portfolio');
  };

  const handleCompanyClick = (borrowerName: string) => {
    // Find matching company by name (fuzzy match)
    const matchingCompany = mockPortfolioCompanies.find(
      (company) =>
        company.customerName.toLowerCase().includes(borrowerName.toLowerCase()) ||
        borrowerName.toLowerCase().includes(company.customerName.toLowerCase())
    );

    if (matchingCompany) {
      navigate(`/company/${matchingCompany.id}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: Portfolio Health */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Portfolio Health</h2>
        <AdvancedKPIBar />

        {/* Trend Charts */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">12-Month Trends</h3>
            <InsightButton
              chartId="portfolio-trends"
              insightCount={getInsightCountByChartId('portfolio-trends')}
              onClick={() => setSelectedInsightChartId('portfolio-trends')}
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="npa"
                stroke="#ef4444"
                strokeWidth={2}
                name="NPA %"
              />
              <Line
                type="monotone"
                dataKey="par"
                stroke="#f59e0b"
                strokeWidth={2}
                name="PAR %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Region Breakdown */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Exposure by Region
              </h3>
              <InsightButton
                chartId="regional-breakdown"
                insightCount={getInsightCountByChartId('regional-breakdown')}
                onClick={() => setSelectedInsightChartId('regional-breakdown')}
              />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredData.breakdowns.region}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ label, percentage }) => `${label} (${percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handleRegionClick}
                  cursor="pointer"
                >
                  {filteredData.breakdowns.region.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value ? `$${(value / 1000000).toFixed(0)}M` : '$0M'} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Product Breakdown */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Exposure by Product
              </h3>
              <InsightButton
                chartId="product-mix"
                insightCount={getInsightCountByChartId('product-mix')}
                onClick={() => setSelectedInsightChartId('product-mix')}
              />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData.breakdowns.product}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value: number) => value ? `$${(value / 1000000).toFixed(0)}M` : '$0M'} />
                <Bar dataKey="value" fill="#3b82f6" onClick={handleProductClick} cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SECTION 2: Delinquency Matrix */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Delinquency Matrix</h2>
          <InsightButton
            chartId="delinquency-matrix"
            insightCount={getInsightCountByChartId('delinquency-matrix')}
            onClick={() => setSelectedInsightChartId('delinquency-matrix')}
          />
        </div>

        {/* Matrix */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 text-sm font-semibold text-gray-900">
                  Region
                </th>
                {filteredData.delinquencyMatrix.buckets.map((bucket) => (
                  <th
                    key={bucket}
                    className="text-center p-3 text-sm font-semibold text-gray-900"
                  >
                    {bucket}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.delinquencyMatrix.data.map((row) => (
                <tr key={row.region} className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-900">{row.region}</td>
                  {filteredData.delinquencyMatrix.buckets.map((bucket) => {
                    const cellData =
                      row[bucket as keyof typeof row] as { count: number; exposure: number };
                    const isSelected =
                      selectedCell?.region === row.region &&
                      selectedCell?.bucket === bucket;

                    return (
                      <td
                        key={bucket}
                        className={cn(
                          'p-3 text-center cursor-pointer transition-all',
                          getHeatColor(cellData.exposure),
                          isSelected && 'ring-2 ring-primary'
                        )}
                        onClick={() => setSelectedCell({ region: row.region, bucket })}
                      >
                        <div className="text-sm font-semibold">{cellData.count}</div>
                        <div className="text-xs">
                          {formatCurrency(cellData.exposure)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Drilldown */}
        {selectedCell && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCell.region} - {selectedCell.bucket} Days
              </h3>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-3 text-sm font-semibold text-gray-900">
                      Account
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-900">
                      Borrower
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-900">
                      Exposure
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-900">
                      DPD
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-900">
                      Product
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-900">
                      Risk Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.slice(0, 10).map((loan) => (
                    <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-900">{loan.accountNumber}</td>
                      <td className="p-3 text-sm text-gray-900">{loan.borrowerName}</td>
                      <td className="p-3 text-sm text-right text-gray-900">
                        {formatCurrency(loan.exposureAmount)}
                      </td>
                      <td className="p-3 text-sm text-center text-gray-900">
                        {loan.delinquentDays}
                      </td>
                      <td className="p-3 text-sm text-gray-900">{loan.productType}</td>
                      <td className="p-3 text-sm text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {loan.riskGrade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: Top Exposures */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Top Exposures</h2>
          <InsightButton
            chartId="top-exposures"
            insightCount={getInsightCountByChartId('top-exposures')}
            onClick={() => setSelectedInsightChartId('top-exposures')}
          />
        </div>

        {/* Concentration Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Single Largest Exposure</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(50000000)}</p>
            <p className="text-sm text-success mt-1">4.0% of Portfolio</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Top 10 Concentration</p>
            <p className="text-2xl font-bold text-gray-900">30.4%</p>
            <p className="text-sm text-success mt-1">Within Limits</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Top 20 Concentration</p>
            <p className="text-2xl font-bold text-gray-900">50.0%</p>
            <p className="text-sm text-success mt-1">Within Limits</p>
          </div>
        </div>

        {/* Top 20 Table */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 20 Exposures by Account
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 text-sm font-semibold text-gray-900">
                    Rank
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-900">
                    Borrower
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-900">
                    Account
                  </th>
                  <th className="text-right p-3 text-sm font-semibold text-gray-900">
                    Exposure
                  </th>
                  <th className="text-right p-3 text-sm font-semibold text-gray-900">
                    % of Portfolio
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="text-center p-3 text-sm font-semibold text-gray-900">
                    Region
                  </th>
                  <th className="text-center p-3 text-sm font-semibold text-gray-900">
                    Risk Grade
                  </th>
                  <th className="text-right p-3 text-sm font-semibold text-gray-900">
                    Utilization
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.topExposures.map((exposure) => (
                  <tr key={exposure.rank} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium text-gray-900">
                      {exposure.rank}
                    </td>
                    <td className="p-3 text-sm">
                      <button
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                        onClick={() => handleCompanyClick(exposure.borrowerName)}
                      >
                        {exposure.borrowerName}
                      </button>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{exposure.accountNumber}</td>
                    <td className="p-3 text-sm text-right font-medium text-gray-900">
                      {formatCurrency(exposure.exposureAmount)}
                    </td>
                    <td className="p-3 text-sm text-right text-gray-900">
                      {formatPercent(exposure.percentOfPortfolio)}
                    </td>
                    <td className="p-3 text-sm text-gray-900">{exposure.productType}</td>
                    <td className="p-3 text-sm text-center text-gray-900">
                      {exposure.region}
                    </td>
                    <td className="p-3 text-sm text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {exposure.riskGrade}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-right text-gray-900">
                      {formatPercent(exposure.utilization)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Insights Drawer */}
      <InsightsDrawer />
    </div>
  );
}
