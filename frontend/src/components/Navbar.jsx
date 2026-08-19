import { useState, useEffect } from "react";
import {
  Shield,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  FileSearch,
  BarChart3,
  Search,
  Settings,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { getClaims } from "../services/api";

function Navbar({ currentPage = "dashboard", selectedClaimId, onNavigate }) {
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleNav = (page, claimId = null) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(page, claimId);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleNav("claims");
    }
  };

  const isInvestigationActive = ["investigation", "evidence", "similar-claims", "decision"].includes(currentPage);

  return (
    <header className="top-navbar">
      <div className="navbar-inner">
        {/* Brand & Organization */}
        <div className="navbar-brand" onClick={() => handleNav("dashboard")}>
          <div className="brand-logo-icon">
            <Shield size={19} />
          </div>
          <div className="brand-titles">
            <span className="brand-name">ClaimShield</span>
            <span className="brand-tag">AI FRAUD SIU</span>
          </div>
        </div>

        {/* Desktop Essential Navigation Links */}
        <nav className="navbar-links">
          {/* 1. Dashboard */}
          <button
            className={`nav-tab-btn ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => handleNav("dashboard")}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          {/* 2. Claims Directory */}
          <button
            className={`nav-tab-btn ${currentPage === "claims" ? "active" : ""}`}
            onClick={() => handleNav("claims")}
          >
            <ClipboardList size={15} />
            <span>Claims Directory</span>
            {flaggedCount > 0 && (
              <span className="nav-badge-pill">
                {flaggedCount}
              </span>
            )}
          </button>

          {/* 3. New Claim Intake */}
          <button
            className={`nav-tab-btn ${currentPage === "new-claim" ? "active" : ""}`}
            onClick={() => handleNav("new-claim")}
          >
            <PlusCircle size={15} />
            <span>Intake Claim</span>
          </button>

          {/* 4. Active Investigation (Contextual Case Tab) */}
          {(isInvestigationActive || selectedClaimId) && (
            <button
              className={`nav-tab-btn ${isInvestigationActive ? "active" : ""}`}
              onClick={() => handleNav("investigation", selectedClaimId || "CLM001")}
            >
              <FileSearch size={15} />
              <span>Active Case</span>
              {selectedClaimId && (
                <span className="nav-case-id-pill">
                  {selectedClaimId}
                </span>
              )}
            </button>
          )}

          {/* 5. Risk Analytics */}
          <button
            className={`nav-tab-btn ${currentPage === "analytics" ? "active" : ""}`}
            onClick={() => handleNav("analytics")}
          >
            <BarChart3 size={15} />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Global Controls & User Profile */}
        <div className="navbar-right">
          {/* Quick Search */}
          <div className="nav-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search claims or plates..."
            />
            <kbd className="search-kbd">/</kbd>
          </div>

          {/* AI Status Badge */}
          <div
            className="ai-engine-status"
            onClick={() => handleNav("models")}
            title="DamageVision PyTorch ResNet50 Engine Active"
          >
            <div className="ai-pulse-dot" />
            <span className="ai-status-text">ResNet50 Active</span>
          </div>

          {/* Settings Shortcut */}
          <button
            className={`nav-icon-btn ${currentPage === "settings" ? "active" : ""}`}
            onClick={() => handleNav("settings")}
            title="Platform Settings"
          >
            <Settings size={16} />
          </button>

          {/* User Profile Pill
          <div className="nav-user-pill">
            <div className="user-avatar-circle">SJ</div>
            <div className="user-info-text">
              <span className="user-name">Sarah J.</span>
              <span className="user-role">SIU Lead</span>
            </div>
          </div> */}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <button
            className={`mobile-nav-item ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => handleNav("dashboard")}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          <button
            className={`mobile-nav-item ${currentPage === "claims" ? "active" : ""}`}
            onClick={() => handleNav("claims")}
          >
            <ClipboardList size={16} />
            <span>Claims Directory</span>
            {flaggedCount > 0 && <span className="nav-badge-pill">{flaggedCount}</span>}
          </button>

          <button
            className={`mobile-nav-item ${currentPage === "new-claim" ? "active" : ""}`}
            onClick={() => handleNav("new-claim")}
          >
            <PlusCircle size={16} />
            <span>Intake New Claim</span>
          </button>

          <button
            className={`mobile-nav-item ${isInvestigationActive ? "active" : ""}`}
            onClick={() => handleNav("investigation", selectedClaimId || "CLM001")}
          >
            <FileSearch size={16} />
            <span>Investigation Workspace ({selectedClaimId || "CLM001"})</span>
          </button>

          <button
            className={`mobile-nav-item ${currentPage === "analytics" ? "active" : ""}`}
            onClick={() => handleNav("analytics")}
          >
            <BarChart3 size={16} />
            <span>Risk Analytics</span>
          </button>

          <button
            className={`mobile-nav-item ${currentPage === "settings" ? "active" : ""}`}
            onClick={() => handleNav("settings")}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;