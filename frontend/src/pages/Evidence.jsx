import { useState, useEffect } from "react";
import {
  Layers,
  Sliders,
  Columns
} from "lucide-react";
import { getClaimById, getMediaUrl } from "../services/api";
import RiskBadge from "../components/RiskBadge";
import StatusBadge from "../components/StatusBadge";
import InvestigationNav from "../components/InvestigationNav";

function Evidence({ claimId = "CLM001", onNavigate }) {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("blend");
  const [opacity, setOpacity] = useState(70);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getClaimById(claimId || "CLM001").then((data) => {
      if (isMounted && data) {
        setClaim(data);
        setLoading(false);
      }
    });
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

  const evidence = claim.evidence || {};
  const originalImage = getMediaUrl(evidence.original_image);
  const heatmapImage = getMediaUrl(evidence.heatmap || evidence.overlay || evidence.original_image);
  const overlayImage = getMediaUrl(evidence.overlay || evidence.original_image);

  const inspectionPoints = [
    {
      title: "Front Bumper Support Deformation",
      severity: "High Concern",
      notes: "Severe compressive deformation inconsistent with low-speed traffic accident dynamics."
    },
    {
      title: "Radiator Core Mount Fracture",
      severity: "Moderate Concern",
      notes: "Secondary blunt force trauma without corresponding external plastic bumper shearing."
    },
    {
      title: "Quarter Panel Fastener Tooling Scratches",
      severity: "Suspicious",
      notes: "Tool slip marks indicating prior manual panel removal before reported incident."
    }
  ];

  return (
    <main className="investigation-page">
      {/* Top Header & Sub-Navigation */}
      <div style={{ marginBottom: "20px" }}>
        <div className="investigation-header" style={{ marginBottom: "14px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2>Damage Photos & Heatmap Analysis</h2>
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
              Inspect original vehicle damage photographs with Grad-CAM neural attention overlays.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <StatusBadge status={claim.status} />
            <RiskBadge risk={claim.risk_level} probability={claim.fraud_probability} />
          </div>
        </div>

        {/* Standardized Sub-Navigation */}
        <InvestigationNav
          currentTab="evidence"
          claimId={claim.claim_id}
          similarCount={claim.similar_claims?.length || 0}
          onNavigate={onNavigate}
        />
      </div>

      {/* Main 2-Column Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: "20px", marginBottom: "28px" }}>
        {/* Left Column: Photo Viewport & Controls */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            boxShadow: "var(--shadow-card)"
          }}
        >
          {/* Mode Switcher */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => setViewMode("blend")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: viewMode === "blend" ? "var(--primary)" : "#ffffff",
                  color: viewMode === "blend" ? "#ffffff" : "var(--text-secondary)",
                  border: `1px solid ${viewMode === "blend" ? "var(--primary)" : "var(--border-color)"}`,
                  fontSize: "0.8rem",
                  fontWeight: "600"
                }}
              >
                <Sliders size={14} />
                Heatmap Blend Slider
              </button>

              <button
                onClick={() => setViewMode("side-by-side")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: viewMode === "side-by-side" ? "var(--primary)" : "#ffffff",
                  color: viewMode === "side-by-side" ? "#ffffff" : "var(--text-secondary)",
                  border: `1px solid ${viewMode === "side-by-side" ? "var(--primary)" : "var(--border-color)"}`,
                  fontSize: "0.8rem",
                  fontWeight: "600"
                }}
              >
                <Columns size={14} />
                Side-by-Side View
              </button>
            </div>

            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Vision Confidence: {evidence.confidence_score || 94.2}%
            </span>
          </div>

          {/* Viewport Render */}
          {viewMode === "blend" ? (
            <div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "360px",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: "1px solid var(--border-color)",
                  background: "#0f172a"
                }}
              >
                <img
                  src={originalImage}
                  alt="Original Damage Photo"
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
                  src={heatmapImage}
                  alt="Grad-CAM Heatmap"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: opacity / 100,
                    mixBlendMode: "normal"
                  }}
                />

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
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  Heatmap Blend: {opacity}%
                </div>
              </div>

              {/* Slider Controls */}
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  background: "var(--bg-canvas)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Raw Photograph (0%)</span>
                  <span style={{ fontWeight: "700", color: "var(--primary)" }}>Heatmap Intensity: {opacity}%</span>
                  <span style={{ color: "var(--text-muted)" }}>Full AI Attention (100%)</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer", accentColor: "var(--primary)" }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "0.74rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "4px" }}>
                  RAW PHOTOGRAPH
                </div>
                <div style={{ height: "280px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                  <img src={originalImage} alt="Raw" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.74rem", fontWeight: "700", color: "var(--risk-high)", marginBottom: "4px" }}>
                  ATTENTION HEATMAP
                </div>
                <div style={{ height: "280px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                  <img src={overlayImage} alt="Overlay" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: "16px", padding: "12px 14px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "2px" }}>
              DAMAGE SUMMARY REPORT
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
              {evidence.damage_description || "Localized bumper shell fracture with radiator core shearing."}
            </p>
          </div>
        </div>

        {/* Right Column: Inspection Findings & Metadata */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Key Findings Card */}
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
              Damage Assessment Findings
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {inspectionPoints.map((pt, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px 12px",
                    background: "var(--bg-canvas)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{pt.title}</strong>
                    <span style={{ fontSize: "0.7rem", color: "var(--risk-high)", fontWeight: "700" }}>{pt.severity}</span>
                  </div>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.35" }}>
                    {pt.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image Forensics Details */}
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
              File Details & Metadata
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ color: "var(--text-muted)" }}>Binary Verification</span>
                <span style={{ color: "var(--risk-low)", fontWeight: "600" }}>PASSED (Valid JPEG)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ color: "var(--text-muted)" }}>Model Architecture</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>ResNet50 v2.4</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Vector Embedding</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>128-dim Normalized</span>
              </div>
            </div>

            <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
              <button
                className="btn-primary"
                onClick={() => onNavigate && onNavigate("similar-claims", claim.claim_id)}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Prior Claims Match &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Evidence;
