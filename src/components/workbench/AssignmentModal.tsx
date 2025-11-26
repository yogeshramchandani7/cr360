import { useState, useRef, useEffect } from 'react';
import { X, UserPlus, ChevronDown, Check, Download, Paperclip, Trash2 } from 'lucide-react';
import type { AssignmentData, Assignment, Attachment } from '../../stores/workbenchStore';

const ASSIGNEES = [
  'Credit Head South',
  'Credit Head North',
  'Credit Head East',
  'Credit Head West',
  'Corporate Credit Department',
  'Retail Credit Department',
  'Credit Risk Analytics Department',
  'Credit Policy Department',
  'Model Risk Department',
  'Stress Testing Department',
];

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: AssignmentData) => void;
  insightTitle: string;
  existingAssignment?: Assignment; // For edit mode
  insightId?: string; // For downloading report
  onDownloadReport?: () => void; // Callback to download report for this insight
}

export default function AssignmentModal({
  isOpen,
  onClose,
  onAssign,
  insightTitle,
  existingAssignment,
  insightId,
  onDownloadReport,
}: AssignmentModalProps) {
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    existingAssignment?.assignedTo || []
  );
  const [description, setDescription] = useState(existingAssignment?.description || '');
  const [remarks, setRemarks] = useState(existingAssignment?.remarks || '');
  const [sendEmail, setSendEmail] = useState(existingAssignment?.emailSent || false);
  const [status, setStatus] = useState<'Open' | 'Completed' | 'Closed' | 'Overdue'>(
    existingAssignment?.status || 'Open'
  );
  const [responseText, setResponseText] = useState(existingAssignment?.responseText || '');
  const [attachments, setAttachments] = useState<Attachment[]>(
    existingAssignment?.responseAttachments || []
  );
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when existingAssignment changes
  useEffect(() => {
    if (existingAssignment) {
      setSelectedAssignees(existingAssignment.assignedTo);
      setDescription(existingAssignment.description || '');
      setRemarks(existingAssignment.remarks || '');
      setSendEmail(existingAssignment.emailSent);
      setStatus(existingAssignment.status);
      setResponseText(existingAssignment.responseText || '');
      setAttachments(existingAssignment.responseAttachments || []);
    } else {
      setSelectedAssignees([]);
      setDescription('');
      setRemarks('');
      setSendEmail(false);
      setStatus('Open');
      setResponseText('');
      setAttachments([]);
    }
    setError('');
  }, [existingAssignment]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleAssignee = (assignee: string) => {
    setSelectedAssignees(prev => {
      if (prev.includes(assignee)) {
        return prev.filter(a => a !== assignee);
      } else {
        return [...prev, assignee];
      }
    });
    setError('');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setError(`File "${file.name}" is too large. Maximum size is 1MB.`);
        continue;
      }

      try {
        // Convert file to base64
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const attachment: Attachment = {
          id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          base64Data,
          uploadedAt: new Date().toISOString(),
        };

        newAttachments.push(attachment);
      } catch (error) {
        console.error('Error reading file:', error);
        setError(`Failed to read file "${file.name}"`);
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (selectedAssignees.length === 0) {
      setError('Please select at least one assignee');
      return;
    }

    // Validate response is required for Completed/Closed status
    if (existingAssignment && (status === 'Completed' || status === 'Closed')) {
      if (!responseText.trim()) {
        setError('Response is required when marking assignment as Completed or Closed');
        return;
      }
    }

    // Call onAssign with data
    onAssign({
      assignedTo: selectedAssignees,
      description: description.trim() || undefined,
      remarks: remarks.trim() || undefined,
      sendEmail,
      status: existingAssignment ? status : undefined,
      responseText: existingAssignment ? (responseText.trim() || undefined) : undefined,
      responseAttachments: existingAssignment ? attachments : undefined,
    });

    // Reset form
    handleClose();
  };

  const handleClose = () => {
    setSelectedAssignees([]);
    setDescription('');
    setRemarks('');
    setSendEmail(false);
    setStatus('Open');
    setResponseText('');
    setAttachments([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {existingAssignment ? 'Edit Action' : 'Add Action'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {insightTitle}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Assignee Multi-Select Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignees <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    ({selectedAssignees.length} selected)
                  </span>
                </label>

                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between"
                >
                  <span className="text-sm">
                    {selectedAssignees.length === 0
                      ? 'Select assignees...'
                      : selectedAssignees.join(', ')}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {ASSIGNEES.map((assignee) => (
                      <label
                        key={assignee}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="relative mr-3">
                          <input
                            type="checkbox"
                            checked={selectedAssignees.includes(assignee)}
                            onChange={() => toggleAssignee(assignee)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                            selectedAssignees.includes(assignee)
                              ? 'bg-teal-600 border-teal-600'
                              : 'bg-white border-gray-300'
                          }`}>
                            {selectedAssignees.includes(assignee) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-900">{assignee}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none placeholder-gray-400"
                  placeholder="Add a description for this assignment..."
                />
              </div>

              {/* Remarks */}
              <div>
                <label htmlFor="remarks" className="block text-sm font-semibold text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none placeholder-gray-400"
                  placeholder="Add any additional remarks..."
                />
              </div>

              {/* Status Field - Only show in Edit Mode */}
              {existingAssignment && (
                <div>
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Open' | 'Completed' | 'Closed' | 'Overdue')}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              )}

              {/* Response Text Field - Only show in Edit Mode */}
              {existingAssignment && (
                <div>
                  <label htmlFor="responseText" className="block text-sm font-semibold text-gray-700 mb-2">
                    Response
                    {(status === 'Completed' || status === 'Closed') && (
                      <span className="text-red-500"> *</span>
                    )}
                  </label>
                  <textarea
                    id="responseText"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none placeholder-gray-400"
                    placeholder="Provide response or feedback on this assignment..."
                  />
                </div>
              )}

              {/* Attachments Section - Only show in Edit Mode */}
              {existingAssignment && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attachments
                  </label>

                  {/* File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                    Attach Files
                  </button>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {attachment.fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(attachment.fileSize)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(attachment.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                            aria-label="Remove attachment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Maximum file size: 1MB per file
                  </p>
                </div>
              )}

              {/* Download Evidence Report Button */}
              {onDownloadReport && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onDownloadReport}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors w-full justify-center"
                  >
                    <Download className="w-4 h-4" />
                    Evidence Report
                  </button>
                </div>
              )}

              {/* Send Email Checkbox */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="sr-only"
                  />
                  <label htmlFor="sendEmail" className="cursor-pointer">
                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                      sendEmail
                        ? 'bg-teal-600 border-teal-600'
                        : 'bg-white border-gray-300'
                    }`}>
                      {sendEmail && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </label>
                </div>
                <label htmlFor="sendEmail" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Send email notification to assignee
                </label>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                {existingAssignment ? 'Update Assignment' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
