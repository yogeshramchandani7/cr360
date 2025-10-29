import { useState } from 'react';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import type { AdvancedKPI } from '../types';
import { cn } from '../lib/utils';

interface KPIMetricCardProps {
  kpi: AdvancedKPI;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function KPIMetricCard({ kpi, isSelected = false, onClick }: KPIMetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Format KPI value based on type
  const formatValue = (): string => {
    const value = kpi.value;

    // Special case: Top Contributing Sectors displays as text
    if (kpi.id === 'det_top_sectors') {
      return 'Real Estate (27%), Infra (18%), NBFC (14%)';
    }

    // Basis points for PD Drift indicator with + sign
    if (kpi.id === 'det_pd_drift') {
      return `+${value.toFixed(2)} bps`;
    }

    // Percentage values
    if (kpi.id.includes('mortality') || kpi.id.includes('vdi') ||
        kpi.id.includes('pbi') || kpi.id.includes('utilization') ||
        kpi.id.includes('reversion') || kpi.id.includes('det_')) {
      return `${value.toFixed(2)}%`;
    }

    // Currency values (billions)
    if (kpi.id.includes('concentration')) {
      return `$${(value / 1e9).toFixed(2)}B`;
    }

    // Currency values (millions)
    if (kpi.id.includes('ecl')) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }

    // Basis points (migration)
    if (kpi.id.includes('migration')) {
      return `${(value / 1000000).toFixed(2)} bps`;
    }

    // Count/number (forward delinquency)
    if (kpi.id.includes('forward_delinquency')) {
      return value.toFixed(2);
    }

    // Score (PPHS)
    if (kpi.id.includes('pphs')) {
      return value.toFixed(2);
    }

    return value.toFixed(2);
  };

  // Determine border color based on alert severity or threshold status
  const getBorderColor = (): string => {
    if (kpi.alertSeverity === 'critical') return 'border-l-red-500';
    if (kpi.alertSeverity === 'warning') return 'border-l-yellow-500';

    // Use threshold status if no alert
    if (kpi.threshold) {
      if (kpi.threshold.status === 'red') return 'border-l-red-500';
      if (kpi.threshold.status === 'amber') return 'border-l-yellow-500';
      if (kpi.threshold.status === 'green') return 'border-l-green-500';
    }

    return 'border-l-green-500';
  };

  // Determine if change is positive or negative (contextual)
  const isPositiveChange = (): boolean => {
    // For most metrics, down is good
    if (kpi.id.includes('mortality') || kpi.id.includes('delinquency') ||
        kpi.id.includes('pbi') || kpi.id.includes('vdi') ||
        kpi.id.includes('migration') || kpi.id.includes('utilization') ||
        kpi.id.includes('reversion') || kpi.id.includes('ecl')) {
      return kpi.changePercent < 0;
    }

    // For PPHS and concentration, interpret based on trend
    return kpi.changePercent > 0;
  };

  const changeColor = isPositiveChange() ? 'text-green-600' : 'text-red-600';
  const ChangeIcon = kpi.changePercent >= 0 ? TrendingUp : TrendingDown;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative bg-white rounded-lg p-4 border-l-4 transition-all duration-200",
        getBorderColor(),
        isSelected
          ? "ring-2 ring-blue-500 shadow-lg"
          : "shadow-sm hover:shadow-md",
        onClick && "cursor-pointer"
      )}
    >
      {/* Header: Label + Info Icon + Alert Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {kpi.label}
          </span>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            {/* Tooltip */}
            {showTooltip && kpi.tooltip && (
              <div className="absolute left-0 top-6 z-50 w-80 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-gray-300 mb-1">Definition:</p>
                    <p>{kpi.tooltip.definition}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-300 mb-1">Formula:</p>
                    <p className="font-mono text-xs">{kpi.tooltip.formula}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-300 mb-1">Business Impact:</p>
                    <p>{kpi.tooltip.businessImplication}</p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>

        {/* Alert Badge */}
        {kpi.alertSeverity && kpi.alertSeverity !== 'none' && (
          <span className={cn(
            "flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded whitespace-nowrap",
            kpi.alertSeverity === 'critical'
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          )}>
            ⚠ {kpi.alertSeverity.toUpperCase()}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-900">
          {formatValue()}
        </p>
      </div>

      {/* Change Indicator */}
      <div className={cn("flex items-center gap-1 text-sm font-medium", changeColor)}>
        <ChangeIcon className="w-4 h-4" />
        <span>
          {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
