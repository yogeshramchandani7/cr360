import { Plus, Smile, Settings } from 'lucide-react';

export default function ORAAssistantPanel() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      {/* Header with greeting */}
      <div className="flex items-start justify-between mb-6">
        <p className="text-base text-gray-700 flex-1">
          Hi I'm <span className="font-semibold">ORA (Oracle AI Risk Assistant)</span>, here to
          help you
        </p>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
          <Smile className="w-5 h-5 text-gray-700" />
        </button>
        <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
