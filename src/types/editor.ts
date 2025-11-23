/**
 * Code document represents the current code being edited
 */
export interface CodeDocument {
  id: string;
  content: string;
  language: string;
  fileName?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Code selection represents a range of selected code
 * Line and column numbers are 1-based (Monaco Editor convention)
 */
export interface CodeSelection {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  selectedText: string;
  contextBefore: string;
  contextAfter: string;
}
