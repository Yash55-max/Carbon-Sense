/**
 * ErrorBoundary — Class-based React Error Boundary.
 * Catches any unhandled runtime errors in child components
 * and renders a terminal-styled fallback UI instead of crashing.
 */

import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * @typedef {Object} ErrorBoundaryProps
 * @property {React.ReactNode} children
 * @property {React.ReactNode} [fallback] - Optional custom fallback UI
 */

/**
 * @typedef {Object} ErrorBoundaryState
 * @property {boolean} hasError
 * @property {Error|null} error
 */

export default class ErrorBoundary extends Component {
  /** @param {ErrorBoundaryProps} props */
  constructor(props) {
    super(props);
    /** @type {ErrorBoundaryState} */
    this.state = { hasError: false, error: null };
  }

  /**
   * Update state so the next render shows the fallback UI.
   * @param {Error} error
   * @returns {ErrorBoundaryState}
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Log error details for debugging.
   * @param {Error} error
   * @param {React.ErrorInfo} info
   */
  componentDidCatch(error, info) {
    console.error('[CarbonSense ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="cs-card flex flex-col items-center justify-center gap-4 py-16 text-center"
        >
          <div className="w-12 h-12 rounded-cs bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-geist font-bold text-xl text-cs-text mb-1">
              Protocol Error
            </h2>
            <p className="font-mono text-xs text-cs-text-muted max-w-sm">
              {this.state.error?.message ?? 'An unexpected runtime error occurred.'}
            </p>
          </div>
          <button
            type="button"
            className="cs-btn-primary text-xs py-2 px-4"
            onClick={this.handleReset}
          >
            Reset Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
