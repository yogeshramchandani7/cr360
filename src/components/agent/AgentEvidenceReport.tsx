/**
 * AgentEvidenceReport Component
 * Displays evidence charts and analysis for agent-generated reports
 */

import { useState } from 'react';
import { AlertTriangle, Download, Wrench } from 'lucide-react';
import InsightEvidenceChart from './InsightEvidenceChart';
import HiddenChartRenderer from './HiddenChartRenderer';
import { generateInsightReportPDF } from '../../lib/pdfExport';
import { useWorkbenchStore } from '../../stores/workbenchStore';
import type { EvidenceChart, KPIInsight } from '../../types';

interface AgentEvidenceReportProps {
  title: string;
  subtitle?: string;
  charts: EvidenceChart[];
  insight?: KPIInsight;
}

export default function AgentEvidenceReport({ title, subtitle, charts, insight }: AgentEvidenceReportProps) {
  const addInsight = useWorkbenchStore((state) => state.addInsight);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [chartsForPDF, setChartsForPDF] = useState<any[]>([]);

  // Handle PDF download
  const handleDownloadReport = async () => {
    if (!insight) return;

    setIsGeneratingPDF(true);
    try {
      // Capture all chart images
      const chartImages: any[] = [];
      for (const chart of charts) {
        const element = document.getElementById(`chart-${chart.id}`);
        if (element) {
          chartImages.push({
            element,
            title: chart.title,
            keyHighlight: chart.keyHighlight
          });
        }
      }
      setChartsForPDF(chartImages);

      // Small delay to ensure charts are rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate PDF
      await generateInsightReportPDF(insight, charts);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
      setChartsForPDF([]);
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

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      {/* Hidden chart renderer for PDF generation */}
      {chartsForPDF.length > 0 && <HiddenChartRenderer charts={chartsForPDF} />}

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        {insight && (
          <div className="flex items-center gap-3 mt-4">
            {/* Download Report Button */}
            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
        )}
      </div>

      {/* Evidence Section */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Evidence</h3>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.map((chart) => (
            <InsightEvidenceChart key={chart.id} chart={chart} />
          ))}
        </div>
      </div>
    </div>
  );
}
