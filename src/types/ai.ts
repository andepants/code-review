import { CodeSelection } from './editor';

/**
 * AI code review request
 */
export interface CodeReviewRequest {
  selection: CodeSelection;
  userMessage: string;
  language: string;
  fullCode: string;
  fileName?: string;
  conversationHistory?: ConversationMessage[];
}

/**
 * Conversation message for context
 */
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * AI response
 */
export interface CodeReviewResponse {
  content: string;
  model: string;
  tokens?: number;
}

/**
 * UltraThink chat request
 */
export interface UltraThinkRequest {
  message: string;
  conversationHistory?: ConversationMessage[];
  systemPrompt?: string;
}
