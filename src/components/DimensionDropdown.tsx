import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { DIMENSIONS, type DimensionKey } from '../lib/masterSlicerUtils';

/**
 * DimensionDropdown Component
 *
 * A custom dropdown for selecting data dimensions with hover preview tooltips.
 * Shows all available dimension values when hovering over each option.
 *
 * Features:
 * - Displays current dimension with icon
 * - Shows all 5 dimension options when opened
 * - Hover preview tooltip showing dimension values
 * - Click outside to close
 * - Keyboard accessible (Escape to close)
 */

interface DimensionDropdownProps {
  value: DimensionKey;
  onChange: (dimension: DimensionKey) => void;
}

export default function DimensionDropdown({ value, onChange }: DimensionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDimension, setHoveredDimension] = useState<DimensionKey | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentDimension = DIMENSIONS[value];

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleSelect = (dimension: DimensionKey) => {
    onChange(dimension);
    setIsOpen(false);
    setHoveredDimension(null);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{currentDimension.icon}</span>
        <span className="font-medium text-gray-700">{currentDimension.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1" role="listbox">
            {(Object.keys(DIMENSIONS) as DimensionKey[]).map((dimensionKey) => {
              const dimension = DIMENSIONS[dimensionKey];
              const isSelected = dimensionKey === value;
              const isHovered = dimensionKey === hoveredDimension;

              return (
                <div
                  key={dimensionKey}
                  className="relative"
                  onMouseEnter={() => setHoveredDimension(dimensionKey)}
                  onMouseLeave={() => setHoveredDimension(null)}
                >
                  {/* Dropdown Option */}
                  <button
                    onClick={() => handleSelect(dimensionKey)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="text-lg">{dimension.icon}</span>
                    <span className="flex-1">{dimension.label}</span>
                    {isSelected && (
                      <span className="text-blue-600 text-sm">✓</span>
                    )}
                  </button>

                  {/* Hover Tooltip with Values */}
                  {isHovered && (
                    <div className="absolute left-full top-0 ml-2 w-48 bg-gray-900 text-white rounded-lg shadow-xl p-3 z-50 pointer-events-none">
                      {/* Arrow */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-8 border-transparent border-r-gray-900" />

                      {/* Tooltip Content */}
                      <div className="text-xs font-semibold mb-2 text-gray-300">
                        {dimension.label} Values:
                      </div>
                      <div className="space-y-1">
                        {dimension.values.map((val, index) => (
                          <div
                            key={val}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-gray-400">
                              {index === dimension.values.length - 1 ? '└' : '├'}─
                            </span>
                            <span>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
