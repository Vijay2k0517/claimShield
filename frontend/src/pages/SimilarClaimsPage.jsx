import { useEffect, useState } from "react";
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Car,
} from "lucide-react";
import { getClaimById, getSimilarClaims } from "../services/api";
import LoadingState from "../components/LoadingState";

function SimilarClaimsPage({ claimId, onNavigate }) {
  const [claim, setClaim] = useState(null);
  const [similarClaims, setSimilarClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimilarClaims = async () => {
      setLoading(true);

      const claimData = await getClaimById(claimId);
      const similarData = await getSimilarClaims(claimId);

      setClaim(claimData);
      setSimilarClaims(similarData);

      setLoading(false);
    };

    if (claimId) {
      loadSimilarClaims();
    }
  }, [claimId]);

  if (loading) {
    return (
      <main className="similar-page">
        <LoadingState message={`Loading similar claims for ${claimId}...`} />
      </main>
    );
  }

  if (!claim) {
    return (
      <main className="similar-page">
        <h2>Claim not found</h2>
        <p>Unable to load claim {claimId}.</p>
      </main>
    );
  }

  const filteredClaims = similarClaims.filter((similarClaim) =>
    similarClaim.claim_id
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const highestSimilarity =
    similarClaims.length > 0
      ? Math.max(
          ...similarClaims.map(
            (item) => item.similarity_score
          )
        )
      : 0;

  return (
    <main className="similar-page">

      {/* Header */}

      <div className="similar-header">

        <div>

          <button
            onClick={() =>
              onNavigate &&
              onNavigate(
                "evidence",
                claim.claim_id
              )
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              marginBottom: "12px",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={16} />
            Back to Evidence
          </button>

          <h2>Similar Claims</h2>

          <p>
            Compare the current claim with historical claims.
          </p>

        </div>

      </div>


      {/* Current Claim */}

      <div className="current-claim-card">

        <div>

          <span>Current Claim</span>

          <h3>
            {claim.claim_id}
          </h3>

          <p>
            Vehicle: {claim.vehicle_number}
          </p>

        </div>


        <div className="similar-score-main">

          <small>Highest Similarity</small>

          <strong>
            {highestSimilarity}%
          </strong>

        </div>

      </div>


      {/* Search */}

      <div className="similar-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search historical claims..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

      </div>


      {/* Similar Claims */}

      <div className="similar-list">

        {filteredClaims.length === 0 ? (

          <div
            style={{
              padding: "30px",
              textAlign: "center",
              background: "#f8fafc",
              borderRadius: "10px",
            }}
          >
            <h3>No Similar Claims Found</h3>

            <p>
              No historical claims matched this claim.
            </p>
          </div>

        ) : (

          filteredClaims.map((similarClaim) => (

            <div
              className="similar-card"
              key={similarClaim.claim_id}
            >

              {/* Current Vehicle */}

              <div className="vehicle-placeholder">

                <Car size={45} />

                <span>
                  Current Vehicle
                </span>

              </div>


              {/* Arrow */}

              <div className="compare-arrow">

                <ArrowRight size={25} />

              </div>


              {/* Historical Vehicle */}

              <div className="vehicle-placeholder">

                <Car size={45} />

                <span>
                  Historical Vehicle
                </span>

              </div>


              {/* Details */}

              <div className="similar-details">

                <div>

                  <small>
                    Historical Claim
                  </small>

                  <strong>
                    {similarClaim.claim_id}
                  </strong>

                </div>


                <div>

                  <small>
                    Vehicle
                  </small>

                  <strong>
                    {similarClaim.vehicle_number}
                  </strong>

                </div>


                <div>

                  <small>
                    Similarity
                  </small>

                  <strong
                    className={
                      similarClaim.similarity_score >= 80
                        ? "similarity-high"
                        : "similarity-medium"
                    }
                  >
                    {similarClaim.similarity_score}%
                  </strong>

                </div>


                <div>

                  <small>
                    Risk
                  </small>

                  <span
                    className={`risk ${similarClaim.risk_level.toLowerCase()}`}
                  >
                    {similarClaim.risk_level}
                  </span>

                </div>


                <button
                  className="compare-btn"
                  onClick={() => {
                    alert(
                      `Comparing ${claim.claim_id} with ${similarClaim.claim_id}`
                    );
                  }}
                >
                  Compare
                </button>

              </div>

            </div>

          ))

        )}

      </div>


      {/* Continue to Decision */}

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
            onNavigate(
              "decision",
              claim.claim_id
            )
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Investigator Decision
          <ArrowRight size={16} />
        </button>

      </div>

    </main>
  );
}

export default SimilarClaimsPage;