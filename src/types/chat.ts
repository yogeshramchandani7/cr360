/**
 * Chat Types
 * TypeScript interfaces for the AI chatbot feature
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  error?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  error: string | null;
}

export interface AppContext {
  currentPage: string;
  currentRoute: string;
  globalFilters: {
    lob: string[];
    partyType: string[];
    rating: string[];
    assetClassification: string[];
  };
  selectedCompanyId?: string;
  selectedCompanyName?: string;
  portfolioSummary: {
    totalCompanies: number;
    totalExposure: number;
    totalKPIs: number;
  };
}

export interface SuggestedQuery {
  id: string;
  text: string;
  category: 'general' | 'company' | 'portfolio' | 'risk';
}
