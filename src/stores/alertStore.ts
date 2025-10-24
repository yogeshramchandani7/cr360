import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AlertType = 'credit_limit' | 'rating_change' | 'delinquency' | 'concentration' | 'covenant' | 'anomaly';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'unread' | 'read' | 'dismissed' | 'resolved';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  companyId?: string;
  companyName?: string;
  metadata: {
    [key: string]: any;
  };
  createdAt: Date;
  readAt?: Date;
  dismissedAt?: Date;
  resolvedAt?: Date;
}

export interface AlertFilter {
  types?: AlertType[];
  severities?: AlertSeverity[];
  statuses?: AlertStatus[];
  dateRange?: { start: Date; end: Date };
  companyId?: string;
}

interface AlertStore {
  // State
  alerts: Alert[];
  filter: AlertFilter;
  isDrawerOpen: boolean;
  selectedAlert: Alert | null;
  notificationPreferences: {
    enableSound: boolean;
    enableDesktop: boolean;
    enableEmail: boolean;
    enableSMS: boolean;
    mutedTypes: AlertType[];
  };

  // Computed getters
  getUnreadCount: () => number;
  getCriticalCount: () => number;
  getFilteredAlerts: () => Alert[];
  getAlertsByCompany: (companyId: string) => Alert[];
  getAlertsByType: (type: AlertType) => Alert[];

  // Actions - Alert Management
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'status'>) => void;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  dismissAlert: (alertId: string) => void;
  resolveAlert: (alertId: string, resolution?: string) => void;
  deleteAlert: (alertId: string) => void;
  clearAllAlerts: () => void;

  // Actions - UI State
  setFilter: (filter: Partial<AlertFilter>) => void;
  clearFilter: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  selectAlert: (alert: Alert | null) => void;

  // Actions - Notification Preferences
  updateNotificationPreferences: (preferences: Partial<AlertStore['notificationPreferences']>) => void;
  muteAlertType: (type: AlertType) => void;
  unmuteAlertType: (type: AlertType) => void;
}

const generateAlertId = () => {
  return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useAlertStore = create<AlertStore>()(
  persist(
    (set, get) => ({
      // Initial state
      alerts: [],
      filter: {},
      isDrawerOpen: false,
      selectedAlert: null,
      notificationPreferences: {
        enableSound: true,
        enableDesktop: true,
        enableEmail: false,
        enableSMS: false,
        mutedTypes: [],
      },

      // Computed getters
      getUnreadCount: () => {
        return get().alerts.filter((alert) => alert.status === 'unread').length;
      },

      getCriticalCount: () => {
        return get().alerts.filter(
          (alert) => alert.severity === 'critical' && alert.status === 'unread'
        ).length;
      },

      getFilteredAlerts: () => {
        const { alerts, filter } = get();
        let filtered = [...alerts];

        if (filter.types && filter.types.length > 0) {
          filtered = filtered.filter((alert) => filter.types!.includes(alert.type));
        }

        if (filter.severities && filter.severities.length > 0) {
          filtered = filtered.filter((alert) => filter.severities!.includes(alert.severity));
        }

        if (filter.statuses && filter.statuses.length > 0) {
          filtered = filtered.filter((alert) => filter.statuses!.includes(alert.status));
        }

        if (filter.dateRange) {
          filtered = filtered.filter((alert) => {
            const alertDate = new Date(alert.createdAt);
            return (
              alertDate >= filter.dateRange!.start && alertDate <= filter.dateRange!.end
            );
          });
        }

        if (filter.companyId) {
          filtered = filtered.filter((alert) => alert.companyId === filter.companyId);
        }

        // Sort by creation date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return filtered;
      },

      getAlertsByCompany: (companyId: string) => {
        return get()
          .alerts.filter((alert) => alert.companyId === companyId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getAlertsByType: (type: AlertType) => {
        return get()
          .alerts.filter((alert) => alert.type === type)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      // Alert Management Actions
      addAlert: (alertData) => {
        const newAlert: Alert = {
          ...alertData,
          id: generateAlertId(),
          status: 'unread',
          createdAt: new Date(),
        };

        set((state) => ({
          alerts: [newAlert, ...state.alerts],
        }));

        // Trigger notification if not muted
        const { notificationPreferences } = get();
        if (!notificationPreferences.mutedTypes.includes(newAlert.type)) {
          // Play sound if enabled
          if (notificationPreferences.enableSound && newAlert.severity === 'critical') {
            // Could play a sound here
            console.log('🔔 Alert sound triggered');
          }

          // Show desktop notification if enabled
          if (notificationPreferences.enableDesktop && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification(newAlert.title, {
                body: newAlert.message,
                icon: '/favicon.ico',
                tag: newAlert.id,
              });
            }
          }
        }
      },

      markAsRead: (alertId) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId
              ? { ...alert, status: 'read' as AlertStatus, readAt: new Date() }
              : alert
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.status === 'unread'
              ? { ...alert, status: 'read' as AlertStatus, readAt: new Date() }
              : alert
          ),
        }));
      },

      dismissAlert: (alertId) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId
              ? { ...alert, status: 'dismissed' as AlertStatus, dismissedAt: new Date() }
              : alert
          ),
        }));
      },

      resolveAlert: (alertId, resolution) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId
              ? {
                  ...alert,
                  status: 'resolved' as AlertStatus,
                  resolvedAt: new Date(),
                  metadata: {
                    ...alert.metadata,
                    resolution,
                  },
                }
              : alert
          ),
        }));
      },

      deleteAlert: (alertId) => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== alertId),
        }));
      },

      clearAllAlerts: () => {
        set({ alerts: [] });
      },

      // UI State Actions
      setFilter: (newFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        }));
      },

      clearFilter: () => {
        set({ filter: {} });
      },

      openDrawer: () => {
        set({ isDrawerOpen: true });
      },

      closeDrawer: () => {
        set({ isDrawerOpen: false, selectedAlert: null });
      },

      toggleDrawer: () => {
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
      },

      selectAlert: (alert) => {
        set({ selectedAlert: alert });
        if (alert && alert.status === 'unread') {
          get().markAsRead(alert.id);
        }
      },

      // Notification Preferences Actions
      updateNotificationPreferences: (preferences) => {
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...preferences,
          },
        }));
      },

      muteAlertType: (type) => {
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            mutedTypes: [...state.notificationPreferences.mutedTypes, type],
          },
        }));
      },

      unmuteAlertType: (type) => {
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            mutedTypes: state.notificationPreferences.mutedTypes.filter((t) => t !== type),
          },
        }));
      },
    }),
    {
      name: 'alert-store',
      // Only persist alerts and preferences, not UI state
      partialize: (state) => ({
        alerts: state.alerts,
        notificationPreferences: state.notificationPreferences,
      }),
    }
  )
);
