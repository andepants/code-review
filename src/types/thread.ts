import { CodeSelection } from './editor';

/**
 * Thread represents a conversation about a specific code selection
 */
export interface Thread {
  id: string;
  documentId: string;
  selection: CodeSelection;
  messages: Message[];
  status: 'active' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  colorIndex: number; // 1-8 for thread colors
}

/**
 * Message in a thread conversation
 */
export interface Message {
  id: string;
  threadId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    streamComplete?: boolean;
  };
}
