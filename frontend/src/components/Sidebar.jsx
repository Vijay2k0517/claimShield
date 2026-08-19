import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  FileSearch,
  Layers,
  GitCompare,
  CheckSquare,
  BarChart3,
  Cpu,
  Settings,
  Shield
} from "lucide-react";
import { getClaims } from "../services/api";

function Sidebar({ currentPage, selectedClaimId, onNavigate }) {
  const [flaggedCount, setFlaggedCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    getClaims()
      .then((claims) => {
        if (isMounted && claims) {
          const count = claims.filter(
            (c) => c.risk_level === "HIGH" || c.status === "Escalated" || (c.fraud_probability && c.fraud_probability >= 75)
          ).length;
          setFlaggedCount(count);
        }
      })
      .catch(() => {
        if (isMounted) setFlaggedCount(0);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  return (
    <aside className="sidebar">
      {/* Brand & Organization */}
      <div className="logo" onClick={() => onNavigate("dashboard")} style={{ cursor: "pointer" }}>
        <div className="logo-icon">
          <Shield size={20} />
        </div>
        <div>
          <h2>ClaimShield</h2>
          <span>Fraud Prevention</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <p className="menu-title">Claims Management</p>

        {/* Dashboard */}
        <button
          className={`menu-item ${currentPage === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </button>

        {/* Claims Queue */}
        <button
          className={`menu-item ${currentPage === "claims" ? "active" : ""}`}
          onClick={() => onNavigate("claims")}
        >
          <ClipboardList size={17} />
          <span>Claims Directory</span>
          {flaggedCount > 0 && (
            <span
              style={{
                marginLeft: "auto",
                background: "#e11d48",
                color: "#ffffff",
                fontSize: "0.68rem",
                fontWeight: "700",
                padding: "1px 6px",
                borderRadius: "9999px"
              }}
            >
              {flaggedCount} Flagged
            </span>
          )}
        </button>

        {/* New Claim Intake */}
        <button
          className={`menu-item ${currentPage === "new-claim" ? "active" : ""}`}
          onClick={() => onNavigate("new-claim")}
        >
          <PlusCircle size={17} />
          <span>Intake New Claim</span>
        </button>

        {/* Active Investigation Context */}
        <p className="menu-title">Investigation Workspace</p>

        <button
          className={`menu-item ${currentPage === "investigation" ? "active" : ""}`}
          onClick={() => onNavigate("investigation", selectedClaimId || "CLM001")}
        >
          <FileSearch size={17} />
          <span>Case Overview</span>
          {selectedClaimId && (
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#93c5fd" }}>
              {selectedClaimId}
            </span>
          )}
        </button>

        <button
          className={`menu-item ${currentPage === "evidence" ? "active" : ""}`}
          onClick={() => onNavigate("evidence", selectedClaimId || "CLM001")}
        >
          <Layers size={17} />
          <span>Damage Photos & Heatmap</span>
        </button>

        <button
          className={`menu-item ${currentPage === "similar-claims" ? "active" : ""}`}
          onClick={() => onNavigate("similar-claims", selectedClaimId || "CLM001")}
        >
          <GitCompare size={17} />
          <span>Prior Claims Match</span>
        </button>

        <button
          className={`menu-item ${currentPage === "decision" ? "active" : ""}`}
          onClick={() => onNavigate("decision", selectedClaimId || "CLM001")}
        >
          <CheckSquare size={17} />
          <span>Adjudication & Audit</span>
        </button>

        <p className="menu-title">Analytics & Config</p>

        {/* Analytics */}
        <button
          className={`menu-item ${currentPage === "analytics" ? "active" : ""}`}
          onClick={() => onNavigate("analytics")}
        >
          <BarChart3 size={17} />
          <span>Risk Analytics</span>
        </button>

        {/* AI System Diagnostics */}
        <button
          className={`menu-item ${currentPage === "models" ? "active" : ""}`}
          onClick={() => onNavigate("models")}
        >
          <Cpu size={17} />
          <span>Vision Models</span>
        </button>

        {/* Settings */}
        <button
          className={`menu-item ${currentPage === "settings" ? "active" : ""}`}
          onClick={() => onNavigate("settings")}
        >
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </nav>

      {/* Adjuster Session Footer */}
      <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px" }}>
          <div className="pulse-dot" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.74rem", fontWeight: "600", color: "#e2e8f0" }}>Backend Connected</span>
            <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>SIU Investigation Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;