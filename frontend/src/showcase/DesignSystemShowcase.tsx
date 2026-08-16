import React, { useState } from 'react';
import {
  Shield,
  Layers,
  SlidersHorizontal,
  Zap,
  Eye,
  Sliders,
  HelpCircle,
  Bell,
} from 'lucide-react';

import {
  Button,
  ButtonGroup,
  Input,
  SearchInput,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
  FileUpload,
  FormField,
  Badge,
  RiskBadge,
  StatusBadge,
  SeverityIndicator,
  ConfidenceIndicator,
  ProgressIndicator,
  KPI,
  StatBlock,
  Metric,
  DataTable,
  ColumnDef,
  Tabs,
  Tooltip,
  Popover,
  Drawer,
  Dialog,
  Accordion,
  Alert,
  Skeleton,
  Spinner,
  EmptyState,
  ErrorState,
  useToast,
  PageContainer,
  Stack,
  Grid,
  Section,
  Toolbar,
  DataLabel,
  FraudProbability,
  AIRecommendation,
  ConfidenceMeter,
  AIProcessingState,
  AnomalyList,
  FeatureImportance,
  EvidenceViewer,
  EvidenceGallery,
  HeatmapOverlay,
  ImageComparison,
  SimilarClaimCard,
  ClaimComparison,
  RiskLevel,
  XAIMode,
  ProcessingStateMode,
} from '../design-system';

import {
  MOCK_DAMAGE_IMAGE_1,
  MOCK_HEATMAP_IMAGE,
  MOCK_HISTORICAL_IMAGE,
  MOCK_DAMAGE_IMAGE_2,
} from './mockEvidence';
import './showcase.css';

interface DemoClaim {
  id: string;
  policyholder: string;
  vin: string;
  vehicle: string;
  lossDate: string;
  lossEstimate: number;
  fraudProb: number;
  riskLevel: RiskLevel;
  status: 'NEW' | 'TRIAGE' | 'UNDER_INVESTIGATION' | 'ADJUDICATED' | 'ESCALATED' | 'CLOSED';
}

const DEMO_CLAIMS: DemoClaim[] = [
  {
    id: 'CLM-88421',
    policyholder: 'Arthur Vance',
    vin: '1HGCR2F83HA029184',
    vehicle: '2024 Honda Civic Sport',
    lossDate: '2026-08-12',
    lossEstimate: 14250,
    fraudProb: 87,
    riskLevel: 'HIGH',
    status: 'ESCALATED',
  },
  {
    id: 'CLM-88422',
    policyholder: 'Sarah Jenkins',
    vin: '4T1B11HK5JU109482',
    vehicle: '2023 Toyota Camry SE',
    lossDate: '2026-08-13',
    lossEstimate: 4800,
    fraudProb: 46,
    riskLevel: 'REVIEW',
    status: 'UNDER_INVESTIGATION',
  },
  {
    id: 'CLM-88423',
    policyholder: 'Michael Chen',
    vin: '3FATP4EJ9HM291048',
    vehicle: '2022 Ford F-150 XLT',
    lossDate: '2026-08-14',
    lossEstimate: 2100,
    fraudProb: 12,
    riskLevel: 'LOW',
    status: 'ADJUDICATED',
  },
  {
    id: 'CLM-88424',
    policyholder: 'Elena Rostova',
    vin: 'WAUZZZF27NA019482',
    vehicle: '2025 Audi Q5 Premium',
    lossDate: '2026-08-14',
    lossEstimate: 18900,
    fraudProb: 91,
    riskLevel: 'HIGH',
    status: 'NEW',
  },
  {
    id: 'CLM-88425',
    policyholder: 'David K. Miller',
    vin: '5N1AT2MV8KC719402',
    vehicle: '2021 Nissan Rogue SV',
    lossDate: '2026-08-15',
    lossEstimate: 6200,
    fraudProb: 38,
    riskLevel: 'REVIEW',
    status: 'TRIAGE',
  },
];

