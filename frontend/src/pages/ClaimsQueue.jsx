import { Search, Filter, Eye } from "lucide-react";

function ClaimsQueue() {
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

        <select>
          <option>All Risk Levels</option>
          <option>High Risk</option>
          <option>Medium Risk</option>
          <option>Low Risk</option>
        </select>

        <select>
          <option>All Status</option>
          <option>Review</option>
          <option>Pending</option>
          <option>Escalated</option>
        </select>

      </div>

      <div className="queue-card">

        <div className="queue-title">
          <div>
            <h3>All Claims</h3>
            <p>120 claims found</p>
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

          <div className="queue-row">
            <span>CLM001</span>
            <span>TN01 AB 1234</span>
            <span className="risk high">HIGH</span>
            <span>87%</span>
            <span className="status review">Review</span>
            <button className="view-btn">
              <Eye size={16} />
              View
            </button>
          </div>

          <div className="queue-row">
            <span>CLM002</span>
            <span>TN02 CD 5678</span>
            <span className="risk high">HIGH</span>
            <span>81%</span>
            <span className="status review">Review</span>
            <button className="view-btn">
              <Eye size={16} />
              View
            </button>
          </div>

          <div className="queue-row">
            <span>CLM003</span>
            <span>TN03 EF 9012</span>
            <span className="risk medium">MEDIUM</span>
            <span>56%</span>
            <span className="status pending">Pending</span>
            <button className="view-btn">
              <Eye size={16} />
              View
            </button>
          </div>

          <div className="queue-row">
            <span>CLM004</span>
            <span>TN04 GH 3456</span>
            <span className="risk low">LOW</span>
            <span>18%</span>
            <span className="status legitimate">Legitimate</span>
            <button className="view-btn">
              <Eye size={16} />
              View
            </button>
          </div>

        </div>

      </div>

    </main>
  );
}

export default ClaimsQueue;