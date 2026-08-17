import { Search, ArrowRight, Car } from "lucide-react";

function SimilarClaimsPage() {
  return (
    <main className="similar-page">

      <div className="similar-header">
        <div>
          <h2>Similar Claims</h2>
          <p>Compare the current claim with historical claims.</p>
        </div>
      </div>

      {/* Current Claim */}
      <div className="current-claim-card">
        <div>
          <span>Current Claim</span>
          <h3>CLM001</h3>
          <p>Vehicle: TN01 AB 1234</p>
        </div>

        <div className="similar-score-main">
          <small>Highest Similarity</small>
          <strong>91%</strong>
        </div>
      </div>

      {/* Search */}
      <div className="similar-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search historical claims..."
        />
      </div>

      {/* Similar Claims */}
      <div className="similar-list">

        {/* Claim 1 */}
        <div className="similar-card">

          <div className="vehicle-placeholder">
            <Car size={45} />
            <span>Current Vehicle</span>
          </div>

          <div className="compare-arrow">
            <ArrowRight size={25} />
          </div>

          <div className="vehicle-placeholder">
            <Car size={45} />
            <span>Historical Vehicle</span>
          </div>

          <div className="similar-details">

            <div>
              <small>Historical Claim</small>
              <strong>CLM045</strong>
            </div>

            <div>
              <small>Vehicle</small>
              <strong>TN09 XY 4567</strong>
            </div>

            <div>
              <small>Similarity</small>
              <strong className="similarity-high">
                91%
              </strong>
            </div>

            <div>
              <small>Risk</small>
              <span className="risk high">
                HIGH
              </span>
            </div>

            <button className="compare-btn">
              Compare
            </button>

          </div>

        </div>

        {/* Claim 2 */}
        <div className="similar-card">

          <div className="vehicle-placeholder">
            <Car size={45} />
            <span>Current Vehicle</span>
          </div>

          <div className="compare-arrow">
            <ArrowRight size={25} />
          </div>

          <div className="vehicle-placeholder">
            <Car size={45} />
            <span>Historical Vehicle</span>
          </div>

          <div className="similar-details">

            <div>
              <small>Historical Claim</small>
              <strong>CLM078</strong>
            </div>

            <div>
              <small>Vehicle</small>
              <strong>TN10 PQ 7890</strong>
            </div>

            <div>
              <small>Similarity</small>
              <strong className="similarity-medium">
                74%
              </strong>
            </div>

            <div>
              <small>Risk</small>
              <span className="risk medium">
                MEDIUM
              </span>
            </div>

            <button className="compare-btn">
              Compare
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

export default SimilarClaimsPage;