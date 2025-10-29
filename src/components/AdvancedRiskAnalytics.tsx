import PortfolioWaterfallChart from './PortfolioWaterfallChart';
import GroupContagionGraph from './GroupContagionGraph';
import DelinquencyMatrixWithSlider from './DelinquencyMatrixWithSlider';
import ExposureFlowSankey from './ExposureFlowSankey';

/**
 * AdvancedRiskAnalytics Component
 *
 * Contains four advanced risk visualization charts:
 * 1. Portfolio Waterfall Chart - Month-over-month portfolio changes
 * 2. Group Contagion Graph - Network visualization of borrower relationships
 * 3. Delinquency Matrix with Time Slider - Historical delinquency heatmap
 * 4. Exposure Flow Sankey - Exposure distribution flow diagram
 *
 * This component has been extracted from the main Dashboard to keep it modular
 * and reusable in other drill-down sections or dedicated analytics pages.
 *
 * @returns Advanced Risk Analytics section with all four charts
 */
export default function AdvancedRiskAnalytics() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Advanced Risk Analytics</h2>

      {/* Waterfall Chart */}
      <div className="mb-6">
        <PortfolioWaterfallChart />
      </div>

      {/* Group Contagion Graph */}
      <div className="mb-6">
        <GroupContagionGraph />
      </div>

      {/* Delinquency Matrix with Time Slider */}
      <div className="mb-6">
        <DelinquencyMatrixWithSlider />
      </div>

      {/* Exposure Flow Sankey */}
      <div className="mb-6">
        <ExposureFlowSankey />
      </div>
    </section>
  );
}
