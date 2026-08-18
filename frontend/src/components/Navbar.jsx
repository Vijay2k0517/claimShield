import { Search, Bell, ChevronRight, CheckCircle2 } from "lucide-react";

function Navbar({ currentPage = "dashboard", selectedClaimId, onNavigate }) {
  const getBreadcrumbTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return { section: "Overview", title: "Claims Dashboard" };
      case "claims":
        return { section: "Management", title: "Claims Directory" };
      case "new-claim":
        return { section: "Intake", title: "New Claim Intake" };
      case "investigation":
        return { section: "Investigation", title: `Case Overview ${selectedClaimId ? `(${selectedClaimId})` : ""}` };
      case "evidence":
        return { section: "Investigation", title: `Damage Photos & Heatmap ${selectedClaimId ? `(${selectedClaimId})` : ""}` };
      case "similar-claims":
        return { section: "Investigation", title: `Prior Claims Match ${selectedClaimId ? `(${selectedClaimId})` : ""}` };
      case "decision":
        return { section: "Investigation", title: `Adjudication Decision ${selectedClaimId ? `(${selectedClaimId})` : ""}` };
      case "analytics":
        return { section: "Reporting", title: "Risk & Fraud Analytics" };
      case "models":
        return { section: "System", title: "Vision Model Specifications" };
      case "settings":
        return { section: "Settings", title: "Platform & Profile Configuration" };
      default:
        return { section: "Overview", title: "Dashboard" };
    }
  };

  const breadcrumb = getBreadcrumbTitle();

  return (
    <header className="navbar">
      {/* Breadcrumb Path */}
      <div className="nav-left">
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem" }}>
          <span
            style={{ color: "var(--text-muted)", cursor: "pointer" }}
            onClick={() => onNavigate && onNavigate("dashboard")}
          >
            Claims
          </span>
          <ChevronRight size={13} style={{ color: "var(--text-dim)" }} />
          <span style={{ color: "var(--text-muted)" }}>
            {breadcrumb.section}
          </span>
          <ChevronRight size={13} style={{ color: "var(--text-dim)" }} />
          <strong style={{ color: "var(--text-primary)", fontWeight: "600" }}>
            {breadcrumb.title}
          </strong>
        </div>
      </div>

      {/* Global Controls & User Profile */}
      <div className="nav-right">
        {/* Global Search Bar */}
        <div className="nav-search">
          <Search size={15} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search claims, policies, vehicle plates..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim() && onNavigate) {
                onNavigate("claims");
              }
            }}
          />
          <kbd
            style={{
              background: "#f1f5f9",
              color: "var(--text-muted)",
              fontSize: "0.68rem",
              padding: "1px 5px",
              borderRadius: "4px",
              border: "1px solid #cbd5e1",
              fontFamily: "var(--font-mono)"
            }}
          >
            /
          </kbd>
        </div>

        {/* System Status Pill */}
        <div className="system-status-pill">
          <div className="pulse-dot" />
          <span>System Online</span>
        </div>

        {/* Notifications */}
        <button
          style={{
            position: "relative",
            background: "#ffffff",
            border: "1px solid var(--border-color)",
            color: "var(--text-secondary)",
            padding: "6px 8px",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-xs)"
          }}
          title="Notifications"
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: "3px",
              right: "3px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--risk-high)"
            }}
          />
        </button>

        {/* Adjuster Profile */}
        <div className="user-profile-badge">
          <div className="user-avatar">
            SJ
          </div>
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)" }}>
              Sarah Jenkins
            </span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
              SIU Specialist (INV-8402)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;