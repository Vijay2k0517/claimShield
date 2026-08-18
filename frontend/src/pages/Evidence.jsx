import { useState, useEffect } from "react";
import { Layers, ShieldCheck, ArrowRight, ArrowLeft, ZoomIn } from "lucide-react";
import { getClaimById } from "../services/api";
import LoadingState from "../components/LoadingState";
import RiskBadge from "../components/RiskBadge";

/**
 * Evidence Page Component
 * Deep-dive inspection view for vehicle damage evidence, heatmaps, and overlays.
 */
function Evidence({ claimId = "CLM001", onNavigate }) {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState("original"); // "original" | "heatmap" | "overlay"

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getClaimById(claimId).then((data) => {
      if (isMounted) {
        setClaim(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [claimId]);

  if (loading) {
    return (
      <main className="investigation-page">
        <LoadingState message={`Loading evidence for claim ${claimId}...`} />
      </main>
    );
  }

  const currentClaim = claim || {
    claim_id: claimId,
    vehicle_number: "TN01 AB 1234",
    vehicle_make: "Hyundai",
    vehicle_model: "Creta",
    risk_level: "HIGH",
    fraud_probability: 87,
    evidence: {
      original_image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      heatmap: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      overlay: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      damage_description: "Front bumper compression and headlight assembly deformation.",
      confidence_score: 94.2
    }
  };

  const getCurrentImage = () => {
    if (activeLayer === "heatmap") return currentClaim.evidence?.heatmap || currentClaim.evidence?.original_image;
    if (activeLayer === "overlay") return currentClaim.evidence?.overlay || currentClaim.evidence?.original_image;
    return currentClaim.evidence?.original_image;
  };

  return (
    <main className="investigation-page">
      {/* Navigation Sub-header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
        <button
          onClick={() => onNavigate && onNavigate("investigation", claimId)}
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
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          Back to Investigation Workspace
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="view-btn"
            onClick={() => onNavigate && onNavigate("similar-claims", claimId)}
          >
            Similar Claims <ArrowRight size={14} />
          </button>
          <button
            className="new-claim-btn"
            style={{ padding: "7px 14px", fontSize: "12px" }}
            onClick={() => onNavigate && onNavigate("decision", claimId)}
          >
            Investigator Decision <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="investigation-header">
        <div>
          <h2>Evidence Analysis • {currentClaim.claim_id}</h2>
          <p>Multi-layer visual forensic evidence and convolutional neural network heatmaps.</p>
        </div>

        <RiskBadge risk={currentClaim.risk_level} probability={currentClaim.fraud_probability} />
      </div>

      {/* Claim Info Header */}
      <section className="claim-info-card">
        <div>
          <small>Vehicle</small>
          <strong>{currentClaim.vehicle_number}</strong>
        </div>
        <div>
          <small>Model</small>
          <strong>{currentClaim.vehicle_make} {currentClaim.vehicle_model}</strong>
        </div>
        <div>
          <small>AI Confidence</small>
          <strong>{currentClaim.evidence?.confidence_score || 94.2}%</strong>
        </div>
        <div>
          <small>Status</small>
          <strong style={{ color: "#2563eb" }}>{currentClaim.status || "Under Review"}</strong>
        </div>
      </section>

      {/* Evidence Viewer Grid */}
      <section className="investigation-grid">
        {/* Layer Viewer */}
        <div className="evidence-card">
          <div className="card-heading">
            <div>
              <h3>Forensic Image Layers</h3>
              <p>Toggle between raw photograph, AI activation map, and damage bounding overlay</p>
            </div>
            <Layers size={20} />
          </div>

          <div
            style={{
              position: "relative",
              height: "360px",
              borderRadius: "8px",
              overflow: "hidden",
              background: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img
              src={getCurrentImage()}
              alt="Vehicle evidence layer"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: activeLayer === "heatmap" ? "contrast(140%) hue-rotate(180deg)" : "none"
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "12px",
                background: "rgba(0, 0, 0, 0.75)",
                color: "white",
                padding: "4px 10px",
                borderRadius: "4px",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <ZoomIn size={12} />
              <span>Layer: {activeLayer.toUpperCase()}</span>
            </div>
          </div>

          <div className="image-tabs" style={{ marginTop: "14px" }}>
            <button
              className={`image-tab ${activeLayer === "original" ? "active" : ""}`}
              onClick={() => setActiveLayer("original")}
            >
              Original Photo
            </button>
            <button
              className={`image-tab ${activeLayer === "heatmap" ? "active" : ""}`}
              onClick={() => setActiveLayer("heatmap")}
            >
              AI Activation Heatmap
            </button>
            <button
              className={`image-tab ${activeLayer === "overlay" ? "active" : ""}`}
              onClick={() => setActiveLayer("overlay")}
            >
              Damage Overlay Mask
            </button>
          </div>
        </div>

        {/* Forensic Metadata */}
        <div className="assessment-card">
          <div className="card-heading">
            <div>
              <h3>Damage Breakdown</h3>
              <p>Visual anomaly detection summary</p>
            </div>
            <ShieldCheck size={20} />
          </div>

          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "#1e293b" }}>
              Detected Damage Vector
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
              {currentClaim.evidence?.damage_description || "Front bumper compression, radiator support deformation, fractured headlamp assembly."}
            </p>
          </div>

          <div className="reason-box" style={{ marginTop: "16px" }}>
            <h4>Forensic Observations</h4>
            <ul>
              {currentClaim.flag_reasons?.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              )) || <li>No abnormalities detected in visual checks.</li>}
            </ul>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              className="new-claim-btn"
              style={{ width: "100%", textAlign: "center" }}
              onClick={() => onNavigate && onNavigate("decision", claimId)}
            >
              Proceed to Decision
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Evidence;
