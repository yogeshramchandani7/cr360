/**
 * ChatWidget Component
 * Main AI chatbot widget with floating button and expandable window
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Trash2, MessageCircle } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useFilterStore } from '../../stores/filterStore';
import { buildAppContext } from '../../services/contextBuilder';
import { sendMessageToGemini } from '../../services/geminiService';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import chatIcon from '../../assets/chat.png';

const SUGGESTED_QUERIES = [
  'What is my current NPA rate?',
  'Show me companies with delinquent status',
  'What are the top 5 exposures?',
  'Explain the climate risk metrics',
];

export default function ChatWidget() {
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Chat store
  const { messages, isOpen, isTyping, addMessage, setIsOpen, toggleChat, setIsTyping, setError, clearChat, loadMessagesFromStorage } = useChatStore();

  // Global filters for context
  const lob = useFilterStore((state) => state.lob);
  const partyType = useFilterStore((state) => state.partyType);
  const rating = useFilterStore((state) => state.rating);
  const assetClassification = useFilterStore((state) => state.assetClassification);

  // Load messages on mount
  useEffect(() => {
    loadMessagesFromStorage();
  }, [loadMessagesFromStorage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ESC key handler to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setIsOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (userMessage: string) => {
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

      const appContext = buildAppContext(location.pathname, filters, companyId);

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

  const handleSuggestedQuery = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 shadow-lg transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <img
            src={chatIcon}
            alt="Chat"
            className="w-16 h-16 rounded-full"
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-oracle-chatHeader text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">CR360 Chatbot</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">CONNECTED</p>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  aria-label="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={toggleChat}
                className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                aria-label="Close chat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Clear Confirmation */}
          {showClearConfirm && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
                <h4 className="font-semibold text-gray-900 mb-2">Clear Chat History?</h4>
                <p className="text-sm text-gray-600 mb-4">This will delete all messages. This action cannot be undone.</p>
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

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-oracle-chatBody">
            {messages.length === 0 ? (
              <div className="p-4">
                <div className="flex gap-3">
                  {/* Bot Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-oracle-chatBotAvatar flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>

                  {/* Welcome Message Bubble */}
                  <div className="bg-oracle-chatBotBubble rounded-lg px-6 py-4 max-w-[85%]">
                    <p className="text-gray-900 mb-4 text-sm">
                      Hi! I'm your CR360 Chatbot. Here are a few things I can help you with:
                    </p>
                    <div className="space-y-2">
                      {SUGGESTED_QUERIES.map((query, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedQuery(query)}
                          className="w-full text-left px-4 py-2.5 bg-oracle-chatAction text-white rounded-lg hover:bg-oracle-chatActionHover transition-colors text-sm font-medium"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        </div>
      )}
    </>
  );
}
