import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MacroIndicator } from '../../types';
import { cn } from '../../lib/utils';

interface MacroIndicatorCardProps {
  indicator: MacroIndicator;
}

export default function MacroIndicatorCard({ indicator }: MacroIndicatorCardProps) {
  // Get trend icon
  const TrendIcon = indicator.direction === 'up'
    ? TrendingUp
    : indicator.direction === 'down'
    ? TrendingDown
    : Minus;

  // Get severity colors
  const severityColors = {
    critical: {
      border: 'border-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800'
    },
    warning: {
      border: 'border-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800'
    },
    info: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800'
    }
  };

  const colors = severityColors[indicator.severity];

  // Format distance display
  const formatDistance = () => {
    if (indicator.unit === 'bps') {
      return `${indicator.distanceFromThreshold > 0 ? '+' : ''}${indicator.distanceFromThreshold.toFixed(0)} bps`;
    } else if (indicator.unit === '%') {
      const bps = indicator.distanceInBps || (indicator.distanceFromThreshold * 100);
      return `${bps > 0 ? '+' : ''}${bps.toFixed(0)} bps`;
    } else {
      return `${indicator.distanceFromThreshold > 0 ? '+' : ''}${indicator.distanceFromThreshold.toFixed(0)} pts`;
    }
  };

  // Determine if over or under threshold
  const isOverThreshold = indicator.distanceFromThreshold > 0;
  const thresholdText = isOverThreshold ? 'over' : 'under';

  return (
    <div
      className={cn(
        'rounded-lg border-2 shadow-sm p-4 transition-all duration-200 hover:shadow-md',
        colors.border,
        colors.bg
      )}
    >
      {/* Header with name and trend icon */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn('text-sm font-semibold uppercase tracking-wide', colors.text)}>
          {indicator.name}
        </h3>
        <TrendIcon className={cn('w-5 h-5', colors.text)} />
      </div>

      {/* Current value - Large display */}
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900">
          {indicator.currentValue.toLocaleString()}
          <span className="text-xl ml-1 text-gray-600">{indicator.unit}</span>
        </div>
      </div>

      {/* Threshold info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Threshold:</span>
          <span className="font-semibold text-gray-900">
            {indicator.threshold.toLocaleString()} {indicator.unit}
          </span>
        </div>

        {/* Distance badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Distance:</span>
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-bold',
            colors.badge
          )}>
            {formatDistance()} {thresholdText}
          </span>
        </div>
      </div>

      {/* Optional description */}
      {indicator.description && (
        <p className="mt-3 text-xs text-gray-600 leading-relaxed">
          {indicator.description}
        </p>
      )}
    </div>
  );
}
