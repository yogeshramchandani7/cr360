import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KPIInsight } from '../types';

/**
 * File attachment for assignment responses
 */
export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  base64Data: string;
  uploadedAt: string;
}

/**
 * Evidence selection for assignments
 */
export interface EvidenceSelection {
  selectedCharts: string[]; // Array of chart IDs to include
  includeCounterparties: boolean; // Whether to include counterparties table
}

/**
 * Individual assignment record
 */
export interface Assignment {
  id: string; // Unique ID for this assignment
  assignedTo: string[]; // Array of assignee names
  description?: string;
  remarks?: string;
  assignmentDate: string; // ISO timestamp
  emailSent: boolean;
  assignedBy: string; // Who created the assignment
  status: 'Open' | 'Completed' | 'Closed' | 'Overdue'; // Assignment status
  responseText?: string; // Response from assignee
  responseAttachments?: Attachment[]; // Files attached to response
  evidenceSelection?: EvidenceSelection; // Evidence charts selected for this task
}

/**
 * WorkbenchItem - Represents an insight added to the workbench
 */
export interface WorkbenchItem {
  insightId: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  dateAdded: string; // ISO timestamp
  lastAccessed: string; // ISO timestamp
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  createdBy: string; // User who created this item
  assignments: Assignment[]; // Array of assignment records
}

/**
 * Assignment data for workbench items
 */
export interface AssignmentData {
  assignedTo: string[]; // Array of assignee names
  description?: string;
  remarks?: string;
  sendEmail: boolean;
  status?: 'Open' | 'Completed' | 'Closed' | 'Overdue'; // Assignment status
  responseText?: string; // Response from assignee
  responseAttachments?: Attachment[]; // Files attached to response
}

/**
 * Migration helper: ensures all items have assignments array
 */
const migrateItem = (item: any): WorkbenchItem => {
  // If item already has assignments array, return as is
  if (Array.isArray(item.assignments)) {
    return item as WorkbenchItem;
  }

  // Migrate old format to new format
  const assignments: Assignment[] = [];

  // If old assignment fields exist, convert to first assignment
  if (item.assignedTo && item.assignedTo.length > 0) {
    assignments.push({
      id: `migrated-${Date.now()}`,
      assignedTo: item.assignedTo,
      description: item.assignmentDescription,
      remarks: item.assignmentRemarks,
      assignmentDate: item.assignmentDate || item.dateAdded,
      emailSent: item.emailSent || false,
      assignedBy: 'Legacy User',
    });
  }

  return {
    insightId: item.insightId,
    title: item.title,
    description: item.description,
    severity: item.severity,
    dateAdded: item.dateAdded,
    lastAccessed: item.lastAccessed,
    assignments,
  };
};

/**
 * WorkbenchStore - Manages workbench items with localStorage persistence
 */
