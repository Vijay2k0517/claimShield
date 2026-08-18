import { useEffect, useState } from "react";
import {
  ShieldAlert,
  Car,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { getClaimById } from "../services/api";

function Investigation({ claimId, onNavigate }) {
  const [claim, setClaim] = useState(null);
  const [activeImage, setActiveImage] = useState("original");

  useEffect(() => {
    const loadClaim = async () => {
      const data = await getClaimById(claimId);
      setClaim(data);
    };

    if (claimId) {
      loadClaim();
    }
  }, [claimId]);

  if (!claim) {
    return (
      <main className="investigation-page">
        <h2>Loading claim...</h2>
      </main>
    );
  }

  const imageMap = {
    original: claim.evidence.original_image,
    heatmap: claim.evidence.heatmap,
    overlay: claim.evidence.overlay,
  };

  return (
    <main className="investigation-page">

      {/* Header */}

      <div className="investigation-header">
        <div>
          <h2>Investigation Workspace</h2>
          <p>
            Review AI assessment and supporting claim evidence.
          </p>
        </div>

        <span className="investigation-status">
          {claim.status}
        </span>
      </div>


      {/* Claim Information */}

      <section className="claim-info-card">

        <div>
          <small>Claim ID</small>
          <strong>{claim.claim_id}</strong>
        </div>

        <div>
          <small>Vehicle</small>
          <strong>{claim.vehicle_number}</strong>
        </div>

        <div>
          <small>Policy ID</small>
          <strong>{claim.policy_id}</strong>
        </div>

        <div>
          <small>Submitted</small>
          <strong>{claim.submission_date}</strong>
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

            <img
              src={imageMap[activeImage]}
              alt={`${activeImage} vehicle evidence`}
              style={{
                width: "100%",
                height: "280px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

          </div>


          {/* Image Tabs */}

          <div className="image-tabs">

            <button
              className={`image-tab ${
                activeImage === "original" ? "active" : ""
              }`}
              onClick={() => setActiveImage("original")}
            >
              Original
            </button>

            <button
              className={`image-tab ${
                activeImage === "heatmap" ? "active" : ""
              }`}
              onClick={() => setActiveImage("heatmap")}
            >
              AI Heatmap
            </button>

            <button
              className={`image-tab ${
                activeImage === "overlay" ? "active" : ""
              }`}
              onClick={() => setActiveImage("overlay")}
            >
              Overlay
            </button>

          </div>


          {/* Damage Description */}

          <div style={{ marginTop: "15px" }}>
            <small>
              {claim.evidence.damage_description}
            </small>
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
              {claim.fraud_probability}%
            </div>

            <div>

              <span className="high-risk-label">
                {claim.risk_level} RISK
              </span>

              <h2>
                {claim.fraud_probability}% Fraud Probability
              </h2>

              <p>
                {claim.recommendation}
              </p>

            </div>

          </div>


          {/* Flag Reasons */}

          <div className="reason-box">

            <h4>
              <AlertTriangle size={17} />
              Why this claim was flagged
            </h4>

            <ul>

              {claim.flag_reasons.map((reason, index) => (
                <li key={index}>
                  {reason}
                </li>
              ))}

            </ul>

          </div>


          {/* AI Model */}

          <div className="model-info">

            <span>AI Model</span>

            <strong>
              {claim.ai_model}
            </strong>

          </div>

        </div>

      </section>


      {/* Investigation Summary */}

      <section className="investigation-summary">

        <div className="summary-item">

          <Calendar size={20} />

          <div>
            <small>Accident Date</small>
            <strong>{claim.accident_date}</strong>
          </div>

        </div>


        <div className="summary-item">

          <User size={20} />

          <div>
            <small>Customer</small>
            <strong>{claim.customer_name}</strong>
          </div>

        </div>


        <div className="summary-item">

          <CheckCircle size={20} />

          <div>
            <small>AI Recommendation</small>
            <strong>{claim.recommendation}</strong>
          </div>

        </div>

      </section>


      {/* Next Step Button */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >

        <button
          className="new-claim-btn"
          onClick={() =>
            onNavigate &&
            onNavigate("evidence", claim.claim_id)
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          View Evidence
          <ArrowRight size={16} />
        </button>

      </div>

    </main>
  );
}

export default Investigation;