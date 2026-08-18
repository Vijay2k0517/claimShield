/**
 * RiskBadge Component
 * Displays the risk level (HIGH, MEDIUM, LOW) with consistent color-coding
 * and optional fraud probability percentage.
 */
function RiskBadge({ risk = "LOW", probability, className = "" }) {
  const normalizedRisk = (risk || "LOW").toUpperCase();

  // Determine CSS class based on risk level
  const getRiskClass = () => {
    switch (normalizedRisk) {
      case "HIGH":
        return "risk high";
      case "MEDIUM":
        return "risk medium";
      case "LOW":
      default:
        return "risk low";
    }
  };

  return (
    <span className={`${getRiskClass()} ${className}`.trim()}>
      {normalizedRisk}
      {probability !== undefined && probability !== null ? ` • ${probability}%` : ""}
    </span>
  );
}

export default RiskBadge;
