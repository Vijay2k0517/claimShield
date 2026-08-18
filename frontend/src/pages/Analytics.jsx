import { useEffect, useState } from "react";
import {
  BarChart3,
  ShieldAlert,
  Clock,
  UserCheck,
  ShieldCheck
} from "lucide-react";
import { getDashboardSummary, getClaims } from "../services/api";

function Analytics({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [sumData, claimsData] = await Promise.all([
          getDashboardSummary(),
          getClaims()
        ]);
        if (isMounted) {
          setSummary(sumData);
          setClaims(claimsData || []);
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const kpis = summary?.kpis || {
    total_claims: claims.length || 5,
    high_risk_claims: 2,
    pending_reviews: 2,
    escalated_claims: 1,
    avg_fraud_probability: 72.4
  };

  const trendDays = [
    { day: "Mon", total: 18, highRisk: 3 },
    { day: "Tue", total: 24, highRisk: 4 },
    { day: "Wed", total: 20, highRisk: 2 },
    { day: "Thu", total: 28, highRisk: 6 },
    { day: "Fri", total: 32, highRisk: 5 },
    { day: "Sat", total: 14, highRisk: 1 },
    { day: "Sun", total: 10, highRisk: 2 }
  ];

  const anomalyReasons = [
    { reason: "Mismatched Impact Vector & Direction", count: 14, pct: 78 },
    { reason: "Pre-existing Rust / Mechanical Disassembly", count: 11, pct: 61 },
    { reason: "Tooling Slip Marks on Bracket Fasteners", count: 9, pct: 50 },
    { reason: "Inflated Repair & Teardown Estimate", count: 7, pct: 39 },
    { reason: "Identical Historical Deformation Profile", count: 5, pct: 28 }
  ];

  return (
    <main className="analytics-page">
      {/* Header */}
      <section className="dashboard-header">
        <div>
          <h2>Fraud Trends & Risk Analytics</h2>
          <p>
            Portfolio-wide fraud metrics, anomaly frequency distributions, and Human-in-the-Loop alignment analytics.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => onNavigate && onNavigate("claims")}
        >
          Claims Directory &rarr;
        </button>
      </section>

      {/* KPI Metric Strip */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <BarChart3 size={20} />
          </div>
          <div>
            <p>Total Claims Processed</p>
            <h3>{kpis.total_claims}</h3>
            <span>Live database count</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p>High Risk Rate</p>
            <h3>{Math.round((kpis.high_risk_claims / (kpis.total_claims || 1)) * 100)}%</h3>
            <span style={{ color: "var(--risk-high)", fontWeight: "600" }}>
              {kpis.high_risk_claims} priority cases
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={20} />
          </div>
          <div>
            <p>Under Triage Review</p>
            <h3>{kpis.pending_reviews}</h3>
            <span>Awaiting decision</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <UserCheck size={20} />
          </div>
          <div>
            <p>Adjuster Alignment</p>
            <h3>94.8%</h3>
            <span style={{ color: "var(--status-escalated)", fontWeight: "600" }}>
              AI vs Adjuster agreement
            </span>
          </div>
        </div>
      </section>

      {/* 2-Column Analytics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px", marginBottom: "28px" }}>
        {/* Left Column: 7-Day Trends + Top Reasons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Trends */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "0.95rem" }}>7-Day Claim Volume & High Risk Flags</h3>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "1px" }}>
                  Daily submission count vs AI-flagged suspicious claims
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", background: "var(--primary)", borderRadius: "2px" }} />
                  Total Volume
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", background: "var(--risk-high)", borderRadius: "2px" }} />
                  High Risk Flagged
                </span>
              </div>
            </div>

            {/* Visual Bars */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "160px", padding: "10px 10px 0", borderBottom: "1px solid var(--border-color)" }}>
              {trendDays.map((item) => (
                <div key={item.day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "120px" }}>
                    <div
                      style={{
                        width: "16px",
                        height: `${(item.total / 35) * 100}%`,
                        background: "rgba(37,99,235,0.7)",
                        borderRadius: "2px 2px 0 0"
                      }}
                    />
                    <div
                      style={{
                        width: "16px",
                        height: `${(item.highRisk / 35) * 100}%`,
                        background: "var(--risk-high)",
                        borderRadius: "2px 2px 0 0"
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Reasons */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <h3 style={{ fontSize: "0.95rem", marginBottom: "14px" }}>Top Anomaly Reason Frequency</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {anomalyReasons.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "4px" }}>
                    <span style={{ color: "var(--text-primary)" }}>{item.reason}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary)", fontWeight: "600" }}>
                      {item.count} claims ({item.pct}%)
                    </span>
                  </div>
                  <div style={{ background: "#f1f5f9", height: "7px", borderRadius: "999px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${item.pct}%`,
                        height: "100%",
                        background:
                          idx === 0
                            ? "var(--risk-high)"
                            : idx === 1
                            ? "var(--risk-review)"
                            : "var(--primary)",
                        borderRadius: "999px"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calibration */}
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
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <ShieldCheck size={18} style={{ color: "var(--risk-low)" }} />
              <h3 style={{ fontSize: "0.95rem" }}>Human-in-the-Loop Metrics</h3>
            </div>

            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.4", marginBottom: "14px" }}>
              Calibration metrics between automated AI scoring and final licensed adjuster determinations.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ padding: "10px 12px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>SIU Referral Precision</span>
                  <strong style={{ fontFamily: "var(--font-mono)", color: "var(--risk-high)", fontSize: "0.85rem" }}>96.2%</strong>
                </div>
              </div>

              <div style={{ padding: "10px 12px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>False Positive Mitigation</span>
                  <strong style={{ fontFamily: "var(--font-mono)", color: "var(--risk-low)", fontSize: "0.85rem" }}>14.3%</strong>
                </div>
              </div>

              <div style={{ padding: "10px 12px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Average Triage Velocity</span>
                  <strong style={{ fontFamily: "var(--font-mono)", color: "var(--primary)", fontSize: "0.85rem" }}>4.2 min</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Analytics;