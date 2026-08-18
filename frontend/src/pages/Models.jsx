import {
  Brain,
  Activity,
  ShieldCheck,
  Clock,
  TrendingUp,
} from "lucide-react";

function Models() {
  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>AI Models</h2>
          <p>
            Monitor the AI models used for insurance claim fraud detection.
          </p>
        </div>

        <div className="model-status">
          <span className="status-dot"></span>
          All Systems Operational
        </div>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Brain size={22} />
          </div>

          <div>
            <p>Active Models</p>
            <h3>3</h3>
            <span>Currently deployed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Activity size={22} />
          </div>

          <div>
            <p>Model Accuracy</p>
            <h3>92.4%</h3>
            <span>Overall performance</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={22} />
          </div>

          <div>
            <p>Claims Analyzed</p>
            <h3>1,248</h3>
            <span>This month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={22} />
          </div>

          <div>
            <p>Avg. Response</p>
            <h3>1.8s</h3>
            <span>Inference time</span>
          </div>
        </div>
      </section>

      <section className="priority-section">
        <div className="section-title">
          <div>
            <h2>Deployed Models</h2>
            <p>AI models currently used by ClaimShield AI.</p>
          </div>
        </div>

        <div className="claims-table">
          <div className="table-header">
            <span>Model</span>
            <span>Purpose</span>
            <span>Accuracy</span>
            <span>Status</span>
            <span>Version</span>
          </div>

          <div className="claim-row">
            <span>
              <strong>DamageVision</strong>
            </span>

            <span>Vehicle Damage Detection</span>

            <span>92.4%</span>

            <span className="status legitimate">
              Active
            </span>

            <span>v2.4</span>
          </div>

          <div className="claim-row">
            <span>
              <strong>FraudClassifier</strong>
            </span>

            <span>Fraud Risk Classification</span>

            <span>90.8%</span>

            <span className="status legitimate">
              Active
            </span>

            <span>v1.8</span>
          </div>

          <div className="claim-row">
            <span>
              <strong>SimilarityEngine</strong>
            </span>

            <span>Historical Claim Matching</span>

            <span>94.1%</span>

            <span className="status legitimate">
              Active
            </span>

            <span>v1.5</span>
          </div>
        </div>
      </section>

      <section className="investigation-summary">
        <div className="summary-item">
          <ShieldCheck size={20} />

          <div>
            <small>Primary Model</small>
            <strong>DamageVision-ResNet50</strong>
          </div>
        </div>

        <div className="summary-item">
          <Activity size={20} />

          <div>
            <small>Model Health</small>
            <strong>Excellent</strong>
          </div>
        </div>

        <div className="summary-item">
          <Brain size={20} />

          <div>
            <small>Detection Type</small>
            <strong>Image-based Fraud Detection</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Models;