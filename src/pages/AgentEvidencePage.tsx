import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Wrench } from 'lucide-react';
import type { KPIInsight } from '../types';
import InsightEvidenceChart from '../components/agent/InsightEvidenceChart';
import { getEvidenceChartsForInsight } from '../lib/insightEvidenceData';
import { getAllKPIInsights } from '../lib/kpiInsights';
import { generateInsightReportPDF } from '../lib/pdfExport';
import HiddenChartRenderer from '../components/agent/HiddenChartRenderer';
import { useFilterStore } from '../stores/filterStore';
import { useWorkbenchStore } from '../stores/workbenchStore';

/**
 * AgentEvidencePage - Standalone page for viewing insight evidence
 * Opens in a new browser tab when user clicks Evidence button
 */
export default function AgentEvidencePage() {
  const { insightId } = useParams<{ insightId: string }>();
  const navigate = useNavigate();
  const setDrillDownFilter = useFilterStore((state) => state.setDrillDownFilter);
  const addInsight = useWorkbenchStore((state) => state.addInsight);
  const [insight, setInsight] = useState<KPIInsight | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [chartsForPDF, setChartsForPDF] = useState<any[]>([]);

  // Load insight data
  useEffect(() => {
    if (!insightId) return;

    // Get all insights and find the one matching this ID
    const allInsights = getAllKPIInsights();
    const foundInsight = allInsights.find(i => i.id === insightId);

    if (foundInsight) {
      setInsight(foundInsight);
    } else {
      console.error('Insight not found:', insightId);
    }
  }, [insightId]);

  // Handle Download Report
  const handleDownloadReport = async () => {
    if (!insight) return;

    try {
      setIsGeneratingPDF(true);

      // Get evidence charts
      const evidenceCharts = getEvidenceChartsForInsight(insight.id);

      // Render charts invisibly
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

  // Handle Workbench button click
  const handleWorkbenchClick = () => {
    if (!insight) return;

    // Add insight to workbench
    addInsight(insight);

    // Open workbench in new tab
    window.open('/workbench', '_blank');
  };

  // Handle chart data click - navigate to Customer View with filter
  const handleChartDataClick = (filterField: string, filterValue: string, filterLabel: string) => {
    console.log('Chart data clicked:', { filterField, filterValue, filterLabel });

    // Set the drilldown filter
    setDrillDownFilter({
      field: filterField,
      value: filterValue,
      label: filterLabel,
      source: insight?.theme || 'Evidence Chart'
    });

    // Navigate to Customer View
    navigate('/customer');
  };

  // Get severity color
  const getSeverityColor = () => {
    if (!insight) return 'bg-gray-400';
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

  // Get evidence charts for this insight
  const evidenceCharts = insight ? getEvidenceChartsForInsight(insight.id) : [];

  // Loading or not found state
  if (!insightId || !insight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">
            {!insightId ? 'Invalid insight ID' : 'Loading insight evidence...'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
          >
            Back to Agent Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        {/* Back to Agent Hub */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Agent Hub
        </button>

        {/* Insight Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-3 h-3 rounded-full ${getSeverityColor()}`} />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {insight.severity} Severity Insight
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-6">
          {insight.theme}
        </h1>

        {/* Action Buttons Below Headline */}
        <div className="flex items-center gap-3">
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

          {/* Workbench Button */}
          <button
            onClick={handleWorkbenchClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            aria-label="Add to workbench and open"
          >
            <Wrench className="w-4 h-4" />
            Add in workbench
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 max-w-[1600px] mx-auto">
        {/* Evidence Charts */}
        {evidenceCharts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Evidence
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {evidenceCharts.map((chart) => (
                <InsightEvidenceChart
                  key={chart.id}
                  chart={chart}
                  onDataClick={handleChartDataClick}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Evidence Message */}
        {evidenceCharts.length === 0 && (
          <section className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
          <section className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
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
      <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 mt-8">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
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
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Hidden Chart Renderer for PDF Generation */}
      {chartsForPDF.length > 0 && <HiddenChartRenderer charts={chartsForPDF} />}
    </div>
  );
}
