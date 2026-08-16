import React, { useState } from 'react';
import { ToastProvider } from './design-system';
import { DesignSystemShowcase } from './showcase/DesignSystemShowcase';
import { ShellDemo } from './shell';
import { Layout, Palette } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'shell' | 'design-system'>('shell');

  return (
    <ToastProvider>
      {/* GLOBAL WORKSPACE VIEW SWITCHER BANNER */}
      <div
        style={{
          backgroundColor: '#04070d',
          borderBottom: '1px solid var(--cs-border-default)',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--cs-stone-400)',
          zIndex: 9999,
          position: 'sticky',
          top: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '1px 6px',
              borderRadius: '3px',
              backgroundColor: 'var(--cs-primary-subtle)',
              color: 'var(--cs-primary-text)',
              fontWeight: 600,
              fontFamily: 'var(--cs-font-mono)',
            }}
          >
            CLAIMSHIELD AI
          </span>
          <span>Phase 1 Refined & Phase 2 Application Shell</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Workstation Mode:
          </span>
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--cs-obsidian-900)',
              borderRadius: '4px',
              padding: '2px',
              border: '1px solid var(--cs-border-default)',
            }}
          >
            <button
              type="button"
              onClick={() => setCurrentView('shell')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: currentView === 'shell' ? 600 : 400,
                color: currentView === 'shell' ? '#ffffff' : 'var(--cs-stone-400)',
                backgroundColor: currentView === 'shell' ? 'var(--cs-primary)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Layout size={12} />
              <span>Phase 2 Application Shell</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('design-system')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: currentView === 'design-system' ? 600 : 400,
                color: currentView === 'design-system' ? '#ffffff' : 'var(--cs-stone-400)',
                backgroundColor: currentView === 'design-system' ? 'var(--cs-primary)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Palette size={12} />
              <span>/design-system Showcase</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE VIEW */}
      {currentView === 'shell' ? <ShellDemo /> : <DesignSystemShowcase />}
    </ToastProvider>
  );
};

export default App;
