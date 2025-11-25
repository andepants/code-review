import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useThreadStore } from '../../store/threadStore';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { SUPPORTED_LANGUAGES } from '../../config/constants';
import { getExampleForLanguage } from '../../examples/languageExamples';

export function EditorToolbar() {
  const document = useEditorStore((state) => state.document);
  const setLanguage = useEditorStore((state) => state.setLanguage);
  const updateContent = useEditorStore((state) => state.updateContent);
  const reset = useEditorStore((state) => state.reset);
  const threads = useThreadStore((state) => state.threads);
  const resetThreads = useThreadStore((state) => state.reset);

  const [showClearCodeModal, setShowClearCodeModal] = useState(false);
  const [showClearThreadsModal, setShowClearThreadsModal] = useState(false);

  const handleClearCode = () => {
    setShowClearCodeModal(true);
  };

  const handleClearThreads = () => {
    setShowClearThreadsModal(true);
  };

  const confirmClearCode = () => {
    reset();
    setShowClearCodeModal(false);
  };

  const confirmClearThreads = () => {
    resetThreads();
    setShowClearThreadsModal(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;

    // Auto-load example if editor is empty
    const isEmpty = !document?.content || document.content.trim() === '';
    if (isEmpty) {
      const example = getExampleForLanguage(newLanguage);
      if (example) {
        updateContent(example);
      }
    }

    setLanguage(newLanguage);
  };

  return (
    <>
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

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCode}
          title="Clear all code"
        >
          Clear Code
        </Button>

        {threads.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearThreads}
            title="Clear all threads"
          >
            Clear Threads
          </Button>
        )}

        <div className="flex-1" />

        {document?.content && (
          <span className="text-sm text-text-muted">
            {document.content.split('\n').length} lines
          </span>
        )}
      </div>

      <ConfirmModal
        isOpen={showClearCodeModal}
        title="Clear all code?"
        message="This will permanently delete all code in the editor. This action cannot be undone."
        confirmText="Clear Code"
        cancelText="Cancel"
        onConfirm={confirmClearCode}
        onCancel={() => setShowClearCodeModal(false)}
      />

      <ConfirmModal
        isOpen={showClearThreadsModal}
        title="Clear all threads?"
        message={`This will permanently delete ${threads.length} thread${threads.length > 1 ? 's' : ''} and all conversation history. This action cannot be undone.`}
        confirmText="Clear Threads"
        cancelText="Cancel"
        onConfirm={confirmClearThreads}
        onCancel={() => setShowClearThreadsModal(false)}
      />
    </>
  );
}
