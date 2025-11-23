import React from 'react';
import { useThreadStore } from '../../store/threadStore';
import { useEditorStore } from '../../store/editorStore';
import { THREAD_COLORS } from '../../config/constants';

export function FloatingNewThreadButton() {
  const currentSelection = useEditorStore((state) => state.currentSelection);
  const addThread = useThreadStore((state) => state.addThread);
  const setActiveThread = useThreadStore((state) => state.setActiveThread);
  const threads = useThreadStore((state) => state.threads);

  // Only show button when code is selected
  if (!currentSelection) {
    return null;
  }

  const handleCreateThread = () => {
    if (!currentSelection) return;

    // Create new thread from current selection
    const colorIndex = threads.length % THREAD_COLORS.length;
    const newThread = {
      selection: currentSelection,
      color: THREAD_COLORS[colorIndex],
    };

    const threadId = addThread(newThread);
    setActiveThread(threadId);
  };

  return (
    <button
      onClick={handleCreateThread}
      className="fixed bottom-6 right-6 z-50
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

      {/* Pulse animation ring */}
      <span className="absolute inset-0 rounded-full bg-accent-primary opacity-75 animate-ping" />
    </button>
  );
}
