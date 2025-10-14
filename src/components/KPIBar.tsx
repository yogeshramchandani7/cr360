import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockPortfolioCompanies } from '../lib/mockData';
import { applyGlobalFilters, calculateFilteredKPIs } from '../lib/filterUtils';
import { useFilterStore } from '../stores/filterStore';
import { formatCurrency, formatPercent, cn } from '../lib/utils';
import type { KPI } from '../types';

interface KPICardProps {
  label: string;
  kpi: KPI;
}

function KPICard({ label, kpi }: KPICardProps) {
  const TrendIcon =
    kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;

  const statusColor = kpi.threshold
    ? kpi.threshold.status === 'green'
      ? 'text-success'
      : kpi.threshold.status === 'amber'
      ? 'text-warning'
      : 'text-error'
    : 'text-gray-600';

  const formattedValue =
    kpi.unit === 'currency' ? formatCurrency(kpi.value) : formatPercent(kpi.value);

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <div className="flex items-baseline justify-between">
        <p className={cn('text-2xl font-bold', statusColor)}>{formattedValue}</p>
        <div className="flex items-center gap-1 text-sm">
          <TrendIcon
            className={cn(
              'w-4 h-4',
              kpi.trend === 'up'
                ? 'text-success'
                : kpi.trend === 'down'
                ? 'text-error'
                : 'text-gray-400'
            )}
          />
          <span
            className={cn(
              'text-xs',
              kpi.changePercent > 0
                ? 'text-success'
                : kpi.changePercent < 0
                ? 'text-error'
                : 'text-gray-600'
            )}
          >
            {kpi.changePercent > 0 ? '+' : ''}
            {kpi.changePercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function KPIBar() {
  // Read global filters from store - use individual selectors to prevent infinite loop
  const lob = useFilterStore((state) => state.lob);
  const partyType = useFilterStore((state) => state.partyType);
  const rating = useFilterStore((state) => state.rating);
  const assetClassification = useFilterStore((state) => state.assetClassification);

  // Calculate KPIs based on filtered data
  const kpis = useMemo(() => {
    const globalFilters = { lob, partyType, rating, assetClassification };
    const filteredCompanies = applyGlobalFilters(mockPortfolioCompanies, globalFilters);
    return calculateFilteredKPIs(filteredCompanies);
  }, [lob, partyType, rating, assetClassification]);

  return (
    <div className="bg-gray-100 border-b border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <KPICard label="NPA %" kpi={kpis.npa} />
        <KPICard label="Total Exposure" kpi={kpis.totalExposure} />
        <KPICard label="PAR %" kpi={kpis.par} />
        <KPICard label="Delinquency %" kpi={kpis.delinquency} />
        <KPICard label="Utilization %" kpi={kpis.utilization} />
        <KPICard label="RAROC %" kpi={kpis.raroc} />
        <KPICard label="LGD %" kpi={kpis.lgd} />
        <KPICard label="Expected Loss" kpi={kpis.expectedLoss} />
      </div>
    </div>
  );
}
