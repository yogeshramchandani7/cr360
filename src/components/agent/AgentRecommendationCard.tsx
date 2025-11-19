import { ArrowRight, PlayCircle } from 'lucide-react';
import type { AgentRecommendation } from '../../types';

interface AgentRecommendationCardProps {
  recommendation: AgentRecommendation;
  onCTAClick?: (action: string) => void;
  onExecute?: () => void;
}

/**
 * AgentRecommendationCard - Displays structured agent recommendations
 * Shows the recommended next steps with priority, action items, and CTAs
 */
export default function AgentRecommendationCard({
  recommendation,
  onCTAClick,
  onExecute
}: AgentRecommendationCardProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border-2 border-teal-200 p-6 shadow-sm">
      {/* Action Items */}
      {recommendation.actionItems.length > 0 && (
        <div className="mb-5">
          <ul className="space-y-2.5">
            {recommendation.actionItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-semibold text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="flex-1 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expected Impact */}
      <div className="bg-white bg-opacity-60 rounded-md p-3 mb-4 border border-teal-100">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
          Expected Impact
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">
          {recommendation.estimatedImpact}
        </p>
      </div>

      {/* CTAs and Execute Button */}
      <div className="flex flex-wrap gap-3">
        {/* Execute Button - Always show */}
        {onExecute && (
          <button
            onClick={onExecute}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-200 transition-all duration-200"
          >
            <PlayCircle className="w-4 h-4" />
            Execute
          </button>
        )}

        {/* Other CTAs - Filter out any "Execute" CTA to avoid duplicates */}
        {recommendation.ctas && recommendation.ctas.length > 0 && (
          <>
            {recommendation.ctas
              .filter((cta) => cta.label !== 'Execute' && cta.action !== 'execute')
              .map((cta, index) => (
                <button
                  key={index}
                  onClick={() => onCTAClick && onCTAClick(cta.action)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold text-sm
                    transition-all duration-200 shadow-sm
                    ${cta.variant === 'primary'
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                    }
                  `}
                >
                  {cta.label}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
