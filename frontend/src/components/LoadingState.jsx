import { Loader2 } from "lucide-react";

/**
 * LoadingState Component
 * Displays a clean loading indicator and status message.
 */
function LoadingState({ message = "Loading claim data...", className = "" }) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        color: "#6b7280",
        gap: "12px"
      }}
    >
      <Loader2
        size={32}
        color="#2563eb"
        style={{
          animation: "cs-spin 1s linear infinite"
        }}
      />
      <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>
        {message}
      </p>
      <style>{`
        @keyframes cs-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingState;
