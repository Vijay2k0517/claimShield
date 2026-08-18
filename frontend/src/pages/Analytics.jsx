import {
  BarChart3,
  ShieldAlert,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

function Analytics() {
  return (
    <main className="dashboard">

      {/* Header */}
      <section className="dashboard-header">
        <div>
          <h2>Claims Analytics</h2>
          <p>
            Monitor fraud detection performance and claim investigation trends.
          </p>
        </div>
      </section>

      {/* Analytics Summary */}
      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            <BarChart3 size={22} />
          </div>

          <div>
            <p>Total Claims</p>
            <h3>120</h3>
            <span>+12% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <ShieldAlert size={22} />
          </div>

          <div>
            <p>Fraud Detected</p>
            <h3>15</h3>
            <span>12.5% of total claims</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={22} />
          </div>

          <div>
            <p>Under Review</p>
            <h3>25</h3>
            <span>Requires investigation</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <CheckCircle size={22} />
          </div>

          <div>
            <p>Resolved Claims</p>
            <h3>80</h3>
            <span>66.7% resolved</span>
          </div>
        </div>

      </section>

      {/* Main Analytics Grid */}
      <section className="investigation-grid">

        {/* Risk Distribution */}
        <div className="evidence-card">

          <div className="card-heading">
            <div>
              <h3>Risk Distribution</h3>
              <p>Current claims grouped by risk level.</p>
            </div>

            <ShieldAlert size={20} />
          </div>

          <div style={{ padding: "20px" }}>

            {/* High */}
            <div style={{ marginBottom: "22px" }}>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>High Risk</span>
                <strong>15 claims</strong>
              </div>

              <div
                style={{
                  height: "10px",
                  background: "#fee2e2",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "60%",
                    height: "100%",
                    background: "#ef4444",
                    borderRadius: "10px",
                  }}
                />
              </div>

            </div>

            {/* Medium */}
            <div style={{ marginBottom: "22px" }}>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Medium Risk</span>
                <strong>35 claims</strong>
              </div>

              <div
                style={{
                  height: "10px",
                  background: "#fef3c7",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "75%",
                    height: "100%",
                    background: "#f59e0b",
                    borderRadius: "10px",
                  }}
                />
              </div>

            </div>

            {/* Low */}
            <div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Low Risk</span>
                <strong>70 claims</strong>
              </div>

              <div
                style={{
                  height: "10px",
                  background: "#dcfce7",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "90%",
                    height: "100%",
                    background: "#22c55e",
                    borderRadius: "10px",
                  }}
                />
              </div>

            </div>

          </div>

        </div>

        {/* Investigation Performance */}
        <div className="assessment-card">

          <div className="card-heading">
            <div>
              <h3>Investigation Performance</h3>
              <p>Current investigation statistics.</p>
            </div>

            <TrendingUp size={20} />
          </div>

          <div style={{ padding: "16px" }}>

            <div
              style={{
                padding: "16px",
                background: "#f8fafc",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            >
              <small>Average Investigation Time</small>

              <h2 style={{ margin: "6px 0" }}>
                18 min
              </h2>

              <span style={{ color: "#16a34a", fontSize: "12px" }}>
                ↓ 8% compared to last month
              </span>
            </div>

            <div
              style={{
                padding: "16px",
                background: "#f8fafc",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            >
              <small>Fraud Detection Rate</small>

              <h2 style={{ margin: "6px 0" }}>
                92.4%
              </h2>

              <span style={{ color: "#16a34a", fontSize: "12px" }}>
                ↑ 4.2% model improvement
              </span>
            </div>

            <div
              style={{
                padding: "16px",
                background: "#f8fafc",
                borderRadius: "8px",
              }}
            >
              <small>Claims Resolved</small>

              <h2 style={{ margin: "6px 0" }}>
                80
              </h2>

              <span style={{ color: "#64748b", fontSize: "12px" }}>
                This month
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* Monthly Trend */}
      <section
        className="priority-section"
        style={{ marginTop: "20px" }}
      >

        <div className="section-title">

          <div>
            <h2>Monthly Claim Trend</h2>
            <p>Overview of claims received during the current period.</p>
          </div>

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "15px",
            padding: "25px",
          }}
        >

          {[
            ["Mar", 55],
            ["Apr", 68],
            ["May", 74],
            ["Jun", 82],
            ["Jul", 96],
            ["Aug", 120],
          ].map(([month, value]) => (

            <div
              key={month}
              style={{
                textAlign: "center",
              }}
            >

              <div
                style={{
                  height: "150px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >

                <div
                  style={{
                    width: "38px",
                    height: `${value}px`,
                    background: "#2563eb",
                    borderRadius: "6px 6px 0 0",
                    transition: "height 0.3s ease",
                  }}
                />

              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                }}
              >
                {value}
              </strong>

              <small>{month}</small>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}

export default Analytics;