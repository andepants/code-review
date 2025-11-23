import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useThreadStore } from '../../store/threadStore';
import { Button } from '../ui/Button';
import { SUPPORTED_LANGUAGES } from '../../config/constants';

export function EditorToolbar() {
  const document = useEditorStore((state) => state.document);
  const setLanguage = useEditorStore((state) => state.setLanguage);
  const reset = useEditorStore((state) => state.reset);
  const threads = useThreadStore((state) => state.threads);
  const resetThreads = useThreadStore((state) => state.reset);

  const handleClear = () => {
    const hasContent = document?.content && document.content.length > 100;
    const hasThreads = threads.length > 0;

    if (hasContent || hasThreads) {
      const message = hasThreads
        ? `Clear all code? This will also delete ${threads.length} thread${threads.length > 1 ? 's' : ''}.`
        : 'Clear all code? This cannot be undone.';

      if (window.confirm(message)) {
        reset();
        resetThreads();
      }
    } else {
      reset();
      resetThreads();
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="h-12 bg-surface border-b border-gray-700 flex items-center px-4 gap-3">
      <select
        data-testid="language-selector"
        value={document?.language || 'javascript'}
        onChange={handleLanguageChange}
        className="bg-surfaceElevated text-text-primary px-3 py-1 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-primary"
        aria-label="Programming language"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>

      <div className="flex-1" />

      {document?.content && (
        <span className="text-sm text-text-muted">
          {document.content.split('\n').length} lines
        </span>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleClear}
        title="Clear all code"
      >
        Clear
      </Button>
    </div>
  );
}
