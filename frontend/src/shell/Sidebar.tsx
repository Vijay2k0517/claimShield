import React from 'react';
import {
  Shield,
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './Shell.css';

export type NavItemId =
  | 'dashboard'
  | 'claims'
  | 'new-claim'
  | 'analytics'
  | 'models'
  | 'settings';

export interface NavItemConfig {
  id: NavItemId;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarProps {
  activeItem?: NavItemId;
  onNavigate?: (id: NavItemId) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: 'claims',
    label: 'Claims Queue',
    icon: <FileText size={18} />,
    badge: 128,
  },
  {
    id: 'new-claim',
    label: 'New Claim Intake',
    icon: <PlusCircle size={18} />,
  },
  {
    id: 'analytics',
    label: 'Fraud Analytics',
    icon: <BarChart3 size={18} />,
  },
  {
    id: 'models',
    label: 'Model Ensembles',
    icon: <Cpu size={18} />,
    badge: 'v2.4',
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: <Settings size={18} />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = 'dashboard',
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
}) => {
  return (
    <aside
      className={`cs-sidebar ${isCollapsed ? 'cs-sidebar-collapsed' : ''} ${className}`.trim()}
      aria-label="Workstation main navigation"
    >
      {/* Brand Header */}
      <div className="cs-sidebar-brand">
        <div className="cs-sidebar-logo">
          <Shield size={19} />
        </div>
        <div className="cs-sidebar-brand-text">
          <span className="cs-sidebar-brand-title">ClaimShield AI</span>
          <span className="cs-sidebar-brand-badge">SIU Intelligence</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="cs-sidebar-nav" role="navigation">
        <div className="cs-sidebar-nav-section-title">Navigation</div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`cs-sidebar-item ${isActive ? 'cs-sidebar-item-active' : ''} ${
                item.disabled ? 'cs-sidebar-item-disabled' : ''
              }`}
              onClick={() => !item.disabled && onNavigate && onNavigate(item.id)}
              disabled={item.disabled}
              title={isCollapsed ? item.label : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="cs-sidebar-item-icon">{item.icon}</div>
              <span className="cs-sidebar-item-label">{item.label}</span>
              {item.badge && (
                <span className="cs-sidebar-item-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Collapse Toggle */}
      <div className="cs-sidebar-footer">
        <button
          type="button"
          className="cs-sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};
