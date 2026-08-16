import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, ShieldCheck, LogOut, ChevronDown, Sliders } from 'lucide-react';
import './Shell.css';

export interface UserProfileMenuProps {
  name?: string;
  role?: string;
  avatarInitials?: string;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  name = 'Arthur Vance',
  role = 'Lead SIU Analyst',
  avatarInitials = 'AV',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="cs-user-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User profile and settings menu"
        aria-expanded={isOpen}
      >
        <div className="cs-user-avatar">{avatarInitials}</div>
        <div className="cs-user-meta">
          <span className="cs-user-name">{name}</span>
          <span className="cs-user-role">{role}</span>
        </div>
        <ChevronDown size={14} color="var(--cs-stone-400)" />
      </button>

      {isOpen && (
        <div className="cs-user-dropdown" role="menu">
          <div style={{ padding: 'var(--cs-space-2) var(--cs-space-3)' }}>
            <div style={{ fontSize: '11px', fontWeight: 'var(--cs-font-weight-semibold)', color: 'var(--cs-text-primary)' }}>
              {name}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--cs-stone-400)' }}>
              Regional Fraud & Forensic Unit
            </div>
          </div>

          <div className="cs-user-dropdown-divider" />

          <button type="button" className="cs-user-dropdown-item" role="menuitem">
            <User size={14} />
            <span>Investigator Profile</span>
          </button>
          <button type="button" className="cs-user-dropdown-item" role="menuitem">
            <Sliders size={14} />
            <span>Analysis Preferences</span>
          </button>
          <button type="button" className="cs-user-dropdown-item" role="menuitem">
            <ShieldCheck size={14} />
            <span>Compliance & Audit Trail</span>
          </button>
          <button type="button" className="cs-user-dropdown-item" role="menuitem">
            <Settings size={14} />
            <span>System Settings</span>
          </button>

          <div className="cs-user-dropdown-divider" />

          <button type="button" className="cs-user-dropdown-item cs-logout" role="menuitem">
            <LogOut size={14} />
            <span>Sign Out Workstation</span>
          </button>
        </div>
      )}
    </div>
  );
};
