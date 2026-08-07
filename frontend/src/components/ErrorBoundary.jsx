import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught Error Boundary catch:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 font-minimal">
          <div className="size-16 rounded-3xl bg-error/10 text-error flex items-center justify-center shadow-md border border-error/20">
            <AlertTriangle className="size-8" />
          </div>
          <h2 className="text-xl font-black text-base-content tracking-tight">Something went wrong</h2>
          <p className="text-xs text-base-content/60 max-w-md font-medium leading-relaxed">
            An unexpected UI rendering error occurred. Tapping reload will refresh your workspace cleanly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-primary text-primary-content rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="size-4" /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
