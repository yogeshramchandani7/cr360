import NewsItem from './NewsItem';
import { mockDailyBriefingNews } from '../../lib/mockDailyBriefingNews';

export default function NewsHubPanel() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">News Hub</h2>
        <button className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors uppercase tracking-wide">
          View All
        </button>
      </div>

      {/* News Items */}
      <div className="space-y-1">
        {mockDailyBriefingNews.map((news) => (
          <NewsItem key={news.id} headline={news.headline} category={news.category} />
        ))}
      </div>
    </div>
  );
}
