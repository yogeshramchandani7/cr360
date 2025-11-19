import { format } from 'date-fns';
import { ExternalLink, Edit2, Trash2, BarChart3 } from 'lucide-react';
import type { RiskItem } from '../../types';
import { useRiskHubStore } from '../../stores/riskHubStore';

interface RiskHubTableProps {
  items: RiskItem[];
}

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

export default function RiskHubTable({ items }: RiskHubTableProps) {
  const openEditDrawer = useRiskHubStore((state) => state.openEditDrawer);
  const deleteItem = useRiskHubStore((state) => state.deleteItem);

  const handleRowClick = (item: RiskItem) => {
    // TODO: Open in new tab - placeholder for now
    console.log('Open item in new tab:', item.id);
  };

  const handleEdit = (e: React.MouseEvent, item: RiskItem) => {
    e.stopPropagation();
    openEditDrawer(item);
  };

  const handleDelete = (e: React.MouseEvent, item: RiskItem) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${item.actionTitle}"? This action cannot be undone.`
      )
    ) {
      deleteItem(item.id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-oracle-bgAlt border-b border-oracle-border">
            <th className="text-left p-3 text-sm font-semibold text-gray-700">
              Action Title
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700">
              Assignee
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700">
              Reporter
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700">
              Priority
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700">
              Due Date
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700">
              Last Activity
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700">
              Actions
            </th>
            <th className="text-left p-3 text-sm font-semibold text-gray-700">
              Agent Analysis
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-oracle-border hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleRowClick(item)}
            >
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.actionTitle}
                    </p>
                    {item.sourceInsightTitle && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        From: {item.sourceInsightTitle}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    const assignees = Array.isArray(item.assignee)
                      ? item.assignee
                      : typeof item.assignee === 'string'
                        ? [item.assignee]
                        : ['Credit Analytics Team'];

                    // Filter out single characters (corrupted data) and ensure we have valid team names
                    const validAssignees = assignees.filter(team =>
                      typeof team === 'string' && team.length > 3
                    );

                    // If no valid assignees, show a default
                    const teamsToShow = validAssignees.length > 0
                      ? validAssignees
                      : ['Credit Analytics Team'];

                    return teamsToShow.map((team, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        title={team}
                      >
                        {team.length > 20 ? team.substring(0, 18) + '...' : team}
                      </span>
                    ));
                  })()}
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xs font-semibold">
                    {item.reporter.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-900">{item.reporter}</span>
                </div>
              </td>
              <td className="p-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeStyles(
                    item.priority
                  )}`}
                >
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(
                    item.status
                  )}`}
                >
                  {formatStatusLabel(item.status)}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-900">
                  {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                </span>
              </td>
              <td className="p-3">
                <div>
                  <p className="text-sm text-gray-900">{item.lastActivity}</p>
                  {item.updatedAt && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(item.updatedAt), 'MMM dd, HH:mm')}
                    </p>
                  )}
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleEdit(e, item)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item)}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
              <td className="p-3">
                {(item.status === 'completed' || item.status === 'closed') ? (
                  <a
                    href={`/risk-hub/analysis/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center w-8 h-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors"
                    title="View Agent Analysis"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </a>
                ) : (
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 text-gray-300 cursor-not-allowed"
                    title="Available after completion"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
