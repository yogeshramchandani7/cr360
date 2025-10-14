import { Sparkles } from 'lucide-react';

interface InsightButtonProps {
  chartId: string;
  insightCount: number;
  onClick: () => void;
}

export default function InsightButton({ insightCount, onClick }: InsightButtonProps) {
  if (insightCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-md group"
    >
      <Sparkles className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
      <span className="text-xs font-medium text-blue-700 group-hover:text-blue-800">
        {insightCount} {insightCount === 1 ? 'insight' : 'insights'}
      </span>
    </button>
  );
}
