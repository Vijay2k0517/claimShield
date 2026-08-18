import { ShieldAlert, AlertTriangle, ShieldCheck } from "lucide-react";

/**
 * RiskBadge Component
 * Displays the risk level (HIGH, REVIEW/MEDIUM, LOW) with glow borders, icons,
 * and tabular monospace fraud probability percentages.
 */
function RiskBadge({ risk = "LOW", probability, showIcon = true, className = "" }) {
  const normalizedRisk = (risk || "LOW").toUpperCase();

  const getRiskDetails = () => {
    switch (normalizedRisk) {
      case "HIGH":
        return {
          cssClass: "risk high",
          icon: <ShieldAlert size={13} />
        };
      case "REVIEW":
      case "MEDIUM":
        return {
          cssClass: "risk review",
          icon: <AlertTriangle size={13} />
        };
      case "LOW":
      default:
        return {
          cssClass: "risk low",
          icon: <ShieldCheck size={13} />
        };
    }
  };

  const { cssClass, icon } = getRiskDetails();

  return (
    <span className={`${cssClass} ${className}`.trim()}>
      {showIcon && icon}
      <span>{normalizedRisk === "MEDIUM" ? "REVIEW" : normalizedRisk}</span>
      {probability !== undefined && probability !== null && (
        <span style={{ opacity: 0.9, marginLeft: "2px" }}>
          {probability}%
        </span>
      )}
    </span>
  );
}

export default RiskBadge;
