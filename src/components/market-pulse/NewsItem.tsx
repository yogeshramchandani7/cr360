import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Building2, TrendingUp, ExternalLink, AlertCircle } from 'lucide-react';
import type { NewsItem as NewsItemType } from '../../types';
import { cn } from '../../lib/utils';
import { getRelativeTime, getCompanyIdByName } from '../../lib/mockNewsData';

interface NewsItemProps {
  newsItem: NewsItemType;
}

export default function NewsItem({ newsItem }: NewsItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Handler for company badge click
  const handleCompanyClick = (companyName: string) => {
    const companyId = getCompanyIdByName(companyName);
    if (companyId) {
      navigate(`/company/${companyId}`);
    }
  };

  // Category icons and styles
  const categoryConfig = {
    'top-exposure': {
      icon: Building2,
      label: 'Top Exposure',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-300'
    },
    'macro': {
      icon: TrendingUp,
      label: 'Macro',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300'
    },
    'sector': {
      icon: Building2,
      label: 'Sector',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300'
    },
    'insight-related': {
      icon: AlertCircle,
      label: 'Insight',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-300'
    }
  };

  const config = categoryConfig[newsItem.category];
  const CategoryIcon = config.icon;

  // Severity badge colors
  const severityColors = newsItem.severity ? {
    critical: 'bg-red-100 text-red-700 border-red-300',
    warning: 'bg-amber-100 text-amber-700 border-amber-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300'
  }[newsItem.severity] : '';

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-3 text-left transition-colors hover:bg-gray-50"
      >
        {/* Category Icon */}
        <div className={cn('p-2 rounded-lg flex-shrink-0', config.bgColor)}>
          <CategoryIcon className={cn('w-5 h-5', config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {newsItem.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
            <span className={cn('px-2 py-0.5 rounded-full font-medium', config.bgColor, config.color)}>
              {config.label}
            </span>
            {newsItem.severity && (
              <span className={cn('px-2 py-0.5 rounded-full font-medium border', severityColors)}>
                {newsItem.severity}
              </span>
            )}
            <span>•</span>
            <span>{newsItem.source}</span>
            <span>•</span>
            <span>{getRelativeTime(newsItem.timestamp)}</span>
          </div>
        </div>

        {/* Expand Icon */}
        <ChevronDown className={cn(
          'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-3">
          {/* Summary */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {newsItem.summary}
          </p>

          {/* Related Companies */}
          {newsItem.relatedCompanies && newsItem.relatedCompanies.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Related Companies
              </h4>
              <div className="flex flex-wrap gap-2">
                {newsItem.relatedCompanies.map((company, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompanyClick(company);
                    }}
                    className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded border border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-colors cursor-pointer"
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Indicators */}
          {newsItem.relatedIndicators && newsItem.relatedIndicators.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Related Indicators
              </h4>
              <div className="flex flex-wrap gap-2">
                {newsItem.relatedIndicators.map((indicator, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200"
                  >
                    {indicator.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Link */}
          {newsItem.url && (
            <a
              href={newsItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Read Full Article
            </a>
          )}
        </div>
      )}
    </div>
  );
}
