// Language Examples Registry
//
// This module provides example code for all supported languages.
// Examples are imported as raw strings using Vite's ?raw suffix.

import javascriptExample from './javascript.jsx?raw';
import typescriptExample from './typescript.tsx?raw';
import pythonExample from './python.py?raw';
import phpExample from './php.php?raw';
import rubyExample from './ruby.rb?raw';
import javaExample from './java.java?raw';
import goExample from './go.go?raw';
import cppExample from './cpp.cpp?raw';
import rustExample from './rust.rs?raw';

export const LANGUAGE_EXAMPLES: Record<string, string> = {
  javascript: javascriptExample,
  typescript: typescriptExample,
  python: pythonExample,
  php: phpExample,
  ruby: rubyExample,
  java: javaExample,
  go: goExample,
  cpp: cppExample,
  rust: rustExample,
};

/**
 * Get example code for a specific language
 * @param language - The language identifier (e.g., 'javascript', 'python')
 * @returns The example code as a string, or null if not found
 */
export function getExampleForLanguage(language: string): string | null {
  return LANGUAGE_EXAMPLES[language] || null;
}
