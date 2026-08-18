import {
  LayoutDashboard,
  ClipboardList,
  FilePlus,
  BarChart3,
  Brain,
  Settings,
} from "lucide-react";

function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">C</div>

        <div>
          <h2>ClaimShield</h2>
          <span>AI</span>
        </div>
      </div>

      <nav className="sidebar-menu">

        <p className="menu-title">MAIN MENU</p>

        {/* Dashboard */}
        <button
          className={`menu-item ${
            currentPage === "dashboard" ? "active" : ""
          }`}
          onClick={() => onNavigate("dashboard")}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        {/* Claims Queue */}
        <button
          className={`menu-item ${
            currentPage === "claims" ? "active" : ""
          }`}
          onClick={() => onNavigate("claims")}
        >
          <ClipboardList size={20} />
          <span>Claims Queue</span>
        </button>

        {/* New Claim */}
        <button
          className={`menu-item ${
            currentPage === "new-claim" ? "active" : ""
          }`}
          onClick={() => onNavigate("new-claim")}
        >
          <FilePlus size={20} />
          <span>New Claim</span>
        </button>

        <p className="menu-title">ANALYSIS</p>

        {/* Analytics */}
        <button
          className={`menu-item ${
            currentPage === "analytics" ? "active" : ""
          }`}
          onClick={() => onNavigate("analytics")}
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </button>

        {/* Models */}
        <button
          className={`menu-item ${
            currentPage === "models" ? "active" : ""
          }`}
          onClick={() => onNavigate("models")}
        >
          <Brain size={20} />
          <span>Models</span>
        </button>

        <p className="menu-title">SYSTEM</p>

        {/* Settings */}
        <button
          className={`menu-item ${
            currentPage === "settings" ? "active" : ""
          }`}
          onClick={() => onNavigate("settings")}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>

      </nav>

      {/* System Status */}
      <div className="sidebar-bottom">

        <div className="system-status">

          <span className="status-dot"></span>

          <div>
            <strong>System Online</strong>
            <small>AI services operational</small>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;