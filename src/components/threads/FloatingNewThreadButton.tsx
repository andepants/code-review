import React from 'react';
import { toast } from 'sonner';
import { useThreadStore } from '../../store/threadStore';
import { useEditorStore } from '../../store/editorStore';

export function FloatingNewThreadButton() {
  const currentSelection = useEditorStore((state) => state.currentSelection);
  const document = useEditorStore((state) => state.document);
  const createThread = useThreadStore((state) => state.createThread);

  const handleCreateThread = () => {
    // Validate code is highlighted
    if (!currentSelection) {
      toast.error('Please highlight code to start a thread');
      return;
    }

    // Validate document exists
    if (!document) {
      toast.error('No document is currently open');
      return;
    }

    // Create new thread using store method
    createThread(currentSelection, document.id);
  };

  return (
    <button
      onClick={handleCreateThread}
      className="absolute bottom-6 right-6 z-50
                 w-14 h-14 rounded-full
                 bg-accent-primary hover:bg-blue-600
                 text-white shadow-lg hover:shadow-xl
                 flex items-center justify-center
                 transition-all duration-200
                 hover:scale-110 active:scale-95
                 group"
      title="Create new thread from selection"
      aria-label="Create new thread from selection"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 transition-transform group-hover:rotate-90 duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
}
