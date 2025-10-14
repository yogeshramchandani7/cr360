import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatStore } from './chatStore';
import type { ChatMessage } from '../types/chat';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('chatStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();

    // Reset store state
    const { result } = renderHook(() => useChatStore());
    act(() => {
      result.current.clearChat();
      result.current.setIsOpen(false);
      result.current.setIsTyping(false);
      result.current.setError(null);
    });
  });

  describe('Initial State', () => {
    it('initializes with empty messages array', () => {
      const { result } = renderHook(() => useChatStore());
      expect(result.current.messages).toEqual([]);
    });

    it('initializes with chat closed', () => {
      const { result } = renderHook(() => useChatStore());
      expect(result.current.isOpen).toBe(false);
    });

    it('initializes with typing indicator off', () => {
      const { result } = renderHook(() => useChatStore());
      expect(result.current.isTyping).toBe(false);
    });

    it('initializes with no error', () => {
      const { result } = renderHook(() => useChatStore());
      expect(result.current.error).toBeNull();
    });
  });

  describe('addMessage', () => {
    it('adds a user message', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({
          role: 'user',
          content: 'Hello, bot!',
        });
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[0].content).toBe('Hello, bot!');
    });

    it('adds an assistant message', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({
          role: 'assistant',
          content: 'Hello, human!',
        });
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe('assistant');
      expect(result.current.messages[0].content).toBe('Hello, human!');
    });

    it('generates unique ID for each message', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'user', content: 'Message 1' });
        result.current.addMessage({ role: 'user', content: 'Message 2' });
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].id).not.toBe(result.current.messages[1].id);
      expect(result.current.messages[0].id).toMatch(/^msg-\d+-[a-z0-9]+$/);
    });

    it('adds timestamp to each message', () => {
      const { result } = renderHook(() => useChatStore());

      const beforeTime = new Date();

      act(() => {
        result.current.addMessage({ role: 'user', content: 'Test message' });
      });

      const afterTime = new Date();

      expect(result.current.messages[0].timestamp).toBeInstanceOf(Date);
      expect(result.current.messages[0].timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeTime.getTime()
      );
      expect(result.current.messages[0].timestamp.getTime()).toBeLessThanOrEqual(
        afterTime.getTime()
      );
    });

    it('adds multiple messages in sequence', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'user', content: 'Hello' });
        result.current.addMessage({ role: 'assistant', content: 'Hi there!' });
        result.current.addMessage({ role: 'user', content: 'How are you?' });
      });

      expect(result.current.messages).toHaveLength(3);
      expect(result.current.messages[0].content).toBe('Hello');
      expect(result.current.messages[1].content).toBe('Hi there!');
      expect(result.current.messages[2].content).toBe('How are you?');
    });

    it('saves messages to localStorage', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'user', content: 'Test message' });
      });

      const stored = localStorageMock.getItem('cr360-chat-messages');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].content).toBe('Test message');
    });

    it('handles messages with optional error flag', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({
          role: 'assistant',
          content: 'Error occurred',
          error: true,
        });
      });

      expect(result.current.messages[0].error).toBe(true);
    });
  });

  describe('updateLastMessage', () => {
    it('updates the last assistant message', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'assistant', content: 'Initial content' });
      });

      const messageId = result.current.messages[0].id;

      act(() => {
        result.current.updateLastMessage('Updated content');
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].id).toBe(messageId);
      expect(result.current.messages[0].content).toBe('Updated content');
    });

    it('does nothing when there are no messages', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.updateLastMessage('Should not add');
      });

      expect(result.current.messages).toHaveLength(0);
    });

    it('does not update last message if it is from user', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'user', content: 'User message' });
      });

      act(() => {
        result.current.updateLastMessage('Should not update');
      });

      expect(result.current.messages[0].content).toBe('User message');
    });

    it('only updates the last message, not earlier ones', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'assistant', content: 'First message' });
        result.current.addMessage({ role: 'assistant', content: 'Second message' });
      });

      act(() => {
        result.current.updateLastMessage('Updated second message');
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].content).toBe('First message');
      expect(result.current.messages[1].content).toBe('Updated second message');
    });

    it('saves updated messages to localStorage', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'assistant', content: 'Original' });
      });

      act(() => {
        result.current.updateLastMessage('Streaming update');
      });

      const stored = localStorageMock.getItem('cr360-chat-messages');
      const parsed = JSON.parse(stored!);
      expect(parsed[0].content).toBe('Streaming update');
    });

    it('supports streaming updates with multiple calls', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'assistant', content: '' });
      });

      act(() => {
        result.current.updateLastMessage('Hello');
      });

      act(() => {
        result.current.updateLastMessage('Hello, ');
      });

      act(() => {
        result.current.updateLastMessage('Hello, how');
      });

      act(() => {
        result.current.updateLastMessage('Hello, how are you?');
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].content).toBe('Hello, how are you?');
    });
  });

  describe('Chat Open State', () => {
    it('sets isOpen to true', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('sets isOpen to false', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsOpen(true);
      });

      act(() => {
        result.current.setIsOpen(false);
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('toggles chat from closed to open', () => {
      const { result } = renderHook(() => useChatStore());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggleChat();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('toggles chat from open to closed', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsOpen(true);
      });

      act(() => {
        result.current.toggleChat();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('toggles chat multiple times', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.toggleChat(); // open
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggleChat(); // closed
      });
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggleChat(); // open
      });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Typing Indicator', () => {
    it('sets isTyping to true', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsTyping(true);
      });

      expect(result.current.isTyping).toBe(true);
    });

    it('sets isTyping to false', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsTyping(true);
      });

      act(() => {
        result.current.setIsTyping(false);
      });

      expect(result.current.isTyping).toBe(false);
    });

    it('toggles isTyping state', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsTyping(true);
      });
      expect(result.current.isTyping).toBe(true);

      act(() => {
        result.current.setIsTyping(false);
      });
      expect(result.current.isTyping).toBe(false);
    });
  });

  describe('Error State', () => {
    it('sets error message', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setError('Connection failed');
      });

      expect(result.current.error).toBe('Connection failed');
    });

    it('clears error by setting to null', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setError('Error occurred');
      });

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });

    it('updates error message', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setError('First error');
      });

      act(() => {
        result.current.setError('Second error');
      });

      expect(result.current.error).toBe('Second error');
    });
  });

  describe('clearChat', () => {
    it('clears all messages', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'user', content: 'Message 1' });
        result.current.addMessage({ role: 'assistant', content: 'Message 2' });
      });

      expect(result.current.messages).toHaveLength(2);

      act(() => {
        result.current.clearChat();
      });

      expect(result.current.messages).toEqual([]);
    });

    it('clears error state', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setError('Some error');
      });

      act(() => {
        result.current.clearChat();
      });

      expect(result.current.error).toBeNull();
    });

    it('removes messages from localStorage', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'user', content: 'Test' });
      });

      expect(localStorageMock.getItem('cr360-chat-messages')).not.toBeNull();

      act(() => {
        result.current.clearChat();
      });

      expect(localStorageMock.getItem('cr360-chat-messages')).toBeNull();
    });

    it('does not affect chat open state', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsOpen(true);
        result.current.addMessage({ role: 'user', content: 'Test' });
      });

      act(() => {
        result.current.clearChat();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('does not affect typing indicator', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.setIsTyping(true);
        result.current.addMessage({ role: 'user', content: 'Test' });
      });

      act(() => {
        result.current.clearChat();
      });

      expect(result.current.isTyping).toBe(true);
    });
  });

  describe('loadMessagesFromStorage', () => {
    it('loads messages from localStorage', () => {
      const { result } = renderHook(() => useChatStore());

      // Manually set messages in localStorage
      const messages: ChatMessage[] = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello',
          timestamp: new Date('2025-01-01T10:00:00Z'),
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Hi there!',
          timestamp: new Date('2025-01-01T10:00:05Z'),
        },
      ];
      localStorageMock.setItem('cr360-chat-messages', JSON.stringify(messages));

      act(() => {
        result.current.loadMessagesFromStorage();
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].content).toBe('Hello');
      expect(result.current.messages[1].content).toBe('Hi there!');
    });

    it('converts timestamp strings to Date objects', () => {
      const { result } = renderHook(() => useChatStore());

      const messages = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Test',
          timestamp: '2025-01-01T10:00:00.000Z',
        },
      ];
      localStorageMock.setItem('cr360-chat-messages', JSON.stringify(messages));

      act(() => {
        result.current.loadMessagesFromStorage();
      });

      expect(result.current.messages[0].timestamp).toBeInstanceOf(Date);
    });

    it('loads empty array when no messages in localStorage', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.loadMessagesFromStorage();
      });

      expect(result.current.messages).toEqual([]);
    });

    it('handles invalid JSON in localStorage gracefully', () => {
      const { result } = renderHook(() => useChatStore());

      localStorageMock.setItem('cr360-chat-messages', 'invalid json');

      act(() => {
        result.current.loadMessagesFromStorage();
      });

      expect(result.current.messages).toEqual([]);
    });

    it('replaces existing messages when loading', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'user', content: 'Current message' });
      });

      const storedMessages = [
        {
          id: 'msg-stored',
          role: 'user',
          content: 'Stored message',
          timestamp: new Date('2025-01-01T10:00:00Z'),
        },
      ];
      localStorageMock.setItem('cr360-chat-messages', JSON.stringify(storedMessages));

      act(() => {
        result.current.loadMessagesFromStorage();
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].content).toBe('Stored message');
    });
  });

  describe('Complex Scenarios', () => {
    it('handles full chat workflow', () => {
      const { result } = renderHook(() => useChatStore());

      // User opens chat
      act(() => {
        result.current.toggleChat();
      });
      expect(result.current.isOpen).toBe(true);

      // User sends message
      act(() => {
        result.current.addMessage({ role: 'user', content: 'What is my portfolio health?' });
      });

      // Show typing indicator
      act(() => {
        result.current.setIsTyping(true);
      });

      // Add empty assistant message for streaming
      act(() => {
        result.current.addMessage({ role: 'assistant', content: '' });
      });

      // Stream response
      act(() => {
        result.current.updateLastMessage('Your');
        result.current.updateLastMessage('Your portfolio');
        result.current.updateLastMessage('Your portfolio health is good');
      });

      // Hide typing indicator
      act(() => {
        result.current.setIsTyping(false);
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[1].role).toBe('assistant');
      expect(result.current.messages[1].content).toBe('Your portfolio health is good');
      expect(result.current.isTyping).toBe(false);
    });

    it('handles error in chat workflow', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.addMessage({ role: 'user', content: 'Test question' });
        result.current.setIsTyping(true);
        result.current.setError('Network error');
        result.current.setIsTyping(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isTyping).toBe(false);
    });

    it('persists messages across hook re-renders', () => {
      const { result: result1 } = renderHook(() => useChatStore());

      act(() => {
        result1.current.addMessage({ role: 'user', content: 'Persisted message' });
      });

      // Create new hook instance (simulates component re-render)
      const { result: result2 } = renderHook(() => useChatStore());

      expect(result2.current.messages).toHaveLength(1);
      expect(result2.current.messages[0].content).toBe('Persisted message');
    });

    it('loads persisted messages on initialization', () => {
      // Pre-populate localStorage
      const messages: ChatMessage[] = [
        {
          id: 'msg-old',
          role: 'user',
          content: 'Old message',
          timestamp: new Date('2025-01-01T10:00:00Z'),
        },
      ];
      localStorageMock.setItem('cr360-chat-messages', JSON.stringify(messages));

      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.loadMessagesFromStorage();
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].content).toBe('Old message');
    });
  });
});
