/**
 * Chat Store
 * Zustand store for managing chat state and messages
 */

import { create } from 'zustand';
import type { ChatMessage } from '../types/chat';

interface ChatStore {
  // State
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  error: string | null;

  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateLastMessage: (content: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleChat: () => void;
  setIsTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
  loadMessagesFromStorage: () => void;
}

// Helper to generate unique IDs
const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to save messages to localStorage
const saveMessagesToStorage = (messages: ChatMessage[]) => {
  try {
    localStorage.setItem('cr360-chat-messages', JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat messages:', error);
  }
};

// Helper to load messages from localStorage
const loadMessagesFromStorageHelper = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem('cr360-chat-messages');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error('Failed to load chat messages:', error);
  }
  return [];
};

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  messages: [],
  isOpen: false,
  isTyping: false,
  error: null,

  // Add a new message
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    };

    set((state) => {
      const updatedMessages = [...state.messages, newMessage];
      saveMessagesToStorage(updatedMessages);
      return { messages: updatedMessages };
    });
  },

  // Update the last message (useful for streaming)
  updateLastMessage: (content) => {
    set((state) => {
      if (state.messages.length === 0) return state;

      const updatedMessages = [...state.messages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];

      if (lastMessage && lastMessage.role === 'assistant') {
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content,
        };
        saveMessagesToStorage(updatedMessages);
        return { messages: updatedMessages };
      }

      return state;
    });
  },

  // Set chat open state
  setIsOpen: (isOpen) => set({ isOpen }),

  // Toggle chat open/closed
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  // Set typing indicator
  setIsTyping: (isTyping) => set({ isTyping }),

  // Set error message
  setError: (error) => set({ error }),

  // Clear all chat messages
  clearChat: () => {
    set({ messages: [], error: null });
    try {
      localStorage.removeItem('cr360-chat-messages');
    } catch (error) {
      console.error('Failed to clear chat messages:', error);
    }
  },

  // Load messages from localStorage
  loadMessagesFromStorage: () => {
    const messages = loadMessagesFromStorageHelper();
    set({ messages });
  },
}));
