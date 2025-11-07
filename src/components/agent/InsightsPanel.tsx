import { useState, useEffect } from 'react';
import InsightCard from './InsightCard';
import { getAllKPIInsights } from '../../lib/kpiInsights';
import { generateMacroInsights } from '../../lib/macroInsightsGenerator';
import type { KPIInsight, MacroInsight } from '../../types';

interface DisplayInsight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  keyInsights: string[];
  source: KPIInsight | MacroInsight;
}

interface InsightsPanelProps {
  onEvidenceClick: (insight: KPIInsight | MacroInsight) => void;
  onDrilldown?: (insight: KPIInsight | MacroInsight) => void;
}

export default function InsightsPanel({ onEvidenceClick, onDrilldown }: InsightsPanelProps) {
  const [displayInsights, setDisplayInsights] = useState<DisplayInsight[]>([]);
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);

  useEffect(() => {
    // Combine KPI insights and macro insights
    const kpiInsights = getAllKPIInsights();
    const macroInsights = generateMacroInsights();

    // Convert to display format
    const kpiDisplay: DisplayInsight[] = kpiInsights.map((insight) => ({
      id: insight.id,
      title: insight.theme,
      description: insight.implication,
      severity: insight.severity,
      keyInsights: insight.keyInsights,
      source: insight,
    }));

    const macroDisplay: DisplayInsight[] = macroInsights.map((insight) => ({
      id: insight.id,
      title: insight.theme,
      description: insight.implication,
      severity: insight.severity,
      keyInsights: [], // Macro insights don't have key insights array
      source: insight,
    }));

    // Combine and sort by severity
    const combined = [...kpiDisplay, ...macroDisplay].sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    setDisplayInsights(combined);
  }, []);

  const handleEvidenceClick = (insightId: string, source: KPIInsight | MacroInsight) => {
    // Toggle expansion: if already expanded, collapse it; otherwise expand it
    setExpandedInsightId(expandedInsightId === insightId ? null : insightId);
    onEvidenceClick(source);
  };

  const handleDrilldown = (source: KPIInsight | MacroInsight) => {
    if (onDrilldown) {
      onDrilldown(source);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 h-full overflow-y-auto">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Insights</h2>

      {/* Insights List */}
      <div>
        {displayInsights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
            severity={insight.severity}
            keyInsights={insight.keyInsights}
            isExpanded={expandedInsightId === insight.id}
            onEvidenceClick={() => handleEvidenceClick(insight.id, insight.source)}
            onDrilldown={
              insight.keyInsights.length > 0
                ? () => handleDrilldown(insight.source)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
