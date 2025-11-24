import React from 'react';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AppLayout />
      <Toaster position="bottom-right" />
    </ErrorBoundary>
  );
}

export default App;
