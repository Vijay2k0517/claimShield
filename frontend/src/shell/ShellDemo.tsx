import React, { useState } from 'react';
import { AppShell } from './AppShell';
import { PageHeader } from './PageHeader';
import { Toolbar } from './Toolbar';
import { NavItemId } from './Sidebar';
import { Button, ButtonGroup, Input, Select, Badge, Breadcrumb } from '../design-system';
import { Download, SlidersHorizontal, RefreshCw, LayoutTemplate } from 'lucide-react';

export const ShellDemo: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavItemId>('dashboard');
  const [filterType, setFilterType] = useState('all');

  const navLabels: Record<NavItemId, string> = {
    dashboard: 'Workstation Overview',
    claims: 'Claims Management Queue',
    'new-claim': 'New Claim Intake & Analysis',
    analytics: 'Fraud Intelligence Analytics',
    models: 'Vision & NLP Model Registry',
    settings: 'Platform & Security Settings',
  };

  return (
    <AppShell activeNav={activeNav} onNavChange={setActiveNav}>
      {/* PAGE HEADER */}
      <PageHeader
        title={navLabels[activeNav]}
        subtitle="Workstation application frame demonstration validating shell geometry, responsiveness, and navigation."
        breadcrumbs={
          <Breadcrumb
            items={[
              { label: 'Workstation', href: '#' },
              { label: 'Application Frame' },
              { label: navLabels[activeNav] },
            ]}
          />
        }
        actions={
          <>
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />}>
              Refresh Frame
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Download size={14} />}>
              Export View
            </Button>
          </>
        }
      />

      {/* FILTER / ACTION TOOLBAR */}
      <div
        style={{
          backgroundColor: 'var(--cs-obsidian-900)',
          border: '1px solid var(--cs-border-default)',
          borderRadius: 'var(--cs-radius-lg)',
          padding: 'var(--cs-space-3) var(--cs-space-4)',
          marginBottom: 'var(--cs-space-5)',
        }}
      >
        <Toolbar
          left={
            <>
              <div style={{ width: '220px' }}>
                <Input placeholder="Filter entries..." size="sm" />
              </div>
              <div style={{ width: '180px' }}>
                <Select
                  options={[
                    { value: 'all', label: 'All Partitions' },
                    { value: 'recent', label: 'Recent Submissions' },
                    { value: 'archived', label: 'Archived Records' },
                  ]}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                />
              </div>
            </>
          }
          right={
            <ButtonGroup>
              <Button variant="secondary" size="sm" leftIcon={<SlidersHorizontal size={14} />}>
                Filter
              </Button>
              <Button variant="primary" size="sm">
                Apply Action
              </Button>
            </ButtonGroup>
          }
        />
      </div>

      {/* GENERIC WORKSTATION VALIDATION PANELS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--cs-space-4)',
          marginBottom: 'var(--cs-space-5)',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--cs-obsidian-900)',
            border: '1px solid var(--cs-border-default)',
            borderRadius: 'var(--cs-radius-lg)',
            padding: 'var(--cs-space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--cs-space-3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'var(--cs-font-weight-semibold)', fontSize: 'var(--cs-text-size-body)' }}>
              Workstation Canvas Partition A
            </span>
            <Badge variant="primary" size="sm" dot>Frame Active</Badge>
          </div>
          <p style={{ fontSize: 'var(--cs-text-size-body-sm)', color: 'var(--cs-stone-400)', lineHeight: '1.5' }}>
            Validates standard 1600px desktop workstation container boundaries, border geometry, typography contrast, and flex responsiveness.
          </p>
          <div
            style={{
              height: '140px',
              backgroundColor: 'var(--cs-obsidian-850)',
              border: '1px dashed var(--cs-obsidian-700)',
              borderRadius: 'var(--cs-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cs-stone-500)',
              fontSize: 'var(--cs-text-size-caption)',
              gap: '8px',
            }}
          >
            <LayoutTemplate size={18} />
            <span>Generic Panel Slot A (Future Product Screen Area)</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--cs-obsidian-900)',
            border: '1px solid var(--cs-border-default)',
            borderRadius: 'var(--cs-radius-lg)',
            padding: 'var(--cs-space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--cs-space-3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'var(--cs-font-weight-semibold)', fontSize: 'var(--cs-text-size-body)' }}>
              Workstation Canvas Partition B
            </span>
            <Badge variant="neutral" size="sm">Neutral Frame</Badge>
          </div>
          <p style={{ fontSize: 'var(--cs-text-size-body-sm)', color: 'var(--cs-stone-400)', lineHeight: '1.5' }}>
            Validates secondary panel layout rhythm without introducing unapproved Phase 3 dashboard or claims business logic.
          </p>
          <div
            style={{
              height: '140px',
              backgroundColor: 'var(--cs-obsidian-850)',
              border: '1px dashed var(--cs-obsidian-700)',
              borderRadius: 'var(--cs-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cs-stone-500)',
              fontSize: 'var(--cs-text-size-caption)',
              gap: '8px',
            }}
          >
            <LayoutTemplate size={18} />
            <span>Generic Panel Slot B (Future Product Screen Area)</span>
          </div>
        </div>
      </div>

      {/* FULL WIDTH GENERIC WORKSTATION CONTENT AREA */}
      <div
        style={{
          backgroundColor: 'var(--cs-obsidian-900)',
          border: '1px solid var(--cs-border-default)',
          borderRadius: 'var(--cs-radius-lg)',
          padding: 'var(--cs-space-5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--cs-space-3)' }}>
          <span style={{ fontWeight: 'var(--cs-font-weight-semibold)', fontSize: 'var(--cs-text-size-body)' }}>
            Workstation Primary Content Frame
          </span>
          <span style={{ fontSize: '11px', color: 'var(--cs-stone-500)', fontFamily: 'var(--cs-font-mono)' }}>
            BASELINE: 1440 × 900 • OBSIDIAN THEME
          </span>
        </div>
        <div
          style={{
            height: '240px',
            backgroundColor: 'var(--cs-obsidian-850)',
            border: '1px dashed var(--cs-obsidian-700)',
            borderRadius: 'var(--cs-radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cs-stone-400)',
            gap: '8px',
          }}
        >
          <LayoutTemplate size={24} />
          <span style={{ fontWeight: 'var(--cs-font-weight-medium)' }}>
            Neutral Workstation Content Frame (Phase 2 Verified)
          </span>
          <span style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-stone-500)', maxWidth: '440px', textAlign: 'center' }}>
            Future Phase 3 screens (Dashboard, Claims Queue, Investigation Workspace, Analytics, Models, Settings) will mount directly into this slot.
          </span>
        </div>
      </div>
    </AppShell>
  );
};
