import { FileText } from 'lucide-react';

interface NewsItemProps {
  headline: string;
  category: string;
}

export default function NewsItem({ headline, category }: NewsItemProps) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm font-semibold text-gray-900 mb-2">{headline}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{category}</span>
        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-oracle-primary transition-colors">
          <FileText className="w-3.5 h-3.5" />
          Read
        </button>
      </div>
    </div>
  );
}
