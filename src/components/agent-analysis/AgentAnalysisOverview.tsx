import { format } from 'date-fns';
import { Calendar, User, UserCircle, Clock } from 'lucide-react';
import type { RiskItem } from '../../types';

interface AgentAnalysisOverviewProps {
  riskItem: RiskItem;
}

/**
 * AgentAnalysisOverview - Overview section showing risk item details
 * Displays description, metadata, and timeline information
 */
export default function AgentAnalysisOverview({ riskItem }: AgentAnalysisOverviewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Action Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Action Description
          </h3>
          <p className="text-gray-900 leading-relaxed">
            {riskItem.actionDescription}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          {/* Assignee */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Assignee
              </p>
              <p className="text-sm font-medium text-gray-900">{riskItem.assignee}</p>
            </div>
          </div>

          {/* Reporter */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Reporter
              </p>
              <p className="text-sm font-medium text-gray-900">{riskItem.reporter}</p>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Due Date
              </p>
              <p className="text-sm font-medium text-gray-900">
                {format(new Date(riskItem.dueDate), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>

          {/* Last Activity */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Last Activity
              </p>
              <p className="text-sm font-medium text-gray-900">{riskItem.lastActivity}</p>
              {riskItem.updatedAt && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {format(new Date(riskItem.updatedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Source Insight (if available) */}
        {riskItem.sourceInsightTitle && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Source Insight
            </h3>
            <p className="text-sm text-gray-900">{riskItem.sourceInsightTitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}
