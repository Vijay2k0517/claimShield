import {
  ShieldAlert,
  Car,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

function Investigation() {
  return (
    <main className="investigation-page">

      <div className="investigation-header">
        <div>
          <h2>Investigation Workspace</h2>
          <p>Review AI assessment and supporting claim evidence.</p>
        </div>

        <span className="investigation-status">
          Under Review
        </span>
      </div>

      {/* Claim Information */}

      <section className="claim-info-card">

        <div>
          <small>Claim ID</small>
          <strong>CLM001</strong>
        </div>

        <div>
          <small>Vehicle</small>
          <strong>TN01 AB 1234</strong>
        </div>

        <div>
          <small>Policy ID</small>
          <strong>POL98231</strong>
        </div>

        <div>
          <small>Submitted</small>
          <strong>17 Aug 2026</strong>
        </div>

      </section>

      {/* Main Investigation Area */}

      <section className="investigation-grid">

        {/* Vehicle Evidence */}

        <div className="evidence-card">

          <div className="card-heading">
            <div>
              <h3>Vehicle Evidence</h3>
              <p>Submitted damage image</p>
            </div>

            <Car size={20} />
          </div>

          <div className="vehicle-image-placeholder">
            <div>
              <Car size={55} />
              <p>Vehicle Damage Image</p>
              <small>Uploaded evidence</small>
            </div>
          </div>

          <div className="image-tabs">
            <button className="image-tab active">
              Original
            </button>

            <button className="image-tab">
              AI Heatmap
            </button>

            <button className="image-tab">
              Overlay
            </button>
          </div>

        </div>

        {/* AI Assessment */}

        <div className="assessment-card">

          <div className="card-heading">
            <div>
              <h3>AI Assessment</h3>
              <p>Model-generated risk assessment</p>
            </div>

            <ShieldAlert size={20} />
          </div>

          <div className="risk-result">

            <div className="risk-circle">
              87%
            </div>

            <div>
              <span className="high-risk-label">
                HIGH RISK
              </span>

              <h2>87% Fraud Probability</h2>

              <p>
                Manual investigation recommended.
              </p>
            </div>

          </div>

          <div className="reason-box">

            <h4>
              <AlertTriangle size={17} />
              Why this claim was flagged
            </h4>

            <ul>
              <li>
                Vehicle damage pattern requires verification.
              </li>

              <li>
                AI model detected suspicious visual characteristics.
              </li>

              <li>
                Claim requires additional investigation.
              </li>
            </ul>

          </div>

          <div className="model-info">
            <span>AI Model</span>
            <strong>Selected CNN Model</strong>
          </div>

        </div>

      </section>

      {/* Investigation Summary */}

      <section className="investigation-summary">

        <div className="summary-item">
          <Calendar size={20} />
          <div>
            <small>Accident Date</small>
            <strong>15 Aug 2026</strong>
          </div>
        </div>

        <div className="summary-item">
          <User size={20} />
          <div>
            <small>Customer</small>
            <strong>Customer Name</strong>
          </div>
        </div>

        <div className="summary-item">
          <CheckCircle size={20} />
          <div>
            <small>AI Recommendation</small>
            <strong>Manual Investigation</strong>
          </div>
        </div>

      </section>

    </main>
  );
}

export default Investigation;