import { AlertTriangle, TrendingDown, TrendingUp, AlertCircle, Info } from 'lucide-react';

interface AgentAnalysisKeyHighlightProps {
  text: string;
  variant?: 'warning' | 'danger' | 'info' | 'success' | 'neutral';
  icon?: 'alert' | 'trend-down' | 'trend-up' | 'info' | 'alert-circle' | null;
}

/**
 * AgentAnalysisKeyHighlight - Informational bar showing key takeaway for charts
 * Displays above evidence charts in agent analysis page
 */
export default function AgentAnalysisKeyHighlight({
  text,
  variant = 'neutral',
  icon = 'alert-circle'
}: AgentAnalysisKeyHighlightProps) {
  // Get icon component
  const getIcon = () => {
    const iconProps = { className: 'w-5 h-5 flex-shrink-0' };

    switch (icon) {
      case 'alert':
        return <AlertTriangle {...iconProps} />;
      case 'trend-down':
        return <TrendingDown {...iconProps} />;
      case 'trend-up':
        return <TrendingUp {...iconProps} />;
      case 'info':
        return <Info {...iconProps} />;
      case 'alert-circle':
        return <AlertCircle {...iconProps} />;
      default:
        return null;
    }
  };

  // Get styling based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'neutral':
      default:
        return 'bg-gray-100 border-gray-200 text-gray-900';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${getVariantStyles()}`}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className="mt-0.5">
          {getIcon()}
        </div>
      )}
      <p className="text-sm font-semibold leading-relaxed flex-1">
        {text}
      </p>
    </div>
  );
}
