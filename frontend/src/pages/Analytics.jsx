import { useEffect, useState, useMemo } from "react";
import {
  BarChart3,
  ShieldAlert,
  Clock,
  UserCheck,
  ShieldCheck,
  Plus,
  AlertCircle
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

  const totalClaims = claims.length;
  const highRiskClaims = claims.filter((c) => c.risk_level === "HIGH").length;
  const pendingReviews = claims.filter((c) => c.status === "Review").length;
  const adjudicatedClaims = claims.filter((c) => c.decision !== null);

  const kpis = {
    total_claims: summary?.kpis?.total_claims ?? totalClaims,
    high_risk_claims: summary?.kpis?.high_risk_claims ?? highRiskClaims,
    pending_reviews: summary?.kpis?.pending_reviews ?? pendingReviews,
    escalated_claims: summary?.kpis?.escalated_claims ?? claims.filter((c) => c.status === "Escalated").length,
    avg_fraud_probability: summary?.kpis?.avg_fraud_probability ?? 0.0
  };

  // Dynamic 7-Day Trend
  const trendDays = useMemo(() => {
    if (summary?.risk_trends && summary.risk_trends.length > 0) {
      return summary.risk_trends.map((pt) => {
        const d = new Date(pt.date);
        const dayName = isNaN(d.getTime()) ? pt.date : d.toLocaleDateString("en-US", { weekday: "short" });
        return {
          day: dayName,
          total: pt.total || 0,
          highRisk: pt.high || 0
        };
      });
    }

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({ day, total: 0, highRisk: 0 }));
  }, [summary]);

  const maxTrendVolume = Math.max(...trendDays.map((t) => t.total), 1);

  // Dynamic Top Anomaly Reasons
  const anomalyReasons = useMemo(() => {
    if (summary?.top_fraud_reasons && summary.top_fraud_reasons.length > 0) {
      return summary.top_fraud_reasons.map((r) => ({
        reason: r.reason,
        count: r.count,
        pct: r.percentage
      }));
    }

    const reasonCounts = {};
    claims.forEach((c) => {
      (c.flag_reasons || []).forEach((r) => {
        reasonCounts[r] = (reasonCounts[r] || 0) + 1;
      });
    });

    const entries = Object.entries(reasonCounts);
    if (entries.length === 0) return [];

    const totalFlags = entries.reduce((acc, [, count]) => acc + count, 0);
    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({
        reason,
        count,
        pct: Math.round((count / totalFlags) * 100)
      }));
  }, [summary, claims]);

  // Model Alignment Metrics
  const modelAlignment = summary?.model_alignment || {
    agreement_rate: adjudicatedClaims.length > 0 ? 100.0 : 0.0,
    total_adjudicated: adjudicatedClaims.length,
    false_positives_mitigated: 0
  };

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
            <h3>{loading ? "--" : kpis.total_claims}</h3>
            <span>Live database count</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p>High Risk Rate</p>
            <h3>{kpis.total_claims > 0 ? Math.round((kpis.high_risk_claims / kpis.total_claims) * 100) : 0}%</h3>
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
            <h3>{loading ? "--" : kpis.pending_reviews}</h3>
            <span>Awaiting decision</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <UserCheck size={20} />
          </div>
          <div>
            <p>Adjuster Alignment</p>
            <h3>{modelAlignment.total_adjudicated > 0 ? `${modelAlignment.agreement_rate}%` : "0.0%"}</h3>
            <span style={{ color: "var(--status-escalated)", fontWeight: "600" }}>
              {modelAlignment.total_adjudicated} decisions evaluated
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

            {/* Visual Bars / Empty State */}
            {totalClaims === 0 ? (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <AlertCircle size={28} style={{ opacity: 0.5 }} />
                <p style={{ fontSize: "0.82rem" }}>No claim submissions recorded in the last 7 days.</p>
                <span style={{ fontSize: "0.72rem" }}>Submit claims to generate time-series trend bars.</span>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "160px", padding: "10px 10px 0", borderBottom: "1px solid var(--border-color)" }}>
                {trendDays.map((item, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "120px" }}>
                      <div
                        style={{
                          width: "16px",
                          height: `${item.total > 0 ? (item.total / maxTrendVolume) * 100 : 0}%`,
                          background: "rgba(37,99,235,0.7)",
                          borderRadius: "2px 2px 0 0"
                        }}
                      />
                      <div
                        style={{
                          width: "16px",
                          height: `${item.highRisk > 0 ? (item.highRisk / maxTrendVolume) * 100 : 0}%`,
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
            )}
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

            {anomalyReasons.length === 0 ? (
              <div style={{ padding: "24px 10px", textAlign: "center", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={28} style={{ opacity: 0.5 }} />
                <p style={{ fontSize: "0.82rem" }}>No anomaly risk flags recorded.</p>
                <span style={{ fontSize: "0.72rem" }}>AI-detected damage inconsistencies will appear here dynamically.</span>
              </div>
            ) : (
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
            )}
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
                  <strong style={{ fontFamily: "var(--font-mono)", color: "var(--risk-high)", fontSize: "0.85rem" }}>
                    {modelAlignment.total_adjudicated > 0 ? `${modelAlignment.agreement_rate}%` : "0.0%"}
                  </strong>
                </div>
              </div>

              <div style={{ padding: "10px 12px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>False Positive Mitigation</span>
                  <strong style={{ fontFamily: "var(--font-mono)", color: "var(--risk-low)", fontSize: "0.85rem" }}>
                    {modelAlignment.false_positives_mitigated} cases
                  </strong>
                </div>
              </div>

              <div style={{ padding: "10px 12px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Total Adjudicated Decisions</span>
                  <strong style={{ fontFamily: "var(--font-mono)", color: "var(--primary)", fontSize: "0.85rem" }}>
                    {modelAlignment.total_adjudicated} decisions
                  </strong>
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