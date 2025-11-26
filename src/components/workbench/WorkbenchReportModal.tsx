import { useState, useEffect } from 'react';
import { X, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import type { WorkbenchItem } from '../../stores/workbenchStore';
import { getEvidenceChartsForInsight } from '../../lib/insightEvidenceData';

export interface ReportSelection {
  [insightId: string]: {
    insightSelected: boolean;
    evidenceCharts: {
      [chartId: string]: boolean;
    };
  };
}

interface WorkbenchReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  workbenchItems: WorkbenchItem[];
  onGenerate: (selections: ReportSelection) => Promise<void>;
}

export default function WorkbenchReportModal({
  isOpen,
  onClose,
  workbenchItems,
  onGenerate,
}: WorkbenchReportModalProps) {
  const [selections, setSelections] = useState<ReportSelection>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  // Initialize selections when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialSelections: ReportSelection = {};

      workbenchItems.forEach(item => {
        const evidenceCharts = getEvidenceChartsForInsight(item.insightId);
        const chartSelections: { [chartId: string]: boolean } = {};

        evidenceCharts.forEach(chart => {
          chartSelections[chart.id] = true; // Select all by default
        });

        initialSelections[item.insightId] = {
          insightSelected: true,
          evidenceCharts: chartSelections,
        };
      });

      setSelections(initialSelections);
      // Expand all insights by default
      setExpandedInsights(new Set(workbenchItems.map(item => item.insightId)));
    }
  }, [isOpen, workbenchItems]);

  // Toggle accordion
  const toggleInsight = (insightId: string) => {
    setExpandedInsights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(insightId)) {
        newSet.delete(insightId);
      } else {
        newSet.add(insightId);
      }
      return newSet;
    });
  };

  // Calculate counts
  const getSelectionCounts = () => {
    let insightCount = 0;
    let evidenceCount = 0;

    Object.values(selections).forEach(selection => {
      if (selection.insightSelected) {
        insightCount++;
      }
      evidenceCount += Object.values(selection.evidenceCharts).filter(Boolean).length;
    });

    return { insightCount, evidenceCount };
  };

  const { insightCount, evidenceCount } = getSelectionCounts();
  const hasSelection = insightCount > 0 || evidenceCount > 0;

  // Handle global select all
  const handleSelectAll = () => {
    const newSelections: ReportSelection = {};

    workbenchItems.forEach(item => {
      const evidenceCharts = getEvidenceChartsForInsight(item.insightId);
      const chartSelections: { [chartId: string]: boolean } = {};

      evidenceCharts.forEach(chart => {
        chartSelections[chart.id] = true;
      });

      newSelections[item.insightId] = {
        insightSelected: true,
        evidenceCharts: chartSelections,
      };
    });

    setSelections(newSelections);
  };

  // Handle global deselect all
  const handleDeselectAll = () => {
    const newSelections: ReportSelection = {};

    workbenchItems.forEach(item => {
      const evidenceCharts = getEvidenceChartsForInsight(item.insightId);
      const chartSelections: { [chartId: string]: boolean } = {};

      evidenceCharts.forEach(chart => {
        chartSelections[chart.id] = false;
      });

      newSelections[item.insightId] = {
        insightSelected: false,
        evidenceCharts: chartSelections,
      };
    });

    setSelections(newSelections);
  };

  // Handle insight checkbox toggle
  const handleInsightToggle = (insightId: string) => {
    const currentSelection = selections[insightId];
    const newState = !currentSelection.insightSelected;

    // Update all evidence charts to match insight state
    const newEvidenceCharts: { [chartId: string]: boolean } = {};
    Object.keys(currentSelection.evidenceCharts).forEach(chartId => {
      newEvidenceCharts[chartId] = newState;
    });

    setSelections({
      ...selections,
      [insightId]: {
        insightSelected: newState,
        evidenceCharts: newEvidenceCharts,
      },
    });
  };

  // Handle evidence checkbox toggle
  const handleEvidenceToggle = (insightId: string, chartId: string) => {
    const currentSelection = selections[insightId];
    const newEvidenceCharts = {
      ...currentSelection.evidenceCharts,
      [chartId]: !currentSelection.evidenceCharts[chartId],
    };

    // Check if any evidence is selected
    const anyEvidenceSelected = Object.values(newEvidenceCharts).some(Boolean);

    setSelections({
      ...selections,
      [insightId]: {
        insightSelected: anyEvidenceSelected, // Auto-select parent if any child selected
        evidenceCharts: newEvidenceCharts,
      },
    });
  };

  // Handle per-insight select all evidence
  const handleSelectAllEvidence = (insightId: string) => {
    const currentSelection = selections[insightId];
    const newEvidenceCharts: { [chartId: string]: boolean } = {};

    Object.keys(currentSelection.evidenceCharts).forEach(chartId => {
      newEvidenceCharts[chartId] = true;
    });

    setSelections({
      ...selections,
      [insightId]: {
        insightSelected: true,
        evidenceCharts: newEvidenceCharts,
      },
    });
  };

  // Handle per-insight deselect all evidence
  const handleDeselectAllEvidence = (insightId: string) => {
    const currentSelection = selections[insightId];
    const newEvidenceCharts: { [chartId: string]: boolean } = {};

    Object.keys(currentSelection.evidenceCharts).forEach(chartId => {
      newEvidenceCharts[chartId] = false;
    });

    setSelections({
      ...selections,
      [insightId]: {
        insightSelected: false,
        evidenceCharts: newEvidenceCharts,
      },
    });
  };

  // Handle generate button
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(selections);
      // Success - close modal
      onClose();
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSeverityColor = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
          {/* Header - Sticky */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Generate Workbench Report</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select insights and evidence charts to include in your report
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Global Controls */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={insightCount === workbenchItems.length && evidenceCount === Object.values(selections).reduce((sum, s) => sum + Object.keys(s.evidenceCharts).length, 0)}
                  onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({insightCount} insights, {evidenceCount} charts)
                </span>
              </label>
              <button
                onClick={handleDeselectAll}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-3">
              {workbenchItems.map((item) => {
                const evidenceCharts = getEvidenceChartsForInsight(item.insightId);
                const selection = selections[item.insightId];
                const isExpanded = expandedInsights.has(item.insightId);

                if (!selection) return null;

                const selectedEvidenceCount = Object.values(selection.evidenceCharts).filter(Boolean).length;

                return (
                  <div key={item.insightId} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Accordion Header */}
                    <div className="bg-gray-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selection.insightSelected}
                          onChange={() => handleInsightToggle(item.insightId)}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(item.severity)} flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {selectedEvidenceCount} of {evidenceCharts.length} evidence charts selected
                          </p>
                        </div>
                        <button
                          onClick={() => toggleInsight(item.insightId)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className="px-4 py-3 bg-white">
                        {/* Evidence Controls */}
                        <div className="flex items-center gap-2 mb-3">
                          <button
                            onClick={() => handleSelectAllEvidence(item.insightId)}
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                          >
                            Select All Evidence
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDeselectAllEvidence(item.insightId)}
                            className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                          >
                            Deselect All Evidence
                          </button>
                        </div>

                        {/* Evidence Checkboxes */}
                        <div className="space-y-2">
                          {evidenceCharts.map((chart) => (
                            <label key={chart.id} className="flex items-start gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selection.evidenceCharts[chart.id] || false}
                                onChange={() => handleEvidenceToggle(item.insightId, chart.id)}
                                className="mt-0.5 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {chart.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer - Sticky */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {insightCount} {insightCount === 1 ? 'insight' : 'insights'}, {evidenceCount} {evidenceCount === 1 ? 'chart' : 'charts'} selected
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!hasSelection || isGenerating}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  {isGenerating ? 'Generating...' : `Generate Report (${insightCount}, ${evidenceCount})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
