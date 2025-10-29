import { useEffect, useRef } from 'react';
import { Users, Filter } from 'lucide-react';
import type { DropdownOption } from '../types';

interface ChartActionDropdownProps {
  position: { x: number; y: number };
  options?: DropdownOption[];
  onSelect: (optionId: string) => void;
  onClose: () => void;
}

const DEFAULT_OPTIONS: DropdownOption[] = [
  {
    id: 'counterparties',
    label: 'Counterparties',
    icon: <Users className="w-4 h-4" />,
    description: 'View list of companies',
  },
  {
    id: 'apply-filter',
    label: 'Apply Filter',
    icon: <Filter className="w-4 h-4" />,
    description: 'Filter data on this page',
  },
];

export default function ChartActionDropdown({
  position,
  options = DEFAULT_OPTIONS,
  onSelect,
  onClose,
}: ChartActionDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Adjust position to keep dropdown within viewport
  const getAdjustedPosition = () => {
    if (!dropdownRef.current) return position;

    const rect = dropdownRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // Adjust horizontal position
    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 10; // 10px padding from edge
    }

    // Adjust vertical position
    if (y + rect.height > viewportHeight) {
      y = viewportHeight - rect.height - 10; // 10px padding from edge
    }

    // Ensure not off the left edge
    if (x < 10) x = 10;
    // Ensure not off the top edge
    if (y < 10) y = 10;

    return { x, y };
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Close dropdown on Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const adjustedPosition = getAdjustedPosition();

  const handleOptionClick = (optionId: string) => {
    onSelect(optionId);
  };

  return (
    <div
      ref={dropdownRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px] z-[9999]"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      {options.map((option, index) => (
        <button
          key={option.id}
          onClick={() => handleOptionClick(option.id)}
          className={`
            w-full px-4 py-2.5 text-left flex items-center gap-3
            hover:bg-blue-50 transition-colors
            ${index !== 0 ? 'border-t border-gray-100' : ''}
          `}
        >
          {option.icon && (
            <span className="text-gray-600 flex-shrink-0">{option.icon}</span>
          )}
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{option.label}</div>
            {option.description && (
              <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
