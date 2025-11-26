/**
 * ProcessingAnimation Component
 * Displays an animated loading state with progress indicator
 */

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingAnimationProps {
  onComplete?: () => void;
  duration?: number; // Duration in milliseconds
}

export default function ProcessingAnimation({ onComplete, duration = 3000 }: ProcessingAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
          }, 200);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12">
      {/* Animated Icon */}
      <div className="relative">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>

      {/* Processing Text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Analyzing Portfolio</h3>
        <p className="text-sm text-gray-500">Generating comprehensive risk report...</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-center text-xs text-gray-400">{Math.round(progress)}%</div>
      </div>

      {/* Processing Steps */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className={`transition-opacity ${progress > 20 ? 'opacity-100' : 'opacity-30'}`}>
          ✓ Fetching portfolio data
        </div>
        <div className={`transition-opacity ${progress > 50 ? 'opacity-100' : 'opacity-30'}`}>
          ✓ Analyzing risk indicators
        </div>
        <div className={`transition-opacity ${progress > 80 ? 'opacity-100' : 'opacity-30'}`}>
          ✓ Generating evidence charts
        </div>
      </div>
    </div>
  );
}
