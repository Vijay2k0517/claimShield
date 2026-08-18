import { Search, Bell, CircleUserRound } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>Welcome back, Investigator</p>
      </div>

      <div className="navbar-actions">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search claims..."
          />
        </div>

        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="system-indicator">
          <span></span>
          Online
        </div>

        <div className="profile">
          <CircleUserRound size={32} />
          <div>
            <strong>Investigator</strong>
            <small>Claims Officer</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;