import { useState, useEffect } from 'react';
import { X, Copy, Check, ChevronDown, FileText, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatBriefingAsMarkdown } from '../../lib/insightsBriefingGenerator';
import type { BriefingData } from '../../lib/insightsBriefingGenerator';

interface InsightsBriefingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: BriefingData;
}

export default function InsightsBriefingDrawer({ isOpen, onClose, briefing }: InsightsBriefingDrawerProps) {
  const [copiedState, setCopiedState] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['critical', 'warning', 'observation', 'assessment'])
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const handleCopy = async () => {
    const markdown = formatBriefingAsMarkdown(briefing);
    await navigator.clipboard.writeText(markdown);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Check speech synthesis support and cleanup on unmount
  useEffect(() => {
    if (!window.speechSynthesis) {
      setSpeechSupported(false);
    }

    return () => {
      // Stop any ongoing speech when component unmounts
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Reset speech state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isOpen]);

  const handleSpeak = () => {
    if (!window.speechSynthesis || !speechSupported) return;

    // If already speaking, pause it
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    // If paused, resume it
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Start new speech
    const text = formatBriefingAsMarkdown(briefing);
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Insights Briefing</h2>
              <p className="text-xs text-gray-500">
                {briefing.timestamp.toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Listen Button */}
            {speechSupported && (
              <>
                <button
                  onClick={handleSpeak}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    isSpeaking
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  )}
                >
                  {isSpeaking && !isPaused ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : isPaused ? (
                    <>
                      <Play className="w-4 h-4" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      Listen
                    </>
                  )}
                </button>

                {/* Stop Button (only show when speaking) */}
                {isSpeaking && (
                  <button
                    onClick={handleStopSpeech}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
                  >
                    <VolumeX className="w-4 h-4" />
                    Stop
                  </button>
                )}
              </>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                copiedState
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {copiedState ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Overview Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{briefing.overview.totalInsights}</div>
                <div className="text-xs text-gray-600 mt-1">Total Insights</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{briefing.overview.criticalCount}</div>
                <div className="text-xs text-gray-600 mt-1">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{briefing.overview.warningCount}</div>
                <div className="text-xs text-gray-600 mt-1">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{briefing.overview.infoCount}</div>
                <div className="text-xs text-gray-600 mt-1">Observations</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200 text-sm text-gray-600 text-center">
              {briefing.overview.kpiInsightCount} KPI Insights + {briefing.overview.macroInsightCount} Macro Insights
            </div>
          </div>

          {/* Critical Issues Section */}
          {briefing.criticalIssues.length > 0 && (
            <div className="border-2 border-red-300 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('critical')}
                className="w-full bg-red-50 px-6 py-4 flex items-center justify-between hover:bg-red-100 transition-colors"
              >
                <h3 className="text-lg font-bold text-red-900 uppercase tracking-wide">
                  Critical Issues ({briefing.criticalIssues.length})
                </h3>
                <ChevronDown className={cn(
                  'w-5 h-5 text-red-700 transition-transform',
                  expandedSections.has('critical') && 'rotate-180'
                )} />
              </button>

              {expandedSections.has('critical') && (
                <div className="p-6 space-y-4 bg-white">
                  {briefing.criticalIssues.map((issue, idx) => (
                    <div key={idx} className="border-l-4 border-red-500 pl-4">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                          {issue.source === 'kpi' ? `KPI: ${issue.kpiName}` : 'MACRO'}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{issue.theme}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{issue.implication}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Warnings Section */}
          {briefing.warnings.length > 0 && (
            <div className="border-2 border-amber-300 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('warning')}
                className="w-full bg-amber-50 px-6 py-4 flex items-center justify-between hover:bg-amber-100 transition-colors"
              >
                <h3 className="text-lg font-bold text-amber-900 uppercase tracking-wide">
                  Warnings ({briefing.warnings.length})
                </h3>
                <ChevronDown className={cn(
                  'w-5 h-5 text-amber-700 transition-transform',
                  expandedSections.has('warning') && 'rotate-180'
                )} />
              </button>

              {expandedSections.has('warning') && (
                <div className="p-6 space-y-4 bg-white">
                  {briefing.warnings.map((warning, idx) => (
                    <div key={idx} className="border-l-4 border-amber-500 pl-4">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                          {warning.source === 'kpi' ? `KPI: ${warning.kpiName}` : 'MACRO'}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{warning.theme}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{warning.implication}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Observations Section */}
          {briefing.observations.length > 0 && (
            <div className="border-2 border-blue-300 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('observation')}
                className="w-full bg-blue-50 px-6 py-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
              >
                <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wide">
                  Key Observations ({briefing.observations.length})
                </h3>
                <ChevronDown className={cn(
                  'w-5 h-5 text-blue-700 transition-transform',
                  expandedSections.has('observation') && 'rotate-180'
                )} />
              </button>

              {expandedSections.has('observation') && (
                <div className="p-6 space-y-4 bg-white">
                  {briefing.observations.map((obs, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                          {obs.source === 'kpi' ? `KPI: ${obs.kpiName}` : 'MACRO'}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{obs.theme}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{obs.implication}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Risk Assessment Section */}
          <div className="border-2 border-purple-300 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('assessment')}
              className="w-full bg-purple-50 px-6 py-4 flex items-center justify-between hover:bg-purple-100 transition-colors"
            >
              <h3 className="text-lg font-bold text-purple-900 uppercase tracking-wide">
                Risk Assessment
              </h3>
              <ChevronDown className={cn(
                'w-5 h-5 text-purple-700 transition-transform',
                expandedSections.has('assessment') && 'rotate-180'
              )} />
            </button>

            {expandedSections.has('assessment') && (
              <div className="p-6 bg-white">
                <p className="text-gray-800 leading-relaxed font-medium">{briefing.riskAssessment}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
