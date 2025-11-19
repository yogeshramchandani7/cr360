import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Save, X, Download } from 'lucide-react';
import type { RiskItem } from '../../types';
import { useRiskHubStore } from '../../stores/riskHubStore';
import { getAllKPIInsights } from '../../lib/kpiInsights';
import { getEvidenceChartsForInsight } from '../../lib/insightEvidenceData';
import { generateInsightReportPDF } from '../../lib/pdfExport';
import HiddenChartRenderer from '../agent/HiddenChartRenderer';
import MultiSelect from '../MultiSelect';

interface RiskItemFormProps {
  editingItem: RiskItem | null;
  prefilledData: Partial<RiskItem> | null;
  onClose: () => void;
}

// Credit team options for assignee and reporter
const ASSIGNEE_OPTIONS = [
  'Wholesale Credit Team',
  'Corporate Credit Team',
  'Retail Credit Team',
  'Consumer Credit Team',
  'Credit Policy Team',
  'Credit Analytics Team',
  'Model Risk Team',
  'Distressed Asset Team',
  'Collections Team',
  'Credit Governance Team',
  'Stress Testing Team',
];
const REPORTER_OPTIONS = [
  'Chief Credit Officer',
  'Chief Risk Officer',
  'VP, Retail Risk',
  'VP, Corporate Risk',
  'Credit Head, South',
  'Credit Head, North',
  'Credit Head, East',
  'Credit Head, West',
];

