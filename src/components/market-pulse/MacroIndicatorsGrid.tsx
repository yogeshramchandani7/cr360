import type { MacroIndicator } from '../../types';
import MacroIndicatorCard from './MacroIndicatorCard';

interface MacroIndicatorsGridProps {
  indicators: MacroIndicator[];
}

export default function MacroIndicatorsGrid({ indicators }: MacroIndicatorsGridProps) {
  if (indicators.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500 text-sm">No macroeconomic indicators available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {indicators.map(indicator => (
        <MacroIndicatorCard key={indicator.id} indicator={indicator} />
      ))}
    </div>
  );
}
