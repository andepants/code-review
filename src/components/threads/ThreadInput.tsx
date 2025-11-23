import React, { useState, useRef, useEffect } from 'react';
import { useThreadStore } from '../../store/threadStore';
import { useEditorStore } from '../../store/editorStore';
import { useAI } from '../../hooks/useAI';
import { useConfigStore } from '../../store/configStore';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { MAX_MESSAGE_LENGTH } from '../../config/constants';

// Throttle function for smooth streaming updates
function createThrottle(delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: any[] | null = null;

  const throttled = (func: Function, ...args: any[]) => {
    console.log(`[Throttle] throttled() called, timeoutId exists: ${!!timeoutId}`);
    lastArgs = args;
    if (!timeoutId) {
      console.log(`[Throttle] Scheduling execution in ${delay}ms`);
      timeoutId = setTimeout(() => {
        console.log(`[Throttle] Executing scheduled function with args:`, lastArgs);
        if (lastArgs) {
          func(...lastArgs);
          console.log(`[Throttle] Function executed successfully`);
        }
        timeoutId = null;
        lastArgs = null;
      }, delay);
    } else {
      console.log(`[Throttle] Timeout already scheduled, updating lastArgs`);
    }
  };

  const flush = (func: Function) => {
    console.log(`[Throttle] flush() called, timeoutId exists: ${!!timeoutId}, lastArgs exists: ${!!lastArgs}`);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      console.log(`[Throttle] Cleared timeout`);
    }
    if (lastArgs) {
      console.log(`[Throttle] Flushing with lastArgs:`, lastArgs);
      func(...lastArgs);
      console.log(`[Throttle] Flush executed successfully`);
      lastArgs = null;
    }
  };

  return { throttled, flush };
}

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
  const { streamReview, streamUltraThink, isStreaming, error } = useAI();

  const thread = threads.find((t) => t.id === threadId);
  const throttleRef = useRef<ReturnType<typeof createThrottle> | null>(null);

  // Initialize throttle on mount
  useEffect(() => {
    throttleRef.current = createThrottle(50); // 50ms throttle for smooth updates
  }, []);

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
      id: aiMessageId,
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
          console.log(`[ThreadInput] onChunk callback received chunk, length: ${chunk.length}`);
          aiContent += chunk;
          console.log(`[ThreadInput] Accumulated content length: ${aiContent.length}`);
          // Use throttled updates for smooth streaming
          if (throttleRef.current) {
            console.log(`[ThreadInput] Calling throttle.throttled() for messageId: ${aiMessageId}`);
            throttleRef.current.throttled(updateMessage, aiMessageId, { content: aiContent });
          } else {
            console.warn('[ThreadInput] throttleRef.current is null!');
          }
        },
        () => {
          console.log(`[ThreadInput] onComplete callback fired, final content length: ${aiContent.length}`);
          // Flush any pending updates and mark as complete
          if (throttleRef.current) {
            console.log(`[ThreadInput] Calling throttle.flush() for final update`);
            throttleRef.current.flush(() => updateMessage(aiMessageId, { content: aiContent }));
          }
          console.log(`[ThreadInput] Marking stream as complete`);
          updateMessage(aiMessageId, {
            metadata: { streamComplete: true, model: 'claude-3-5-sonnet' },
          });
        }
      );
    } catch (err) {
      // Flush any pending updates on error
      if (throttleRef.current) {
        throttleRef.current.flush(() => updateMessage(aiMessageId, { content: aiContent }));
      }
      updateMessage(aiMessageId, {
        content: aiContent || `Error: ${error || 'Failed to get AI response'}`,
        metadata: { streamComplete: true },
      });
    }
  };

  /**
   * Example: Using streamUltraThink for general chat (without code review context)
   * This demonstrates the streaming pattern with markdown rendering in ThreadMessage
   */
  const handleUltraThinkSend = async () => {
    if (!input.trim() || !thread || isStreaming) return;

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
      id: aiMessageId,
      threadId,
      role: 'assistant',
      content: '',
      metadata: { streamComplete: false },
    });

    let aiContent = '';

    try {
      await streamUltraThink(
        {
          message: userMessage,
          // Optional: Include conversation history for context
          conversationHistory: thread.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          // Optional: Add a system prompt for ultrathink behavior
          systemPrompt: 'You are UltraThink, an advanced AI assistant that provides deep, thoughtful responses with clear reasoning.',
        },
        (chunk) => {
          aiContent += chunk;
          // Use throttled updates for smooth streaming (50ms interval)
          if (throttleRef.current) {
            throttleRef.current.throttled(updateMessage, aiMessageId, { content: aiContent });
          }
        },
        () => {
          // Flush final chunk and mark stream as complete
          if (throttleRef.current) {
            throttleRef.current.flush(() => updateMessage(aiMessageId, { content: aiContent }));
          }
          updateMessage(aiMessageId, {
            metadata: { streamComplete: true, model: 'claude-haiku' },
          });
        }
      );
    } catch (err) {
      // Handle errors gracefully
      if (throttleRef.current) {
        throttleRef.current.flush(() => updateMessage(aiMessageId, { content: aiContent }));
      }
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
