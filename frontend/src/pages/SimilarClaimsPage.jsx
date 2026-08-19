import { useEffect, useState } from "react";
import {
  Search,
  AlertTriangle
} from "lucide-react";
import { getClaimById, getSimilarClaims, getMediaUrl } from "../services/api";
import RiskBadge from "../components/RiskBadge";
import StatusBadge from "../components/StatusBadge";
import InvestigationNav from "../components/InvestigationNav";

function SimilarClaimsPage({ claimId = "CLM001", onNavigate }) {
  const [claim, setClaim] = useState(null);
  const [similarClaims, setSimilarClaims] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [claimData, similarData] = await Promise.all([
          getClaimById(claimId || "CLM001"),
          getSimilarClaims(claimId || "CLM001")
        ]);

        if (isMounted) {
          setClaim(claimData);
          const list = similarData || [];
          setSimilarClaims(list);
          if (list.length > 0) {
            setSelectedMatch(list[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load similar claims:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [claimId]);

  if (loading || !claim) {
    return (
      <main className="investigation-page">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px 0" }}>
          <div className="skeleton" style={{ height: "36px", width: "35%" }} />
          <div className="skeleton" style={{ height: "400px", width: "100%" }} />
        </div>
      </main>
    );
  }

  const currentEvidence = claim.evidence || {};
  const currentImage = getMediaUrl(currentEvidence.original_image || "https://images.unsplash.com/photo-1590362891991-f776e747a588");

  const filteredMatches = similarClaims.filter((item) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      item.claim_id?.toLowerCase().includes(query) ||
      item.vehicle_make?.toLowerCase().includes(query) ||
      item.vehicle_model?.toLowerCase().includes(query) ||
      item.notes?.toLowerCase().includes(query)
    );
  });

  const activeMatch = selectedMatch || (similarClaims.length > 0 ? similarClaims[0] : null);

  return (
    <main className="investigation-page">
      {/* Top Header & Sub-Navigation */}
      <div style={{ marginBottom: "20px" }}>
        <div className="investigation-header" style={{ marginBottom: "14px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2>Prior Claims Comparison</h2>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  color: "var(--primary)",
                  background: "var(--primary-light)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--primary-border)"
                }}
              >
                {claim.claim_id}
              </span>
            </div>
            <p>
              Compare submitted damage against historical claims to identify repeat claims, duplicate photos, and prior total losses.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <StatusBadge status={claim.status} />
            <RiskBadge risk={claim.risk_level} probability={claim.fraud_probability} />
          </div>
        </div>

        {/* Standardized Sub-Navigation */}
        <InvestigationNav
          currentTab="similar-claims"
          claimId={claim.claim_id}
          similarCount={similarClaims.length}
          onNavigate={onNavigate}
        />
      </div>

      {/* Main 2-Column Comparative Workbench */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "20px", marginBottom: "28px" }}>
        {/* Left Column: Side-by-Side Dual View */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1rem" }}>Visual Damage Comparison</h3>
              {activeMatch && (
                <span
                  style={{
                    background: "#fff1f2",
                    border: "1px solid #fecdd3",
                    color: "var(--risk-high)",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  {activeMatch.similarity_score}% Visual Match
                </span>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {/* Current Claim Panel */}
              <div style={{ background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                <div style={{ padding: "8px 12px", background: "#ffffff", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--primary)" }}>
                    Current: {claim.claim_id}
                  </strong>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {claim.vehicle_make} {claim.vehicle_model}
                  </span>
                </div>
                <div style={{ height: "210px", overflow: "hidden", background: "#0f172a" }}>
                  <img src={currentImage} alt="Current" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "10px 12px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <div><strong>Accident Date:</strong> {claim.accident_date}</div>
                  <div style={{ marginTop: "2px" }}><strong>Damage:</strong> {currentEvidence.damage_description || "Front bumper damage."}</div>
                </div>
              </div>

              {/* Historical Match Panel */}
              {activeMatch ? (
                <div style={{ background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                  <div style={{ padding: "8px 12px", background: "#ffffff", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--risk-high)" }}>
                      Historical: {activeMatch.claim_id}
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {activeMatch.vehicle_make} {activeMatch.vehicle_model}
                    </span>
                  </div>
                  <div style={{ height: "210px", overflow: "hidden", background: "#0f172a" }}>
                    <img src={getMediaUrl(activeMatch.image)} alt="Historical" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "10px 12px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    <div><strong>Outcome:</strong> Total Loss Claim Settled</div>
                    <div style={{ marginTop: "2px" }}><strong>Notes:</strong> {activeMatch.notes || "Identical impact deformation."}</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.82rem", padding: "16px" }}>
                  No historical matches available.
                </div>
              )}
            </div>

            {/* Comparison Remarks */}
            {activeMatch && (
              <div style={{ marginTop: "16px", padding: "12px 14px", background: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <h4 style={{ fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertTriangle size={14} style={{ color: "var(--risk-review)" }} />
                  Similarity Analysis Notes
                </h4>
                <ul style={{ paddingLeft: "18px", fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>
                    Vector embedding distance shows {activeMatch.similarity_score}% visual feature alignment.
                  </li>
                  <li>
                    Damage crease location on front bumper bracket matches prior file {activeMatch.claim_id}.
                  </li>
                  <li>
                    Recommend checking prior total loss databases for duplicate insurance payout history.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Match List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "0.95rem" }}>Matching Historical Claims</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {filteredMatches.length} files
              </span>
            </div>

            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--bg-canvas)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "6px 10px",
                marginBottom: "12px"
              }}
            >
              <Search size={13} style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search matching files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "0.78rem",
                  color: "var(--text-primary)",
                  width: "100%"
                }}
              />
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredMatches.length === 0 ? (
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "14px 0" }}>
                  No similar claims found.
                </div>
              ) : (
                filteredMatches.map((match) => (
                  <div
                    key={match.claim_id}
                    onClick={() => setSelectedMatch(match)}
                    style={{
                      padding: "10px",
                      background: activeMatch?.claim_id === match.claim_id ? "var(--primary-light)" : "var(--bg-canvas)",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${activeMatch?.claim_id === match.claim_id ? "var(--primary-border)" : "var(--border-color)"}`,
                      cursor: "pointer",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={getMediaUrl(match.image)}
                      alt={match.claim_id}
                      style={{ width: "44px", height: "44px", borderRadius: "var(--radius-sm)", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--primary)" }}>
                          {match.claim_id}
                        </strong>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "0.72rem", color: "var(--risk-high)" }}>
                          {match.similarity_score}% Match
                        </span>
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "1px" }}>
                        {match.vehicle_make} {match.vehicle_model} • {match.notes}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
              <button
                className="btn-primary"
                onClick={() => onNavigate && onNavigate("decision", claim.claim_id)}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Adjudication & Decision &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SimilarClaimsPage;