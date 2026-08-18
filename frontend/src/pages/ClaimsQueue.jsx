import { Search, Filter, Eye } from "lucide-react";

function ClaimsQueue({ onViewClaim }) {
  const claims = [
    {
      claim_id: "CLM001",
      vehicle_number: "TN01 AB 1234",
      risk_level: "HIGH",
      fraud_probability: 87,
      status: "Review",
    },
    {
      claim_id: "CLM002",
      vehicle_number: "TN02 CD 5678",
      risk_level: "HIGH",
      fraud_probability: 81,
      status: "Review",
    },
    {
      claim_id: "CLM003",
      vehicle_number: "TN03 EF 9012",
      risk_level: "MEDIUM",
      fraud_probability: 56,
      status: "Pending",
    },
    {
      claim_id: "CLM004",
      vehicle_number: "TN04 GH 3456",
      risk_level: "LOW",
      fraud_probability: 18,
      status: "Legitimate",
    },
  ];

  return (
    <main className="claims-page">
      <div className="claims-header">
        <div>
          <h2>Claims Queue</h2>
          <p>Review and investigate submitted insurance claims.</p>
        </div>
      </div>

      <div className="claims-controls">
        <div className="claim-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Claim ID, Policy ID or VIN..."
          />
        </div>

        <button className="filter-btn">
          <Filter size={17} />
          Filters
        </button>

        <select defaultValue="All Risk Levels">
          <option>All Risk Levels</option>
          <option>High Risk</option>
          <option>Medium Risk</option>
          <option>Low Risk</option>
        </select>

        <select defaultValue="All Status">
          <option>All Status</option>
          <option>Review</option>
          <option>Pending</option>
          <option>Escalated</option>
          <option>Legitimate</option>
        </select>
      </div>

      <div className="queue-card">
        <div className="queue-title">
          <div>
            <h3>All Claims</h3>
            <p>{claims.length} claims found</p>
          </div>
        </div>

        <div className="queue-table">
          <div className="queue-table-header">
            <span>Claim ID</span>
            <span>Vehicle</span>
            <span>Risk Level</span>
            <span>Fraud Probability</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {claims.map((claim) => (
            <div className="queue-row" key={claim.claim_id}>
              <span>{claim.claim_id}</span>

              <span>{claim.vehicle_number}</span>

              <span className={`risk ${claim.risk_level.toLowerCase()}`}>
                {claim.risk_level}
              </span>

              <span>{claim.fraud_probability}%</span>

              <span
                className={`status ${
                  claim.status === "Review"
                    ? "review"
                    : claim.status === "Pending"
                    ? "pending"
                    : "legitimate"
                }`}
              >
                {claim.status}
              </span>

              <button
                type="button"
                className="view-btn"
                onClick={() => onViewClaim?.(claim.claim_id)}
              >
                <Eye size={16} />
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ClaimsQueue;