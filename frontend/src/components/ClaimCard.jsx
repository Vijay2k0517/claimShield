import { Eye, Car, Calendar, ShieldAlert } from "lucide-react";
import RiskBadge from "./RiskBadge";
import StatusBadge from "./StatusBadge";

/**
 * ClaimCard Component
 * Displays a modular summary card for an individual claim.
 */
function ClaimCard({ claim, onView, className = "" }) {
  if (!claim) return null;

  return (
    <div
      className={`stat-card ${className}`}
      style={{
        flexDirection: "column",
        alignItems: "stretch",
        gap: "12px",
        cursor: onView ? "pointer" : "default"
      }}
      onClick={() => onView && onView(claim.claim_id)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold" }}>
            {claim.policy_id || "POLICY"}
          </span>
          <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "#111827" }}>
            {claim.claim_id}
          </h3>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4b5563", fontSize: "13px" }}>
        <Car size={16} color="#2563eb" />
        <span>
          <strong>{claim.vehicle_number}</strong> ({claim.vehicle_make} {claim.vehicle_model})
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldAlert size={16} color={claim.risk_level === "HIGH" ? "#dc2626" : "#d97706"} />
          <RiskBadge risk={claim.risk_level} probability={claim.fraud_probability} />
        </div>

        {claim.accident_date && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6b7280" }}>
            <Calendar size={13} />
            <span>{claim.accident_date}</span>
          </div>
        )}
      </div>

      {onView && (
        <button
          className="view-btn"
          style={{ width: "100%", justifyContent: "center", marginTop: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            onView(claim.claim_id);
          }}
        >
          <Eye size={15} />
          Investigate Claim
        </button>
      )}
    </div>
  );
}

export default ClaimCard;
