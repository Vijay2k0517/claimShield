import { useEffect, useState } from "react";
import {
  Brain,
  Layers,
  GitCompare,
  Clock,
  Cpu,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { getModelInfo } from "../services/api";

function Models({ onNavigate }) {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadInfo() {
      try {
        setLoading(true);
        const data = await getModelInfo();
        if (isMounted) {
          setModelInfo(data);
        }
      } catch (err) {
        console.error("Failed to load model info:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInfo();
    return () => {
      isMounted = false;
    };
  }, []);

  const info = modelInfo || {
    name: "DamageVision-ResNet50",
    version: "2.4.0",
    architecture: "ResNet50 + Grad-CAM Explainer",
    input_resolution: "224x224x3 RGB",
    embedding_dimension: 128,
    status: "Operational"
  };

  return (
    <main className="models-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Computer Vision Models & Diagnostics</h2>
          <p>
            Convolutional feature maps, Grad-CAM attention layer, and historical vector similarity engine.
          </p>
        </div>

        <div className="system-status-pill">
          <div className="pulse-dot" />
          <span>DamageVision v2.4 Active</span>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Brain size={20} />
          </div>
          <div>
            <p>Model Backbone</p>
            <h3 style={{ fontSize: "1.2rem" }}>ResNet50</h3>
            <span>50-layer deep CNN</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Layers size={20} />
          </div>
          <div>
            <p>Attention Layer</p>
            <h3 style={{ fontSize: "1.2rem" }}>Grad-CAM</h3>
            <span>Gradient activation map</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <GitCompare size={20} />
          </div>
          <div>
            <p>Embedding Space</p>
            <h3 style={{ fontSize: "1.2rem" }}>128-dim</h3>
            <span>Normalized Cosine L2</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green" style={{ background: "#ecfdf5", color: "var(--risk-low)", border: "1px solid #a7f3d0" }}>
            <Clock size={20} />
          </div>
          <div>
            <p>Inference Latency</p>
            <h3 style={{ fontSize: "1.2rem" }}>~142ms</h3>
            <span>Mean batch execution</span>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px", marginBottom: "28px" }}>
        {/* Pipeline Stages */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            boxShadow: "var(--shadow-card)"
          }}
        >
          <h3 style={{ fontSize: "0.95rem", marginBottom: "16px" }}>
            Automated Damage Processing Pipeline
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "14px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <strong style={{ fontSize: "0.84rem", color: "var(--primary)", display: "block", marginBottom: "2px" }}>
                1. Binary Validation & Tensor Normalization (Pillow)
              </strong>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.35" }}>
                Strips corrupted headers, validates MIME compliance, and normalizes input to 224&times;224&times;3 RGB tensor dimensions.
              </p>
            </div>

            <div style={{ padding: "14px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <strong style={{ fontSize: "0.84rem", color: "var(--primary)", display: "block", marginBottom: "2px" }}>
                2. Feature Extraction & Grad-CAM Heatmap Generation
              </strong>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.35" }}>
                Computes convolutional feature activations on the final residual block to localize physical vehicle impact damage.
              </p>
            </div>

            <div style={{ padding: "14px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <strong style={{ fontSize: "0.84rem", color: "var(--primary)", display: "block", marginBottom: "2px" }}>
                3. Vector Cosine Historical Duplicate Search
              </strong>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.35" }}>
                Projects damage characteristics into 128-dimensional embedding space to detect matching damage profiles across historical claims.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Thresholds */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <h3 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>Risk Cutoff Calibration</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ color: "var(--text-muted)" }}>High Risk Cutoff</span>
                <strong style={{ color: "var(--risk-high)", fontFamily: "var(--font-mono)" }}>&ge; 75.0%</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ color: "var(--text-muted)" }}>Needs Review Cutoff</span>
                <strong style={{ color: "var(--risk-review)", fontFamily: "var(--font-mono)" }}>40.0% &ndash; 74.9%</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ color: "var(--text-muted)" }}>Low Risk Fast-Track</span>
                <strong style={{ color: "var(--risk-low)", fontFamily: "var(--font-mono)" }}>&lt; 40.0%</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Duplicate Cosine Match</span>
                <strong style={{ color: "var(--primary)", fontFamily: "var(--font-mono)" }}>&ge; 70.0%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Models;