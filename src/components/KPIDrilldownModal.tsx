import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { AdvancedKPI } from '../types';
import { getChartsForKPI } from '../lib/kpiDrilldownData';
import { mockPortfolioCompanies } from '../lib/mockData';
import ClickableChartCard from './ClickableChartCard';

interface KPIDrilldownModalProps {
  kpi: AdvancedKPI | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function KPIDrilldownModal({ kpi, isOpen, onClose }: KPIDrilldownModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if closed or no KPI selected
  if (!isOpen || !kpi) {
    return null;
  }

  // Get charts for this KPI
  const charts = getChartsForKPI(kpi.id, mockPortfolioCompanies);

  // Format KPI value based on type
  const formatValue = () => {
    const value = kpi.value;

    // Percentage values
    if (kpi.id.includes('mortality') || kpi.id.includes('forecast') ||
        kpi.id.includes('reversion') || kpi.id.includes('vdi')) {
      return `${value.toFixed(2)}%`;
    }

    // Currency values
    if (kpi.id.includes('exposure') || kpi.id.includes('ecl')) {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-oracle-border">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{kpi.label}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Current Value:</span>
                  <span className="font-bold text-gray-900">{formatValue()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Change:</span>
                  <span className={`font-bold ${kpi.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(2)}%
                  </span>
                </div>
                {kpi.alertSeverity && kpi.alertSeverity !== 'none' && (
                  <div className="flex items-center gap-2">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium uppercase
                      ${kpi.alertSeverity === 'critical' ? 'bg-red-100 text-red-700' :
                        kpi.alertSeverity === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'}
                    `}>
                      {kpi.alertSeverity}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Chart Grid */}
          <div className="p-6">
            {charts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No drilldown charts available for this KPI yet.</p>
                <p className="text-gray-400 text-sm mt-2">Charts will be added soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts.map((chart) => (
                  <ClickableChartCard
                    key={chart.id}
                    chart={chart}
                    kpiId={kpi.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer (optional - for future use) */}
          <div className="px-6 py-4 border-t border-oracle-border bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Click on any chart element to view filtered companies in Portfolio View
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
