import { Calendar } from 'lucide-react';
import MacroIndicatorItem from './MacroIndicatorItem';

export default function MacroIndicatorsPanel() {
  const newestIndicators = [
    {
      id: 'gdp',
      name: 'GDP',
      value: '-5%',
      timestamp: '27 March 2020, at 12:30 PM',
      trend: 'down' as const,
      changeColor: 'red' as const,
    },
    {
      id: 'sp500',
      name: 'S&P 500',
      value: '+1.2%',
      timestamp: '27 March 2020, at 12:30 PM',
      trend: 'up' as const,
      changeColor: 'green' as const,
    },
  ];

  const olderIndicators = [
    {
      id: 'fed10y',
      name: 'FED 10 Yrs Yield',
      value: '+$800',
      timestamp: '26 March 2020, at 13:45 PM',
      trend: 'up' as const,
      changeColor: 'green' as const,
    },
    {
      id: 'unemployment',
      name: 'Unemployement',
      value: '+ 50 BPS',
      timestamp: '26 March 2020, at 12:30 PM',
      trend: 'up' as const,
      changeColor: 'green' as const,
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing PMI',
      value: '3%(+20%)',
      timestamp: '26 March 2020, at 05:00 AM',
      trend: 'neutral' as const,
      changeColor: 'gray' as const,
    },
    {
      id: 'inflation',
      name: 'Inflation(PPP)',
      value: '-2%',
      timestamp: '25 March 2020, at 10:30 PM',
      trend: 'down' as const,
      changeColor: 'red' as const,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Macro Indicators</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>23 - 30 March 2020</span>
        </div>
      </div>

      {/* NEWEST Section */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
          Newest
        </div>
        <div className="space-y-1">
          {newestIndicators.map((indicator) => (
            <MacroIndicatorItem key={indicator.id} {...indicator} />
          ))}
        </div>
      </div>

      {/* OLDER Section */}
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
          Older
        </div>
        <div className="space-y-1">
          {olderIndicators.map((indicator) => (
            <MacroIndicatorItem key={indicator.id} {...indicator} />
          ))}
        </div>
      </div>
    </div>
  );
}
