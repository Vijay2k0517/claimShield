import { useEffect, useState } from "react";
import {
  FileText,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2
} from "lucide-react";
import { getClaims, getDashboardSummary } from "../services/api";
import RiskBadge from "../components/RiskBadge";
import StatusBadge from "../components/StatusBadge";

function Dashboard({ onNavigate, onViewClaim }) {
  const [summary, setSummary] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        const [sumData, claimsData] = await Promise.all([
          getDashboardSummary(),
          getClaims({ page: 1, page_size: 10 })
        ]);

        if (isMounted) {
          setSummary(sumData);
          setClaims(claimsData || []);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const kpis = summary?.kpis || {
    total_claims: claims.length || 5,
    pending_reviews: claims.filter((c) => c.status === "Review").length || 3,
    high_risk_claims: claims.filter((c) => c.risk_level === "HIGH").length || 3,
    escalated_claims: claims.filter((c) => c.status === "Escalated").length || 1,
    avg_fraud_probability: 72.4
  };

  // Top priority claims (sorted by fraud probability descending)
  const priorityClaims = [...claims]
    .sort((a, b) => (b.fraud_probability || 0) - (a.fraud_probability || 0))
    .slice(0, 4);

  // Recent decisions
  const recentDecisions = claims.filter((c) => c.decision !== null);

  return (
    <main className="dashboard">
      {/* Dashboard Header */}
      <section className="dashboard-header">
        <div>
          <h2>Claims Overview</h2>
          <p>
            Monitor incoming auto physical damage claims and triage priority fraud investigations.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-secondary"
            onClick={() => onNavigate && onNavigate("claims")}
          >
            View Directory
          </button>
          <button
            className="new-claim-btn"
            onClick={() => onNavigate && onNavigate("new-claim")}
          >
            <Plus size={15} />
            Intake New Claim
          </button>
        </div>
      </section>

      {/* Metric KPI Strip */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FileText size={20} />
          </div>
          <div>
            <p>Total Active Claims</p>
            <h3>{loading ? "--" : kpis.total_claims}</h3>
            <span>Open portfolio files</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p>Needs Investigation</p>
            <h3>{loading ? "--" : kpis.pending_reviews}</h3>
            <span style={{ color: "var(--risk-review)", fontWeight: "600" }}>
              Pending triage review
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p>High Risk Flags</p>
            <h3>{loading ? "--" : kpis.high_risk_claims}</h3>
            <span style={{ color: "var(--risk-high)", fontWeight: "600" }}>
              Potential fraud signals
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <ArrowUpRight size={20} />
          </div>
          <div>
            <p>Escalated to SIU</p>
            <h3>{loading ? "--" : kpis.escalated_claims}</h3>
            <span>Referred for field audit</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Priority Claims + Risk Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "20px", marginBottom: "28px" }}>
        {/* Priority Attention Feed */}
        <section className="priority-section">
          <div className="section-title">
            <div>
              <h3>Priority Claims Requiring Review</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Ranked by anomalous damage and historical similarity score
              </p>
            </div>

            <button onClick={() => onNavigate && onNavigate("claims")}>
              View All Claims &rarr;
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px 0" }}>
              <div className="skeleton" style={{ height: "42px" }} />
              <div className="skeleton" style={{ height: "42px" }} />
              <div className="skeleton" style={{ height: "42px" }} />
            </div>
          ) : (
            <div className="claims-table">
              <div className="table-header">
                <span>Claim ID</span>
                <span>Vehicle & Policyholder</span>
                <span>Risk Level</span>
                <span>Fraud Probability</span>
                <span>Status</span>
                <span style={{ textAlign: "right" }}>Inspect</span>
              </div>

              {priorityClaims.map((claim) => (
                <div
                  className="claim-row"
                  key={claim.claim_id}
                  onClick={() => onViewClaim ? onViewClaim(claim.claim_id) : onNavigate("investigation", claim.claim_id)}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "var(--primary)" }}>
                    {claim.claim_id}
                  </span>

                  <div>
                    <div style={{ color: "var(--text-primary)", fontWeight: "600", fontSize: "0.85rem" }}>
                      {claim.vehicle_make} {claim.vehicle_model}
                    </div>
                    <small style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>
                      {claim.customer_name} • {claim.vehicle_number}
                    </small>
                  </div>

                  <div>
                    <RiskBadge risk={claim.risk_level} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, background: "#e2e8f0", height: "6px", borderRadius: "999px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${claim.fraud_probability}%`,
                          height: "100%",
                          background:
                            claim.fraud_probability >= 75
                              ? "var(--risk-high)"
                              : claim.fraud_probability >= 40
                              ? "var(--risk-review)"
                              : "var(--risk-low)",
                          borderRadius: "999px"
                        }}
                      />
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "0.82rem" }}>
                      {claim.fraud_probability}%
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <StatusBadge status={claim.status} />
                    <Eye size={15} style={{ color: "var(--text-muted)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Risk Tier Breakdown & Recent Adjuster Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Risk Distribution Breakdown Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <h3 style={{ fontSize: "0.95rem", marginBottom: "14px" }}>Risk Tier Breakdown</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "4px" }}>
                  <span style={{ color: "var(--risk-high)", fontWeight: "600" }}>High Risk (&ge;75%)</span>
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    {summary?.risk_distribution?.[2]?.count ?? kpis.high_risk_claims} claims ({summary?.risk_distribution?.[2]?.percentage ?? 40}%)
                  </span>
                </div>
                <div style={{ background: "#f1f5f9", height: "7px", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${summary?.risk_distribution?.[2]?.percentage ?? 40}%`, height: "100%", background: "var(--risk-high)", borderRadius: "999px" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "4px" }}>
                  <span style={{ color: "var(--risk-review)", fontWeight: "600" }}>Needs Review (40-74%)</span>
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    {summary?.risk_distribution?.[1]?.count ?? kpis.pending_reviews} claims ({summary?.risk_distribution?.[1]?.percentage ?? 40}%)
                  </span>
                </div>
                <div style={{ background: "#f1f5f9", height: "7px", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${summary?.risk_distribution?.[1]?.percentage ?? 40}%`, height: "100%", background: "var(--risk-review)", borderRadius: "999px" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "4px" }}>
                  <span style={{ color: "var(--risk-low)", fontWeight: "600" }}>Low Risk (&lt;40%)</span>
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    {summary?.risk_distribution?.[0]?.count ?? 1} claims ({summary?.risk_distribution?.[0]?.percentage ?? 20}%)
                  </span>
                </div>
                <div style={{ background: "#f1f5f9", height: "7px", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${summary?.risk_distribution?.[0]?.percentage ?? 20}%`, height: "100%", background: "var(--risk-low)", borderRadius: "999px" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Decisions Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "0.95rem" }}>Recent Adjudications</h3>
              <Clock size={15} style={{ color: "var(--text-muted)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {recentDecisions.length === 0 ? (
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "10px 0" }}>
                  No decisions recorded yet.
                </div>
              ) : (
                recentDecisions.slice(0, 3).map((c) => (
                  <div
                    key={c.claim_id}
                    onClick={() => onViewClaim ? onViewClaim(c.claim_id) : onNavigate("investigation", c.claim_id)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "9px 10px",
                      background: "var(--bg-canvas)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      cursor: "pointer"
                    }}
                  >
                    <CheckCircle2 size={16} style={{ color: "var(--risk-low)", marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--primary)" }}>
                          {c.claim_id}
                        </strong>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {c.decision?.decision}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
                        {c.decision?.notes || "Adjudicated by investigator."}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;