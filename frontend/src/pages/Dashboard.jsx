import {
  FileText,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

function Dashboard() {
  return (
    <main className="dashboard">
      <section className="dashboard-header">
        <div>
          <h2>Investigation Overview</h2>
          <p>Monitor insurance claims and identify priority investigations.</p>
        </div>

        <button className="new-claim-btn">
          + New Claim
        </button>
      </section>

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            <FileText size={22} />
          </div>

          <div>
            <p>Total Claims</p>
            <h3>120</h3>
            <span>+12% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertTriangle size={22} />
          </div>

          <div>
            <p>Needs Review</p>
            <h3>25</h3>
            <span>Requires attention</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <ShieldAlert size={22} />
          </div>

          <div>
            <p>High Risk</p>
            <h3>15</h3>
            <span>Manual investigation</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <ArrowUpRight size={22} />
          </div>

          <div>
            <p>Escalated</p>
            <h3>5</h3>
            <span>Investigation required</span>
          </div>
        </div>

      </section>

      <section className="priority-section">

        <div className="section-title">
          <div>
            <h2>Priority Investigations</h2>
            <p>Claims that require your immediate attention.</p>
          </div>

          <button>View All</button>
        </div>

        <div className="claims-table">

          <div className="table-header">
            <span>Claim ID</span>
            <span>Vehicle</span>
            <span>Risk</span>
            <span>Fraud Probability</span>
            <span>Status</span>
          </div>

          <div className="claim-row">
            <span>CLM001</span>
            <span>TN01 AB 1234</span>
            <span className="risk high">HIGH</span>
            <span>87%</span>
            <span className="status review">Review</span>
          </div>

          <div className="claim-row">
            <span>CLM002</span>
            <span>TN02 CD 5678</span>
            <span className="risk high">HIGH</span>
            <span>81%</span>
            <span className="status review">Review</span>
          </div>

          <div className="claim-row">
            <span>CLM003</span>
            <span>TN03 EF 9012</span>
            <span className="risk medium">MEDIUM</span>
            <span>56%</span>
            <span className="status pending">Pending</span>
          </div>

        </div>

      </section>
    </main>
  );
}

export default Dashboard;