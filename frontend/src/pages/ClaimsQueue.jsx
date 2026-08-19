import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  Car,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShieldAlert,
  Calendar,
  Trash2,
  AlertOctagon
} from "lucide-react";
import { getClaims, deleteClaim, clearAllClaims } from "../services/api";
import RiskBadge from "../components/RiskBadge";
import StatusBadge from "../components/StatusBadge";

function ClaimsQueue({ onViewClaim, onNavigate, showToast }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [makeFilter, setMakeFilter] = useState("ALL");

  // Sorting State
  const [sortField, setSortField] = useState("fraud_probability");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function refreshClaims() {
    try {
      setLoading(true);
      const data = await getClaims();
      setClaims(data || []);
    } catch (err) {
      console.error("Error loading claims directory:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshClaims();
  }, []);

  const handleDeleteClaim = async (e, claimId) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete claim ${claimId}?`)) {
      return;
    }

    try {
      await deleteClaim(claimId);
      setClaims((prev) => prev.filter((c) => c.claim_id !== claimId));
      if (showToast) showToast(`Claim ${claimId} permanently deleted.`, "info");
    } catch (err) {
      console.error("Failed to delete claim:", err);
      alert("Could not delete claim. Please try again.");
    }
  };

  const handleClearAllClaims = async () => {
    if (!window.confirm("⚠️ WARNING: This will permanently delete ALL claims from the database. Proceed?")) {
      return;
    }

    try {
      await clearAllClaims();
      setClaims([]);
      if (showToast) showToast("All claim records have been cleared.", "info");
    } catch (err) {
      console.error("Failed to clear claims:", err);
      alert("Could not clear claims. Please try again.");
    }
  };

  const vehicleMakes = useMemo(() => {
    const makes = new Set(claims.map((c) => c.vehicle_make).filter(Boolean));
    return Array.from(makes);
  }, [claims]);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      if (riskFilter !== "ALL") {
        if (riskFilter === "HIGH" && claim.risk_level !== "HIGH") return false;
        if ((riskFilter === "REVIEW" || riskFilter === "MEDIUM") && !["REVIEW", "MEDIUM"].includes(claim.risk_level)) return false;
        if (riskFilter === "LOW" && claim.risk_level !== "LOW") return false;
      }
      if (statusFilter !== "ALL") {
        if (claim.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }
      if (makeFilter !== "ALL") {
        if (claim.vehicle_make?.toLowerCase() !== makeFilter.toLowerCase()) return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = claim.claim_id?.toLowerCase().includes(query);
        const matchesCustomer = claim.customer_name?.toLowerCase().includes(query);
        const matchesVehicle = claim.vehicle_number?.toLowerCase().includes(query);
        const matchesMake = claim.vehicle_make?.toLowerCase().includes(query);
        const matchesModel = claim.vehicle_model?.toLowerCase().includes(query);
        const matchesPolicy = claim.policy_id?.toLowerCase().includes(query);
        if (!matchesId && !matchesCustomer && !matchesVehicle && !matchesMake && !matchesModel && !matchesPolicy) {
          return false;
        }
      }
      return true;
    });
  }, [claims, riskFilter, statusFilter, makeFilter, searchTerm]);

  const sortedClaims = useMemo(() => {
    return [...filteredClaims].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "fraud_probability") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = String(aVal || "").toLowerCase();
        bVal = String(bVal || "").toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredClaims, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedClaims.length / pageSize) || 1;
  const paginatedClaims = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedClaims.slice(start, start + pageSize);
  }, [sortedClaims, page, pageSize]);

  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRiskFilter("ALL");
    setStatusFilter("ALL");
    setMakeFilter("ALL");
    setPage(1);
  };

  const hasActiveFilters = searchTerm || riskFilter !== "ALL" || statusFilter !== "ALL" || makeFilter !== "ALL";

  return (
    <main className="claims-page">
      {/* Header */}
      <div className="claims-header">
        <div>
          <h2>Claims Directory & Triage</h2>
          <p>Comprehensive register of submitted claims, damage assessment scores, and investigation statuses.</p>
        </div>

        <button
          className="new-claim-btn"
          onClick={() => onNavigate && onNavigate("new-claim")}
        >
          + Intake New Claim
        </button>
      </div>

      {/* Filter Control Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          background: "#ffffff",
          padding: "14px 18px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-card)"
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--bg-canvas)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "7px 12px",
            flex: "1 1 260px"
          }}
        >
          <Search size={15} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search by Claim ID, Customer, Plate, Policy #..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "0.82rem",
              color: "var(--text-primary)",
              width: "100%"
            }}
          />
        </div>

        {/* Risk Dropdown */}
        <select
          value={riskFilter}
          onChange={(e) => {
            setRiskFilter(e.target.value);
            setPage(1);
          }}
          style={{
            background: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "7px 10px",
            fontSize: "0.82rem",
            color: "var(--text-primary)",
            cursor: "pointer"
          }}
        >
          <option value="ALL">All Risk Levels</option>
          <option value="HIGH">High Risk (&ge;75%)</option>
          <option value="REVIEW">Needs Review (40-74%)</option>
          <option value="LOW">Low Risk (&lt;40%)</option>
        </select>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{
            background: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "7px 10px",
            fontSize: "0.82rem",
            color: "var(--text-primary)",
            cursor: "pointer"
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="Review">Under Review</option>
          <option value="Pending">Pending Evidence</option>
          <option value="Escalated">Escalated to SIU</option>
          <option value="Legitimate">Approved Legitimate</option>
        </select>

        {/* Make Dropdown */}
        {vehicleMakes.length > 0 && (
          <select
            value={makeFilter}
            onChange={(e) => {
              setMakeFilter(e.target.value);
              setPage(1);
            }}
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "7px 10px",
              fontSize: "0.82rem",
              color: "var(--text-primary)",
              cursor: "pointer"
            }}
          >
            <option value="ALL">All Vehicle Makes</option>
            {vehicleMakes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "transparent",
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
              borderRadius: "var(--radius-md)",
              padding: "7px 10px",
              fontSize: "0.78rem",
              fontWeight: "600"
            }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}

        {claims.length > 0 && (
          <button
            onClick={handleClearAllClaims}
            title="Permanently remove all claim records from database"
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#e11d48",
              borderRadius: "var(--radius-md)",
              padding: "7px 12px",
              fontSize: "0.78rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            <Trash2 size={13} />
            Clear All Records
          </button>
        )}
      </div>

      {/* Directory Table */}
      <div className="queue-card">
        <div className="queue-title">
          <div>
            <h3>Active Claims</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Showing {sortedClaims.length} records {hasActiveFilters && "(Filtered)"}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <span>Sort:</span>
            <button
              onClick={() => handleSortToggle("fraud_probability")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: sortField === "fraud_probability" ? "var(--bg-canvas)" : "transparent",
                color: "var(--text-primary)",
                padding: "3px 7px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                fontSize: "0.75rem",
                fontWeight: "600"
              }}
            >
              Fraud Risk
              <ArrowUpDown size={11} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px 0" }}>
            <div className="skeleton" style={{ height: "42px" }} />
            <div className="skeleton" style={{ height: "42px" }} />
            <div className="skeleton" style={{ height: "42px" }} />
          </div>
        ) : paginatedClaims.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <ShieldAlert size={36} style={{ color: "var(--text-muted)", opacity: 0.6 }} />
            <h4>No matching claims found</h4>
            <p style={{ fontSize: "0.82rem", maxWidth: "360px" }}>
              No claims in the directory. Submit a new claim or upload photos to start fraud investigation.
            </p>
            <button className="btn-primary" onClick={() => onNavigate("new-claim")}>
              + Submit New Claim
            </button>
          </div>
        ) : (
          <div className="queue-table">
            <div className="queue-table-header">
              <span>Claim ID</span>
              <span>Vehicle & Policyholder</span>
              <span>Risk Tier</span>
              <span>Fraud Probability</span>
              <span>Status</span>
              <span style={{ textAlign: "right" }}>Action</span>
            </div>

            {paginatedClaims.map((claim) => (
              <div
                className="queue-row"
                key={claim.claim_id}
                onClick={() => onViewClaim ? onViewClaim(claim.claim_id) : onNavigate("investigation", claim.claim_id)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "var(--primary)" }}>
                    {claim.claim_id}
                  </span>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "1px" }}>
                    {claim.submission_date}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "0.85rem" }}>
                    {claim.vehicle_make} {claim.vehicle_model}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "1px" }}>
                    {claim.customer_name} • {claim.vehicle_number}
                  </div>
                </div>

                <div>
                  <RiskBadge risk={claim.risk_level} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, background: "#e2e8f0", height: "6px", borderRadius: "999px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${claim.fraud_probability}%`,
                        height: "100%",
                        background:
                          claim.fraud_probability >= 75
                            ? "var(--risk-high)"
                            : claim.fraud_probability >= 40
                            ? "var(--risk-review)"
                            : "var(--risk-low)",
                        borderRadius: "999px"
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "0.82rem" }}>
                    {claim.fraud_probability}%
                  </span>
                </div>

                <div>
                  <StatusBadge status={claim.status} />
                </div>

                <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onViewClaim) onViewClaim(claim.claim_id);
                      else onNavigate("investigation", claim.claim_id);
                    }}
                  >
                    <Eye size={13} />
                    Inspect
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteClaim(e, claim.claim_id)}
                    title={`Delete Claim ${claim.claim_id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid #fee2e2",
                      background: "#fff1f2",
                      color: "#e11d48",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "16px",
              paddingTop: "14px",
              borderTop: "1px solid var(--border-color)",
              fontSize: "0.82rem",
              color: "var(--text-secondary)"
            }}
          >
            <span>
              Page {page} of {totalPages}
            </span>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  background: "#ffffff",
                  border: "1px solid var(--border-color)",
                  color: page <= 1 ? "var(--text-dim)" : "var(--text-primary)",
                  padding: "5px 10px",
                  borderRadius: "var(--radius-sm)",
                  cursor: page <= 1 ? "not-allowed" : "pointer"
                }}
              >
                <ChevronLeft size={14} />
                Prev
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  background: "#ffffff",
                  border: "1px solid var(--border-color)",
                  color: page >= totalPages ? "var(--text-dim)" : "var(--text-primary)",
                  padding: "5px 10px",
                  borderRadius: "var(--radius-sm)",
                  cursor: page >= totalPages ? "not-allowed" : "pointer"
                }}
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ClaimsQueue;