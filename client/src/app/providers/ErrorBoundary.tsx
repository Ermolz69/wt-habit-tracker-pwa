import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card } from '@/shared/ui';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error boundary caught an error', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen app-shell flex items-center justify-center px-4">
        <Card className="max-w-lg text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-danger/10 text-2xl text-danger">
            !
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-muted">
            Safe recovery
          </div>
          <h1 className="mt-3 font-display text-4xl text-dark">Something went wrong</h1>
          <p className="mx-auto mt-4 max-w-sm leading-7 text-muted">
            Your local habit data is still stored on this device. Reload the app to start from a clean UI state.
          </p>
          <Button type="button" className="mt-7 px-6 py-3 text-base" onClick={() => window.location.reload()}>
            Reload app
          </Button>
        </Card>
      </div>
    );
  }
}
