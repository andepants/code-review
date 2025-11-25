import React, { useState } from 'react';
import { Thread } from '../../types';
import { useThreadStore } from '../../store/threadStore';
import { THREAD_COLORS } from '../../config/constants';
import { ThreadMessage } from './ThreadMessage';
import { ThreadInput } from './ThreadInput';
import { Button } from '../ui/Button';

interface ThreadItemProps {
  thread: Thread;
  expanded: boolean;
}

export function ThreadItem({ thread, expanded }: ThreadItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const resolveThread = useThreadStore((state) => state.resolveThread);
  const reopenThread = useThreadStore((state) => state.reopenThread);
  const deleteThread = useThreadStore((state) => state.deleteThread);

  const threadColor = THREAD_COLORS[thread.colorIndex - 1];
  const isResolved = thread.status === 'resolved';

  const handleDelete = () => {
    if (window.confirm('Delete this thread? This cannot be undone.')) {
      deleteThread(thread.id);
    }
  };

  const handleToggleResolve = () => {
    if (isResolved) {
      reopenThread(thread.id);
    } else {
      resolveThread(thread.id);
    }
  };

  const handleResolveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleResolve();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDelete();
  };

  return (
    <div data-testid="thread-item" data-active={expanded} data-status={thread.status} data-color={`thread-${thread.colorIndex}`} className="p-4">
      {/* Thread Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: threadColor }}
        />
        <span className="text-sm font-medium text-text-primary">
          Thread {thread.colorIndex}
        </span>
        <span className="text-xs text-text-muted">
          Lines {thread.selection.startLine}-{thread.selection.endLine}
        </span>
        {isResolved && (
          <span className="text-xs px-2 py-0.5 bg-accent-success/20 text-accent-success rounded">
            Resolved
          </span>
        )}
        <div className="flex-1" />
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResolveClick}
            title={isResolved ? 'Reopen thread' : 'Resolve thread'}
            aria-label={isResolved ? 'Reopen thread' : 'Resolve thread'}
          >
            {isResolved ? '↩' : '✓'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            title="Delete thread"
            aria-label="Delete thread"
          >
            🗑
          </Button>
        </div>
      </div>

      {/* Code Preview */}
      <div className="mb-3 bg-background rounded p-2 border-l-2" style={{ borderColor: threadColor }}>
        <pre className="text-xs text-text-secondary font-mono overflow-x-auto">
          {thread.selection.selectedText.split('\n').slice(0, 3).join('\n')}
          {thread.selection.selectedText.split('\n').length > 3 && '\n...'}
        </pre>
      </div>

      {/* Messages */}
      {expanded && !isCollapsed && (
        <div className="space-y-3">
          {thread.messages.map((message) => (
            <ThreadMessage key={message.id} message={message} />
          ))}

          {/* Input for new message */}
          {!isResolved && <ThreadInput threadId={thread.id} />}
        </div>
      )}

      {/* Collapsed view - show message count */}
      {!expanded && thread.messages.length > 0 && (
        <p className="text-xs text-text-muted">
          {thread.messages.length} message{thread.messages.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
