import { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useRiskHubStore } from '../../stores/riskHubStore';
import RiskItemForm from './RiskItemForm';

export default function RiskHubDrawer() {
  const isDrawerOpen = useRiskHubStore((state) => state.isDrawerOpen);
  const closeDrawer = useRiskHubStore((state) => state.closeDrawer);
  const editingItem = useRiskHubStore((state) => state.editingItem);
  const prefilledData = useRiskHubStore((state) => state.prefilledData);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const isEditing = !!editingItem;
  const title = isEditing ? 'Edit Risk Action' : 'Create Risk Action';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-[70vw] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 flex items-center justify-between border-b border-teal-700">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-teal-100 mt-0.5">
                {isEditing
                  ? 'Update action item details'
                  : 'Fill in the details to create a new action item'}
              </p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 hover:bg-teal-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <RiskItemForm
            editingItem={editingItem}
            prefilledData={prefilledData}
            onClose={closeDrawer}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-oracle-border p-4 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            All fields are required unless marked as optional
            <br />
            <span className="text-teal-600 font-medium">
              Actions created from insights will be automatically linked
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
