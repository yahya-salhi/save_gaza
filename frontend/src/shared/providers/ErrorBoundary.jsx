import { Component } from "react";

/**
 * @typedef {object} ErrorBoundaryProps
 * @property {import("react").ReactNode} children
 * @property {import("react").ReactNode} [fallback]
 */

/**
 * @typedef {object} ErrorBoundaryState
 * @property {Error | null} error
 */

/**
 * Catches unhandled rendering errors in its subtree and shows a recovery UI.
 * Must be the outermost provider so every downstream component is protected.
 */
export class ErrorBoundary extends Component {
  /** @type {ErrorBoundaryState} */
  state = { error: null };

  /**
   * @param {Error} error
   * @returns {ErrorBoundaryState}
   */
  static getDerivedStateFromError(error) {
    return { error };
  }

  /**
   * @param {Error} error
   */
  componentDidCatch(error) {
    console.error("[ErrorBoundary]", error);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-4)",
            background: "var(--bg)",
            color: "var(--text-2)",
            fontFamily: "var(--font-sans)",
            padding: "var(--space-6)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "var(--text-1)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-2xl)",
              fontWeight: 700,
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: "var(--text-base)",
              maxWidth: "480px",
            }}
          >
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={this.reset}
            type="button"
            style={{
              background: "var(--accent-500)",
              color: "var(--text-on-accent)",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-3) var(--space-5)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
