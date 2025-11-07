export type ChartDisplayType = 'bar' | 'pie';

interface ChartTypeSwitcherProps {
  currentType: ChartDisplayType;
  onTypeChange: (type: ChartDisplayType) => void;
  disabled?: boolean;
}

export default function ChartTypeSwitcher({
  currentType,
  onTypeChange,
  disabled = false,
}: ChartTypeSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 font-medium">View:</label>
      <select
        value={currentType}
        onChange={(e) => onTypeChange(e.target.value as ChartDisplayType)}
        disabled={disabled}
        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-oracle-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>
      </select>
    </div>
  );
}
