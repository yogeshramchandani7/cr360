import ORAAssistantPanel from './ORAAssistantPanel';
import InsightsPanel from './InsightsPanel';
import NewsHubPanel from './NewsHubPanel';
import MacroIndicatorsPanel from './MacroIndicatorsPanel';
import type { KPIInsight, MacroInsight } from '../../types';

export default function DailyBriefingView() {
  const handleEvidenceClick = (insight: KPIInsight | MacroInsight) => {
    // Evidence click just toggles expansion now - no additional action needed
    console.log('Evidence clicked for insight:', insight);
  };

  const handleDrilldown = (insight: KPIInsight | MacroInsight) => {
    // No longer needed - Evidence button opens in new tab
    console.log('Drilldown for insight:', insight);
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
    </div>
  );
}
