import type { FC } from 'react';

interface ActionCardProps {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  disabled = false
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-white rounded-lg border border-gray-200 p-6 text-left
        transition-all duration-200
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-blue-400 hover:shadow-md cursor-pointer'
        }
      `}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <Icon className={`w-6 h-6 ${disabled ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
}
