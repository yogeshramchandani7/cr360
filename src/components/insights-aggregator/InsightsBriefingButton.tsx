import { FileText } from 'lucide-react';

interface InsightsBriefingButtonProps {
  onClick: () => void;
}

export default function InsightsBriefingButton({ onClick }: InsightsBriefingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 active:scale-95"
    >
      <FileText className="w-4 h-4" />
      Daily Briefing
    </button>
  );
}
