import { CodeSelection } from '../types';

/**
 * Extract code context around a selection
 */
export function extractCodeContext(
  fullCode: string,
  startLine: number,
  endLine: number,
  contextLines: number = 10
): { contextBefore: string; contextAfter: string; selectedText: string } {
  const lines = fullCode.split('\n');

  // Extract selected text (1-based line numbers)
  const selectedText = lines.slice(startLine - 1, endLine).join('\n');

  // Extract context before
  const beforeStart = Math.max(0, startLine - contextLines - 1);
  const contextBefore = lines.slice(beforeStart, startLine - 1).join('\n');

  // Extract context after
  const afterEnd = Math.min(lines.length, endLine + contextLines);
  const contextAfter = lines.slice(endLine, afterEnd).join('\n');

  return {
    selectedText,
    contextBefore,
    contextAfter,
  };
}

/**
 * Create a CodeSelection from Monaco selection
 */
export function createCodeSelection(
  selection: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  },
  fullCode: string,
  contextLines: number = 10
): CodeSelection {
  const { selectedText, contextBefore, contextAfter } = extractCodeContext(
    fullCode,
    selection.startLineNumber,
    selection.endLineNumber,
    contextLines
  );

  return {
    startLine: selection.startLineNumber,
    startColumn: selection.startColumn,
    endLine: selection.endLineNumber,
    endColumn: selection.endColumn,
    selectedText,
    contextBefore,
    contextAfter,
  };
}
