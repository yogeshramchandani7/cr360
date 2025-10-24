import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import type { AdvancedKPI } from '../types';
import { calculateCCOKPIs } from '../lib/mockCCOData';

interface TooltipProps {
  kpi: AdvancedKPI;
  isVisible: boolean;
}

const KPITooltip = ({ kpi, isVisible }: TooltipProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute z-50 w-80 p-4 bg-white border border-oracle-border rounded-lg shadow-xl top-full mt-2 left-1/2 transform -translate-x-1/2">
      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Definition</h4>
          <p className="text-sm text-gray-700">{kpi.tooltip.definition}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Formula</h4>
          <p className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded">{kpi.tooltip.formula}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Business Implication</h4>
          <p className="text-sm text-gray-700">{kpi.tooltip.businessImplication}</p>
        </div>
        {kpi.components && kpi.components.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Components</h4>
            <div className="space-y-1">
              {kpi.components.map((component, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-700">
                  <span>{component.name} ({(component.weight * 100).toFixed(0)}%)</span>
                  <span className="font-medium">{component.value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Triangle pointer */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-oracle-border rotate-45"></div>
    </div>
  );
};

interface AdvancedKPICardProps {
  kpi: AdvancedKPI;
  onClick?: () => void;
}

const AdvancedKPICard = ({ kpi, onClick }: AdvancedKPICardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine border color based on alert severity
  const getBorderColor = () => {
    switch (kpi.alertSeverity) {
      case 'critical':
        return 'border-l-4 border-l-red-500';
      case 'warning':
        return 'border-l-4 border-l-amber-500';
      case 'info':
        return 'border-l-4 border-l-blue-500';
      default:
        return 'border-l-4 border-l-green-500';
    }
  };

  // Determine background color for alert badge
  const getAlertBadgeStyle = () => {
    switch (kpi.alertSeverity) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-amber-100 text-amber-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  // Format value based on KPI type
  const formatValue = () => {
    const value = kpi.value;

    // Percentage values
    if (kpi.id.includes('mortality') || kpi.id.includes('forecast') ||
        kpi.id.includes('reversion') || kpi.id.includes('vdi')) {
      return `${value.toFixed(2)}%`;
    }

    // Currency values (billions)
    if (kpi.id.includes('concentration')) {
      return `$${(value / 1e9).toFixed(1)}B`;
    }

    // Currency values (millions)
    if (kpi.id.includes('ecl')) {
      return `$${(value / 1e6).toFixed(1)}M`;
    }

    // Index values (PBI, PPHS)
    if (kpi.id.includes('pbi') || kpi.id.includes('pphs')) {
      return value.toFixed(1);
    }

    // Migration basis points
    if (kpi.id.includes('migration')) {
      return `${value.toFixed(0)} bps`;
    }

    // Utilization percentage
    if (kpi.id.includes('utilization')) {
      return `${value.toFixed(1)}%`;
    }

    return value.toFixed(2);
  };

  const isPositiveTrend = kpi.changePercent >= 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm p-4 ${getBorderColor()} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      {/* Alert Badge */}
      {kpi.alertSeverity && kpi.alertSeverity !== 'none' && (
        <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getAlertBadgeStyle()}`}>
          {kpi.alertSeverity === 'critical' && <AlertTriangle className="w-3 h-3" />}
          {kpi.alertSeverity === 'warning' && <AlertTriangle className="w-3 h-3" />}
          {kpi.alertSeverity === 'info' && <Info className="w-3 h-3" />}
          <span className="uppercase">{kpi.alertSeverity}</span>
        </div>
      )}

      {/* KPI Label */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {kpi.label}
        </h3>
        <div
          className="cursor-pointer hover:bg-gray-100 rounded-full p-1 -m-1"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </div>
      </div>

      {/* KPI Value */}
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {formatValue()}
      </div>

      {/* Change Indicator */}
      <div className={`flex items-center gap-1 text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
        <TrendIcon className="w-4 h-4" />
        <span className="font-medium">
          {isPositiveTrend ? '+' : ''}{kpi.changePercent.toFixed(2)}%
        </span>
      </div>

      {/* Tooltip */}
      <KPITooltip kpi={kpi} isVisible={showTooltip} />
    </div>
  );
};

const AdvancedKPIBar = () => {
  const ccoKPIs = calculateCCOKPIs();

  // Convert to array and maintain order
  const kpiArray = [
    ccoKPIs.quick_mortality,
    ccoKPIs.forward_delinquency,
    ccoKPIs.pbi,
    ccoKPIs.vdi,
    ccoKPIs.net_pd_migration,
    ccoKPIs.concentration_contagion,
    ccoKPIs.utilization_stress,
    ccoKPIs.reversion_rate,
    ccoKPIs.ecl_sensitivity,
    ccoKPIs.pphs,
  ];

  const handleKPIClick = (kpi: AdvancedKPI) => {
    // Open KPI drilldown page in new tab
    window.open(`/kpi/${kpi.id}`, '_blank');
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiArray.map((kpi) => (
          <AdvancedKPICard
            key={kpi.id}
            kpi={kpi}
            onClick={() => handleKPIClick(kpi)}
          />
        ))}
      </div>

      {/* Alert Summary */}
      {kpiArray.some(k => k.alertSeverity && k.alertSeverity !== 'none') && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              {kpiArray.filter(k => k.alertSeverity === 'critical').length} Critical Alert(s),
              {' '}{kpiArray.filter(k => k.alertSeverity === 'warning').length} Warning(s) detected
            </span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            Click on individual KPIs for detailed drilldown analysis (opens in new tab)
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedKPIBar;
