import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Smile, Paperclip, Image, ArrowUpCircle, Sparkles, Star, AlertTriangle } from 'lucide-react';
import ActionCard from '../components/agent/ActionCard';
import DailyBriefingView from '../components/agent/DailyBriefingView';

export default function AgentPage() {
  const [inputValue, setInputValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [showWorkflowsMessage, setShowWorkflowsMessage] = useState(false);

  const showDailyBriefing = searchParams.get('view') !== 'chat';

  const handleDailyBriefingClick = () => {
    setSearchParams({});
  };

  const handleWorkflowsClick = () => {
    setShowWorkflowsMessage(true);
    setTimeout(() => setShowWorkflowsMessage(false), 3000);
  };

  const handleSend = () => {
    // UI only - no actual functionality for now
    if (inputValue.trim()) {
      console.log('User input:', inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // If Daily Briefing is shown, render the new view
  if (showDailyBriefing) {
    return <DailyBriefingView />;
  }

  // Default Agent Hub Page View
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Hi I'm ORA (Oracle AI Risk Assistant), what do you want to know?
          </h1>
        </div>

        {/* Main Input Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything related to your risk insights, portfolio health, Macro trends or any of your customers"
              className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-400 text-base"
              rows={2}
              style={{ minHeight: '60px' }}
            />
          </div>
          <div className="flex items-center justify-between px-4 pb-4">
            {/* Left Icons */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Add emoji"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Add image"
              >
                <Image className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Right Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`p-2 rounded-full transition-all ${
                inputValue.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <ArrowUpCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            icon={Sparkles}
            title="Daily Briefing"
            description="Collate insights of your portfolio, macro and obligors"
            onClick={handleDailyBriefingClick}
          />
          <div className="relative">
            <ActionCard
              icon={Star}
              title="Workflows"
              description="Remembers what user said earlier in the conversation"
              onClick={handleWorkflowsClick}
            />
            {showWorkflowsMessage && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg text-center z-10">
                Coming Soon!
              </div>
            )}
          </div>
          <ActionCard
            icon={AlertTriangle}
            title="Alerts"
            description="May occasionally generate incorrect information"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
