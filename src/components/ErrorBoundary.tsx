import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Handle specific Portal errors gracefully
    if (error.message.includes('removeChild') || error.message.includes('Portal')) {
      console.warn('Portal rendering error caught and handled gracefully');
      // Don't re-throw Portal errors, just log them
      return;
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ error, resetError }) => (
  <div className="flex flex-col items-center justify-center p-8 border border-red-200 rounded-lg bg-red-50">
    <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
    <p className="text-red-600 mb-4 text-center">
      {error?.message || 'An unexpected error occurred'}
    </p>
    <button
      onClick={resetError}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

export default ErrorBoundary;
