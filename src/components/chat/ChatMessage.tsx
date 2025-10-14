/**
 * ChatMessage Component
 * Displays individual chat messages with styling for user and AI
 */

import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types/chat';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isError = message.error;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={cn(
        'flex gap-3 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          isUser ? 'bg-blue-600' : 'bg-oracle-chatBotAvatar'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn('flex flex-col gap-1 max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-lg px-4 py-3 shadow-sm',
            isUser
              ? 'bg-blue-600 text-white'
              : isError
              ? 'bg-red-50 text-red-900 border border-red-200'
              : 'bg-oracle-chatBotBubble text-gray-900'
          )}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="text-sm prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
