import React from 'react';
import { Header } from './Header';
import { CodeEditor } from '../editor/CodeEditor';
import { ThreadPanel } from '../threads/ThreadPanel';

export function AppLayout() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div data-testid="editor-panel" className="flex-1 w-3/5">
          <CodeEditor />
        </div>
        <div className="w-2/5">
          <ThreadPanel />
        </div>
      </div>
    </div>
  );
}
