import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Message } from '../../types';
import 'highlight.js/styles/github-dark.css';

interface ThreadMessageProps {
  message: Message;
}

export function ThreadMessage({ message }: ThreadMessageProps) {
  const isUser = message.role === 'user';
  const isStreaming = !isUser && message.metadata?.streamComplete === false;

  // Debug logging for streaming
  React.useEffect(() => {
    if (isStreaming) {
      console.log('[ThreadMessage] Re-render during streaming, content length:', message.content.length);
    }
  }, [message.content, isStreaming]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        data-testid="thread-message"
        data-role={message.role}
        className={`max-w-[85%] rounded-lg p-3 ${
          isUser
            ? 'bg-accent-primary text-white'
            : 'bg-surfaceElevated text-text-primary'
        }`}
      >
        {isUser ? (
          // User messages: plain text with line breaks
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>
        ) : (
          // AI messages: render markdown with syntax highlighting
          <div className="prose prose-invert prose-sm max-w-none
                          prose-headings:text-text-primary
                          prose-p:text-text-primary
                          prose-strong:text-text-primary
                          prose-code:text-text-primary
                          prose-pre:bg-gray-900
                          prose-pre:border
                          prose-pre:border-gray-700">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Style inline code differently from code blocks
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !match ? (
                    // Inline code
                    <code
                      className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    // Code block
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-flex ml-1 gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
              </span>
            )}
          </div>
        )}
        <div data-testid="message-timestamp" className="text-xs mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
