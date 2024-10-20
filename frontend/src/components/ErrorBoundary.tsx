import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // Update state when an error occurs to display fallback UI
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // Log the error information for debugging
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if an error occurred
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>Please try again later.</p>
        </div>
      );
    }

    // Render children components if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
