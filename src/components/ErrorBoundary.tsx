
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught application error', { error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
          <div className="tech-panel max-w-lg w-full p-8 border-[var(--tech-border)] bg-[var(--tech-inner)] text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertCircle className="text-red-500" size={32} />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-black text-[var(--tech-text-bright)] tracking-tighter uppercase italic">
                System_Failure: CRITICAL_ERROR
              </h1>
              <p className="text-[12px] font-mono text-[var(--tech-text-dim)] uppercase tracking-wider leading-relaxed">
                The application encountered an unexpected runtime exception.
                Module integrity compromised. Error logged to recovery cluster.
              </p>
              {this.state.error && (
                <div className="p-4 bg-black/40 border border-[var(--tech-border)] rounded text-left overflow-hidden">
                  <p className="text-[10px] font-mono text-red-400 break-words italic">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={this.handleReset}
                className="tech-btn flex items-center justify-center space-x-2 py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] group"
              >
                <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>Re-Initialize</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center space-x-2 py-4 px-6 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Home size={14} />
                <span>Abort_To_Home</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[var(--tech-border)]">
              <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                ErrorID: {Math.random().toString(36).substring(2, 10).toUpperCase()} // Build: 2026.04.21
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
