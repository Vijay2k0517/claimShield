import {
  LayoutDashboard,
  ClipboardList,
  FilePlus,
  BarChart3,
  Brain,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">C</div>
        <div>
          <h2>ClaimShield</h2>
          <span>AI</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <p className="menu-title">MAIN MENU</p>

        <a href="#" className="menu-item active">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>

        <a href="#" className="menu-item">
          <ClipboardList size={20} />
          <span>Claims Queue</span>
        </a>

        <a href="#" className="menu-item">
          <FilePlus size={20} />
          <span>New Claim</span>
        </a>

        <p className="menu-title">ANALYSIS</p>

        <a href="#" className="menu-item">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </a>

        <a href="#" className="menu-item">
          <Brain size={20} />
          <span>Models</span>
        </a>

        <p className="menu-title">SYSTEM</p>

        <a href="#" className="menu-item">
          <Settings size={20} />
          <span>Settings</span>
        </a>
      </nav>

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