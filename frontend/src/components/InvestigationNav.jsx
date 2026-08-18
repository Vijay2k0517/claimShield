import { FileText, Layers, GitCompare, CheckSquare } from "lucide-react";

/**
 * InvestigationNav Component
 * Provides clean, standardized, interactive sub-navigation tabs across all 4 investigation views.
 */
function InvestigationNav({ currentTab, claimId, similarCount = 0, onNavigate }) {
  const tabs = [
    {
      id: "investigation",
      label: "Case Overview",
      icon: <FileText size={15} />
    },
    {
      id: "evidence",
      label: "Damage Photos & Heatmap",
      icon: <Layers size={15} />
    },
    {
      id: "similar-claims",
      label: "Prior Claims Match",
      icon: <GitCompare size={15} />,
      badge: similarCount > 0 ? similarCount : null
    },
    {
      id: "decision",
      label: "Adjudication & Audit",
      icon: <CheckSquare size={15} />
    }
  ];

  return (
    <nav
      style={{
        display: "flex",
        gap: "4px",
        background: "#ffffff",
        padding: "4px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-xs)",
        width: "fit-content"
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate && onNavigate(tab.id, claimId)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "var(--radius-sm)",
              background: isActive ? "var(--bg-canvas)" : "transparent",
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: isActive ? "600" : "500",
              fontSize: "0.8rem",
              border: `1px solid ${isActive ? "var(--border-color)" : "transparent"}`,
              transition: "all var(--transition-fast)"
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontSize: "0.68rem",
                  padding: "1px 5px",
                  borderRadius: "999px",
                  fontWeight: "700"
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default InvestigationNav;
