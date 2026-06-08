// features/chatbot/types/index.ts
export type Domain      = 'perkuliahan' | 'wisudawan' | 'unknown';
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  domain?: Domain;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  domain?: Domain;
}