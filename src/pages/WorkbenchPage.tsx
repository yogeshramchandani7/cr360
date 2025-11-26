import React, { useState } from 'react';
import { Trash2, ExternalLink, FileText, UserPlus, ChevronDown, ChevronRight, Edit2, Mail, MailCheck, X, Plus } from 'lucide-react';
import { useWorkbenchStore } from '../stores/workbenchStore';
import type { AssignmentData, Assignment } from '../stores/workbenchStore';
import { formatDate, formatRelativeTime } from '../lib/dateUtils';
import WorkbenchReportModal from '../components/workbench/WorkbenchReportModal';
import type { ReportSelection } from '../components/workbench/WorkbenchReportModal';
import { generateCollatedWorkbenchReport } from '../lib/collatedPdfExport';
import HiddenChartRenderer from '../components/agent/HiddenChartRenderer';
import { getEvidenceChartsForInsight } from '../lib/insightEvidenceData';
import AssignmentModal from '../components/workbench/AssignmentModal';

/**
 * WorkbenchPage - Displays all insights added to the workbench
 * Allows users to track and access frequently reviewed insights
 */
export default function WorkbenchPage() {
  const { items, removeInsight, updateLastAccessed, assignInsight, updateAssignment, deleteAssignment, openDrawer } = useWorkbenchStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [chartsForPDF, setChartsForPDF] = useState<any[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedInsightForAssignment, setSelectedInsightForAssignment] = useState<{
    insightId: string;
    title: string;
    existingAssignment?: Assignment;
  } | null>(null);

  // Get sorted items (newest first) - use useMemo to prevent infinite re-renders
  const workbenchItems = React.useMemo(() => {
    return useWorkbenchStore.getState().getWorkbenchItems();
  }, [useWorkbenchStore((state) => state.items)]);

  const handleDelete = (insightId: string, title: string) => {
    if (window.confirm(`Remove "${title}" from workbench?`)) {
      setDeletingId(insightId);
      setTimeout(() => {
        removeInsight(insightId);
        setDeletingId(null);
      }, 150); // Small delay for visual feedback
    }
  };

  const handleEvidenceClick = (insightId: string) => {
    // Update last accessed timestamp
    updateLastAccessed(insightId);
    // Open evidence page in new tab
    window.open(`/agent/evidence/${insightId}`, '_blank');
  };

  const handleGenerateReport = async (selections: ReportSelection) => {
    try {
      setIsGeneratingPDF(true);

      // Collect all selected evidence charts for rendering
      const allChartsToRender: any[] = [];
      Object.entries(selections).forEach(([insightId, selection]) => {
        if (selection.insightSelected) {
          const evidenceCharts = getEvidenceChartsForInsight(insightId);
          const selectedCharts = evidenceCharts.filter(
            chart => selection.evidenceCharts[chart.id]
          );
          allChartsToRender.push(...selectedCharts);
        }
      });

      // Render charts invisibly
      setChartsForPDF(allChartsToRender);

      // Wait for charts to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate PDF
      await generateCollatedWorkbenchReport(selections, workbenchItems);

      // Clean up
      setChartsForPDF([]);
    } catch (error) {
      console.error('Failed to generate collated report:', error);
      alert('Failed to generate report. Please try again.');
      setChartsForPDF([]);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const toggleRowExpansion = (insightId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(insightId)) {
        newSet.delete(insightId);
      } else {
        newSet.add(insightId);
      }
      return newSet;
    });
  };

  const handleCreateAssignment = (insightId: string, title: string) => {
    setSelectedInsightForAssignment({ insightId, title });
    setIsAssignModalOpen(true);
  };

  const handleEditAssignment = (insightId: string, title: string, assignment: Assignment) => {
    setSelectedInsightForAssignment({ insightId, title, existingAssignment: assignment });
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = (assignmentData: AssignmentData) => {
    if (!selectedInsightForAssignment) return;

    if (selectedInsightForAssignment.existingAssignment) {
      // Update existing assignment
      updateAssignment(
        selectedInsightForAssignment.insightId,
        selectedInsightForAssignment.existingAssignment.id,
        assignmentData
      );
    } else {
      // Create new assignment
      assignInsight(selectedInsightForAssignment.insightId, assignmentData);
      // Auto-expand the row to show the new assignment
      setExpandedRows(prev => new Set(prev).add(selectedInsightForAssignment.insightId));
    }

    // Close modal
    setIsAssignModalOpen(false);
    setSelectedInsightForAssignment(null);
  };

  const handleDeleteAssignment = (insightId: string, assignmentId: string, insightTitle: string) => {
    if (window.confirm(`Delete this assignment for "${insightTitle}"?`)) {
      deleteAssignment(insightId, assignmentId);
    }
  };

  const handleDownloadSingleInsightReport = async (insightId: string) => {
    try {
      setIsGeneratingPDF(true);

      // Find the workbench item
      const item = workbenchItems.find(i => i.insightId === insightId);
      if (!item) {
        alert('Insight not found');
        return;
      }

      // Get all evidence charts for this insight
      const evidenceCharts = getEvidenceChartsForInsight(insightId);

      // Render charts invisibly
      setChartsForPDF(evidenceCharts);

      // Wait for charts to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a selection object for just this one insight with all its charts
      const selection: ReportSelection = {
        [insightId]: {
          insightSelected: true,
          evidenceCharts: evidenceCharts.reduce((acc, chart) => {
            acc[chart.id] = true; // Select all charts for this insight
            return acc;
          }, {} as Record<string, boolean>)
        }
      };

      // Generate PDF
      await generateCollatedWorkbenchReport(selection, workbenchItems);

      // Clean up
      setChartsForPDF([]);
    } catch (error) {
      console.error('Failed to generate insight report:', error);
      alert('Failed to generate report. Please try again.');
      setChartsForPDF([]);
    } finally {
      setIsGeneratingPDF(false);
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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Empty state
  if (workbenchItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No insights in workbench yet</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Click the <span className="font-semibold">Workbench</span> button from any evidence page to start tracking insights here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workbench</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage insights you're actively reviewing ({workbenchItems.length} {workbenchItems.length === 1 ? 'item' : 'items'})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openDrawer()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Insight
          </button>
          <button
            onClick={() => setIsReportModalOpen(true)}
            disabled={workbenchItems.length === 0 || isGeneratingPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">

                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insight Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insight Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Action
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {workbenchItems.map((item) => {
                const isExpanded = expandedRows.has(item.insightId);
                const hasAssignments = item.assignments && item.assignments.length > 0;

                return (
                  <React.Fragment key={item.insightId}>
                    {/* Main Row */}
                    <tr
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        deletingId === item.insightId ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Expand/Collapse Button */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRowExpansion(item.insightId)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          disabled={!hasAssignments}
                        >
                          {hasAssignments ? (
                            isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Insight Title with severity indicator */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getSeverityColor(item.severity)} flex-shrink-0`} />
                          <button
                            onClick={() => handleEvidenceClick(item.insightId)}
                            className="text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors text-left"
                          >
                            {item.title}
                          </button>
                        </div>
                      </td>

                      {/* Insight Description */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-md">
                          {truncateText(item.description, 120)}
                        </p>
                      </td>

                      {/* Date Added */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">{formatDate(item.dateAdded)}</p>
                      </td>

                      {/* Last Action */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">{formatRelativeTime(item.lastAccessed)}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEvidenceClick(item.insightId)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                            title="View Evidence"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Evidence
                          </button>
                          <button
                            onClick={() => handleCreateAssignment(item.insightId, item.title)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            title="Add Action"
                          >
                            <UserPlus className="w-3 h-3" />
                            Add Action
                          </button>
                          <button
                            onClick={() => handleDelete(item.insightId, item.title)}
                            disabled={deletingId === item.insightId}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Close issue"
                            title="Close Issue"
                          >
                            <X className="w-3 h-3" />
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Assignment Sub-Cards */}
                    {isExpanded && hasAssignments && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-px bg-gray-300 flex-1" />
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Assignments ({item.assignments.length})
                              </span>
                              <div className="h-px bg-gray-300 flex-1" />
                            </div>

                            {/* Assignment Cards Grid */}
                            <div className="grid grid-cols-1 gap-3">
                              {item.assignments.map((assignment) => (
                                <div
                                  key={assignment.id}
                                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                                >
                                  <div className="grid grid-cols-6 gap-4 items-start">
                                    {/* Assignees */}
                                    <div className="col-span-1">
                                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Assignees
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {assignment.assignedTo.map((assignee, idx) => (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800"
                                          >
                                            {assignee}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-1">
                                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Description
                                      </div>
                                      <p className="text-sm text-gray-900">
                                        {assignment.description || '-'}
                                      </p>
                                    </div>

                                    {/* Remarks */}
                                    <div className="col-span-1">
                                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Remarks
                                      </div>
                                      <p className="text-sm text-gray-900">
                                        {assignment.remarks || '-'}
                                      </p>
                                    </div>

                                    {/* Assignment Date */}
                                    <div className="col-span-1">
                                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Assigned On
                                      </div>
                                      <p className="text-sm text-gray-900">
                                        {formatDate(assignment.assignmentDate)}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {formatRelativeTime(assignment.assignmentDate)}
                                      </p>
                                    </div>

                                    {/* Email Status & Assigned By */}
                                    <div className="col-span-1">
                                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Status
                                      </div>
                                      {/* Assignment Status Badge */}
                                      <div className="mb-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          assignment.status === 'Open'
                                            ? 'bg-blue-100 text-blue-800'
                                            : assignment.status === 'Completed'
                                            ? 'bg-green-100 text-green-800'
                                            : assignment.status === 'Closed'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-red-100 text-red-800' // Overdue
                                        }`}>
                                          {assignment.status}
                                        </span>
                                      </div>
                                      {/* Email Status */}
                                      <div className="flex items-center gap-1 mb-2">
                                        {assignment.emailSent ? (
                                          <MailCheck className="w-4 h-4 text-green-600" />
                                        ) : (
                                          <Mail className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span className="text-xs text-gray-600">
                                          {assignment.emailSent ? 'Email sent' : 'No email'}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        by {assignment.assignedBy}
                                      </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 flex items-start justify-end gap-2">
                                      <button
                                        onClick={() => handleEditAssignment(item.insightId, item.title, assignment)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Edit Assignment"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteAssignment(item.insightId, assignment.id, item.title)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete Assignment"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Generation Modal */}
      <WorkbenchReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        workbenchItems={workbenchItems}
        onGenerate={handleGenerateReport}
      />

      {/* Assignment Modal */}
      {selectedInsightForAssignment && (
        <AssignmentModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedInsightForAssignment(null);
          }}
          onAssign={handleAssignSubmit}
          insightTitle={selectedInsightForAssignment.title}
          existingAssignment={selectedInsightForAssignment.existingAssignment}
          insightId={selectedInsightForAssignment.insightId}
          onDownloadReport={() => handleDownloadSingleInsightReport(selectedInsightForAssignment.insightId)}
        />
      )}

      {/* Hidden Chart Renderer for PDF Generation */}
      {chartsForPDF.length > 0 && <HiddenChartRenderer charts={chartsForPDF} />}
    </div>
  );
}
