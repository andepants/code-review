/**
 * Detect programming language from code content
 */
export function detectLanguage(code: string): string {
  // JavaScript/TypeScript patterns
  if (
    /\b(const|let|var|function|=>|import|export)\b/.test(code) &&
    !/\b(def|class.*:)\b/.test(code)
  ) {
    if (/\b(interface|type|enum|namespace)\b/.test(code)) {
      return 'typescript';
    }
    return 'javascript';
  }

  // Python patterns
  if (/\b(def|import|from|class.*:)\b/.test(code) && /:\s*$/.test(code.split('\n')[0])) {
    return 'python';
  }

  // Java patterns
  if (/\b(public|private|class|void|static)\b/.test(code) && /\{/.test(code)) {
    return 'java';
  }

  // Go patterns
  if (/\b(package|func|import)\b/.test(code) && /\bfunc\s+\w+\s*\(/.test(code)) {
    return 'go';
  }

  // C++ patterns
  if (/#include|using namespace|std::/.test(code)) {
    return 'cpp';
  }

  // Rust patterns
  if (/\b(fn|let|mut|impl|trait|use)\b/.test(code) && /->/.test(code)) {
    return 'rust';
  }

  // Ruby patterns
  if (/\b(def|end|require|class|module)\b/.test(code) && /\bend\s*$/.test(code)) {
    return 'ruby';
  }

  // PHP patterns
  if (/<\?php/.test(code)) {
    return 'php';
  }

  return 'plaintext';
}
