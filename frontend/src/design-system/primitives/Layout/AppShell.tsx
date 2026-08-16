import React, { useState } from 'react';
import { Menu, ChevronLeft, Shield } from 'lucide-react';
import './Layout.css';

export interface AppShellProps {
  sidebarContent?: (collapsed: boolean) => React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
  brandName?: string;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  sidebarContent,
  headerContent,
  children,
  brandName = 'ClaimShield AI',
  className = '',
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`cs-app-shell ${className}`.trim()}>
      {sidebarContent && (
        <aside className={`cs-app-sidebar ${collapsed ? 'cs-collapsed' : ''}`}>
          <div
            style={{
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 var(--cs-space-4)',
              borderBottom: '1px solid var(--cs-border-default)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--cs-radius-sm)',
                  backgroundColor: 'var(--cs-primary)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <Shield size={16} />
              </div>
              {!collapsed && (
                <span
                  style={{
                    fontWeight: 'var(--cs-font-weight-bold)',
                    fontSize: 'var(--cs-text-size-body)',
                    letterSpacing: 'var(--cs-tracking-tight)',
                    color: 'var(--cs-text-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {brandName}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              style={{
                color: 'var(--cs-slate-400)',
                padding: '4px',
                borderRadius: 'var(--cs-radius-sm)',
              }}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--cs-space-3)' }}>
            {sidebarContent(collapsed)}
          </div>
        </aside>
      )}

      <div className="cs-app-main-wrapper">
        {headerContent && <header className="cs-app-header">{headerContent}</header>}
        <main className="cs-app-content">{children}</main>
      </div>
    </div>
  );
};
