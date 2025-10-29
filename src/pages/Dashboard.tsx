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
import { mockPortfolioCompanies, getInsightCountByChartId } from '../lib/mockData';
import { formatCurrency, formatPercent, cn } from '../lib/utils';
import { useFilterStore } from '../stores/filterStore';
import {
  applyGlobalFilters,
  applyPageFilters,
  calculateFilteredBreakdowns,
  calculateFilteredDelinquencyMatrix,
  calculateFilteredTopExposures,
  calculateFilteredTopNPA,
  calculateFilteredTopDelinquent,
  calculateFilteredTrends
} from '../lib/filterUtils';
import InsightsDrawer from '../components/InsightsDrawer';
import InsightButton from '../components/InsightButton';
import AdvancedKPIBar from '../components/AdvancedKPIBar';
import ChartActionDropdown from '../components/ChartActionDropdown';
import PageFilterChips from '../components/PageFilterChips';
import MasterSlicerChart from '../components/MasterSlicerChart';
import type { PageFilter } from '../types';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

// Stable empty array to prevent unnecessary re-renders
const EMPTY_PAGE_FILTERS: PageFilter[] = [];

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

export default function Dashboard() {
  const navigate = useNavigate();
  const setDrillDownFilter = useFilterStore((state) => state.setDrillDownFilter);
  const addPageFilter = useFilterStore((state) => state.addPageFilter);
  const setSelectedInsightChartId = useFilterStore((state) => state.setSelectedInsightChartId);
  const [dropdownState, setDropdownState] = useState<DropdownState>({
    visible: false,
    x: 0,
    y: 0,
    filterData: null,
  });
  const [exposureLimit, setExposureLimit] = useState<number>(20);
  const [exposureType, setExposureType] = useState<'exposures' | 'npa' | 'delinquent'>('exposures');

  // Read global filters from store - use individual selectors to prevent infinite loop
  const lob = useFilterStore((state) => state.lob);
  const partyType = useFilterStore((state) => state.partyType);
  const rating = useFilterStore((state) => state.rating);
  const assetClassification = useFilterStore((state) => state.assetClassification);

  // Get ALL page filters object (subscribe to entire object to ensure re-renders on any change)
  const allPageFilters = useFilterStore((state) => state.pageFilters);

  // Extract page-specific filters inside component (not in selector)
  const pageFilters = allPageFilters['/'] ?? EMPTY_PAGE_FILTERS;

  // Calculate filtered data based on global filters AND page filters
  const filteredData = useMemo(() => {
    const globalFilters = { lob, partyType, rating, assetClassification };

    // Step 1: Apply global filters
    let companies = applyGlobalFilters(mockPortfolioCompanies, globalFilters);

    // Step 2: Apply page filters (with AND logic)
    companies = applyPageFilters(companies, pageFilters);

    // Conditionally calculate top exposures based on type
    console.log('[Dashboard] Calculating topExposures:', { exposureType, exposureLimit, totalCompanies: companies.length });

    let topExposures;
    if (exposureType === 'npa') {
      topExposures = calculateFilteredTopNPA(companies, exposureLimit);
      console.log('[Dashboard] NPA results:', topExposures.length);
    } else if (exposureType === 'delinquent') {
      topExposures = calculateFilteredTopDelinquent(companies, exposureLimit);
      console.log('[Dashboard] Delinquent results:', topExposures.length);
    } else {
      topExposures = calculateFilteredTopExposures(companies, exposureLimit);
      console.log('[Dashboard] Exposures results:', topExposures.length);
    }

    return {
      companies,
      trends: calculateFilteredTrends(companies),
      breakdowns: calculateFilteredBreakdowns(companies),
      delinquencyMatrix: calculateFilteredDelinquencyMatrix(companies),
      topExposures,
    };
  }, [lob, partyType, rating, assetClassification, pageFilters, exposureLimit, exposureType]);

  const handleDropdownSelect = (optionId: string) => {
    if (!dropdownState.filterData) return;

    if (optionId === 'counterparties') {
      // Navigate to portfolio with drilldown filter (current behavior)
      setDrillDownFilter(dropdownState.filterData);
      navigate('/portfolio');
    } else if (optionId === 'apply-filter') {
      // Apply filter to current page
      addPageFilter('/', {
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
      {/* Page Filter Chips */}
      <PageFilterChips page="/" />

      {/* Chart Action Dropdown */}
      {dropdownState.visible && (
        <ChartActionDropdown
          position={{ x: dropdownState.x, y: dropdownState.y }}
          onSelect={handleDropdownSelect}
          onClose={handleDropdownClose}
        />
      )}

      {/* SECTION 1: Portfolio Health */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Portfolio Health</h2>
        <AdvancedKPIBar />

        {/* Trend Charts */}
        <div className="bg-white rounded-lg p-6 border border-oracle-border mb-6">
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
      </section>

      {/* SECTION 2: Master Slicer Charts - Exposure, NPA, and Delinquency */}
      <section className="space-y-8 mb-8">
        {/* Chart 1: Exposure by Dimension */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Exposure by Dimension</h2>
          <MasterSlicerChart
            data={filteredData.companies}
            metricType="exposure"
            defaultDimension="segment"
            defaultChartType="pie"
            source="Dashboard - Exposure Analysis"
          />
        </div>

        {/* Chart 2: NPA by Dimension */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">NPA by Dimension</h2>
          <MasterSlicerChart
            data={filteredData.companies}
            metricType="npa"
            defaultDimension="segment"
            defaultChartType="pie"
            source="Dashboard - NPA Analysis"
          />
        </div>

        {/* Chart 3: Delinquency by Dimension */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Delinquency by Dimension</h2>
          <MasterSlicerChart
            data={filteredData.companies}
            metricType="delinquency"
            defaultDimension="segment"
            defaultChartType="pie"
            source="Dashboard - Delinquency Analysis"
          />
        </div>
      </section>

      {/* SECTION 3: Top Exposures */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Top {exposureType === 'exposures' ? 'Exposures' : exposureType === 'npa' ? 'NPA' : 'Delinquent'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="exposure-type" className="text-sm font-medium text-gray-700">
                Type:
              </label>
              <select
                id="exposure-type"
                value={exposureType}
                onChange={(e) => setExposureType(e.target.value as 'exposures' | 'npa' | 'delinquent')}
                className="px-3 py-2 border border-oracle-border rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-oracle-primary focus:border-oracle-primary transition-colors"
              >
                <option value="exposures">Exposures</option>
                <option value="npa">NPA</option>
                <option value="delinquent">Delinquent</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="exposure-limit" className="text-sm font-medium text-gray-700">
                Show top:
              </label>
              <select
                id="exposure-limit"
                value={exposureLimit}
                onChange={(e) => setExposureLimit(Number(e.target.value))}
                className="px-3 py-2 border border-oracle-border rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-oracle-primary focus:border-oracle-primary transition-colors"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <InsightButton
              chartId="top-exposures"
              insightCount={getInsightCountByChartId('top-exposures')}
              onClick={() => setSelectedInsightChartId('top-exposures')}
            />
          </div>
        </div>

        {/* Concentration Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 border border-oracle-border">
            <p className="text-sm text-gray-600 mb-2">Single Largest Exposure</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredData.topExposures[0] ? formatCurrency(filteredData.topExposures[0].exposureAmount) : '$0'}
            </p>
            <p className="text-sm text-success mt-1">
              {filteredData.topExposures[0] ? `${filteredData.topExposures[0].percentOfPortfolio.toFixed(1)}% of Portfolio` : '0% of Portfolio'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-oracle-border">
            <p className="text-sm text-gray-600 mb-2">Top 10 Concentration</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredData.topExposures.length >= 10
                ? `${filteredData.topExposures.slice(0, 10).reduce((sum, exp) => sum + exp.percentOfPortfolio, 0).toFixed(1)}%`
                : filteredData.topExposures.length > 0
                ? `${filteredData.topExposures.reduce((sum, exp) => sum + exp.percentOfPortfolio, 0).toFixed(1)}%`
                : '0%'}
            </p>
            <p className="text-sm text-success mt-1">Within Limits</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-oracle-border">
            <p className="text-sm text-gray-600 mb-2">Top 20 Concentration</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredData.topExposures.length >= 20
                ? `${filteredData.topExposures.slice(0, 20).reduce((sum, exp) => sum + exp.percentOfPortfolio, 0).toFixed(1)}%`
                : filteredData.topExposures.length > 0
                ? `${filteredData.topExposures.reduce((sum, exp) => sum + exp.percentOfPortfolio, 0).toFixed(1)}%`
                : '0%'}
            </p>
            <p className="text-sm text-success mt-1">Within Limits</p>
          </div>
        </div>

        {/* Top N Table */}
        <div className="bg-white rounded-lg p-6 border border-oracle-border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top {exposureLimit} {exposureType === 'exposures' ? 'Exposures' : exposureType === 'npa' ? 'NPA' : 'Delinquent'} by Account
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-oracle-bgAlt border-b border-oracle-border">
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
                  {exposureType === 'npa' && (
                    <th className="text-right p-3 text-sm font-semibold text-gray-900">
                      NPA Amount
                    </th>
                  )}
                  {exposureType === 'delinquent' && (
                    <th className="text-right p-3 text-sm font-semibold text-gray-900">
                      Delinquent Amount
                    </th>
                  )}
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
                {filteredData.topExposures.map((exposure: any) => (
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
                    {exposureType === 'npa' && (
                      <td className="p-3 text-sm text-right font-medium text-red-600">
                        {formatCurrency(exposure.npaAmount)}
                      </td>
                    )}
                    {exposureType === 'delinquent' && (
                      <td className="p-3 text-sm text-right font-medium text-orange-600">
                        {formatCurrency(exposure.delinquentAmount)}
                      </td>
                    )}
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