export const DesignSystemShowcase: React.FC = () => {
  const { showToast } = useToast();

  // Navigation tabs for showcase sections matching Phase 1 Enhancement specs
  const [activeSection, setActiveSection] = useState<string>('foundations');

  // Interactive controls state
  const [btnLoading, setBtnLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedMulti, setSelectedMulti] = useState<string[]>(['collision', 'tampering']);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [tableDensity, setTableDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>(['CLM-88421']);

  // Overlays state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Evidence state
  const [xaiMode, setXaiMode] = useState<XAIMode>('OVERLAY');
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.7);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState('1');

  // AI Pipeline Simulator state
  const [pipelineMode, setPipelineMode] = useState<ProcessingStateMode>('PROCESSING');

  const navTabs = [
    { id: 'foundations', label: 'FOUNDATIONS', icon: <Layers size={14} /> },
    { id: 'primitives', label: 'PRIMITIVES', icon: <SlidersHorizontal size={14} /> },
    { id: 'ai', label: 'AI & EXPLAINABILITY', icon: <Zap size={14} /> },
    { id: 'evidence', label: 'VISUAL EVIDENCE', icon: <Eye size={14} /> },
    { id: 'states', label: 'STATES & FEEDBACK', icon: <Sliders size={14} /> },
  ];

  const tableColumns: ColumnDef<DemoClaim>[] = [
    {
      id: 'id',
      header: 'Claim ID',
      accessorKey: 'id',
      sortable: true,
      isMono: true,
      cell: ({ value }) => (
        <span style={{ fontWeight: 'var(--cs-font-weight-semibold)', color: 'var(--cs-primary-text)' }}>
          {value}
        </span>
      ),
    },
    {
      id: 'policyholder',
      header: 'Policyholder',
      accessorKey: 'policyholder',
      sortable: true,
    },
    {
      id: 'vehicle',
      header: 'Vehicle Details',
      accessorKey: 'vehicle',
      cell: ({ row }) => (
        <div>
          <div>{row.vehicle}</div>
          <div style={{ fontSize: '10px', color: 'var(--cs-stone-500)', fontFamily: 'var(--cs-font-mono)' }}>
            VIN: {row.vin}
          </div>
        </div>
      ),
    },
    {
      id: 'lossEstimate',
      header: 'Loss Estimate',
      accessorKey: 'lossEstimate',
      sortable: true,
      isMono: true,
      cell: ({ value }) => <span>${Number(value).toLocaleString()}</span>,
    },
    {
      id: 'fraudProb',
      header: 'Fraud Probability',
      accessorKey: 'fraudProb',
      sortable: true,
      cell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RiskBadge level={row.riskLevel} score={row.fraudProb} />
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Claim Status',
      accessorKey: 'status',
      cell: ({ value }) => <StatusBadge status={value} size="sm" />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            showToast({
              title: `Viewing Claim ${row.id}`,
              message: `Opened target claim context for ${row.policyholder}`,
              variant: 'info',
            });
          }}
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* SHOWCASE HEADER */}
      <header className="cs-showcase-header">
        <div>
          <div className="cs-showcase-title">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--cs-radius-md)',
                backgroundColor: 'var(--cs-primary)',
                display: 'grid',
                placeItems: 'center',
                color: '#ffffff',
              }}
            >
              <Shield size={22} />
            </div>
            <span>ClaimShield AI — Visual Specification & Design System</span>
          </div>
          <p className="cs-showcase-desc">
            Obsidian + Arctic Blue + Soft Stone design system specification for ClaimShield AI Enterprise Insurance Fraud Intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Badge variant="primary" size="lg" dot>
            Phase 1 Refined • Obsidian Palette
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Bell size={14} />}
            onClick={() =>
              showToast({
                title: 'System Notification Test',
                message: 'All design tokens and primitives compiled successfully.',
                variant: 'success',
              })
            }
          >
            Trigger Toast
          </Button>
        </div>
      </header>

      {/* STICKY NAVIGATION TABS */}
      <nav className="cs-showcase-nav">
        <Tabs
          tabs={navTabs}
          activeTab={activeSection}
          onChange={setActiveSection}
          variant="boxed"
        />
      </nav>

      {/* 1. FOUNDATIONS */}
      {activeSection === 'foundations' && (
        <section className="cs-showcase-section">
          <Section
            title="1. Foundations & Tokens"
            subtitle="Obsidian surfaces, Arctic Blue brand actions, restrained risk semantics, and high-density typography."
          >
            {/* COLOR SYSTEM */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Foundation & Surface Tokens (Obsidian & Graphite)</div>
              <div className="cs-showcase-box-desc">
                Near-black blue canvas and warm graphite surfaces prevent eye strain and create high-contrast legibility.
              </div>
              <div className="cs-color-swatch-grid">
                {[
                  { name: 'Canvas Base', token: '--cs-bg-base', hex: '#070a11 (Obsidian 950)', color: 'var(--cs-bg-base)' },
                  { name: 'Surface Panel', token: '--cs-bg-surface', hex: '#0b0f19 (Obsidian 900)', color: 'var(--cs-bg-surface)' },
                  { name: 'Elevated Cards', token: '--cs-bg-elevated', hex: '#111624 (Graphite 850)', color: 'var(--cs-bg-elevated)' },
                  { name: 'Subtle Containers', token: '--cs-bg-subtle', hex: '#171e31 (Graphite 800)', color: 'var(--cs-bg-subtle)' },
                  { name: 'Border Default', token: '--cs-border-default', hex: '#1b2438', color: 'var(--cs-border-default)' },
                  { name: 'Primary Action', token: '--cs-primary', hex: '#0284c7 (Arctic Blue)', color: 'var(--cs-primary)' },
                ].map((s) => (
                  <div key={s.token} className="cs-swatch">
                    <div className="cs-swatch-preview" style={{ backgroundColor: s.color }} />
                    <div className="cs-swatch-info">
                      <div className="cs-swatch-name">{s.name}</div>
                      <div className="cs-swatch-val">{s.token}</div>
                      <div className="cs-swatch-val">{s.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RISK SEMANTIC COLORS */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Risk Level Tokens (Muted Mint / Amber / Coral-Red)</div>
              <div className="cs-showcase-box-desc">
                Soft tinted backgrounds and subtle borders communicate risk priority without aggressive fluorescent glow.
              </div>
              <div className="cs-color-swatch-grid">
                {[
                  { name: 'LOW Risk (Success)', token: '--cs-risk-low', hex: '#10b981 (Muted Mint)', color: 'var(--cs-success)' },
                  { name: 'REVIEW Risk (Warning)', token: '--cs-risk-review', hex: '#f59e0b (Amber)', color: 'var(--cs-warning)' },
                  { name: 'HIGH Risk (Danger)', token: '--cs-risk-high', hex: '#f43f5e (Coral Rose)', color: 'var(--cs-danger)' },
                  { name: 'AI Cyan Accent', token: '--cs-cyan', hex: '#06b6d4 (Cool Cyan)', color: 'var(--cs-cyan)' },
                ].map((s) => (
                  <div key={s.token} className="cs-swatch">
                    <div className="cs-swatch-preview" style={{ backgroundColor: s.color }} />
                    <div className="cs-swatch-info">
                      <div className="cs-swatch-name">{s.name}</div>
                      <div className="cs-swatch-val">{s.token}</div>
                      <div className="cs-swatch-val">{s.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TYPOGRAPHY SPECIMENS */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Typography System (Inter & Tabular Numerals)</div>
              <div className="cs-showcase-box-desc">
                Calibrated for 1440 × 900 desktop workstations. Stable tabular figures prevent numeric shifting.
              </div>
              <Stack gap="var(--cs-space-3)">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', borderBottom: '1px solid var(--cs-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ width: '140px', fontSize: '11px', color: 'var(--cs-stone-400)', textTransform: 'uppercase' }}>KPI / Value</span>
                  <span className="cs-tabular-nums" style={{ fontSize: 'var(--cs-text-size-kpi)', fontWeight: 'bold', color: 'var(--cs-text-primary)' }}>
                    87.4% • ₹4,82,000 • CLM-88421
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', borderBottom: '1px solid var(--cs-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ width: '140px', fontSize: '11px', color: 'var(--cs-stone-400)', textTransform: 'uppercase' }}>H1 Screen Title</span>
                  <span style={{ fontSize: 'var(--cs-text-size-h1)', fontWeight: '600', color: 'var(--cs-text-primary)' }}>
                    Investigation Workspace — Claim #88421
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', borderBottom: '1px solid var(--cs-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ width: '140px', fontSize: '11px', color: 'var(--cs-stone-400)', textTransform: 'uppercase' }}>H2 Panel Title</span>
                  <span style={{ fontSize: 'var(--cs-text-size-h2)', fontWeight: '600', color: 'var(--cs-text-primary)' }}>
                    AI Visual Damage Heatmap & Bounding Boxes
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', borderBottom: '1px solid var(--cs-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ width: '140px', fontSize: '11px', color: 'var(--cs-stone-400)', textTransform: 'uppercase' }}>Body Text</span>
                  <span style={{ fontSize: 'var(--cs-text-size-body)', color: 'var(--cs-stone-300)' }}>
                    Visual inspection detects pre-existing oxidation inconsistent with the reported loss timestamp of August 12, 2026.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                  <span style={{ width: '140px', fontSize: '11px', color: 'var(--cs-stone-400)', textTransform: 'uppercase' }}>Technical Metadata</span>
                  <span style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-stone-400)', fontFamily: 'var(--cs-font-mono)' }}>
                    VIN: 1HGCR2F83HA029184 • LAT: 33.7490° N • TIME: 2026-08-12 14:22:18 UTC
                  </span>
                </div>
              </Stack>
            </div>
          </Section>
        </section>
      )}

      {/* 2. PRIMITIVES */}
      {activeSection === 'primitives' && (
        <section className="cs-showcase-section">
          <Section
            title="2. Reusable Primitives"
            subtitle="Buttons, form controls, risk badges, KPI widgets, data tables, and overlays."
          >
            {/* BUTTONS */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Button System</div>
              <div className="cs-showcase-box-desc">
                Clear hierarchy: Arctic Blue primary actions, warm graphite secondary, and restrained danger buttons.
              </div>
              <Stack gap="var(--cs-space-4)">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <Button variant="primary">Primary Action</Button>
                  <Button variant="secondary">Secondary Action</Button>
                  <Button variant="outline">Outline Action</Button>
                  <Button variant="ghost">Ghost Action</Button>
                  <Button variant="danger">Escalate Threat</Button>
                  <Button variant="danger-subtle">Flag Anomaly</Button>
                  <Button variant="success-subtle">Approve Claim</Button>
                  <Button disabled>Disabled Action</Button>
                  <Button
                    variant="primary"
                    isLoading={btnLoading}
                    onClick={() => {
                      setBtnLoading(true);
                      setTimeout(() => setBtnLoading(false), 1500);
                    }}
                  >
                    {btnLoading ? 'Processing...' : 'Simulate Loading'}
                  </Button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-stone-400)' }}>Sizes:</span>
                  <Button variant="secondary" size="sm">Small (28px)</Button>
                  <Button variant="secondary" size="md">Medium (34px)</Button>
                  <Button variant="secondary" size="lg">Large (40px)</Button>
                  <ButtonGroup>
                    <Button variant="secondary" size="sm">Day</Button>
                    <Button variant="primary" size="sm">Week</Button>
                    <Button variant="secondary" size="sm">Month</Button>
                  </ButtonGroup>
                </div>
              </Stack>
            </div>

            {/* FORMS */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Form Controls & Validation States</div>
              <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="var(--cs-space-4)">
                <FormField id="claim-id" label="Claim Number" required helperText="Assigned by intake system">
                  <Input
                    id="claim-id"
                    placeholder="CLM-88421"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </FormField>

                <FormField id="search-vin" label="Global Triage Search">
                  <SearchInput
                    id="search-vin"
                    placeholder="Search VIN, Policy # or Name..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onClear={() => setSearchValue('')}
                    shortcut="⌘K"
                  />
                </FormField>

                <FormField id="claim-type" label="Claim Policy Type">
                  <Select
                    id="claim-type"
                    options={[
                      { value: 'comprehensive', label: 'Comprehensive Auto Coverage' },
                      { value: 'collision', label: 'Collision Damage' },
                      { value: 'liability', label: 'Third-Party Liability' },
                    ]}
                  />
                </FormField>

                <FormField id="loss-date" label="Reported Date of Loss" required>
                  <DatePicker id="loss-date" defaultValue="2026-08-12" />
                </FormField>

                <FormField id="anomalies-select" label="Target Investigation Flags">
                  <MultiSelect
                    options={[
                      { value: 'collision', label: 'Impact Mismatch' },
                      { value: 'tampering', label: 'Metadata Tampering' },
                      { value: 'odometer', label: 'Odometer Inconsistency' },
                      { value: 'historical', label: 'Duplicate Image Match' },
                    ]}
                    value={selectedMulti}
                    onChange={setSelectedMulti}
                  />
                </FormField>

                <FormField id="error-demo" label="Loss Estimate Amount ($)" error="Loss amount exceeds maximum policy coverage threshold of $25,000.">
                  <Input id="error-demo" isError defaultValue="38,400" />
                </FormField>
              </Grid>

              <div style={{ marginTop: 'var(--cs-space-4)' }}>
                <FormField label="Investigator Reason & Audit Notes" helperText="Mandatory for audit trail integrity">
                  <Textarea placeholder="Document detailed evidence reasoning before escalating or adjudicating..." rows={3} />
                </FormField>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: 'var(--cs-space-4)', alignItems: 'center' }}>
                <Checkbox label="Require SIU Senior Analyst Co-sign" defaultChecked />
                <Checkbox label="Send Automated Fraud Alert to Underwriter" />
                <Radio label="Fast-Track Adjudication" name="adjudication-type" defaultChecked />
                <Radio label="Full Forensic Queue" name="adjudication-type" />
                <Switch
                  label="High-Sensitivity Vision Anomaly Model"
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                />
              </div>

              <div style={{ marginTop: 'var(--cs-space-5)' }}>
                <FormField label="Vehicle Damage Evidence Dropzone">
                  <FileUpload />
                </FormField>
              </div>
            </div>

            {/* BADGES & RISK */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Risk Badges & Status Indicators</div>
              <Stack gap="var(--cs-space-3)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <RiskBadge level="LOW" size="lg" score={12} />
                  <RiskBadge level="REVIEW" size="lg" score={48} />
                  <RiskBadge level="HIGH" size="lg" score={87} />
                  <span style={{ color: 'var(--cs-stone-500)' }}>|</span>
                  <RiskBadge level="LOW" size="md" />
                  <RiskBadge level="REVIEW" size="md" />
                  <RiskBadge level="HIGH" size="md" />
                  <span style={{ color: 'var(--cs-stone-500)' }}>|</span>
                  <StatusBadge status="NEW" />
                  <StatusBadge status="TRIAGE" />
                  <StatusBadge status="UNDER_INVESTIGATION" />
                  <StatusBadge status="ESCALATED" />
                  <StatusBadge status="ADJUDICATED" />
                  <StatusBadge status="CLOSED" />
                  <Badge variant="cyan" size="md" dot>AI Flagged</Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <SeverityIndicator severity="low" />
                  <SeverityIndicator severity="medium" />
                  <SeverityIndicator severity="high" />
                  <SeverityIndicator severity="critical" />
                  <ConfidenceIndicator confidence={94} showBar />
                  <div style={{ width: 120 }}>
                    <ProgressIndicator value={75} />
                  </div>
                </div>
              </Stack>
            </div>

            {/* KPI WIDGETS */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">KPI Cards & Stat Blocks</div>
              <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="var(--cs-space-3)">
                <KPI
                  title="High-Risk Claims Queue"
                  value="128"
                  subtitle="Awaiting SIU Action"
                  trend={{ value: '+14.2%', direction: 'negative', label: 'vs last week' }}
                  badge={<RiskBadge level="HIGH" size="sm" showLabel={false} />}
                />
                <KPI
                  title="AI Detection Precision"
                  value="94.6%"
                  subtitle="False Positive Rate: 2.1%"
                  trend={{ value: '+1.8%', direction: 'positive', label: 'vs model v2.3' }}
                />
                <KPI
                  title="Estimated Fraud Exposure"
                  value="$1,482,000"
                  subtitle="Across 42 Flagged Claims"
                  trend={{ value: '-8.4%', direction: 'positive', label: 'prevented losses' }}
                />
                <KPI
                  title="Loading State"
                  value="--"
                  isLoading
                />
              </Grid>

              <div style={{ marginTop: 'var(--cs-space-4)' }}>
                <Grid columns="repeat(auto-fit, minmax(180px, 1fr))" gap="var(--cs-space-3)">
                  <StatBlock label="Average Triage Velocity" value="4.2 mins" hint="Target: < 5.0 mins" variant="success" />
                  <StatBlock label="Duplicate Image Matches" value="18 Claims" hint="Historical vector store" variant="warning" />
                  <StatBlock label="Critical Severity Flags" value="7 Urgent" hint="Immediate escalation" variant="danger" />
                  <Metric title="Active Models" value="4 Online" description="All pipelines operational" />
                </Grid>
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Enterprise Data Table</div>
              <Toolbar
                left={
                  <span style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-stone-400)' }}>
                    Selected: <strong>{selectedClaimIds.length}</strong> claims
                  </span>
                }
                right={
                  <ButtonGroup>
                    <Button
                      variant={tableDensity === 'comfortable' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setTableDensity('comfortable')}
                    >
                      Comfortable
                    </Button>
                    <Button
                      variant={tableDensity === 'compact' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setTableDensity('compact')}
                    >
                      Compact
                    </Button>
                  </ButtonGroup>
                }
              />

              <DataTable
                data={DEMO_CLAIMS}
                columns={tableColumns}
                density={tableDensity}
                selectable
                selectedIds={selectedClaimIds}
                onSelectChange={setSelectedClaimIds}
                getRowId={(r) => r.id}
                pageSize={5}
              />
            </div>

            {/* OVERLAYS & DRAWERS */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Contextual Drawers, Dialogs, Accordions & Tooltips</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>
                  Open Slide-Over Investigation Drawer
                </Button>
                <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
                  Open Confirmation Dialog
                </Button>
                <Tooltip content="EXIF data extracted from vehicle camera header">
                  <Button variant="outline" size="sm" leftIcon={<HelpCircle size={14} />}>
                    Hover for Tooltip
                  </Button>
                </Tooltip>
                <Popover
                  trigger={<Button variant="secondary" size="sm">Context Popover</Button>}
                  content={<div style={{ fontSize: '12px', color: 'var(--cs-stone-300)' }}>Model: Vision Classifier v2.4</div>}
                />
              </div>

              <div style={{ marginTop: 'var(--cs-space-4)' }}>
                <Accordion
                  items={[
                    {
                      id: 'exif',
                      title: 'EXIF Metadata Analysis',
                      badge: <Badge variant="info" size="sm">Camera Match</Badge>,
                      content: 'EXIF timestamp confirms photo taken on 2026-08-12 at 14:22:18 UTC with SONY-IMX890 sensor.',
                    },
                    {
                      id: 'corrosion',
                      title: 'Pre-existing Corrosion Verification',
                      badge: <Badge variant="danger" size="sm">High Anomaly</Badge>,
                      content: 'Oxidation depth exceeds 3 months, indicating damage occurred prior to reported policy inception.',
                    },
                  ]}
                />
              </div>

              {/* DEMO DRAWER */}
              <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Contextual Investigation — Claim #88421"
                size="lg"
                footer={
                  <>
                    <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>Close Panel</Button>
                    <Button variant="danger" onClick={() => setIsDrawerOpen(false)}>Escalate to SIU</Button>
                  </>
                }
              >
                <Stack gap="var(--cs-space-4)">
                  <Alert variant="warning" title="Potential Staged Damage Pattern">
                    Computer vision identified identical front bumper crumple characteristics to prior claim #CLM-44012.
                  </Alert>
                  <Grid columns={2} gap="var(--cs-space-3)">
                    <DataLabel label="Policyholder" value="Arthur Vance" />
                    <DataLabel label="Vehicle VIN" value="1HGCR2F83HA029184" isMono />
                    <DataLabel label="Loss Date" value="2026-08-12" isMono />
                    <DataLabel label="Estimated Claim" value="$14,250.00" isMono />
                  </Grid>
                </Stack>
              </Drawer>

              {/* DEMO DIALOG */}
              <Dialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Confirm Investigator Adjudication"
                footer={
                  <>
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setIsDialogOpen(false)}>Confirm Decision</Button>
                  </>
                }
              >
                <p style={{ color: 'var(--cs-stone-300)', marginBottom: '12px' }}>
                  You are about to record a formal human adjudication for <strong>Claim #88421</strong>.
                </p>
                <FormField label="Reason Summary" required>
                  <Textarea placeholder="Explain evidence justification..." rows={2} />
                </FormField>
              </Dialog>
            </div>
          </Section>
        </section>
      )}

      {/* 3. AI & EXPLAINABILITY */}
      {activeSection === 'ai' && (
        <section className="cs-showcase-section">
          <Section
            title="3. Explainable AI (XAI) Primitives"
            subtitle="Serious analytical tools: fraud probabilities, confidence metrics, and feature weights."
          >
            {/* PROBABILITY HERO */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Fraud Probability Indicators (All Risk States)</div>
              <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="var(--cs-space-4)">
                <FraudProbability score={87} riskLevel="HIGH" confidence={94} />
                <FraudProbability score={46} riskLevel="REVIEW" confidence={81} />
                <FraudProbability score={12} riskLevel="LOW" confidence={98} />
              </Grid>
            </div>

            {/* RECOMMENDATION BANNER */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">AI Recommendation Banners (Non-Authoritative)</div>
              <Stack gap="var(--cs-space-3)">
                <AIRecommendation
                  recommendation="MANUAL_INVESTIGATION"
                  rationale="High probability of pre-existing front bumper damage combined with duplicate collision photo signature matching historical claim CLM-44012."
                  anomalyTags={['Impact Direction Mismatch', 'Pre-existing Corrosion', 'Historical Photo Match (92%)']}
                />
                <AIRecommendation
                  recommendation="FAST_TRACK_APPROVAL"
                  rationale="Damage characteristics match police report impact vector. Zero historical duplicate matches detected."
                  anomalyTags={['Verified OEM Part Match', 'EXIF Geolocation Confirmed']}
                />
              </Stack>
            </div>

            {/* CONFIDENCE & FEATURE WEIGHTS */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Model Confidence vs. Feature Weights</div>
              <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="var(--cs-space-4)">
                <Stack gap="var(--cs-space-3)">
                  <ConfidenceMeter confidenceScore={94} sampleSize={12500} />
                  <ConfidenceMeter confidenceScore={68} sampleSize={4200} />
                </Stack>
                <FeatureImportance
                  features={[
                    { name: 'Damage Vector Direction Mismatch', weight: 0.38 },
                    { name: 'Historical Image Embedding Similarity', weight: 0.32 },
                    { name: 'Corrosion Age vs Date of Loss Delta', weight: 0.24 },
                    { name: 'Odometer Mileage Discrepancy', weight: -0.15 },
                    { name: 'Police Report Weather Match', weight: -0.22 },
                  ]}
                />
              </Grid>
            </div>

            {/* AI PIPELINE SIMULATOR */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Multi-Step AI Pipeline Tracker</div>
              <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button variant={pipelineMode === 'READY' ? 'primary' : 'secondary'} size="sm" onClick={() => setPipelineMode('READY')}>READY</Button>
                <Button variant={pipelineMode === 'PROCESSING' ? 'primary' : 'secondary'} size="sm" onClick={() => setPipelineMode('PROCESSING')}>PROCESSING</Button>
                <Button variant={pipelineMode === 'SUCCESS' ? 'primary' : 'secondary'} size="sm" onClick={() => setPipelineMode('SUCCESS')}>SUCCESS</Button>
                <Button variant={pipelineMode === 'FAILURE' ? 'primary' : 'secondary'} size="sm" onClick={() => setPipelineMode('FAILURE')}>FAILURE</Button>
              </div>

              <AIProcessingState
                mode={pipelineMode}
                onStartAnalysis={() => setPipelineMode('PROCESSING')}
                onRetry={() => setPipelineMode('PROCESSING')}
              />
            </div>

            {/* ANOMALY LIST */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Detected Risk Factors & Anomaly Checklist</div>
              <AnomalyList
                anomalies={[
                  {
                    id: '1',
                    title: 'Impact Direction Inconsistency',
                    category: 'Visual',
                    severity: 'high',
                    description: 'Front crumple lines indicate top-down force rather than horizontal collision in loss statement.',
                    evidenceReference: 'IMG-88421-A1',
                  },
                  {
                    id: '2',
                    title: 'Pre-existing Metal Corrosion',
                    category: 'Visual',
                    severity: 'critical',
                    description: 'Severe rust present in internal bumper beam indicative of damage older than 90 days.',
                    evidenceReference: 'IMG-88421-A2',
                  },
                ]}
              />
            </div>
          </Section>
        </section>
      )}

      {/* 4. VISUAL EVIDENCE */}
      {activeSection === 'evidence' && (
        <section className="cs-showcase-section">
          <Section
            title="4. Vehicle Evidence & Visual Inspection"
            subtitle="High-resolution damage canvas, explainable AI heatmap layer blending, and split-slider comparison."
          >
            {/* EVIDENCE VIEWER */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Interactive Vehicle Damage & AI Heatmap Viewer</div>
              <div style={{ marginBottom: 'var(--cs-space-3)' }}>
                <HeatmapOverlay
                  mode={xaiMode}
                  onModeChange={setXaiMode}
                  opacity={heatmapOpacity}
                  onOpacityChange={setHeatmapOpacity}
                />
              </div>

              <EvidenceViewer
                imageUrl={MOCK_DAMAGE_IMAGE_1}
                heatmapUrl={MOCK_HEATMAP_IMAGE}
                xaiMode={xaiMode}
                heatmapOpacity={heatmapOpacity}
                metadataTag="CLAIM #88421 • EVIDENCE ITEM 1 OF 4 • 2026-08-12 14:22:18 UTC"
                boundingBoxes={[
                  { id: 'b1', x: 75, y: 48, width: 18, height: 28, label: 'Primary Collision Deformation (Flagged)', severity: 'high' },
                  { id: 'b2', x: 26, y: 44, width: 12, height: 16, label: 'Pre-existing Wear', severity: 'medium' },
                ]}
              />

              <div style={{ marginTop: 'var(--cs-space-3)' }}>
                <EvidenceGallery
                  items={[
                    { id: '1', imageUrl: MOCK_DAMAGE_IMAGE_1, label: 'Front Right Bumper', tag: 'Front 3/4', riskLevel: 'HIGH' },
                    { id: '2', imageUrl: MOCK_DAMAGE_IMAGE_2, label: 'Odometer & Dash', tag: 'Dash EXIF', riskLevel: 'REVIEW' },
                    { id: '3', imageUrl: MOCK_HISTORICAL_IMAGE, label: 'Historical Comparison', tag: 'Matched', riskLevel: 'HIGH' },
                  ]}
                  selectedId={selectedEvidenceId}
                  onSelect={setSelectedEvidenceId}
                />
              </div>
            </div>

            {/* SPLIT SLIDER */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Split-Slider & Side-by-Side Comparison</div>
              <ImageComparison
                currentImageUrl={MOCK_DAMAGE_IMAGE_1}
                historicalImageUrl={MOCK_HISTORICAL_IMAGE}
                currentLabel="Current Claim #88421 (2026 Loss)"
                historicalLabel="Historical Match #CLM-44012 (2025 Loss)"
                currentMetadata="Honda Civic Sport — Front Right Impact"
                historicalMetadata="Honda Civic Sport — Exact Identical Deformation"
              />
            </div>
          </Section>
        </section>
      )}

      {/* 5. STATES & FEEDBACK */}
      {activeSection === 'states' && (
        <section className="cs-showcase-section">
          <Section
            title="5. Application States & Feedback"
            subtitle="Historical duplicate matches, alerts, skeletons, and error recovery states."
          >
            {/* SIMILAR CLAIMS */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Historical Duplicate & Similar Claims</div>
              <Grid columns="repeat(auto-fit, minmax(340px, 1fr))" gap="var(--cs-space-3)">
                <SimilarClaimCard
                  claim={{
                    id: 'CLM-44012',
                    similarityScore: 92,
                    riskLevel: 'HIGH',
                    vehicle: '2024 Honda Civic Sport',
                    dateOfLoss: '2025-11-14',
                    lossLocation: 'Atlanta, GA',
                    thumbnailUrl: MOCK_HISTORICAL_IMAGE,
                    matchFactors: ['Identical Dent Geometry', 'Matching Impact Vector', '92% Vector Sim'],
                  }}
                  isActive
                />
                <SimilarClaimCard
                  claim={{
                    id: 'CLM-31902',
                    similarityScore: 68,
                    riskLevel: 'REVIEW',
                    vehicle: '2023 Honda Civic EX',
                    dateOfLoss: '2025-06-22',
                    lossLocation: 'Marietta, GA',
                    thumbnailUrl: MOCK_DAMAGE_IMAGE_1,
                    matchFactors: ['Same Body Panel', '68% Vector Sim'],
                  }}
                />
              </Grid>

              <div style={{ marginTop: 'var(--cs-space-4)' }}>
                <ClaimComparison
                  currentClaimId="CLM-88421"
                  historicalClaimId="CLM-44012"
                  currentRisk="HIGH"
                  historicalRisk="HIGH"
                  similarityScore={92}
                  fields={[
                    { label: 'Vehicle Make & Model', currentValue: '2024 Honda Civic Sport', historicalValue: '2024 Honda Civic Sport', isMatch: true },
                    { label: 'VIN Hash / Serial', currentValue: '1HGCR2F83HA029184', historicalValue: '1HGCR2F83HA029184', isMatch: true },
                    { label: 'Damage Location', currentValue: 'Front Right Quarter Panel', historicalValue: 'Front Right Quarter Panel', isMatch: true },
                    { label: 'Loss Description', currentValue: 'Parking lot collision at 15mph', historicalValue: 'Highway lane change collision', isMatch: false },
                    { label: 'Prior Adjudication', currentValue: 'Pending SIU Review', historicalValue: 'Confirmed Staged Fraud', isMatch: true },
                  ]}
                />
              </div>
            </div>

            {/* ALERTS */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Alert Notification Banners</div>
              <Stack gap="var(--cs-space-3)">
                <Alert variant="info" title="System Model Calibration">
                  Vision Classifier ensemble was updated to version 2.4 with enhanced rust/corrosion detection.
                </Alert>
                <Alert variant="success" title="Adjudication Audit Recorded">
                  Investigator approval logged with transaction hash #7A8902F1 for regulatory compliance.
                </Alert>
                <Alert variant="warning" title="Incomplete Loss Metadata">
                  GPS coordinates could not be extracted from photo #IMG-88421-B1. Analyst verification advised.
                </Alert>
                <Alert
                  variant="danger"
                  title="Critical Duplicate Evidence Detected"
                  action={<Button variant="danger" size="sm">Escalate to SIU Immediately</Button>}
                >
                  Damage image #IMG-88421-A1 matches historical fraudulent claim #CLM-44012 with 92% confidence.
                </Alert>
              </Stack>
            </div>

            {/* SKELETONS & EMPTY/ERROR */}
            <div className="cs-showcase-box">
              <div className="cs-showcase-box-title">Empty, Loading & Error Recovery States</div>
              <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="var(--cs-space-4)">
                <EmptyState
                  title="No Similar Claims Found"
                  description="Vector search did not find any historical damage images matching this signature."
                />
                <ErrorState
                  title="Analysis Engine Timeout"
                  description="Neural vision service took longer than 15s to respond. Please retry the request."
                  onRetry={() =>
                    showToast({
                      title: 'Retrying AI Pipeline',
                      message: 'Reconnected to vision server.',
                      variant: 'info',
                    })
                  }
                />
              </Grid>

              <div style={{ marginTop: 'var(--cs-space-4)' }}>
                <div style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-stone-400)', marginBottom: '8px' }}>
                  Skeleton Loading & Spinners:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton width="40%" height={24} />
                  <Skeleton width="100%" height={16} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </section>
      )}
    </PageContainer>
  );
};
