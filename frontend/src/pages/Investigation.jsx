import { useEffect, useState } from "react";
import {
  ShieldAlert,
  Car,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { getClaimById, saveDecision, getMediaUrl, deleteClaim } from "../services/api";
import RiskBadge from "../components/RiskBadge";
import StatusBadge from "../components/StatusBadge";
import InvestigationNav from "../components/InvestigationNav";

function Investigation({ claimId = "CLM001", onNavigate, showToast }) {
  const [claim, setClaim] = useState(null);
  const [activeImage, setActiveImage] = useState("overlay");
  const [loading, setLoading] = useState(true);

  // Quick adjudication state inside workspace
  const [quickDecision, setQuickDecision] = useState("");
  const [quickNotes, setQuickNotes] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadClaim() {
      try {
        setLoading(true);
        const [data, simMatches] = await Promise.all([
          getClaimById(claimId || "CLM001"),
          getSimilarClaims(claimId || "CLM001")
        ]);
        if (isMounted && data) {
          if (simMatches && simMatches.length > 0) {
            data.similar_claims = simMatches;
          }
          setClaim(data);
          if (data.decision) {
            setQuickDecision(data.decision.decision || "");
            setQuickNotes(data.decision.notes || "");
          }
        }
      } catch (err) {
        console.error("Failed to load claim in investigation:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadClaim();
    return () => {
      isMounted = false;
    };
  }, [claimId]);

  if (loading || !claim) {
    return (
      <main className="investigation-page">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px 0" }}>
          <div className="skeleton" style={{ height: "36px", width: "35%" }} />
          <div className="skeleton" style={{ height: "70px", width: "100%" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="skeleton" style={{ height: "350px" }} />
            <div className="skeleton" style={{ height: "350px" }} />
          </div>
        </div>
      </main>
    );
  }

  const evidence = claim.evidence || {};
  const imageMap = {
    original: getMediaUrl(evidence.original_image),
    heatmap: getMediaUrl(evidence.heatmap || evidence.original_image),
    overlay: getMediaUrl(evidence.overlay || evidence.original_image)
  };

  const similarClaims = claim.similar_claims || [];
  const topSimilar = similarClaims[0];

  const handleQuickAdjudication = async (decisionType) => {
    setSubmittingDecision(true);
    try {
      const updated = await saveDecision(claim.claim_id, {
        decision: decisionType,
        notes: quickNotes || `Adjudicated as '${decisionType}' by SIU Investigator.`,
        investigator_id: "INV-8402"
      });
      setClaim(updated);
      setQuickDecision(decisionType);
      if (showToast) {
        showToast(`Adjudication Recorded: ${decisionType}`, "success");
      }
    } catch (err) {
      console.error("Adjudication failed:", err);
      alert("Failed to record decision.");
    } finally {
      setSubmittingDecision(false);
    }
  };

  const handleDeleteCurrentClaim = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete claim ${claim.claim_id}?`)) {
      return;
    }
    try {
      await deleteClaim(claim.claim_id);
      if (showToast) showToast(`Claim ${claim.claim_id} deleted.`, "info");
      if (onNavigate) onNavigate("queue");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete claim.");
    }
  };

  return (
    <main className="investigation-page">
      {/* Top Header & Sub-Navigation */}
      <div style={{ marginBottom: "20px" }}>
        <div className="investigation-header" style={{ marginBottom: "14px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2>Claim Investigation Workspace</h2>
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
              Review automated damage assessments, Grad-CAM attention heatmaps, and duplicate historical claims.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <StatusBadge status={claim.status} />
            <RiskBadge risk={claim.risk_level} probability={claim.fraud_probability} />

            <button
              type="button"
              onClick={handleDeleteCurrentClaim}
              title={`Permanently delete ${claim.claim_id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid #fee2e2",
                background: "#fff1f2",
                color: "#e11d48",
                fontSize: "0.78rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <Trash2 size={13} />
              Delete Case
            </button>
          </div>
        </div>

        {/* Standardized Sub-Navigation */}
        <InvestigationNav
          currentTab="investigation"
          claimId={claim.claim_id}
          similarCount={similarClaims.length}
          onNavigate={onNavigate}
        />
      </div>

      {/* Claim Metadata Strip */}
      <section className="claim-info-card">
        <div>
          <small>Policy Number</small>
          <strong>{claim.policy_id}</strong>
        </div>

        <div>
          <small>Vehicle & Variant</small>
          <strong>
            {claim.vehicle_make} {claim.vehicle_model} ({claim.vehicle_year || 2023})
          </strong>
        </div>

        <div>
          <small>Registration Plate</small>
          <strong>{claim.vehicle_number}</strong>
        </div>

        <div>
          <small>Date of Loss</small>
          <strong>{claim.accident_date}</strong>
        </div>
      </section>

      {/* Main 2-Column Grid */}
      <section className="investigation-grid">
        {/* Left Column: Visual Damage Evidence & Prior Claims Match */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Damage Evidence Card */}
          <div className="evidence-card">
            <div className="card-heading">
              <div>
                <h3 style={{ fontSize: "1rem" }}>Submitted Damage Photographs</h3>
                <p>Inspection photograph with AI Grad-CAM attention overlay</p>
              </div>
              <Car size={18} style={{ color: "var(--text-muted)" }} />
            </div>

            {/* Photo Viewport */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "280px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid var(--border-color)",
                background: "#0f172a"
              }}
            >
              {activeImage === "heatmap" ? (
                <>
                  <img
                    src={imageMap.original}
                    alt="Original Damage Evidence"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <img
                    src={imageMap.heatmap}
                    alt="Grad-CAM Heatmap"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.85
                    }}
                  />
                </>
              ) : (
                <img
                  src={imageMap[activeImage]}
                  alt="Damage Evidence"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  background: "rgba(15, 23, 42, 0.8)",
                  padding: "3px 8px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.72rem",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  zIndex: 2
                }}
              >
                Layer: {activeImage.toUpperCase()}
              </div>
            </div>

            {/* Image Layer Tabs */}
            <div className="image-tabs">
              <button
                className={`image-tab ${activeImage === "original" ? "active" : ""}`}
                onClick={() => setActiveImage("original")}
              >
                Original Photo
              </button>
              <button
                className={`image-tab ${activeImage === "heatmap" ? "active" : ""}`}
                onClick={() => setActiveImage("heatmap")}
              >
                AI Heatmap
              </button>
              <button
                className={`image-tab ${activeImage === "overlay" ? "active" : ""}`}
                onClick={() => setActiveImage("overlay")}
              >
                Overlay
              </button>
            </div>

            {/* Physical Damage Report */}
            <div style={{ marginTop: "14px", padding: "12px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "4px" }}>
                <span>PHYSICAL DAMAGE ASSESSMENT</span>
                <span style={{ color: "var(--primary)", fontFamily: "var(--font-mono)" }}>
                  {evidence.confidence_score || 94.2}% Vision Confidence
                </span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                {evidence.damage_description || "Front bumper compression and radiator core deformation."}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <button
                onClick={() => onNavigate && onNavigate("evidence", claim.claim_id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "transparent",
                  color: "var(--primary)",
                  fontSize: "0.8rem",
                  fontWeight: "600"
                }}
              >
                Open Full Photo Inspector &rarr;
              </button>
            </div>
          </div>

          {/* Prior Claims Match Card */}
          <div className="assessment-card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "0.95rem" }}>Prior Historical Claim Overlap</h3>
            </div>

            {topSimilar ? (
              <div
                style={{
                  background: "var(--bg-canvas)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  padding: "12px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center"
                }}
              >
                <img
                  src={getMediaUrl(topSimilar.image)}
                  alt="Prior Claim"
                  style={{ width: "60px", height: "60px", borderRadius: "var(--radius-sm)", objectFit: "cover", flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--primary)" }}>
                      {topSimilar.claim_id} ({topSimilar.vehicle_make} {topSimilar.vehicle_model})
                    </strong>
                    <span
                      style={{
                        background: "#fff1f2",
                        color: "#e11d48",
                        fontFamily: "var(--font-mono)",
                        fontWeight: "700",
                        fontSize: "0.72rem",
                        padding: "1px 6px",
                        borderRadius: "999px",
                        border: "1px solid #fecdd3"
                      }}
                    >
                      {topSimilar.similarity_score}% Visual Match
                    </span>
                  </div>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "3px" }}>
                    {topSimilar.notes || "Identical bumper deformation vector."}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", padding: "10px", textAlign: "center" }}>
                No duplicate visual matches found in historical repository.
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button
                onClick={() => onNavigate && onNavigate("similar-claims", claim.claim_id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "transparent",
                  color: "var(--primary)",
                  fontSize: "0.78rem",
                  fontWeight: "600"
                }}
              >
                View Side-by-Side Comparison &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Fraud Risk Assessment & Rapid Action Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Risk Score & Risk Factors */}
          <div className="assessment-card">
            <div className="card-heading">
              <div>
                <h3 style={{ fontSize: "1rem" }}>Fraud Risk Assessment</h3>
                <p>Automated score and identified risk anomalies</p>
              </div>
              <ShieldAlert size={18} style={{ color: "var(--risk-high)" }} />
            </div>

            {/* Score Strip */}
            <div className="risk-result">
              <div className="risk-circle">
                {claim.fraud_probability}%
              </div>
              <div>
                <span className="high-risk-label">
                  {claim.risk_level} RISK LEVEL
                </span>
                <h2 style={{ fontSize: "1.2rem", margin: "2px 0 4px" }}>
                  {claim.fraud_probability}% Fraud Probability
                </h2>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  Recommendation: <strong>{claim.recommendation}</strong>
                </span>
              </div>
            </div>

            {/* Identified Risk Factors */}
            <div className="reason-box">
              <h4>
                <AlertTriangle size={15} style={{ color: "var(--risk-review)" }} />
                Identified Risk Factors
              </h4>
              {claim.flag_reasons && claim.flag_reasons.length > 0 ? (
                <ul>
                  {claim.flag_reasons.map((reason, index) => (
                    <li key={index}>
                      {reason}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Damage patterns align with standard collision dynamics.
                </p>
              )}
            </div>

            <div className="model-info">
              <span>Model Architecture</span>
              <strong>{claim.ai_model || "DamageVision-ResNet50 v2.4"}</strong>
            </div>
          </div>

          {/* Rapid Adjudication Panel */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <h3 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>
              Investigator Adjudication
            </h3>

            {claim.decision ? (
              <div
                style={{
                  background: "#f8fafc",
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  marginBottom: "14px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--risk-low)", fontWeight: "700", fontSize: "0.85rem" }}>
                  <CheckCircle2 size={16} />
                  Decided: {claim.decision.decision}
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  "{claim.decision.notes}"
                </p>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "6px" }}>
                  Certified by {claim.decision.investigator_id || "INV-8402"} on {new Date(claim.decision.timestamp).toLocaleDateString()}
                </div>
              </div>
            ) : null}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                <button
                  disabled={submittingDecision}
                  onClick={() => handleQuickAdjudication("Mark Legitimate")}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "var(--radius-md)",
                    background: quickDecision === "Mark Legitimate" ? "#ecfdf5" : "#ffffff",
                    color: quickDecision === "Mark Legitimate" ? "#047857" : "var(--text-primary)",
                    border: `1px solid ${quickDecision === "Mark Legitimate" ? "#a7f3d0" : "var(--border-color)"}`,
                    fontWeight: "600",
                    fontSize: "0.75rem",
                    boxShadow: "var(--shadow-xs)"
                  }}
                >
                  ✓ Approve
                </button>

                <button
                  disabled={submittingDecision}
                  onClick={() => handleQuickAdjudication("Request Additional Evidence")}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "var(--radius-md)",
                    background: quickDecision === "Request Additional Evidence" ? "#fffbeb" : "#ffffff",
                    color: quickDecision === "Request Additional Evidence" ? "#b45309" : "var(--text-primary)",
                    border: `1px solid ${quickDecision === "Request Additional Evidence" ? "#fde68a" : "var(--border-color)"}`,
                    fontWeight: "600",
                    fontSize: "0.75rem",
                    boxShadow: "var(--shadow-xs)"
                  }}
                >
                  ? Request Info
                </button>

                <button
                  disabled={submittingDecision}
                  onClick={() => handleQuickAdjudication("Escalate Investigation")}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "var(--radius-md)",
                    background: quickDecision === "Escalate Investigation" ? "#fff1f2" : "#ffffff",
                    color: quickDecision === "Escalate Investigation" ? "#e11d48" : "var(--text-primary)",
                    border: `1px solid ${quickDecision === "Escalate Investigation" ? "#fecdd3" : "var(--border-color)"}`,
                    fontWeight: "600",
                    fontSize: "0.75rem",
                    boxShadow: "var(--shadow-xs)"
                  }}
                >
                  ⚠ Refer SIU
                </button>
              </div>

              <input
                type="text"
                placeholder="Add adjuster rationale notes..."
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--bg-canvas)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8rem",
                  color: "var(--text-primary)",
                  outline: "none"
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
                <button
                  onClick={() => onNavigate && onNavigate("decision", claim.claim_id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "transparent",
                    color: "var(--primary)",
                    fontSize: "0.78rem",
                    fontWeight: "600"
                  }}
                >
                  Full Adjudication Form &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Investigation;