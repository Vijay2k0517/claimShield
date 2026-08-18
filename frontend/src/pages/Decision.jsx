import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Send,
  Shield
} from "lucide-react";
import { getClaimById, saveDecision } from "../services/api";
import RiskBadge from "../components/RiskBadge";
import StatusBadge from "../components/StatusBadge";
import InvestigationNav from "../components/InvestigationNav";

function Decision({ claimId = "CLM001", onNavigate, showToast }) {
  const [claim, setClaim] = useState(null);
  const [decision, setDecision] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const noteTemplates = [
    "Damage geometry and impact vector align with police collision report.",
    "Photograph timestamp and geolocation contradict reported accident timeline.",
    "Bumper bracket damage exhibits identical tooling marks to prior settled claim.",
    "Supplemental itemized teardown estimate requested from certified repair facility."
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadData() {
      try {
        const data = await getClaimById(claimId || "CLM001");
        if (isMounted && data) {
          setClaim(data);
          if (data.decision) {
            setDecision(data.decision.decision || "");
            setNotes(data.decision.notes || "");
          }
        }
      } catch (err) {
        console.error("Failed to load claim for decision:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [claimId]);

  if (loading || !claim) {
    return (
      <main className="investigation-page">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px 0" }}>
          <div className="skeleton" style={{ height: "36px", width: "35%" }} />
          <div className="skeleton" style={{ height: "400px", width: "100%" }} />
        </div>
      </main>
    );
  }

  const handleSaveDecision = async () => {
    if (!decision) {
      alert("Please select an investigator adjudication decision.");
      return;
    }

    setSaving(true);
    try {
      const updated = await saveDecision(claim.claim_id, {
        decision,
        notes: notes || `Adjudicated as '${decision}' by SIU Investigator.`,
        investigator_id: "INV-8402"
      });

      setClaim(updated);
      if (showToast) {
        showToast(`Adjudication successfully recorded: ${decision}`, "success");
      }
    } catch (error) {
      console.error("Failed to save decision:", error);
      alert("Unable to save decision. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="investigation-page">
      {/* Top Header & Sub-Navigation */}
      <div style={{ marginBottom: "20px" }}>
        <div className="investigation-header" style={{ marginBottom: "14px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2>Adjudication Decision & Audit Log</h2>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  color: "var(--primary)",
                  background: "var(--primary-light)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--primary-border)"
                }}
              >
                {claim.claim_id}
              </span>
            </div>
            <p>
              Record final adjuster determination, attach investigation rationale, and update compliance audit records.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <StatusBadge status={claim.status} />
            <RiskBadge risk={claim.risk_level} probability={claim.fraud_probability} />
          </div>
        </div>

        {/* Standardized Sub-Navigation */}
        <InvestigationNav
          currentTab="decision"
          claimId={claim.claim_id}
          similarCount={claim.similar_claims?.length || 0}
          onNavigate={onNavigate}
        />
      </div>

      {/* Human-in-the-Loop Governance Notice */}
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "var(--radius-md)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px"
        }}
      >
        <Shield size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.35" }}>
          <strong style={{ color: "var(--text-primary)" }}>Investigator Decision Authority:</strong> ClaimShield AI assessments serve as decision-support telemetry. Final settlement, denial, or SIU referral is certified by the licensed claims officer.
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: "20px", marginBottom: "28px" }}>
        {/* Left Column: Decision Selection & Notes */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            boxShadow: "var(--shadow-card)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "1rem" }}>Select Adjudication Action</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Investigator: <strong>Sarah Jenkins (INV-8402)</strong>
            </span>
          </div>

          {/* 3 Decision Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "18px" }}>
            {/* 1. Mark Legitimate */}
            <div
              onClick={() => setDecision("Mark Legitimate")}
              style={{
                padding: "14px 10px",
                borderRadius: "var(--radius-md)",
                background: decision === "Mark Legitimate" ? "#ecfdf5" : "var(--bg-canvas)",
                border: `2px solid ${decision === "Mark Legitimate" ? "var(--risk-low)" : "var(--border-color)"}`,
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--risk-low)", margin: "0 auto 8px", boxShadow: "var(--shadow-xs)" }}>
                <CheckCircle2 size={18} />
              </div>
              <strong style={{ fontSize: "0.82rem", color: "var(--text-primary)", display: "block", marginBottom: "2px" }}>
                Approve Claim
              </strong>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: "1.2" }}>
                Clear for payout. Document false positive context.
              </p>
            </div>

            {/* 2. Request Evidence */}
            <div
              onClick={() => setDecision("Request Additional Evidence")}
              style={{
                padding: "14px 10px",
                borderRadius: "var(--radius-md)",
                background: decision === "Request Additional Evidence" ? "#fffbeb" : "var(--bg-canvas)",
                border: `2px solid ${decision === "Request Additional Evidence" ? "var(--risk-review)" : "var(--border-color)"}`,
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--risk-review)", margin: "0 auto 8px", boxShadow: "var(--shadow-xs)" }}>
                <AlertTriangle size={18} />
              </div>
              <strong style={{ fontSize: "0.82rem", color: "var(--text-primary)", display: "block", marginBottom: "2px" }}>
                Request Info
              </strong>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: "1.2" }}>
                Hold for dashcam, shop teardown, or metadata.
              </p>
            </div>

            {/* 3. Escalate SIU */}
            <div
              onClick={() => setDecision("Escalate Investigation")}
              style={{
                padding: "14px 10px",
                borderRadius: "var(--radius-md)",
                background: decision === "Escalate Investigation" ? "#fff1f2" : "var(--bg-canvas)",
                border: `2px solid ${decision === "Escalate Investigation" ? "var(--risk-high)" : "var(--border-color)"}`,
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--risk-high)", margin: "0 auto 8px", boxShadow: "var(--shadow-xs)" }}>
                <ShieldAlert size={18} />
              </div>
              <strong style={{ fontSize: "0.82rem", color: "var(--text-primary)", display: "block", marginBottom: "2px" }}>
                Refer to SIU
              </strong>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: "1.2" }}>
                Transfer to Special Investigation Unit for field audit.
              </p>
            </div>
          </div>

          {/* Quick Rationale Chips */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-primary)" }}>
                Quick Rationale Templates
              </label>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Click to insert into notes
              </span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {noteTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNotes(template)}
                  style={{
                    background: "var(--bg-canvas)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                    fontSize: "0.72rem",
                    padding: "4px 8px",
                    borderRadius: "var(--radius-sm)",
                    textAlign: "left"
                  }}
                >
                  &ldquo;{template.substring(0, 42)}...&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Notes Textarea */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>
              Investigator Rationale & Audit Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter detailed reasons, evidence verification steps, and next actions..."
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--bg-canvas)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.82rem",
                color: "var(--text-primary)",
                outline: "none"
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              className="btn-secondary"
              onClick={() => onNavigate && onNavigate("claims")}
            >
              &larr; Claims Directory
            </button>

            <button
              className="btn-primary"
              disabled={saving || !decision}
              onClick={handleSaveDecision}
            >
              <Send size={14} />
              {saving ? "Saving..." : "Save Adjudication & Update Status"}
            </button>
          </div>
        </div>

        {/* Right Column: Compliance Audit Trail */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            boxShadow: "var(--shadow-card)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} style={{ color: "var(--primary)" }} />
              <h3 style={{ fontSize: "0.95rem" }}>Compliance Audit Trail</h3>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--risk-low)", fontWeight: "600" }}>
              VERIFIED
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#eff6ff", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: "700", flexShrink: 0 }}>
                1
              </div>
              <div>
                <strong style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>Claim Ingestion & Validation</strong>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "1px" }}>
                  Image binary verification passed • {claim.submission_date}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff1f2", color: "var(--risk-high)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: "700", flexShrink: 0 }}>
                2
              </div>
              <div>
                <strong style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>AI Vision & Heatmap Scoring</strong>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "1px" }}>
                  Fraud Risk: {claim.fraud_probability}% ({claim.risk_level}) • ResNet50
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#f0fdf4", color: "var(--risk-low)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: "700", flexShrink: 0 }}>
                3
              </div>
              <div>
                <strong style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>Historical Duplicate Cross-Check</strong>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "1px" }}>
                  128-dim vector embeddings checked against claim database
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: claim.decision ? "#ecfdf5" : "#f1f5f9", color: claim.decision ? "var(--risk-low)" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: "700", flexShrink: 0 }}>
                4
              </div>
              <div>
                <strong style={{ fontSize: "0.8rem", color: claim.decision ? "var(--risk-low)" : "var(--text-muted)" }}>
                  {claim.decision ? `Adjudicated: ${claim.decision.decision}` : "Pending Investigator Adjudication"}
                </strong>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "1px" }}>
                  {claim.decision ? `Signed by ${claim.decision.investigator_id || "INV-8402"} on ${new Date(claim.decision.timestamp).toLocaleDateString()}` : "Awaiting review"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Decision;