import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * ErrorMessage Component
 * Displays an error notification box with an optional retry action.
 */
function ErrorMessage({
  message = "An error occurred while processing claim data.",
  onRetry,
  className = ""
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "#fff5f5",
        border: "1px solid #fed7d7",
        borderRadius: "8px",
        color: "#c53030",
        textAlign: "center",
        gap: "12px"
      }}
    >
      <AlertCircle size={28} color="#e53e3e" />
      <div>
        <h4 style={{ margin: "0 0 4px", fontSize: "15px", color: "#9b2c2c" }}>
          Unable to Load Data
        </h4>
        <p style={{ margin: 0, fontSize: "13px", color: "#742a2a" }}>
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#c53030",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "4px"
          }}
        >
          <RefreshCw size={13} />
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
