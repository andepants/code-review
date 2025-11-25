import React, { useState } from 'react';
import { useThreadStore } from '../../store/threadStore';
import { useEditorStore } from '../../store/editorStore';
import { ThreadItem } from './ThreadItem';
import { NewThreadButton } from './NewThreadButton';
import { Button } from '../ui/Button';

export function ThreadPanel() {
  const activeThreadId = useThreadStore((state) => state.activeThreadId);
  const setActiveThread = useThreadStore((state) => state.setActiveThread);
  // Get active thread directly from store for proper reactivity
  const activeThread = useThreadStore((state) =>
    state.threads.find((t) => t.id === state.activeThreadId)
  );
  const threads = useThreadStore((state) => state.threads);
  const currentSelection = useEditorStore((state) => state.currentSelection);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const filteredThreads = threads.filter((thread) => {
    if (filter === 'all') return true;
    return thread.status === filter;
  });

  return (
    <div data-testid="thread-panel" className="h-full bg-surface flex flex-col border-l border-gray-700 relative">
      {/* Header */}
      <div className="h-12 border-b border-gray-700 flex items-center px-4 gap-3">
        <h2 className="text-sm font-semibold text-text-primary">
          Threads ({threads.length})
        </h2>
        <div className="flex-1" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-xs bg-surfaceElevated text-text-primary px-2 py-1 rounded border border-gray-700"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Thread List or Active Thread */}
      <div className="flex-1 overflow-hidden">
        {activeThread ? (
          <div className="h-full flex flex-col">
            <div className="border-b border-gray-700 p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveThread(null)}
              >
                ← Back to threads
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <ThreadItem thread={activeThread} expanded={true} />
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-text-muted mb-4">
                  {filter === 'all'
                    ? 'No threads yet'
                    : `No ${filter} threads`}
                </p>
                {currentSelection && filter === 'all' && (
                  <NewThreadButton />
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThread(thread.id)}
                    className="cursor-pointer hover:bg-surfaceElevated transition-colors"
                  >
                    <ThreadItem thread={thread} expanded={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
