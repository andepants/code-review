import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useThreadStore } from '../../store/threadStore';
import { Button } from '../ui/Button';

export function NewThreadButton() {
  const currentSelection = useEditorStore((state) => state.currentSelection);
  const document = useEditorStore((state) => state.document);
  const createThread = useThreadStore((state) => state.createThread);
  const setActiveThread = useThreadStore((state) => state.setActiveThread);

  const handleCreateThread = () => {
    if (!currentSelection || !document) return;

    const thread = createThread(currentSelection, document.id);
    setActiveThread(thread.id);
  };

  if (!currentSelection) return null;

  return (
    <div className="p-4">
      <Button onClick={handleCreateThread} className="w-full">
        Ask AI
      </Button>
      <p className="text-xs text-text-muted mt-2 text-center">
        Lines {currentSelection.startLine}-{currentSelection.endLine} selected
      </p>
    </div>
  );
}
