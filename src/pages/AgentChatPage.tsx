/**
 * AgentChatPage Component
 * Full-page AI chat interface with Oracle Risk Agent branding
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Trash2, Calendar, Bell, Users, MessageSquarePlus, ArrowLeft } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useFilterStore } from '../stores/filterStore';
import { buildAppContext } from '../services/contextBuilder';
import { sendMessageToGemini } from '../services/geminiService';
import ChatMessage from '../components/chat/ChatMessage';
import TypingIndicator from '../components/chat/TypingIndicator';
import ChatInput from '../components/chat/ChatInput';
import ProcessingAnimation from '../components/agent/ProcessingAnimation';
import AgentEvidenceReport from '../components/agent/AgentEvidenceReport';
import { helocUtilizationCharts } from '../lib/insightEvidenceDataPart5';
import { getAllKPIInsights } from '../lib/kpiInsights';
import type { EvidenceChart, KPIInsight } from '../types';

const SUGGESTED_PROMPTS = [
  {
    title: 'HELOC Utilization Risk in Texas',
    description: 'Analyze critical risk from rapid HELOC drawdowns and declining home prices in Texas',
  },
  {
    title: 'Quality of Loans in new originations',
    description: 'Review credit quality metrics and performance of recently originated loans',
  },
  {
    title: 'Credit rating deterioration',
    description: 'Identify accounts with declining credit quality and migration trends',
  },
];

export default function AgentChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Processing and evidence report states
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEvidenceReport, setShowEvidenceReport] = useState(false);
  const [reportData, setReportData] = useState<{
    title: string;
    subtitle?: string;
    charts: EvidenceChart[];
    insight?: KPIInsight;
  } | null>(null);

  // Chat store
  const { messages, isTyping, addMessage, setIsTyping, setError, clearChat, loadMessagesFromStorage } = useChatStore();

  // Global filters for context
  const lob = useFilterStore((state) => state.lob);
  const partyType = useFilterStore((state) => state.partyType);
  const rating = useFilterStore((state) => state.rating);
  const assetClassification = useFilterStore((state) => state.assetClassification);

  // Handler to start a new chat (clear everything and return to welcome screen)
  const handleNewChat = () => {
    // Clear all chat messages
    clearChat();
    // Hide evidence report
    setShowEvidenceReport(false);
    setReportData(null);
    // This will automatically show the welcome screen since messages.length === 0
  };

  // Load messages on mount
  useEffect(() => {
    loadMessagesFromStorage();
  }, [loadMessagesFromStorage]);

  // Reset chat when navigating to root with reset parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reset') === 'true') {
      handleNewChat();
      // Clean up the URL
      navigate('/', { replace: true });
    }
  }, [location.search]);

  // Auto-scroll to bottom when new messages arrive (but not when evidence report first appears)
  useEffect(() => {
    // Only auto-scroll if there are messages in the chat
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (userMessage: string, evidenceData?: { charts: EvidenceChart[]; title: string }) => {
    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    // Clear any previous errors
    setError(null);
    setIsTyping(true);

    try {
      // Build application context
      const filters = { lob, partyType, rating, assetClassification };
      const companyId = location.pathname.includes('/company/')
        ? location.pathname.split('/company/')[1]?.split('/')[0]
        : undefined;

      // Use provided evidence data or check if report is currently displayed
      const evidence = evidenceData || (showEvidenceReport && reportData ? { charts: reportData.charts, title: reportData.title } : null);

      // Include evidence report data if available
      const appContext = buildAppContext(
        location.pathname,
        filters,
        companyId,
        evidence?.charts,
        evidence?.title
      );

      // Create a placeholder AI message for streaming
      addMessage({
        role: 'assistant',
        content: '',
      });

      // Send message to Gemini with streaming
      await sendMessageToGemini(
        userMessage,
        appContext,
        (chunk) => {
          // Update the last message with streamed content
          useChatStore.getState().updateLastMessage(
            useChatStore.getState().messages[useChatStore.getState().messages.length - 1].content + chunk
          );
        }
      );
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to get response');

      // Add error message
      addMessage({
        role: 'assistant',
        content: err.message || 'Sorry, I encountered an error. Please try again.',
        error: true,
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    clearChat();
    setShowClearConfirm(false);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    // Show processing animation
    setIsProcessing(true);

    // Simulate loading and then show report
    setTimeout(() => {
      setIsProcessing(false);

      // Get the HELOC insight from all insights
      const allInsights = getAllKPIInsights();
      const helocInsight = allInsights.find(i => i.id === 'heloc_utilization_insight_1');

      // Prepare evidence data
      const evidenceData = {
        title: 'HELOC Utilization Trap: Decreasing prices and Rapid Drawdown in Texas',
        subtitle: 'Critical risk identified in Texas HELOC portfolio with rapid utilization increase and declining home prices',
        charts: helocUtilizationCharts,
        insight: helocInsight,
      };

      // Set report data for display
      setReportData(evidenceData);
      setShowEvidenceReport(true);

      // Send the message to chat WITH evidence data (don't rely on state)
      handleSendMessage(prompt, { charts: evidenceData.charts, title: evidenceData.title });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
        {isProcessing ? (
          /* Processing Animation */
          <ProcessingAnimation onComplete={() => {}} />
        ) : messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            {/* Heading */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-semibold text-gray-900">Oracle Risk Agent</h1>
              <p className="text-gray-500 text-lg">AI-powered credit risk analysis and insights</p>
            </div>

            {/* Input Area */}
            <div className="w-full max-w-3xl">
              <ChatInput onSend={handleSendMessage} disabled={isTyping} placeholder="How can I help you today?" />
            </div>

            {/* Quick Action Cards */}
            <div className="w-full max-w-3xl -mt-2">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/agent-hub')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-full transition-all hover:shadow-md text-sm font-medium text-gray-700 hover:text-teal-600"
                >
                  <Calendar className="w-4 h-4" />
                  Daily Briefing
                </button>
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-full text-sm font-medium text-gray-400 cursor-not-allowed relative group"
                >
                  <Bell className="w-4 h-4" />
                  Alerts
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Coming Soon
                  </span>
                </button>
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-full text-sm font-medium text-gray-400 cursor-not-allowed relative group"
                >
                  <Users className="w-4 h-4" />
                  Agents
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Coming Soon
                  </span>
                </button>
              </div>
            </div>

            {/* Suggested Prompts */}
            <div className="w-full max-w-3xl space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-gray-400">⚡</span>
                <span>Suggested</span>
              </div>
              <div className="space-y-3">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedPrompt(prompt.title)}
                    className="w-full text-left p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all hover:shadow-md group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                          {prompt.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{prompt.description}</p>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages View */
          <div className="flex-1 flex flex-col">
            {/* Header with Back Button and New Chat Button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Back Button */}
                <button
                  onClick={handleNewChat}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Back to welcome screen"
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-semibold text-gray-900">Oracle Risk Agent</h2>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={handleNewChat}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  New Chat
                </button>
              )}
            </div>

            {/* Evidence Report Section */}
            {showEvidenceReport && reportData && (
              <div className="mb-6">
                <AgentEvidenceReport
                  title={reportData.title}
                  subtitle={reportData.subtitle}
                  charts={reportData.charts}
                  insight={reportData.insight}
                />
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-6 mb-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-gradient-to-t from-gray-100 to-transparent pt-4">
              <ChatInput onSend={handleSendMessage} disabled={isTyping} />
            </div>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
            <h4 className="font-semibold text-gray-900 mb-2">Clear Chat History?</h4>
            <p className="text-sm text-gray-600 mb-4">
              This will delete all messages. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClearChat}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
