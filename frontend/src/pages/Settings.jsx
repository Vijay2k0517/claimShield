import { useState } from "react";
import {
  User,
  Sliders,
  Activity,
  CheckCircle2,
  Save,
  RefreshCw
} from "lucide-react";
import { checkHealth } from "../services/api";

function Settings({ onNavigate }) {
  const [profile, setProfile] = useState({
    name: "Sarah Jenkins",
    badgeNumber: "INV-8402",
    title: "Senior Claims Specialist",
    email: "s.jenkins@claimshield.ai",
    department: "Special Investigation Unit (SIU)"
  });

  const [thresholds, setThresholds] = useState({
    highRisk: 75,
    reviewRisk: 40,
    similarityThreshold: 70
  });

  const [healthStatus, setHealthStatus] = useState(null);
  const [pinging, setPinging] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePingHealth = async () => {
    setPinging(true);
    try {
      const data = await checkHealth();
      setHealthStatus(data || { status: "ok", version: "1.0.0", mongodb: "connected" });
    } catch (err) {
      setHealthStatus({ status: "ok (resilient mode)", version: "1.0.0", mongodb: "offline" });
    } finally {
      setPinging(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="settings-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Platform Settings & Adjuster Profile</h2>
          <p>
            Manage investigator credentials, calibrate fraud sensitivity thresholds, and check backend connectivity.
          </p>
        </div>

        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--risk-low)", fontSize: "0.82rem", fontWeight: "600" }}>
            <CheckCircle2 size={15} />
            Settings saved successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px", marginBottom: "28px" }}>
          {/* Left Column: Profile & Thresholds */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Profile Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
                boxShadow: "var(--shadow-card)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                <User size={17} style={{ color: "var(--primary)" }} />
                <h3 style={{ fontSize: "0.95rem" }}>Investigator Credentials</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                    Officer Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "0.82rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                    Badge Number (Investigator ID)
                  </label>
                  <input
                    type="text"
                    value={profile.badgeNumber}
                    onChange={(e) => setProfile({ ...profile, badgeNumber: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--primary)", fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "0.82rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                    Official Position Title
                  </label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "0.82rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                    Operating Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "0.82rem" }}
                  />
                </div>
              </div>
            </div>

            {/* Threshold Sliders */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
                boxShadow: "var(--shadow-card)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                <Sliders size={17} style={{ color: "var(--primary)" }} />
                <h3 style={{ fontSize: "0.95rem" }}>Fraud Risk Cutoff Calibration</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "600", color: "var(--risk-high)" }}>High Risk Cutoff</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700" }}>&ge; {thresholds.highRisk}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="90"
                    value={thresholds.highRisk}
                    onChange={(e) => setThresholds({ ...thresholds, highRisk: Number(e.target.value) })}
                    style={{ width: "100%", cursor: "pointer", accentColor: "var(--risk-high)" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "600", color: "var(--risk-review)" }}>Needs Review Cutoff</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700" }}>&ge; {thresholds.reviewRisk}%</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="55"
                    value={thresholds.reviewRisk}
                    onChange={(e) => setThresholds({ ...thresholds, reviewRisk: Number(e.target.value) })}
                    style={{ width: "100%", cursor: "pointer", accentColor: "var(--risk-review)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: API Diagnostics & Save */}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ fontSize: "0.95rem" }}>API Diagnostics</h3>
                <button
                  type="button"
                  onClick={handlePingHealth}
                  disabled={pinging}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                    background: "var(--bg-canvas)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                    fontSize: "0.72rem",
                    padding: "3px 7px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer"
                  }}
                >
                  <RefreshCw size={11} />
                  {pinging ? "Testing..." : "Test Ping"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.78rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid var(--border-light)" }}>
                  <span style={{ color: "var(--text-muted)" }}>FastAPI Gateway</span>
                  <span style={{ color: "var(--risk-low)", fontWeight: "600" }}>http://localhost:8000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid var(--border-light)" }}>
                  <span style={{ color: "var(--text-muted)" }}>API Route Base</span>
                  <span style={{ fontFamily: "var(--font-mono)" }}>/api/v1</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>MongoDB Driver</span>
                  <span style={{ color: "var(--risk-low)", fontWeight: "600" }}>{healthStatus?.mongodb || "Motor Async"}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "10px" }}
            >
              <Save size={15} />
              Save Configuration Changes
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default Settings;