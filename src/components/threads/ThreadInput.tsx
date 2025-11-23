import React, { useState } from 'react';
import { useThreadStore } from '../../store/threadStore';
import { useEditorStore } from '../../store/editorStore';
import { useAI } from '../../hooks/useAI';
import { useConfigStore } from '../../store/configStore';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { MAX_MESSAGE_LENGTH } from '../../config/constants';

interface ThreadInputProps {
  threadId: string;
}

export function ThreadInput({ threadId }: ThreadInputProps) {
  const [input, setInput] = useState('');
  const addMessage = useThreadStore((state) => state.addMessage);
  const updateMessage = useThreadStore((state) => state.updateMessage);
  const threads = useThreadStore((state) => state.threads);
  const document = useEditorStore((state) => state.document);
  const maxContextLines = useConfigStore((state) => state.config.maxContextLines);
  const { streamReview, isStreaming, error } = useAI();

  const thread = threads.find((t) => t.id === threadId);

  const handleSend = async () => {
    if (!input.trim() || !thread || !document || isStreaming) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addMessage(threadId, {
      threadId,
      role: 'user',
      content: userMessage,
    });

    // Create AI message placeholder
    const aiMessageId = crypto.randomUUID();
    addMessage(threadId, {
      threadId,
      role: 'assistant',
      content: '',
      metadata: { streamComplete: false },
    });

    let aiContent = '';

    try {
      await streamReview(
        {
          selection: thread.selection,
          userMessage,
          language: document.language,
          fullCode: document.content,
          fileName: document.fileName,
          conversationHistory: thread.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
        (chunk) => {
          aiContent += chunk;
          updateMessage(aiMessageId, { content: aiContent });
        },
        () => {
          updateMessage(aiMessageId, {
            metadata: { streamComplete: true, model: 'claude-3-5-sonnet' },
          });
        }
      );
    } catch (err) {
      updateMessage(aiMessageId, {
        content: aiContent || `Error: ${error || 'Failed to get AI response'}`,
        metadata: { streamComplete: true },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        data-testid="thread-input"
        value={input}
        onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about this code..."
        className="w-full min-h-[80px] p-3 bg-background border border-gray-700 rounded-md text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary"
        disabled={isStreaming}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">
          {input.length} / {MAX_MESSAGE_LENGTH}
        </span>
        <Button
          type="submit"
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          size="sm"
        >
          {isStreaming ? <LoadingSpinner size="sm" /> : 'Send'}
        </Button>
      </div>
      {error && (
        <p data-testid="error-message" className="text-xs text-accent-error">
          Error: {error}
        </p>
      )}
    </div>
  );
}
