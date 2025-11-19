import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRiskHubStore } from '../stores/riskHubStore';
import { getMockEvidenceCharts, generateUpdatedRecommendations, generatePostActionCharts } from '../lib/agentAnalysisHelpers';
import { getEvidenceChartsForInsight } from '../lib/insightEvidenceData';
import { generateAgentAnalysisReportPDF } from '../lib/pdfExport';
import AgentAnalysisLayout from '../components/agent-analysis/AgentAnalysisLayout';
import AgentAnalysisHeader from '../components/agent-analysis/AgentAnalysisHeader';
import AgentAnalysisOverview from '../components/agent-analysis/AgentAnalysisOverview';
import AgentAnalysisRecommendations from '../components/agent-analysis/AgentAnalysisRecommendations';
import AgentAnalysisEvidence from '../components/agent-analysis/AgentAnalysisEvidence';

export default function AgentAnalysisPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const items = useRiskHubStore((state) => state.items);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Find the risk item by ID
  const riskItem = items.find((item) => item.id === itemId);

  // If item not found, show error
  if (!riskItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h1>
          <p className="text-gray-600 mb-6">
            The risk action item with ID <span className="font-mono text-sm">{itemId}</span> could not be found.
          </p>
          <a
            href="/risk-hub"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Risk Hub
          </a>
        </div>
      </div>
    );
  }

  // Only show analysis for completed or closed items
  if (riskItem.status !== 'completed' && riskItem.status !== 'closed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Available</h1>
          <p className="text-gray-600 mb-6">
            Agent analysis is only available for completed or closed risk action items.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Current status: <span className="font-semibold capitalize">{riskItem.status.replace('_', ' ')}</span>
          </p>
          <a
            href="/risk-hub"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Risk Hub
          </a>
        </div>
      </div>
    );
  }

  // Get evidence charts from source insight, or use mock charts if no source insight
  const hasSourceInsight = !!riskItem.sourceInsightId;
  const evidenceCharts = riskItem.sourceInsightId
    ? getEvidenceChartsForInsight(riskItem.sourceInsightId)
    : getMockEvidenceCharts(riskItem);

  // Generate post action charts for completed/closed items
  const showPrePostLayout = riskItem.status === 'closed' || riskItem.status === 'completed';
  const postActionCharts = showPrePostLayout ? generatePostActionCharts(evidenceCharts, riskItem) : undefined;

  // Get agent recommendations
  const agentRecommendation = generateUpdatedRecommendations(riskItem);

  // Download report functionality
  const handleDownloadReport = async () => {
    try {
      setIsGeneratingPDF(true);

      // Wait for charts to render (give them time to fully load)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate PDF
      await generateAgentAnalysisReportPDF(
        riskItem,
        agentRecommendation,
        evidenceCharts,
        postActionCharts,
        (progress, message) => {
          console.log(`PDF Generation: ${progress}% - ${message}`);
        }
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <AgentAnalysisLayout
      header={
        <AgentAnalysisHeader
          riskItem={riskItem}
          onDownloadReport={handleDownloadReport}
          isGeneratingPDF={isGeneratingPDF}
        />
      }
      overview={
        <AgentAnalysisOverview riskItem={riskItem} />
      }
      recommendations={
        <AgentAnalysisRecommendations riskItem={riskItem} />
      }
      evidence={
        <AgentAnalysisEvidence
          charts={evidenceCharts}
          hasSourceInsight={hasSourceInsight}
          riskItemStatus={riskItem.status}
          riskItem={riskItem}
        />
      }
    />
  );
}
