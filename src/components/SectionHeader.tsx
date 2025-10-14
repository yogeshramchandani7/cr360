import { ExternalLink } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  detailsRoute?: string;
  companyId?: string;
}

export default function SectionHeader({ title, detailsRoute, companyId }: SectionHeaderProps) {
  const handleViewDetails = () => {
    if (detailsRoute && companyId) {
      const route = detailsRoute.replace(':id', companyId);
      window.open(route, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {detailsRoute && companyId && (
        <button
          onClick={handleViewDetails}
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          View Details
          <ExternalLink className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
