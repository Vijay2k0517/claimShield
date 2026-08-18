import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

import { getClaimById, saveDecision } from "../services/api";
import LoadingState from "../components/LoadingState";

function Decision({ claimId, onNavigate }) {
  const [claim, setClaim] = useState(null);
  const [decision, setDecision] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadClaim = async () => {
      const data = await getClaimById(claimId);
      setClaim(data);

      if (data?.decision) {
        setDecision(data.decision);
      }

      if (data?.notes) {
        setNotes(data.notes);
      }
    };

    if (claimId) {
      loadClaim();
    }
  }, [claimId]);

  if (!claim) {
    return (
      <main className="investigation-page">
        <LoadingState message="Loading decision workspace..." />
      </main>
    );
  }

  const handleSaveDecision = async () => {
    if (!decision) {
      alert("Please select an investigator decision.");
      return;
    }

    setSaving(true);

    try {
      await saveDecision(claim.claim_id, {
        decision,
        notes,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save decision:", error);
      alert("Unable to save decision.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="investigation-page">

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() =>
            onNavigate && onNavigate("investigation", claim.claim_id)
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "#2563eb",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={16} />
          Back to Investigation
        </button>
      </div>

      {/* Page Header */}
      <div className="investigation-header">
        <div>
          <h2>Investigator Decision</h2>
          <p>
            Review the AI assessment and record the final claim decision.
          </p>
        </div>

        <span className="investigation-status">
          {claim.status || "Under Review"}
        </span>
      </div>

      {/* Claim Summary */}
      <section className="claim-info-card">

        <div>
          <small>Claim ID</small>
          <strong>{claim.claim_id}</strong>
        </div>

        <div>
          <small>Vehicle</small>
          <strong>{claim.vehicle_number}</strong>
        </div>

        <div>
          <small>Risk Level</small>
          <strong>{claim.risk_level}</strong>
        </div>

        <div>
          <small>Fraud Probability</small>
          <strong>{claim.fraud_probability}%</strong>
        </div>

      </section>

      {/* AI Recommendation */}
      <section className="assessment-card" style={{ marginTop: "20px" }}>

        <div className="card-heading">
          <div>
            <h3>AI Recommendation</h3>
            <p>Model-generated assessment for this claim.</p>
          </div>

          <ShieldAlert size={20} />
        </div>

        <div className="risk-result">

          <div className="risk-circle">
            {claim.fraud_probability}%
          </div>

          <div>
            <span className="high-risk-label">
              {claim.risk_level} RISK
            </span>

            <h2>
              {claim.fraud_probability}% Fraud Probability
            </h2>

            <p>
              {claim.recommendation}
            </p>
          </div>

        </div>

        {claim.flag_reasons?.length > 0 && (
          <div className="reason-box">

            <h4>
              <AlertTriangle size={17} />
              Key Investigation Findings
            </h4>

            <ul>
              {claim.flag_reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>

          </div>
        )}

      </section>

      {/* Decision Section */}
      <section
        className="claim-form-card"
        style={{ marginTop: "20px" }}
      >

        <div className="form-section-title">

          <ShieldAlert size={20} />

          <div>
            <h3>Final Investigator Decision</h3>
            <p>
              Select the appropriate action based on the investigation.
            </p>
          </div>

        </div>

        {/* Decision Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
            marginTop: "20px",
          }}
        >

          {/* Approve */}
          <button
            type="button"
            onClick={() => setDecision("Approved")}
            style={{
              padding: "20px",
              borderRadius: "10px",
              border:
                decision === "Approved"
                  ? "2px solid #16a34a"
                  : "1px solid #e2e8f0",
              background:
                decision === "Approved"
                  ? "#f0fdf4"
                  : "#ffffff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <CheckCircle
              size={25}
              style={{ color: "#16a34a" }}
            />

            <h4 style={{ margin: "10px 0 5px" }}>
              Approve Claim
            </h4>

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              Claim appears legitimate and can proceed.
            </p>
          </button>

          {/* Reject */}
          <button
            type="button"
            onClick={() => setDecision("Rejected")}
            style={{
              padding: "20px",
              borderRadius: "10px",
              border:
                decision === "Rejected"
                  ? "2px solid #dc2626"
                  : "1px solid #e2e8f0",
              background:
                decision === "Rejected"
                  ? "#fef2f2"
                  : "#ffffff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <XCircle
              size={25}
              style={{ color: "#dc2626" }}
            />

            <h4 style={{ margin: "10px 0 5px" }}>
              Reject Claim
            </h4>

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              Evidence indicates the claim is potentially fraudulent.
            </p>
          </button>

          {/* Escalate */}
          <button
            type="button"
            onClick={() => setDecision("Escalated")}
            style={{
              padding: "20px",
              borderRadius: "10px",
              border:
                decision === "Escalated"
                  ? "2px solid #d97706"
                  : "1px solid #e2e8f0",
              background:
                decision === "Escalated"
                  ? "#fffbeb"
                  : "#ffffff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <AlertTriangle
              size={25}
              style={{ color: "#d97706" }}
            />

            <h4 style={{ margin: "10px 0 5px" }}>
              Escalate Claim
            </h4>

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              Send the claim for further investigation.
            </p>
          </button>

        </div>

        {/* Notes */}
        <div
          className="form-group"
          style={{ marginTop: "25px" }}
        >

          <label>Investigator Notes</label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your investigation notes..."
            rows="5"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              resize: "vertical",
              fontFamily: "inherit",
              fontSize: "13px",
            }}
          />

        </div>

        {/* Save */}
        <div
          className="form-actions"
          style={{ marginTop: "20px" }}
        >

          <button
            className="cancel-btn"
            type="button"
            onClick={() =>
              onNavigate &&
              onNavigate("investigation", claim.claim_id)
            }
          >
            Cancel
          </button>

          <button
            className="analyze-btn"
            type="button"
            onClick={handleSaveDecision}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Decision"}
          </button>

        </div>

        {/* Success */}
        {saved && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "8px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle size={17} />
            Decision saved successfully.
          </div>
        )}

      </section>

    </main>
  );
}

export default Decision;