/**
 * Monaco Editor configuration
 */

export const MONACO_OPTIONS = {
  fontSize: 14,
  fontFamily: 'Fira Code, monospace',
  fontLigatures: true,
  minimap: { enabled: true },
  lineNumbers: 'on' as const,
  renderWhitespace: 'selection' as const,
  tabSize: 2,
  wordWrap: 'off' as const,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  theme: 'vs-dark',
};

export const MONACO_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '569cd6' },
    { token: 'string', foreground: 'ce9178' },
    { token: 'comment', foreground: '6a9955' },
    { token: 'function', foreground: 'dcdcaa' },
    { token: 'variable', foreground: '9cdcfe' },
    { token: 'number', foreground: 'b5cea8' },
  ],
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
    'editor.lineHighlightBackground': '#2a2a2a',
    'editorLineNumber.foreground': '#858585',
    'editor.selectionBackground': '#264f78',
  },
};
