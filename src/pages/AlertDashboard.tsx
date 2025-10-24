import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlertStore } from '../stores/alertStore';
import type { AlertType, AlertSeverity, AlertStatus } from '../stores/alertStore';
import { formatCurrency } from '../lib/utils';
import {
  AlertTriangle,
  Bell,
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import { simulateRealtimeAlerts } from '../lib/alertGenerator';

const severityConfig = {
  critical: { color: 'bg-red-100 text-red-900 border-red-300', icon: AlertTriangle, iconColor: 'text-red-600' },
  high: { color: 'bg-orange-100 text-orange-900 border-orange-300', icon: AlertCircle, iconColor: 'text-orange-600' },
  medium: { color: 'bg-yellow-100 text-yellow-900 border-yellow-300', icon: Bell, iconColor: 'text-yellow-600' },
  low: { color: 'bg-blue-100 text-blue-900 border-blue-300', icon: Bell, iconColor: 'text-blue-600' },
};

const typeLabels: Record<AlertType, string> = {
  credit_limit: 'Credit Limit',
  rating_change: 'Rating Change',
  delinquency: 'Delinquency',
  concentration: 'Concentration',
  covenant: 'Covenant',
  anomaly: 'Anomaly',
};

export default function AlertDashboard() {
  const navigate = useNavigate();

  // Alert store
  const alerts = useAlertStore((state) => state.alerts);
  const getFilteredAlerts = useAlertStore((state) => state.getFilteredAlerts);
  const filter = useAlertStore((state) => state.filter);
  const setFilter = useAlertStore((state) => state.setFilter);
  const clearFilter = useAlertStore((state) => state.clearFilter);
  const markAsRead = useAlertStore((state) => state.markAsRead);
  const markAllAsRead = useAlertStore((state) => state.markAllAsRead);
  const dismissAlert = useAlertStore((state) => state.dismissAlert);
  const resolveAlert = useAlertStore((state) => state.resolveAlert);

  // Local state
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const unread = alerts.filter(a => a.status === 'unread').length;
    const critical = alerts.filter(a => a.severity === 'critical').length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;
    const avgResolutionTime = 0; // Would calculate from resolved alerts in real implementation

    const typeBreakdown: Partial<Record<AlertType, number>> = {};
    alerts.forEach(alert => {
      typeBreakdown[alert.type] = (typeBreakdown[alert.type] || 0) + 1;
    });

    return { unread, critical, resolved, avgResolutionTime, typeBreakdown, total: alerts.length };
  }, [alerts]);

  // Filter alerts by search term
  const filteredAndSearchedAlerts = useMemo(() => {
    let result = getFilteredAlerts();

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(alert =>
        alert.title.toLowerCase().includes(term) ||
        alert.message.toLowerCase().includes(term) ||
        alert.companyName?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [getFilteredAlerts, searchTerm]);

  const handleAlertClick = (alertId: string) => {
    setSelectedAlert(alertId);
    const alert = alerts.find(a => a.id === alertId);
    if (alert && alert.status === 'unread') {
      markAsRead(alertId);
    }
  };

  const handleCompanyClick = (companyId?: string) => {
    if (companyId) {
      navigate(`/company/${companyId}`);
    }
  };

  const handleGenerateTestAlert = () => {
    simulateRealtimeAlerts();
  };

  const selectedAlertData = alerts.find(a => a.id === selectedAlert);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor and manage credit risk alerts across your portfolio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateTestAlert}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Generate Test Alert
          </button>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-oracle-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Alerts</p>
            <Bell className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.unread} unread</p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-red-700">Critical Alerts</p>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-900">{stats.critical}</p>
          <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-700">Resolved</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">{stats.resolved}</p>
          <p className="text-xs text-green-600 mt-1">
            {stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(0) : 0}% resolution rate
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-blue-700">Avg Resolution Time</p>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">2.3h</p>
          <p className="text-xs text-blue-600 mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Alert Type Breakdown */}
      <div className="bg-white rounded-lg p-6 border border-oracle-border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts by Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {(Object.keys(typeLabels) as AlertType[]).map(type => (
            <div key={type} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.typeBreakdown[type] || 0}</p>
              <p className="text-xs text-gray-600 mt-1">{typeLabels[type]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 border border-oracle-border">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "px-4 py-2 border rounded-lg font-medium transition-colors flex items-center gap-2",
              showFilters ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          {(filter.types || filter.severities || filter.statuses) && (
            <button
              onClick={clearFilter}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="space-y-2">
                {(Object.keys(typeLabels) as AlertType[]).map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filter.types?.includes(type) || false}
                      onChange={(e) => {
                        const types = filter.types || [];
                        setFilter({
                          types: e.target.checked
                            ? [...types, type]
                            : types.filter(t => t !== type)
                        });
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{typeLabels[type]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <div className="space-y-2">
                {(['critical', 'high', 'medium', 'low'] as AlertSeverity[]).map(severity => (
                  <label key={severity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filter.severities?.includes(severity) || false}
                      onChange={(e) => {
                        const severities = filter.severities || [];
                        setFilter({
                          severities: e.target.checked
                            ? [...severities, severity]
                            : severities.filter(s => s !== severity)
                        });
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{severity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="space-y-2">
                {(['unread', 'read', 'dismissed', 'resolved'] as AlertStatus[]).map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filter.statuses?.includes(status) || false}
                      onChange={(e) => {
                        const statuses = filter.statuses || [];
                        setFilter({
                          statuses: e.target.checked
                            ? [...statuses, status]
                            : statuses.filter(s => s !== status)
                        });
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alert List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert List */}
        <div className="bg-white rounded-lg border border-oracle-border overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Alerts ({filteredAndSearchedAlerts.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredAndSearchedAlerts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No alerts found</p>
              </div>
            ) : (
              filteredAndSearchedAlerts.map(alert => {
                const config = severityConfig[alert.severity];
                const Icon = config.icon;
                const isSelected = selectedAlert === alert.id;

                return (
                  <div
                    key={alert.id}
                    onClick={() => handleAlertClick(alert.id)}
                    className={cn(
                      "p-4 cursor-pointer transition-colors",
                      isSelected ? "bg-blue-50" : "hover:bg-gray-50",
                      alert.status === 'unread' && "bg-blue-50/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={cn(
                            "text-sm font-semibold",
                            alert.status === 'unread' ? "text-gray-900" : "text-gray-600"
                          )}>
                            {alert.title}
                          </h4>
                          {alert.status === 'unread' && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{alert.message}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full",
                            config.color
                          )}>
                            {alert.severity}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            {typeLabels[alert.type]}
                          </span>
                          {alert.companyName && (
                            <span className="text-xs text-gray-500">{alert.companyName}</span>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Alert Detail View */}
        <div className="bg-white rounded-lg border border-oracle-border overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Alert Details</h3>
          </div>
          <div className="p-6">
            {selectedAlertData ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          "px-3 py-1 text-sm font-medium rounded-full",
                          severityConfig[selectedAlertData.severity].color
                        )}>
                          {selectedAlertData.severity.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
                          {typeLabels[selectedAlertData.type]}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedAlertData.title}
                      </h4>
                      <p className="text-gray-600">{selectedAlertData.message}</p>
                    </div>
                  </div>

                  {selectedAlertData.companyName && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Affected Company</p>
                      <button
                        onClick={() => handleCompanyClick(selectedAlertData.companyId)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {selectedAlertData.companyName}
                      </button>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Metadata</p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {Object.entries(selectedAlertData.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="font-medium text-gray-900">
                            {typeof value === 'number' && key.includes('exposure')
                              ? formatCurrency(value)
                              : typeof value === 'number' && (key.includes('utilization') || key.includes('concentration') || key.includes('percentage'))
                              ? `${(value * 100).toFixed(1)}%`
                              : String(value)
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>Created: {new Date(selectedAlertData.createdAt).toLocaleString()}</p>
                    {selectedAlertData.readAt && (
                      <p>Read: {new Date(selectedAlertData.readAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  {selectedAlertData.status !== 'resolved' && (
                    <button
                      onClick={() => resolveAlert(selectedAlertData.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  {selectedAlertData.status !== 'dismissed' && (
                    <button
                      onClick={() => dismissAlert(selectedAlertData.id)}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Select an alert to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