export default function RiskItemForm({
  editingItem,
  prefilledData,
  onClose,
}: RiskItemFormProps) {
  const addItem = useRiskHubStore((state) => state.addItem);
  const updateItem = useRiskHubStore((state) => state.updateItem);

  // Initialize form data
  const [formData, setFormData] = useState<Omit<RiskItem, 'id' | 'createdAt' | 'updatedAt'>>({
    actionTitle: '',
    actionDescription: '',
    assignee: ['Credit Analytics Team'],
    reporter: 'Chief Credit Officer',
    priority: 'medium',
    status: 'open',
    dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 7 days from now
    lastActivity: 'Created',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [chartsForPDF, setChartsForPDF] = useState<any[]>([]);

  // Handle Download Report
  const handleDownloadReport = async () => {
    if (!formData.sourceInsightId) return;

    try {
      setIsGeneratingPDF(true);

      // Find the insight by ID
      const allInsights = getAllKPIInsights();
      const insight = allInsights.find((ins) => ins.id === formData.sourceInsightId);

      if (!insight) {
        alert('Source insight not found');
        return;
      }

      // Get evidence charts
      const evidenceCharts = getEvidenceChartsForInsight(insight.id);

      // Render charts invisibly in the DOM
      setChartsForPDF(evidenceCharts);

      // Wait for charts to be fully rendered (give extra time for hidden charts to render)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate PDF
      await generateInsightReportPDF(insight, evidenceCharts);

      // Clean up - remove hidden charts
      setChartsForPDF([]);

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
      // Clean up on error
      setChartsForPDF([]);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Load editing item or prefilled data
  useEffect(() => {
    if (editingItem) {
      setFormData({
        actionTitle: editingItem.actionTitle,
        actionDescription: editingItem.actionDescription,
        assignee: editingItem.assignee,
        reporter: editingItem.reporter,
        priority: editingItem.priority,
        status: editingItem.status,
        dueDate: editingItem.dueDate,
        lastActivity: editingItem.lastActivity,
        sourceInsightId: editingItem.sourceInsightId,
        sourceInsightTitle: editingItem.sourceInsightTitle,
        companyId: editingItem.companyId,
        companyName: editingItem.companyName,
      });
    } else if (prefilledData) {
      setFormData((prev) => ({
        ...prev,
        ...prefilledData,
      }));
    }
  }, [editingItem, prefilledData]);

  // Form validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.actionTitle.trim()) {
      newErrors.actionTitle = 'Action title is required';
    }

    if (!formData.actionDescription.trim()) {
      newErrors.actionDescription = 'Action description is required';
    }

    if (!formData.assignee || formData.assignee.length === 0) {
      newErrors.assignee = 'Please select at least one assignee team';
    }

    if (!formData.reporter) {
      newErrors.reporter = 'Reporter is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (editingItem) {
      // Update existing item
      updateItem(editingItem.id, formData);
    } else {
      // Add new item
      addItem(formData);
    }

    onClose();
  };

  // Handle field changes
  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Action Title */}
      <div className="space-y-2">
        <label htmlFor="actionTitle" className="block text-sm font-semibold text-gray-700">
          Action Title <span className="text-red-500">*</span>
        </label>
        <textarea
          id="actionTitle"
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors resize-none ${
            errors.actionTitle ? 'border-red-500' : 'border-oracle-border'
          }`}
          placeholder="Enter action title"
          value={formData.actionTitle}
          onChange={(e) => handleChange('actionTitle', e.target.value)}
        />
        {errors.actionTitle && (
          <p className="text-sm text-red-600">{errors.actionTitle}</p>
        )}
      </div>

      {/* Action Description */}
      <div className="space-y-2">
        <label htmlFor="actionDescription" className="block text-sm font-semibold text-gray-700">
          Action Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="actionDescription"
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors resize-none ${
            errors.actionDescription ? 'border-red-500' : 'border-oracle-border'
          }`}
          placeholder="Describe the action in detail..."
          value={formData.actionDescription}
          onChange={(e) => handleChange('actionDescription', e.target.value)}
        />
        {errors.actionDescription && (
          <p className="text-sm text-red-600">{errors.actionDescription}</p>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Assignee */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Assigned To <span className="text-red-500">*</span>
          </label>
          <MultiSelect
            label=""
            options={ASSIGNEE_OPTIONS}
            selected={formData.assignee}
            onChange={(selected) => handleChange('assignee', selected)}
            placeholder="Select teams..."
          />
          {errors.assignee && <p className="text-sm text-red-600">{errors.assignee}</p>}
        </div>

        {/* Reporter */}
        <div className="space-y-2">
          <label htmlFor="reporter" className="block text-sm font-semibold text-gray-700">
            Reporter <span className="text-red-500">*</span>
          </label>
          <select
            id="reporter"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
              errors.reporter ? 'border-red-500' : 'border-oracle-border'
            }`}
            value={formData.reporter}
            onChange={(e) => handleChange('reporter', e.target.value)}
          >
            {REPORTER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.reporter && <p className="text-sm text-red-600">{errors.reporter}</p>}
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Priority */}
        <div className="space-y-2">
          <label htmlFor="priority" className="block text-sm font-semibold text-gray-700">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            className="w-full px-4 py-2 border border-oracle-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value as RiskItem['priority'])}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            className="w-full px-4 py-2 border border-oracle-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as RiskItem['status'])}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            id="dueDate"
            type="date"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
              errors.dueDate ? 'border-red-500' : 'border-oracle-border'
            }`}
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
          {errors.dueDate && <p className="text-sm text-red-600">{errors.dueDate}</p>}
        </div>
      </div>

      {/* Source Insight Info (Read-only if present) */}
      {formData.sourceInsightTitle && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Linked to Insight</p>
            <p className="text-sm text-blue-700">{formData.sourceInsightTitle}</p>
          </div>

          {/* Download Report Button */}
          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isGeneratingPDF ? 'Generating Report...' : 'Download Source Insight Report'}
          </button>
        </div>
      )}

      {/* Company Info (Read-only if present) */}
      {formData.companyName && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-green-900 mb-1">Related Company</p>
          <p className="text-sm text-green-700">{formData.companyName}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-oracle-border">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          {editingItem ? 'Update Action' : 'Create Action'}
        </button>
      </div>

      {/* Hidden Chart Renderer for PDF Generation */}
      {chartsForPDF.length > 0 && <HiddenChartRenderer charts={chartsForPDF} />}
    </form>
  );
}
