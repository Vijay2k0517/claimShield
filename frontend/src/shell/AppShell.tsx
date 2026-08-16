import React, { useState } from 'react';
import { Sidebar, NavItemId, NAV_ITEMS } from './Sidebar';
import { Header } from './Header';
import { X, Shield } from 'lucide-react';
import './Shell.css';

export interface AppShellProps {
  activeNav?: NavItemId;
  onNavChange?: (id: NavItemId) => void;
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeNav = 'dashboard',
  onNavChange,
  children,
  className = '',
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleNavClick = (id: NavItemId) => {
    if (onNavChange) onNavChange(id);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className={`cs-app-shell ${className}`.trim()}>
      {/* DESKTOP/TABLET SIDEBAR */}
      <Sidebar
        activeItem={activeNav}
        onNavigate={handleNavClick}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* MOBILE SLIDE-OUT DRAWER */}
      {isMobileDrawerOpen && (
        <>
          <div
            className="cs-mobile-drawer-backdrop"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="cs-mobile-drawer" role="dialog" aria-label="Mobile Navigation">
            <div className="cs-sidebar-brand" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="cs-sidebar-logo">
                  <Shield size={19} />
                </div>
                <span className="cs-sidebar-brand-title">ClaimShield AI</span>
              </div>
              <button
                type="button"
                className="cs-btn-ghost"
                onClick={() => setIsMobileDrawerOpen(false)}
                style={{ padding: '6px', borderRadius: '4px', display: 'grid', placeItems: 'center' }}
                aria-label="Close mobile navigation"
              >
                <X size={18} color="var(--cs-stone-400)" />
              </button>
            </div>

            <nav className="cs-sidebar-nav">
              <div className="cs-sidebar-nav-section-title">Navigation</div>
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`cs-sidebar-item ${isActive ? 'cs-sidebar-item-active' : ''} ${
                      item.disabled ? 'cs-sidebar-item-disabled' : ''
                    }`}
                    onClick={() => handleNavClick(item.id)}
                    disabled={item.disabled}
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
          </div>
        </>
      )}

      {/* MAIN WORKSTATION WRAPPER */}
      <div className="cs-main-wrapper">
        <Header onMobileMenuToggle={() => setIsMobileDrawerOpen(true)} />
        <main className="cs-main-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};
