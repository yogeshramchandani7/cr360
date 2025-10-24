import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { AdvancedKPI } from '../types';
import { getChartsForKPI } from '../lib/kpiDrilldownData';
import { calculateCCOKPIs } from '../lib/mockCCOData';
import ClickableChartCard from '../components/ClickableChartCard';

export default function KPIDrilldownPage() {
  const { kpiId } = useParams<{ kpiId: string }>();
  const navigate = useNavigate();

  // Get all KPIs
  const ccoKPIs = calculateCCOKPIs();

  // Find the selected KPI by ID
  const kpi: AdvancedKPI | undefined = Object.values(ccoKPIs).find(
    (k) => k.id === kpiId
  );

  // If KPI not found, show error
  if (!kpi) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">KPI Not Found</h1>
          <p className="text-gray-600 mb-4">The requested KPI could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-oracle-primary text-white rounded-lg hover:bg-oracle-hover transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get charts for this KPI
  const charts = getChartsForKPI(kpi.id);

  // Format KPI value based on type
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-oracle-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          {/* KPI Title and Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{kpi.label}</h1>
            <div className="flex items-center gap-6 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Current Value:</span>
                <span className="font-bold text-gray-900 text-lg">{formatValue()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Change:</span>
                <span className={`font-bold text-lg ${kpi.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(2)}%
                </span>
              </div>
              {kpi.alertSeverity && kpi.alertSeverity !== 'none' && (
                <div className="flex items-center gap-2">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium uppercase
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
        </div>
      </div>

      {/* Chart Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {charts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
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

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-oracle-border">
          <p className="text-sm text-gray-600 text-center">
            Click on any chart element to view filtered companies in Portfolio View
          </p>
        </div>
      </div>
    </div>
  );
}
