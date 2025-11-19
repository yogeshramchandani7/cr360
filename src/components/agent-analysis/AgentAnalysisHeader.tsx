import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Download, Loader2 } from 'lucide-react';
import type { RiskItem } from '../../types';

interface AgentAnalysisHeaderProps {
  riskItem: RiskItem;
  onDownloadReport?: () => void;
  isGeneratingPDF?: boolean;
}

/**
 * AgentAnalysisHeader - Header section for agent analysis page
 * Shows breadcrumb, title, status, and actions
 */
export default function AgentAnalysisHeader({ riskItem, onDownloadReport, isGeneratingPDF }: AgentAnalysisHeaderProps) {
  const getStatusBadgeStyles = (status: RiskItem['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusLabel = (status: RiskItem['status']) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getPriorityBadgeStyles = (priority: RiskItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <Link
        to="/risk-hub"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Risk Hub
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
            <BarChart3 className="w-10 h-10 text-teal-600" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {riskItem.actionTitle}
            </h1>

            <div className="flex items-center gap-3 flex-wrap mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyles(
                  riskItem.status
                )}`}
              >
                {formatStatusLabel(riskItem.status)}
              </span>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeStyles(
                  riskItem.priority
                )}`}
              >
                {riskItem.priority.charAt(0).toUpperCase() + riskItem.priority.slice(1)} Priority
              </span>

              {riskItem.sourceInsightTitle && (
                <span className="text-sm text-gray-600">
                  From: <span className="font-medium text-gray-900">{riskItem.sourceInsightTitle}</span>
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm">
              Risk Item ID: <span className="font-mono text-gray-900">{riskItem.id}</span>
            </p>
          </div>
        </div>

        {/* Download Report Button */}
        {onDownloadReport && (
          <button
            onClick={onDownloadReport}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Report
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
