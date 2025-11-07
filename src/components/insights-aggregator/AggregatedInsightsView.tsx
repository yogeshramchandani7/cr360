import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { getAllKPIInsights, getKPIDisplayName } from '../../lib/kpiInsights';
import { generateMacroInsights } from '../../lib/macroInsightsGenerator';
import { generateInsightsBriefing } from '../../lib/insightsBriefingGenerator';
import type { BriefingData } from '../../lib/insightsBriefingGenerator';
import InsightCard from '../InsightCard';
import InsightsBriefingButton from './InsightsBriefingButton';
import InsightsBriefingDrawer from './InsightsBriefingDrawer';
import type { KPIInsight } from '../../types';
import { cn } from '../../lib/utils';

export default function AggregatedInsightsView() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['critical', 'warning']) // Critical and Warning expanded by default
  );
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);

  // Handler for navigating to drill-down page with insight
  const handleInsightClick = (insight: KPIInsight) => {
    navigate(`/kpi/${insight.kpiId}?insights=open&insightId=${insight.id}`);
  };

  // Get all insights (KPI + Macro)
  const allInsights = getAllKPIInsights();
  const macroInsights = generateMacroInsights();

  // Handler for generating briefing
  const handleGenerateBriefing = () => {
    const briefing = generateInsightsBriefing(allInsights, macroInsights);
    setBriefingData(briefing);
    setIsBriefingOpen(true);
  };

  // Sort insights by severity (Critical > Warning > Info)
  const processedInsights = useMemo(() => {
    const sorted = [...allInsights];
    sorted.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    return sorted;
  }, [allInsights]);

  // Group insights by severity
  const groupedInsights = useMemo(() => {
    return {
      critical: processedInsights.filter(i => i.severity === 'critical'),
      warning: processedInsights.filter(i => i.severity === 'warning'),
      info: processedInsights.filter(i => i.severity === 'info')
    };
  }, [processedInsights]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const SeveritySection = ({
    severity,
    insights,
    title,
    icon: Icon,
    bgColor,
    borderColor,
    textColor
  }: {
    severity: string;
    insights: KPIInsight[];
    title: string;
    icon: typeof AlertTriangle;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }) => {
    const isExpanded = expandedSections.has(severity);

    if (insights.length === 0) return null;

    return (
      <div className="mb-6">
        {/* Section Header */}
        <button
          onClick={() => toggleSection(severity)}
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200",
            bgColor,
            borderColor,
            "hover:shadow-md"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className={cn("w-6 h-6", textColor)} />
            <h3 className={cn("text-lg font-bold", textColor)}>
              {title}
            </h3>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-bold",
              bgColor === 'bg-red-50' ? 'bg-red-100 text-red-800' :
              bgColor === 'bg-amber-50' ? 'bg-amber-100 text-amber-800' :
              'bg-blue-100 text-blue-800'
            )}>
              {insights.length}
            </span>
          </div>
          <ChevronDown className={cn(
            "w-5 h-5 transition-transform duration-200",
            textColor,
            isExpanded && "rotate-180"
          )} />
        </button>

        {/* Section Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {insights.map(insight => (
              <InsightCard
                key={insight.id}
                insight={insight}
                showKpiLabel={true}
                kpiDisplayName={getKPIDisplayName(insight.kpiId)}
                onNavigate={handleInsightClick}
                showNavigationButton={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Lightbulb className="w-7 h-7 text-yellow-500" />
            Portfolio Insights
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {allInsights.length} insights from all KPI drilldowns
          </p>
        </div>

        {/* Briefing Button */}
        <InsightsBriefingButton onClick={handleGenerateBriefing} />
      </div>

      {/* Insights Sections */}
      {processedInsights.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Info className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Insights Available</h3>
          <p className="text-gray-600">
            No insights have been generated yet. Check back later for updates.
          </p>
        </div>
      ) : (
        <>
          <SeveritySection
            severity="critical"
            insights={groupedInsights.critical}
            title="Critical Insights"
            icon={AlertTriangle}
            bgColor="bg-red-50"
            borderColor="border-red-300"
            textColor="text-red-700"
          />
          <SeveritySection
            severity="warning"
            insights={groupedInsights.warning}
            title="Warning Insights"
            icon={AlertTriangle}
            bgColor="bg-amber-50"
            borderColor="border-amber-300"
            textColor="text-amber-700"
          />
          <SeveritySection
            severity="info"
            insights={groupedInsights.info}
            title="Informational Insights"
            icon={Info}
            bgColor="bg-blue-50"
            borderColor="border-blue-300"
            textColor="text-blue-700"
          />
        </>
      )}

      {/* Briefing Drawer */}
      {briefingData && (
        <InsightsBriefingDrawer
          isOpen={isBriefingOpen}
          onClose={() => setIsBriefingOpen(false)}
          briefing={briefingData}
        />
      )}
    </div>
  );
}