interface WorkbenchStore {
  items: WorkbenchItem[];
  // Drawer state
  isDrawerOpen: boolean;
  editingItem: WorkbenchItem | null;
  pendingTasks: Assignment[];
  hasUnsavedChanges: boolean;
  // Item management
  addInsight: (insight: KPIInsight, dueDate?: string) => void;
  addItem: (item: Partial<WorkbenchItem>) => void;
  updateItem: (insightId: string, updates: Partial<WorkbenchItem>) => void;
  removeInsight: (insightId: string) => void;
  updateLastAccessed: (insightId: string) => void;
  assignInsight: (insightId: string, assignmentData: AssignmentData) => void;
  updateAssignment: (insightId: string, assignmentId: string, assignmentData: AssignmentData) => void;
  deleteAssignment: (insightId: string, assignmentId: string) => void;
  getWorkbenchItems: () => WorkbenchItem[];
  // Drawer management
  openDrawer: (item?: WorkbenchItem) => void;
  closeDrawer: () => void;
  setEditingItem: (item: WorkbenchItem | null) => void;
  addPendingTask: (task: Assignment) => void;
  removePendingTask: (taskId: string) => void;
  clearPendingTasks: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export const useWorkbenchStore = create<WorkbenchStore>()(
  persist(
    (set, get) => ({
      items: [],
      // Drawer state (not persisted)
      isDrawerOpen: false,
      editingItem: null,
      pendingTasks: [],
      hasUnsavedChanges: false,

      /**
       * Add or update an insight in the workbench
       * If insight already exists, updates lastAccessed timestamp
       */
      addInsight: (insight: KPIInsight, dueDate?: string) => {
        const existingItem = get().items.find(item => item.insightId === insight.id);
        const now = new Date().toISOString();

        if (existingItem) {
          // Update existing item's lastAccessed
          set(state => ({
            items: state.items.map(item =>
              item.insightId === insight.id
                ? { ...item, lastAccessed: now, dueDate: dueDate || item.dueDate }
                : item
            )
          }));
        } else {
          // Add new item
          const newItem: WorkbenchItem = {
            insightId: insight.id,
            title: insight.theme,
            description: insight.implication,
            severity: insight.severity,
            dateAdded: now,
            lastAccessed: now,
            dueDate,
            createdBy: 'Current User', // TODO: Replace with actual user
            assignments: [], // Initialize with empty assignments array
          };

          set(state => ({
            items: [newItem, ...state.items] // Add to beginning (newest first)
          }));
        }
      },

      /**
       * Add a custom workbench item (for customers, manual entries, etc.)
       */
      addItem: (item: Partial<WorkbenchItem>) => {
        const now = new Date().toISOString();
        const newItem: WorkbenchItem = {
          insightId: item.insightId || `item-${Date.now()}`,
          title: item.title || 'Untitled',
          description: item.description || '',
          severity: item.severity || 'info',
          dateAdded: now,
          lastAccessed: now,
          dueDate: item.dueDate,
          createdBy: item.createdBy || 'Current User',
          assignments: item.assignments || [],
        };

        set(state => ({
          items: [newItem, ...state.items]
        }));
      },

      /**
       * Update an existing workbench item
       */
      updateItem: (insightId: string, updates: Partial<WorkbenchItem>) => {
        const now = new Date().toISOString();
        set(state => ({
          items: state.items.map(item =>
            item.insightId === insightId
              ? { ...item, ...updates, lastAccessed: now }
              : item
          )
        }));
      },

      /**
       * Remove an insight from the workbench
       */
      removeInsight: (insightId: string) => {
        set(state => ({
          items: state.items.filter(item => item.insightId !== insightId)
        }));
      },

      /**
       * Update the lastAccessed timestamp for an insight
       */
      updateLastAccessed: (insightId: string) => {
        const now = new Date().toISOString();
        set(state => ({
          items: state.items.map(item =>
            item.insightId === insightId
              ? { ...item, lastAccessed: now }
              : item
          )
        }));
      },

      /**
       * Create a new assignment for an insight
       */
      assignInsight: (insightId: string, assignmentData: AssignmentData) => {
        const now = new Date().toISOString();
        const assignmentId = `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Simulate email sending if requested
        if (assignmentData.sendEmail && assignmentData.assignedTo.length > 0) {
          console.log('📧 Email Notification (Simulated)', {
            to: assignmentData.assignedTo.join(', '),
            subject: 'New Insight Assignment',
            body: `You have been assigned a new insight.\n\nDescription: ${assignmentData.description || 'N/A'}\nRemarks: ${assignmentData.remarks || 'N/A'}`,
            timestamp: now,
            recipients: assignmentData.assignedTo
          });
        }

        const newAssignment: Assignment = {
          id: assignmentId,
          assignedTo: assignmentData.assignedTo,
          description: assignmentData.description,
          remarks: assignmentData.remarks,
          assignmentDate: now,
          emailSent: assignmentData.sendEmail,
          assignedBy: 'Current User', // Could be made dynamic in the future
          status: 'Open', // Default status for new assignments
          responseAttachments: [], // Initialize empty attachments array
        };

        set(state => ({
          items: state.items.map(item => {
            if (item.insightId === insightId) {
              // Ensure item has assignments array (migrate if needed)
              const migratedItem = migrateItem(item);
              return {
                ...migratedItem,
                assignments: [...migratedItem.assignments, newAssignment],
                lastAccessed: now
              };
            }
            return item;
          })
        }));
      },

      /**
       * Update an existing assignment
       */
      updateAssignment: (insightId: string, assignmentId: string, assignmentData: AssignmentData) => {
        const now = new Date().toISOString();

        // Simulate email sending if requested
        if (assignmentData.sendEmail && assignmentData.assignedTo.length > 0) {
          console.log('📧 Email Notification (Simulated)', {
            to: assignmentData.assignedTo.join(', '),
            subject: 'Updated Insight Assignment',
            body: `An insight assignment has been updated.\n\nDescription: ${assignmentData.description || 'N/A'}\nRemarks: ${assignmentData.remarks || 'N/A'}`,
            timestamp: now,
            recipients: assignmentData.assignedTo
          });
        }

        set(state => ({
          items: state.items.map(item =>
            item.insightId === insightId
              ? {
                  ...item,
                  assignments: item.assignments.map(assignment =>
                    assignment.id === assignmentId
                      ? {
                          ...assignment,
                          assignedTo: assignmentData.assignedTo,
                          description: assignmentData.description,
                          remarks: assignmentData.remarks,
                          emailSent: assignmentData.sendEmail,
                          status: assignmentData.status || assignment.status,
                          responseText: assignmentData.responseText,
                          responseAttachments: assignmentData.responseAttachments || assignment.responseAttachments,
                        }
                      : assignment
                  ),
                  lastAccessed: now
                }
              : item
          )
        }));
      },

      /**
       * Delete an assignment
       */
      deleteAssignment: (insightId: string, assignmentId: string) => {
        set(state => ({
          items: state.items.map(item =>
            item.insightId === insightId
              ? {
                  ...item,
                  assignments: item.assignments.filter(assignment => assignment.id !== assignmentId)
                }
              : item
          )
        }));
      },

      /**
       * Get all workbench items sorted by dateAdded (newest first)
       * Also ensures all items are migrated to new format
       */
      getWorkbenchItems: () => {
        const state = get();

        // Migrate all items to ensure they have assignments array
        const migratedItems = state.items.map(item => migrateItem(item));

        return migratedItems.sort((a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      },

      /**
       * Open the workbench drawer
       */
      openDrawer: (item?: WorkbenchItem) => {
        set({
          isDrawerOpen: true,
          editingItem: item || null,
          pendingTasks: item?.assignments || [],
          hasUnsavedChanges: false
        });
      },

      /**
       * Close the workbench drawer
       */
      closeDrawer: () => {
        set({
          isDrawerOpen: false,
          editingItem: null,
          pendingTasks: [],
          hasUnsavedChanges: false
        });
      },

      /**
       * Set the item being edited in the drawer
       */
      setEditingItem: (item: WorkbenchItem | null) => {
        set({ editingItem: item });
      },

      /**
       * Add a pending task (not yet saved)
       */
      addPendingTask: (task: Assignment) => {
        set(state => ({
          pendingTasks: [...state.pendingTasks, task],
          hasUnsavedChanges: true
        }));
      },

      /**
       * Remove a pending task
       */
      removePendingTask: (taskId: string) => {
        set(state => ({
          pendingTasks: state.pendingTasks.filter(task => task.id !== taskId),
          hasUnsavedChanges: true
        }));
      },

      /**
       * Clear all pending tasks
       */
      clearPendingTasks: () => {
        set({ pendingTasks: [], hasUnsavedChanges: false });
      },

      /**
       * Set unsaved changes flag
       */
      setHasUnsavedChanges: (hasChanges: boolean) => {
        set({ hasUnsavedChanges: hasChanges });
      },
    }),
    {
      name: 'workbench-storage', // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items, not drawer state
    }
  )
);
