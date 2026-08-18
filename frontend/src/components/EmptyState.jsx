import { Inbox } from "lucide-react";

/**
 * EmptyState Component
 * Displays a friendly empty state when no records/claims match current filters.
 */
function EmptyState({
  title = "No claims found",
  description = "Try adjusting your search or filters to find what you are looking for.",
  icon: Icon = Inbox,
  actionText,
  onAction,
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
        padding: "48px 24px",
        textAlign: "center",
        color: "#6b7280",
        background: "white",
        borderRadius: "10px",
        border: "1px dashed #e5e7eb",
        margin: "12px 0"
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
          color: "#9ca3af"
        }}
      >
        <Icon size={26} />
      </div>

      <h3 style={{ fontSize: "16px", color: "#111827", margin: "0 0 6px" }}>
        {title}
      </h3>

      <p style={{ fontSize: "13px", color: "#6b7280", maxWidth: "360px", margin: "0 0 16px" }}>
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="new-claim-btn"
          style={{ fontSize: "12px", padding: "8px 16px" }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
