import { ArrowUp, ArrowDown, Circle } from 'lucide-react';

interface MacroIndicatorItemProps {
  name: string;
  value: string;
  timestamp: string;
  trend: 'up' | 'down' | 'neutral';
  changeColor: 'red' | 'green' | 'gray';
}

export default function MacroIndicatorItem({
  name,
  value,
  timestamp,
  trend,
  changeColor,
}: MacroIndicatorItemProps) {
  const getTrendIcon = () => {
    if (trend === 'up') {
      return <ArrowUp className="w-4 h-4" />;
    } else if (trend === 'down') {
      return <ArrowDown className="w-4 h-4" />;
    } else {
      return <Circle className="w-4 h-4 fill-current" />;
    }
  };

  const getColorClasses = () => {
    switch (changeColor) {
      case 'red':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'green':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'gray':
        return 'text-gray-500 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${getColorClasses()}`}
        >
          {getTrendIcon()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{timestamp}</p>
        </div>
      </div>
      <div className={`text-sm font-bold ${changeColor === 'red' ? 'text-red-600' : changeColor === 'green' ? 'text-green-600' : 'text-gray-600'}`}>
        {value}
      </div>
    </div>
  );
}
