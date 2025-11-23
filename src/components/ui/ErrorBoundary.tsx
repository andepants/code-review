import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Something went wrong
            </h2>
            <p className="text-text-secondary mb-4">
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            {this.state.error && (
              <details className="mb-4">
                <summary className="text-sm text-text-muted cursor-pointer">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs text-text-muted bg-background p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
