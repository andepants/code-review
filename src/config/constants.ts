/**
 * Application-wide constants
 */

export const APP_NAME = 'AI Code Review Assistant';
export const MAX_FILE_SIZE = 1024 * 1024; // 1MB
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_CONTEXT_LINES = 50;
export const DEFAULT_CONTEXT_LINES = 10;
export const DEFAULT_FONT_SIZE = 14;
export const MAX_THREADS = 50;
export const MAX_MESSAGES_PER_THREAD = 100;

/**
 * AI Model Configuration
 * The application will automatically fetch and use the latest available model
 * from the selected tier (Haiku, Sonnet, or Opus)
 */
export const DEFAULT_MODEL_TIER = 'haiku'; // Options: 'haiku', 'sonnet', 'opus'

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'go', name: 'Go' },
  { id: 'cpp', name: 'C++' },
  { id: 'rust', name: 'Rust' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'php', name: 'PHP' },
];

export const THREAD_COLORS = [
  '#4fc3f7',
  '#81c784',
  '#ffb74d',
  '#e57373',
  '#ba68c8',
  '#64b5f6',
  '#ffd54f',
  '#f06292',
];
