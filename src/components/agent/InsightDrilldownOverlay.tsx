import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Download } from 'lucide-react';
import type { KPIInsight } from '../../types';
import AgentRecommendationCard from './AgentRecommendationCard';
import InsightEvidenceChart from './InsightEvidenceChart';
import { getEvidenceChartsForInsight } from '../../lib/insightEvidenceData';
import { useRiskHubStore } from '../../stores/riskHubStore';
import { generateInsightReportPDF } from '../../lib/pdfExport';
import HiddenChartRenderer from './HiddenChartRenderer';

interface InsightDrilldownOverlayProps {
  insight: KPIInsight | null;
  isOpen: boolean;
  onClose: () => void;
  onCTAClick?: (action: string) => void;
  onChartDataClick?: (filterField: string, filterValue: string, filterLabel: string) => void;
}

/**
 * InsightDrilldownOverlay - 80% screen overlay for insight drilldown
 * Displays insight details, agent recommendations, and evidence charts
 */
export default function InsightDrilldownOverlay({
  insight,
  isOpen,
  onClose,
  onCTAClick,
  onChartDataClick
}: InsightDrilldownOverlayProps) {
  const navigate = useNavigate();
  const openRiskHubDrawer = useRiskHubStore((state) => state.openDrawer);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [chartsForPDF, setChartsForPDF] = useState<any[]>([]);

  // Handle Download Report
  const handleDownloadReport = async () => {
    if (!insight) return;

    try {
      setIsGeneratingPDF(true);

      // Get evidence charts
      const evidenceCharts = getEvidenceChartsForInsight(insight.id);

      // Render charts invisibly (even though they're already visible, this ensures they're all in DOM)
      setChartsForPDF(evidenceCharts);

      // Wait for charts to be fully rendered (give time for SVG/canvas rendering)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate PDF
      await generateInsightReportPDF(insight, evidenceCharts);

      // Clean up
      setChartsForPDF([]);

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
      setChartsForPDF([]);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handle Execute button click
  const handleExecute = () => {
    if (!insight) return;

    // Close the overlay
    onClose();

    // Navigate to Risk Hub
    navigate('/risk-hub');

    // Format action title from agent recommended actions with numbering
    const actionTitle = insight.agentRecommendation?.actionItems.length
      ? insight.agentRecommendation.actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')
      : insight.theme;

    // Format description with insight theme and implication
    const actionDescription = `${insight.theme}\n\n${insight.implication}`;

    // Open Risk Hub drawer with prefilled data
    setTimeout(() => {
      openRiskHubDrawer({
        actionTitle,
        actionDescription,
        priority: insight.severity === 'critical' ? 'high' : insight.severity === 'warning' ? 'medium' : 'low',
        sourceInsightId: insight.id,
        sourceInsightTitle: insight.theme,
      });
    }, 100);
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if closed or no insight selected
  if (!isOpen || !insight) {
    return null;
  }

  // Get evidence charts for this insight
  const evidenceCharts = getEvidenceChartsForInsight(insight.id);

  // Get severity color
  const getSeverityColor = () => {
    switch (insight.severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      case 'info':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay Container - 80% width, slides from right */}
      <div
        className="fixed inset-y-0 right-0 w-[80%] bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-overlay-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-start justify-between z-10 shadow-sm">
          <div className="flex-1 pr-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${getSeverityColor()}`} />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {insight.severity} Severity Insight
              </span>
            </div>
            <h2
              id="insight-overlay-title"
              className="text-3xl font-bold text-gray-900 leading-tight"
            >
              {insight.theme}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {/* Download Report Button */}
            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Download insight report"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? 'Generating...' : 'Download Report'}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close overlay"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-8 py-6 space-y-8">
          {/* Agent Recommendation */}
          {insight.agentRecommendation && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Recommended Actions</h3>
              <AgentRecommendationCard
                recommendation={insight.agentRecommendation}
                onCTAClick={onCTAClick}
                onExecute={handleExecute}
              />
            </section>
          )}

          {/* Evidence Charts */}
          {evidenceCharts.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Evidence
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {evidenceCharts.map((chart) => (
                  <InsightEvidenceChart
                    key={chart.id}
                    chart={chart}
                    onDataClick={onChartDataClick}
                  />
                ))}
              </div>
            </section>
          )}

          {/* No Evidence Message */}
          {evidenceCharts.length === 0 && (
            <section className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 text-base">
                Evidence charts are being prepared for this insight.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Check back soon for detailed supporting data.
              </p>
            </section>
          )}

          {/* CRO Actions (if no agent recommendation) */}
          {!insight.agentRecommendation && insight.croActions.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Actions</h3>
              <ul className="space-y-2.5">
                {insight.croActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-base text-gray-700 leading-relaxed flex-1">{action}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Last updated: {new Date(insight.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Hidden Chart Renderer for PDF Generation */}
        {chartsForPDF.length > 0 && <HiddenChartRenderer charts={chartsForPDF} />}
      </div>
    </>
  );
}
