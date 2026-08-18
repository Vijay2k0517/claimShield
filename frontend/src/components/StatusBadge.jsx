/**
 * StatusBadge Component
 * Renders standardized status pills for claims (Review, Pending, Escalated, Legitimate).
 */
function StatusBadge({ status = "Review", className = "" }) {
  const normalizedStatus = (status || "Review").toLowerCase();

  const getStatusClass = () => {
    if (normalizedStatus.includes("review")) {
      return "status review";
    }
    if (normalizedStatus.includes("pending")) {
      return "status pending";
    }
    if (normalizedStatus.includes("escalat")) {
      return "status high"; // Uses alert styling
    }
    if (normalizedStatus.includes("legit") || normalizedStatus.includes("approv")) {
      return "status legitimate";
    }
    return "status review";
  };

  return (
    <span className={`${getStatusClass()} ${className}`.trim()}>
      {status}
    </span>
  );
}

export default StatusBadge;
