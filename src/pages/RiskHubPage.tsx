import { Plus, AlertCircle } from 'lucide-react';
import { useRiskHubStore } from '../stores/riskHubStore';
import RiskHubTable from '../components/risk-hub/RiskHubTable';
import RiskHubDrawer from '../components/risk-hub/RiskHubDrawer';

export default function RiskHubPage() {
  const items = useRiskHubStore((state) => state.items);
  const openDrawer = useRiskHubStore((state) => state.openDrawer);
  const filters = useRiskHubStore((state) => state.filters);

  // Apply filters
  let filteredItems = [...items];

  if (filters.priorities && filters.priorities.length > 0) {
    filteredItems = filteredItems.filter((item) =>
      filters.priorities!.includes(item.priority)
    );
  }

  if (filters.statuses && filters.statuses.length > 0) {
    filteredItems = filteredItems.filter((item) =>
      filters.statuses!.includes(item.status)
    );
  }

  if (filters.assignees && filters.assignees.length > 0) {
    filteredItems = filteredItems.filter((item) => {
      const assigneeArray = Array.isArray(item.assignee) ? item.assignee : [item.assignee];
      return assigneeArray.some(a => filters.assignees!.includes(a));
    });
  }

  if (filters.dateRange) {
    filteredItems = filteredItems.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate >= filters.dateRange!.start && itemDate <= filters.dateRange!.end
      );
    });
  }

  // Sort by creation date (newest first)
  filteredItems.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calculate stats
  const stats = {
    total: items.length,
    open: items.filter((item) => item.status === 'open').length,
    inProgress: items.filter((item) => item.status === 'in_progress').length,
    completed: items.filter((item) => item.status === 'completed').length,
    high: items.filter((item) => item.priority === 'high').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Hub</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage action items from insights and risk analysis
          </p>
        </div>
        <button
          onClick={() => openDrawer()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          New Action
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-oracle-border p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Total Actions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-oracle-border p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Open</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.open}</p>
        </div>
        <div className="bg-white rounded-lg border border-oracle-border p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg border border-oracle-border p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg border border-oracle-border p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">High Priority</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.high}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-oracle-border">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No action items yet
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Create your first action item to start tracking risk management tasks
            </p>
            <button
              onClick={() => openDrawer()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Action Item
            </button>
          </div>
        ) : (
          <RiskHubTable items={filteredItems} />
        )}
      </div>

      {/* Drawer */}
      <RiskHubDrawer />
    </div>
  );
}
