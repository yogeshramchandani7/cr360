import { useState } from 'react';
import ORAAssistantPanel from './ORAAssistantPanel';
import InsightsPanel from './InsightsPanel';
import NewsHubPanel from './NewsHubPanel';
import MacroIndicatorsPanel from './MacroIndicatorsPanel';
import InsightDrilldownOverlay from './InsightDrilldownOverlay';
import type { KPIInsight, MacroInsight } from '../../types';

export default function DailyBriefingView() {
  const [selectedInsight, setSelectedInsight] = useState<KPIInsight | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleEvidenceClick = (insight: KPIInsight | MacroInsight) => {
    // Evidence click just toggles expansion now - no additional action needed
    console.log('Evidence clicked for insight:', insight);
  };

  const handleDrilldown = (insight: KPIInsight | MacroInsight) => {
    // Open the drilldown overlay for KPI insights
    if ('kpiId' in insight) {
      setSelectedInsight(insight);
      setIsOverlayOpen(true);
    }
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
    // Delay clearing the insight to allow for animation
    setTimeout(() => setSelectedInsight(null), 300);
  };

  const handleCTAClick = (action: string) => {
    console.log('CTA clicked:', action);
    // TODO: Implement CTA actions (e.g., navigate to portfolio view, generate report)
    switch (action) {
      case 'view_exception_portfolio':
        // Navigate to customer view with exception filter
        console.log('Navigating to exception portfolio view');
        break;
      case 'generate_exception_report':
        // Generate and download report
        console.log('Generating exception report');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleChartDataClick = (filterField: string, filterValue: string, filterLabel: string) => {
    console.log('Chart data clicked:', { filterField, filterValue, filterLabel });
    // TODO: Apply filter and navigate to customer view or update charts
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column - ORA Assistant + Insights (66% width) */}
        <div className="lg:col-span-2 space-y-6">
          <ORAAssistantPanel />
          <InsightsPanel
            onEvidenceClick={handleEvidenceClick}
            onDrilldown={handleDrilldown}
          />
        </div>

        {/* Right Column - News Hub + Macro Indicators (33% width) */}
        <div className="lg:col-span-1 space-y-6">
          <NewsHubPanel />
          <MacroIndicatorsPanel />
        </div>
      </div>

      {/* Insight Drilldown Overlay */}
      <InsightDrilldownOverlay
        insight={selectedInsight}
        isOpen={isOverlayOpen}
        onClose={handleOverlayClose}
        onCTAClick={handleCTAClick}
        onChartDataClick={handleChartDataClick}
      />
    </div>
  );
}
