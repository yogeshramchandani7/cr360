/**
 * WorkbenchDrawer Component
 * Left-side sliding drawer for adding/editing workbench items with tasks
 */

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertTriangle, FileText } from 'lucide-react';
import { useWorkbenchStore, type Assignment } from '../../stores/workbenchStore';
import { getEvidenceChartsForInsight } from '../../lib/insightEvidenceData';

// Available assignees for tasks
const AVAILABLE_ASSIGNEES = [
  'Credit Head - South',
  'Credit Head - North',
  'Credit Head - East',
  'Credit Head - West',
  'Corporate Credit Department',
  'Retail Credit Department',
  'Credit Risk Analytics Department',
  'Credit Policy Department',
  'Model Risk Department',
  'Stress Testing Department',
];

interface TaskFormData {
  assignedTo: string[];
  description: string;
  remarks: string;
  sendEmail: boolean;
  selectedCharts: string[];
  includeCounterparties: boolean;
}

export default function WorkbenchDrawer() {
  const {
    isDrawerOpen,
    editingItem,
    pendingTasks,
    hasUnsavedChanges,
    closeDrawer,
    addPendingTask,
    removePendingTask,
    setHasUnsavedChanges,
    addItem,
    updateItem,
  } = useWorkbenchStore();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [createdBy] = useState('Current User'); // Auto-filled

  // Task form state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEvidenceSelector, setShowEvidenceSelector] = useState(false);
  const [taskForm, setTaskForm] = useState<TaskFormData>({
    assignedTo: [],
    description: '',
    remarks: '',
    sendEmail: false,
    selectedCharts: [],
    includeCounterparties: false,
  });

  // Warning modal state
  const [showWarning, setShowWarning] = useState(false);

  // Get available evidence charts for the insight
  const availableCharts = editingItem && editingItem.insightId && !editingItem.insightId.startsWith('customer-')
    ? getEvidenceChartsForInsight(editingItem.insightId)
    : [];

  // Initialize form when editing item changes
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description);
      setDueDate(editingItem.dueDate || '');
    } else {
      // Reset form for new item
      setTitle('');
      setDescription('');
      setDueDate('');
    }
    setShowTaskForm(false);
    setShowEvidenceSelector(false);
    setTaskForm({
      assignedTo: [],
      description: '',
      remarks: '',
      sendEmail: false,
      selectedCharts: [],
      includeCounterparties: false,
    });
  }, [editingItem]);

  // Handle close with warning if unsaved changes
  const handleClose = () => {
    if (hasUnsavedChanges || title !== (editingItem?.title || '') || description !== (editingItem?.description || '')) {
      setShowWarning(true);
    } else {
      closeDrawer();
    }
  };

  // Confirm close (discard changes)
  const confirmClose = () => {
    setShowWarning(false);
    closeDrawer();
  };

  // Cancel close (go back to editing)
  const cancelClose = () => {
    setShowWarning(false);
  };

  // Handle save
  const handleSave = () => {
    // Validation
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (editingItem) {
      // Update existing item
      updateItem(editingItem.insightId, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || undefined,
        assignments: pendingTasks,
      });
    } else {
      // Create new item
      addItem({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || undefined,
        createdBy,
        assignments: pendingTasks,
      });
    }

    closeDrawer();
  };

  // Add task
  const handleAddTask = () => {
    // Validation
    if (taskForm.assignedTo.length === 0) {
      alert('Please select at least one assignee');
      return;
    }

    const newTask: Assignment = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assignedTo: taskForm.assignedTo,
      description: taskForm.description,
      remarks: taskForm.remarks,
      assignmentDate: new Date().toISOString(),
      emailSent: taskForm.sendEmail,
      assignedBy: createdBy,
      status: 'Open',
      responseAttachments: [],
      evidenceSelection: taskForm.selectedCharts.length > 0 ? {
        selectedCharts: taskForm.selectedCharts,
        includeCounterparties: taskForm.includeCounterparties,
      } : undefined,
    };

    addPendingTask(newTask);

    // Reset task form
    setTaskForm({
      assignedTo: [],
      description: '',
      remarks: '',
      sendEmail: false,
      selectedCharts: [],
      includeCounterparties: false,
    });
    setShowTaskForm(false);
    setShowEvidenceSelector(false);
  };

  // Toggle assignee selection
  const toggleAssignee = (assignee: string) => {
    setTaskForm(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(assignee)
        ? prev.assignedTo.filter(a => a !== assignee)
        : [...prev.assignedTo, assignee],
    }));
  };

  // Toggle chart selection
  const toggleChart = (chartId: string) => {
    setTaskForm(prev => ({
      ...prev,
      selectedCharts: prev.selectedCharts.includes(chartId)
        ? prev.selectedCharts.filter(c => c !== chartId)
        : [...prev.selectedCharts, chartId],
    }));
  };

  // Select all charts
  const selectAllCharts = () => {
    setTaskForm(prev => ({
      ...prev,
      selectedCharts: availableCharts.map(c => c.id),
    }));
  };

  // Deselect all charts
  const deselectAllCharts = () => {
    setTaskForm(prev => ({
      ...prev,
      selectedCharts: [],
    }));
  };

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingItem ? 'Edit Workbench Item' : 'Add to Workbench'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter title"
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter description"
              rows={4}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Created By (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created By
            </label>
            <input
              type="text"
              value={createdBy}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Tasks Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
              <button
                onClick={() => setShowTaskForm(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>

            {/* Task List */}
            {pendingTasks.length === 0 && !showTaskForm && (
              <p className="text-sm text-gray-500 text-center py-6">
                No tasks added yet. Click "Add Task" to create one.
              </p>
            )}

            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Assignees:
                      </span>
                      <span className="text-sm text-gray-900">
                        {task.assignedTo.join(', ')}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Description:</span> {task.description}
                      </p>
                    )}
                    {task.remarks && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Remarks:</span> {task.remarks}
                      </p>
                    )}
                    {task.evidenceSelection && (
                      <p className="text-sm text-gray-700 mt-2 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-medium">Evidence:</span>
                        <span>
                          {task.evidenceSelection.selectedCharts.length} chart{task.evidenceSelection.selectedCharts.length !== 1 ? 's' : ''} selected
                          {task.evidenceSelection.includeCounterparties ? ' • Counterparties included' : ' • Counterparties excluded'}
                        </span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removePendingTask(task.id)}
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {task.emailSent && (
                  <span className="inline-block text-xs text-gray-500 mt-1">
                    📧 Email notification enabled
                  </span>
                )}
              </div>
            ))}

            {/* Task Form */}
            {showTaskForm && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-900">New Task</h4>

                {/* Assignees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignees <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-white">
                    {AVAILABLE_ASSIGNEES.map((assignee) => (
                      <label key={assignee} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={taskForm.assignedTo.includes(assignee)}
                          onChange={() => toggleAssignee(assignee)}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">{assignee}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter task description"
                    rows={3}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={taskForm.remarks}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, remarks: e.target.value }))}
                    placeholder="Enter remarks"
                    rows={2}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Add Evidence */}
                {availableCharts.length > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowEvidenceSelector(!showEvidenceSelector)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      {showEvidenceSelector ? 'Hide Evidence' : 'Add Evidence'}
                      {taskForm.selectedCharts.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-700 rounded-full">
                          {taskForm.selectedCharts.length}
                        </span>
                      )}
                    </button>

                    {showEvidenceSelector && (
                      <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                        {/* Chart Selection Header */}
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-semibold text-gray-700">Select Evidence Charts</h5>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={selectAllCharts}
                              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                            >
                              Select All
                            </button>
                            <span className="text-gray-400">|</span>
                            <button
                              type="button"
                              onClick={deselectAllCharts}
                              className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Charts List */}
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-white">
                          {availableCharts.map((chart) => (
                            <label key={chart.id} className="flex items-start gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={taskForm.selectedCharts.includes(chart.id)}
                                onChange={() => toggleChart(chart.id)}
                                className="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                              />
                              <span className="text-sm text-gray-700 leading-tight">{chart.title}</span>
                            </label>
                          ))}
                        </div>

                        {/* Counterparties Option */}
                        <div className="pt-2 border-t border-gray-200">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={taskForm.includeCounterparties}
                              onChange={(e) => setTaskForm(prev => ({ ...prev, includeCounterparties: e.target.checked }))}
                              className="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-700">Include Counterparties Table</span>
                              <p className="text-xs text-gray-500 mt-0.5">Add detailed counterparty information to the evidence</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Email Notification */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taskForm.sendEmail}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, sendEmail: e.target.checked }))}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">Send email notification</span>
                  </label>
                </div>

                {/* Task Form Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTask}
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => {
                      setShowTaskForm(false);
                      setShowEvidenceSelector(false);
                      setTaskForm({
                        assignedTo: [],
                        description: '',
                        remarks: '',
                        sendEmail: false,
                        selectedCharts: [],
                        includeCounterparties: false,
                      });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Save
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Unsaved Changes</h3>
                <p className="text-sm text-gray-600">
                  You have unsaved changes. Are you sure you want to close without saving?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmClose}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Discard Changes
              </button>
              <button
                onClick={cancelClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
