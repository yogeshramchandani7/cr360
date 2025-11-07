import { useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { AdvancedKPI, PageFilter, SectorComparisonData, MigrationMatrixData, RatingMigrationMatrix } from '../types';
import { getChartsForKPI, getIndicatorsForKPI, generateCMICharts } from '../lib/kpiDrilldownData';
import { calculateCCOKPIs, getKPIsForDrilldown, generateRatingMigrationMatrix } from '../lib/mockCCOData';
import { mockPortfolioCompanies } from '../lib/mockData';
import { applyPageFilters, calculateTopExposuresWithMigration, calculateFilteredTopExposures } from '../lib/filterUtils';
import { useFilterStore } from '../stores/filterStore';
import ClickableChartCard from '../components/ClickableChartCard';
import KPIMetricCard from '../components/KPIMetricCard';
import PageFilterChips from '../components/PageFilterChips';
import InsightSection from '../components/InsightSection';
import SectorComparisonTable from '../components/charts/SectorComparisonTable';
import DeteriorationHeatmap from '../components/charts/DeteriorationHeatmap';
import MigrationMatrix from '../components/charts/MigrationMatrix';
import RatingMigrationHeatmap from '../components/charts/RatingMigrationHeatmap';
import BenchmarkComparisonTable from '../components/charts/BenchmarkComparisonTable';
import SectorBenchmarkingTable from '../components/charts/SectorBenchmarkingTable';
import TopExposuresTable, { type TopExposureRow } from '../components/TopExposuresTable';

// Stable empty array to prevent unnecessary re-renders
const EMPTY_PAGE_FILTERS: PageFilter[] = [];

export default function KPIDrilldownPage() {
  const { kpiId } = useParams<{ kpiId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check if insights should be initially open (from URL query parameter)
  const insightId = searchParams.get('insightId');
  const shouldOpenInsights = searchParams.get('insights') === 'open' || !!insightId;

  // Get ALL page filters object (subscribe to entire object to ensure re-renders on any change)
  const allPageFilters = useFilterStore((state) => state.pageFilters);

  // Extract page-specific filters inside component (not in selector)
  const pageFilters = allPageFilters[location.pathname] ?? EMPTY_PAGE_FILTERS;

  // Get drilldown-specific KPIs for this page
  const drilldownKPIs = useMemo(() => {
    return kpiId ? getKPIsForDrilldown(kpiId) : [];
  }, [kpiId]);

  // Get dashboard KPIs to find the main KPI label for the header
  const dashboardKPIs = calculateCCOKPIs();

  // Find the selected KPI by ID (use dashboard KPIs for the header/main KPI info)
  const kpi: AdvancedKPI | undefined = Object.values(dashboardKPIs).find(
    (k) => k.id === kpiId
  );

  // If KPI not found, show error
  if (!kpi) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">KPI Not Found</h1>
          <p className="text-gray-600 mb-4">The requested KPI could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-oracle-primary text-white rounded-lg hover:bg-oracle-hover transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Filter companies based on page filters (just like Dashboard does)
  const filteredCompanies = useMemo(() => {
    return applyPageFilters(mockPortfolioCompanies, pageFilters);
  }, [pageFilters]);

  // Check if this KPI uses indicators instead of charts (CMI & Net Deterioration)
  const indicators = useMemo(() => {
    return getIndicatorsForKPI(kpi.id);
  }, [kpi.id]);

  // Check if this is a CMI page (indicator-based with additional charts)
  const isCMIPage = kpi.id === 'qm_rwa_intensity';

  // Generate charts dynamically from filtered companies
  const charts = useMemo(() => {
    // For CMI/Net Det pages, show all CMI charts (including custom table types)
    if (isCMIPage) {
      const cmiCharts = generateCMICharts();
      // Return ALL charts - custom rendering logic handles each type
      return cmiCharts;
    }
    // For other KPIs, show standard dynamic charts
    return getChartsForKPI(kpi.id, filteredCompanies);
  }, [kpi.id, filteredCompanies, isCMIPage]);

  // Calculate Top 20 Originations data (only for quick_mortality KPI)
  const topOriginationsData: TopExposureRow[] = useMemo(() => {
    if (kpi.id === 'quick_mortality') {
      return calculateFilteredTopExposures(filteredCompanies, 20);
    }
    return [];
  }, [kpi.id, filteredCompanies]);

  // Calculate Top Exposures with Migration data (only for CMI KPI)
  const topExposuresWithMigration: TopExposureRow[] = useMemo(() => {
    if (kpi.id === 'qm_rwa_intensity') {
      return calculateTopExposuresWithMigration(filteredCompanies, 20);
    }
    return [];
  }, [kpi.id, filteredCompanies]);

  // Scroll to specific insight when insightId is present in URL
  useEffect(() => {
    if (insightId) {
      // Wait for insights section to expand and DOM to update
      const timeoutId = setTimeout(() => {
        const element = document.querySelector(`[data-insight-id="${insightId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300); // Allow time for expansion animation

      return () => clearTimeout(timeoutId);
    }
  }, [insightId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-oracle-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          {/* KPI Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{kpi.label}</h1>
          </div>
        </div>
      </div>

      {/* Insights Section - Above Everything */}
      <InsightSection kpiId={kpi.id} initiallyOpen={shouldOpenInsights} />

      {/* Metrics Grid - Show 4 indicators for CMI/Net Det, or context-specific KPIs for others */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid ${indicators ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : drilldownKPIs.length <= 4 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : drilldownKPIs.length === 5 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-4`}>
          {indicators ? (
            // Show 4 deterioration indicators for CMI and Net Deterioration
            indicators.map((indicator) => (
              <KPIMetricCard key={indicator.id} kpi={indicator} />
            ))
          ) : (
            // Show drilldown-specific KPIs (context-relevant metrics)
            drilldownKPIs.map((kpiItem) => (
              <KPIMetricCard
                key={kpiItem.id}
                kpi={kpiItem}
                isSelected={false}
              />
            ))
          )}
        </div>
      </div>

      {/* Page Filter Chips */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageFilterChips page={location.pathname} />
      </div>

      {/* Chart Grid - Show for all KPIs */}
      {charts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts.map((chart) => {
              // Render custom Benchmark Comparison Table
              if (chart.type === 'benchmark-table') {
                return (
                  <div key={chart.id} className="lg:col-span-2">
                    <BenchmarkComparisonTable
                      data={chart.data}
                      title={chart.title}
                      description={chart.description}
                      kpiId={kpi.id}
                    />
                  </div>
                );
              }

              // Render custom Sector Benchmarking Table
              if (chart.type === 'sector-benchmark-table') {
                return (
                  <div key={chart.id} className="lg:col-span-2">
                    <SectorBenchmarkingTable
                      data={chart.data}
                      title={chart.title}
                      description={chart.description}
                      kpiId={kpi.id}
                    />
                  </div>
                );
              }

              // Render custom Sector Comparison Table
              if (chart.type === 'sector-table') {
                return (
                  <div key={chart.id} className="lg:col-span-2">
                    <SectorComparisonTable
                      data={chart.data}
                      title={chart.title}
                      description={chart.description}
                      kpiId={kpi.id}
                    />
                  </div>
                );
              }

              // Render custom Deterioration Heatmap
              if (chart.type === 'heatmap') {
                return (
                  <div key={chart.id} className="lg:col-span-2">
                    <DeteriorationHeatmap
                      data={chart.data}
                      title={chart.title}
                      description={chart.description}
                      kpiId={kpi.id}
                    />
                  </div>
                );
              }

              // Render custom Rating Migration Heatmap
              if (chart.type === 'rating-migration-heatmap') {
                return (
                  <div key={chart.id} className="lg:col-span-2">
                    <RatingMigrationHeatmap
                      data={chart.data}
                      title={chart.title}
                      description={chart.description}
                      kpiId={kpi.id}
                      companies={filteredCompanies}
                    />
                  </div>
                );
              }

              // Render custom Migration Matrix
              if (chart.type === 'migration-matrix') {
                return (
                  <div key={chart.id} className="lg:col-span-2">
                    <MigrationMatrix
                      data={chart.data}
                      title={chart.title}
                      description={chart.description}
                      kpiId={kpi.id}
                    />
                  </div>
                );
              }

              // Render custom Migration Table (Top Exposures with Rating Migration)
              if (chart.type === 'migration-table') {
                return (
                  <div key={chart.id} className="lg:col-span-2">
                    <TopExposuresTable
                      data={topExposuresWithMigration}
                      title={chart.title}
                      defaultLimit={20}
                      showMigrationColumns={true}
                    />
                  </div>
                );
              }

              // Render standard chart types (line, bar, pie, area)
              return (
                <div key={chart.id} className={chart.type === 'line' ? 'lg:col-span-2' : ''}>
                  <ClickableChartCard
                    chart={chart}
                    kpiId={kpi.id}
                  />
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-oracle-border">
            <p className="text-sm text-gray-600 text-center">
              Click on chart elements to view filtered companies in Customer View or apply filters
            </p>
          </div>
        </div>
      )}

      {/* Top 20 Originations Table - Only show for quick_mortality KPI */}
      {kpi.id === 'quick_mortality' && topOriginationsData.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TopExposuresTable
            data={topOriginationsData}
            title="Top 20 Originations"
            defaultLimit={20}
            showMigrationColumns={false}
          />
        </div>
      )}
    </div>
  );
}
