# ClaimShield AI — Frontend Product & UX Strategy

> **SOURCE OF TRUTH FOR FRONTEND DEVELOPMENT**  
> **Document Status:** Locked (Phase 0 Complete)  
> **Version:** 1.0.0  
> **Target Environment:** Enterprise Desktop / Web App (1440 × 900 baseline)

---

## 1. Project Context

**ClaimShield AI** is an enterprise-grade insurance claim investigation platform designed specifically for insurance carriers and claims adjusters.

The system assists insurance fraud investigators in analyzing, evaluating, and adjudicating complex vehicle damage claims using advanced multi-modal AI intelligence.

### Core System Capabilities
* **AI Vehicle Claim Fraud Classification:** Automated categorization of risk factors across visual evidence and metadata.
* **Fraud Probability Estimation:** Quantitative scoring backed by confidence metrics.
* **Explainable AI (XAI):** Transparent visual and textual explanations highlighting suspicious damage patterns, mismatch areas, and anomaly factors.
* **Similar & Duplicate Claim Detection:** Historical pattern matching and vector-similarity lookup across claim databases.
* **Fraud Risk Intelligence:** Aggregated organizational risk insights, anomaly heatmaps, and trend analytics.
* **Human-in-the-Loop Investigation:** Structured decision-support workflows requiring human adjudication for high-stakes outcomes.

---

## 2. Primary User Persona

### Insurance Fraud Investigator / Claims Analyst
* **Role:** Special Investigations Unit (SIU) Analyst, Claims Adjuster, Fraud Auditor.
* **Operational Environment:** High-volume daily workflow, high financial exposure, regulatory compliance constraints.
* **Core Mental Model & Driving Question:**

> *"Which claim needs my attention right now, why is it suspicious, what concrete evidence supports that suspicion, has something similar happened before, and what action should I take?"*

The frontend application is architected around answering this core question with maximum clarity, speed, and evidence-driven confidence.

---

## 3. Product Objective

The frontend application serves as a **Decision Support System**, not an automated execution bot. Its objective is to empower the investigator to:

1. **Quickly Identify High-Priority Claims:** Zero in on urgent risk flags without navigating through noise.
2. **Understand the AI Fraud Assessment:** Clear presentation of risk probabilities, risk levels, and confidence intervals.
3. **Understand the Evidence:** Direct visual and textual mapping of claim anomalies (e.g., impact inconsistency, pre-existing damage, metadata tampering).
4. **Inspect AI Visual Focus:** Visual heatmaps and activation overlays indicating exact pixel regions evaluated by computer vision models.
5. **Discover Historical Patterns:** Instant comparison against similar/duplicate claims across past records.
6. **Make an Informed Human Decision:** Clear, deliberate tools for accepting, modifying, or escalating findings.
7. **Record Investigation Outcome:** Audit-compliant logging of notes, reasoning, and final decision state.

---

## 4. Primary User Journey

```text
Dashboard
    │ (Identify urgent queue items & system health)
    ▼
Claims Queue
    │ (Filter by risk level, claim status, policy type, date)
    ▼
Select Claim
    │ (Open target claim context)
    ▼
Investigation Workspace
    │
    ├── 1. AI Risk Assessment  (Probability, Risk Level, Anomaly Badges)
    ├── 2. AI Evidence         (Visual Focus, Bounding Box overlays, Feature breakdown)
    ├── 3. Explainable AI      (Feature importance, Model confidence, Reasoning notes)
    ├── 4. Similar Claims      (Historical matches, Side-by-side comparative analysis)
    ├── 5. Investigator Action (Adjudication panel: Approve, Escalate, Mark Legitimate)
    └── 6. Outcome Audit       (Saved record, Audit log timestamp, Export report)
```

### Stage Purpose Breakdown
1. **Dashboard:** High-level operational awareness — "Where are system risks concentrated right now?"
2. **Claims Queue:** Efficient triage and filtering — "Which specific claims require immediate manual review?"
3. **Investigation Workspace:** Deep-dive analysis and evidence verification — "Is this specific claim fraud, and why?"
4. **Investigator Decision & Outcome:** Human judgment recording — "I approve/escalate/reject based on verified evidence."

---

## 5. Core Application Screens

### Screen 1: Dashboard
* **Primary UX Purpose:** *"What needs my attention right now?"*
* **Conceptual Hierarchy & Widgets:**
  * **Metric KPI Strip:** Total Claims, Pending Reviews, High-Risk Claims, Escalated Claims.
  * **Priority Attention Feed:** Real-time queue of high-risk claims awaiting SIU review.
  * **Fraud Risk Trend Graph:** Aggregate risk level distribution over time.
  * **Recent Adjudication Activity:** Audit stream of recent investigator decisions.

### Screen 2: Claims (Triage & Directory)
* **Primary UX Purpose:** *"Find, filter, and prioritize claims."*
* **Core Capabilities:**
  * Multi-attribute filtering (Risk Level: LOW / REVIEW / HIGH, Claim Status, Date Range, Vehicle Make/Model, Estimated Loss).
  * Fast text search across Claim ID, Policyholder Name, VIN, License Plate.
  * Column sorting by Risk Score, Submission Date, Flag Count.
  * Data density controls (Compact / Detailed view).
  * Paginated table / high-performance virtualization.

### Screen 3: New Claim Submission
* **Primary UX Purpose:** *"Submit a vehicle claim for AI-assisted analysis."*
* **Core UX Flow:**
  * **Step 1: Claim & Policy Details** (Policy #, Date of Loss, Incident Description).
  * **Step 2: Vehicle Information** (VIN, Make, Model, Year, Mileage).
  * **Step 3: Media Upload** (Drag-and-drop damage photos, police reports, repair estimates).
  * **Step 4: AI Analysis Trigger & Validation** (Form client-side validation -> Real-time submission state -> Transition to Workspace).

### Screen 4: Investigation Workspace
* **Primary UX Purpose:** *"Understand a specific claim and decide what to do."*
* **Status:** Most critical screen in the application.
* **Core Structure:** Unified single-view workspace divided into 5 clear logical panels following strict information hierarchy.

### Screen 5: Analytics
* **Primary UX Purpose:** *"Understand fraud and investigation trends at an organizational level."*
* **Business Metric Focus:**
  * Claim Volume vs. High-Risk Detection Rates.
  * Fraud Pattern Breakdown (e.g., staged accidents, pre-existing damage, inflated estimates).
  * Model Precision & False Positive Trackers.
  * Investigator Triage Velocity & Turnaround Time.

### Screen 6: Models / System Intelligence (Optional / Minimal)
* **Primary UX Purpose:** *"Understand model versioning, confidence distributions, and system health."*
* **Focus:** View active AI model versions (e.g., Vision Classifier v2.4, Duplicate Detector v1.1) and system uptime.

### Screen 7: Settings
* **Primary UX Purpose:** *"System configuration and investigator preferences."*
* **Minimal Scope:** User profile, notifications, display density, API connections status.

---

## 6. Investigation Workspace UX Hierarchy

The workspace follows an unyielding top-to-bottom / left-to-right evidence progression:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. WHAT IS THE RISK?                                                        │
│ [Claim #88421] [Risk Level: HIGH] [Fraud Probability: 87%] [Confidence: 94%]│
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 2. WHY IS IT SUSPICIOUS?             │ 3. WHAT EVIDENCE SUPPORTS IT?        │
│ • Impact Direction Mismatch          │ • AI Damage Heatmap & Bounding Box   │
│ • Pre-existing Corrosion Detected    │ • Photo Metadata / Exif Timestamp    │
│ • Staged Incident Indicator          │ • Repair Estimate vs. Visual Damage  │
├──────────────────────────────────────┴──────────────────────────────────────┤
│ 4. HAS THIS HAPPENED BEFORE?                                                │
│ • Match Found: Claim #44012 (92% visual similarity, same damage pattern)   │
│ • Side-by-Side Image Comparative Slider                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. WHAT SHOULD THE INVESTIGATOR DO?                                         │
│ [ Accept AI Risk / Escalate to SIU ]  [ Mark Legitimate ]  [ Request Evidence]│
│ [ Notes & Adjudication Reason Input Textarea                              ] │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Immediate Risk Visibility:** Primary KPI banner with Risk Level (`HIGH`), Fraud Probability (`87%`), and Key Anomaly Tags visible within 100ms of page load.
2. **Progressive Disclosure:** Deep visual heatmaps, EXIF analysis, and explainable AI metrics are organized under structured tabs or adjacent collapsible split-views.
3. **Side-by-Side Historical Comparison:** Visual overlay comparing current claim damage images with matching historical duplicate claims.
4. **Deliberate Adjudication Panel:** Prominent, isolated action bar at the bottom with required decision selection and mandatory notes for audit trail integrity.

---

## 7. Risk Terminology & Compliance Standard

To maintain professional enterprise standards and prevent legal liability, the UI enforces strict terminology rules. The platform is a **decision-support tool**; human investigators make final legal determinations.

| Approved Enterprise Terminology | Prohibited / Invalid Terminology |
| :--- | :--- |
| **Fraud Probability** (e.g., 87%) | ~~Fraud Confirmed~~ |
| **Risk Level** (LOW / REVIEW / HIGH) | ~~AI Confirmed Fraud~~ |
| **Potential Fraud Indicator** | ~~Automatically Fraudulent~~ |
| **Suspicious Claim** | ~~AI Rejected Customer~~ |
| **Manual Investigation Recommended** | ~~Decline Claim Automatically~~ |
| **AI Assessment / Recommendation** | ~~Guilty / Fraudster~~ |
| **Investigator Adjudication / Decision** | ~~System Verdict~~ |

---

## 8. Risk Levels & Semantic States

Risk is categorized into exactly three conceptual states:

| Risk State | Semantic Meaning | Recommended UI Treatment |
| :--- | :--- | :--- |
| **LOW** | Claim matches standard baseline parameters. Low probability of fraud or anomaly. | Success semantic (Subtle muted green accent), standard fast-track queue. |
| **REVIEW** | Moderate anomaly or metadata inconsistency detected. Requires routine analyst review. | Warning semantic (Subtle amber/yellow accent), standard investigator queue. |
| **HIGH** | Significant visual damage mismatch, duplicate image match, or severe metadata anomaly detected. | Danger semantic (Crisp red accent banner), prioritized SIU queue. |

*Note: Numerical probability thresholds (e.g., <30% Low, 30-70% Review, >70% High) will be defined during AI model integration.*

---

## 9. Visual Design Direction

* **Design Aesthetic:** Enterprise Intelligence / Defense & Financial Operations.
* **Tone & Persona:** Calm, precise, authoritative, highly structured, evidence-first, trustworthy.
* **Inspiration:** Palantir Foundry, Bloomberg Terminal, Datadog Enterprise, Stripe Dashboard, Linear, Cloudflare Radar.
* **Strict Anti-Patterns (PROHIBITED):**
  * ❌ NO Cyberpunk, neon glow, or futuristic sci-fi tropes.
  * ❌ NO Gaming-style interfaces or excessive decorative badges.
  * ❌ NO Generic consumer app rounded cards with excessive white space.
  * ❌ NO Heavy glassmorphism, blur effects, or translucent noise patterns.
  * ❌ NO Loud multicolor gradients or rainbow metric charts.

---

## 10. Design Philosophy

1. **Clarity Over Decoration:** Every visual element must convey functional information.
2. **Visual Hierarchy:** Critical data points (Risk Level, Fraud Score) dominate secondary metadata.
3. **Data Density:** High-information layout tailored for desktop workstations, minimizing unnecessary scrolling.
4. **Interface Restraint:** Accent colors are reserved strictly for status signals and primary actions.
5. **Calm Trustworthiness:** Dark/Neutral palette engineered to prevent eye fatigue during multi-hour investigation sessions.

---

## 11. Typography Direction

* **Primary Font Family:** `Inter`, system sans-serif fallback (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`).
* **Numeric Data Font:** `Inter` with tabular numbers enabled (`font-variant-numeric: tabular-nums`).

### Typography Scale Hierarchy

| Token Role | Use Case | Weight | Case / Style |
| :--- | :--- | :--- | :--- |
| **Display / KPI** | Fraud Probability %, Large Risk Score | SemiBold (600) / Bold (700) | Tabular Nums, Large Display |
| **H1** | Screen Titles (e.g., Investigation Workspace) | SemiBold (600) | Sentence case |
| **H2** | Section / Panel Headers | Medium (500) / SemiBold | Sentence case |
| **H3** | Widget & Card Titles | Medium (500) | Sentence case |
| **Body** | Descriptions, Evidence Explanations | Regular (400) | Standard |
| **Label** | Form Labels, Metadata Keys | Medium (500) | Uppercase / Tracking wide |
| **Caption** | Timestamps, Footnotes, Tooltips | Regular (400) | Muted text |

---

## 12. Color Semantics

Color selection is strictly tokenized into functional categories:

```text
Background:       Dark/Neutral Base (e.g., Slate 950 / Charcoal)
Surface:          Card & Panel Containers (Slate 900)
Surface Elevated: Modals, Popovers, Floating Action Bars (Slate 850)
Overlay:          Backdrop shade for focus modes
Border:           Subtle divider lines (Slate 800)
Text Primary:     High contrast body & title text (Slate 50)
Text Secondary:   Supporting metadata text (Slate 400)
Text Muted:       Disabled / subtle timestamps (Slate 500)
Primary:          System action blue / indigo accent
Success:          LOW Risk / Approved (Emerald)
Warning:          REVIEW Risk / Caution (Amber)
Danger:           HIGH Risk / Fraud Flag (Rose / Red)
Info:             Neutral system information (Sky Blue)
```

### Risk Color Mapping
* `LOW` → `Success` semantic
* `REVIEW` → `Warning` semantic
* `HIGH` → `Danger` semantic

*Danger red is strictly reserved for actionable threats, high fraud probabilities, and destructive system actions.*

---

## 13. Application Shell Direction

The application layout uses a canonical enterprise 2-column sidebar grid:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Brand Logo]  [Global Search VIN/Claim#]       [Alerts (3)]  [Analyst Profile]│
├──────────────┬──────────────────────────────────────────────────────────────┤
│ 📊 Dashboard  │                                                              │
│ 📁 Claims    │                                                              │
│ ➕ New Claim  │                     MAIN CONTENT AREA                        │
│ 📈 Analytics │       (Triage Queue / Investigation Workspace)               │
│ 🧠 Models    │                                                              │
│ ⚙️ Settings   │                                                              │
│              │                                                              │
│ [System OK]  │                                                              │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

* **Header:** Sticky top navigation bar containing global claim search, active alert notifications, tenant switcher, and user session profile.
* **Sidebar:** Fixed left navigation menu with clear section indicators and active state highlights.
* **Main Area:** Scroll-isolated content view optimized for dense data tables and multi-pane workspace layouts.

---

## 14. Interaction Philosophy

* **Fast & Direct:** Zero multi-page redirect flows for core investigation steps.
* **No Modal Chains:** Avoid nested modals. Use slide-over panels, inline drawers, or split views.
* **Seamless Context Switching:** Moving from `Claim List` → `Investigation Workspace` → `Similar Claim Inspection` preserves user state and filter memory.
* **Keyboard Navigation:** Native keyboard shortcuts for frequent investigator actions (e.g., `[J/K]` queue navigation, `[A]` approve, `[E]` escalate).

---

## 15. AI Operation States

All AI-assisted UI elements must explicitly handle and display five core operational states:

```text
┌──────────────┐
│  1. READY    │ "Ready for AI Analysis"
└──────┬───────┘
       │ (User triggers / Auto-start)
       ▼
┌──────────────┐
│ 2. PROCESSING│ "Analyzing vehicle evidence & vision heatmaps..." [Spinner / Pulse]
└──────┬───────┘
       ├───────────────────────────────┐
       ▼                               ▼
┌──────────────┐               ┌──────────────┐
│  3. SUCCESS  │               │  4. FAILURE  │
│ "Analysis    │               │ "Analysis    │
│  Complete"   │               │  Failed"     │
└──────────────┘               │ [Retry Btn]  │
                               └──────────────┘
       │ (No match found)
       ▼
┌──────────────────────────┐
│ 5. EMPTY / NO RESULT     │ "No duplicate historical claims detected."
└──────────────────────────┘
```

---

## 16. Human-in-the-Loop Workflow

```text
AI Risk Scoring & Anomaly Detection
                │
                ▼
      Investigator Review
   (Inspects Heatmaps, Evidence, EXIF, Historical Matches)
                │
                ▼
      Investigator Decision
  ┌─────────────┼─────────────┬──────────────┐
  ▼             ▼             ▼              ▼
[Approve]  [Escalate]  [Mark Legitimate] [Request Info]
  └─────────────┴─────────────┴──────────────┘
                │
                ▼
     Audit Trail Recorded
  (Adjudicator ID, Timestamp, Decision, Notes)
```

The system **never** automatically executes legal rejection or policy cancellation without explicit human confirmation.

---

## 17. Target Screen Resolution & Strategy

* **Primary Desktop Baseline:** `1440 × 900` pixels (standard enterprise laptop / monitor setup).
* **Secondary Desktop:** `1920 × 1080` (Widescreen multi-panel layout expansion).
* **Responsive Strategy:** Flexible panel widths with minimum width constraints; sidebar collapsible on narrower displays.

---

## 18. Information Architecture

```text
ClaimShield AI Frontend
│
├── Dashboard (Triage Overview, Risk Distribution, KPI Bar)
│
├── Claims Queue
│   ├── Claim List & Triage Table
│   └── Filter & Search Controls
│
├── New Claim (Submission Form, Media Upload, Validation)
│
├── Investigation Workspace (Claim ID Context)
│   ├── Header: Claim Metadata & Quick Actions
│   ├── Section 1: AI Risk Score & Confidence Metrics
│   ├── Section 2: Visual Damage & AI Focus Heatmap (XAI)
│   ├── Section 3: Anomaly Breakdown & EXIF Verification
│   ├── Section 4: Duplicate & Historical Claim Matcher
│   └── Section 5: Investigator Adjudication Bar
│
├── Analytics (Fraud Insights, Model Performance, SIU Metrics)
│
├── Models (Active AI Pipeline & Health Status)
│
└── Settings (User Preferences, Audit Logs, API Config)
```

---

## 19. Mandatory Rules for Future AI Frontend Development

These rules are strict, binding directives for all future AI agents and developers working on this codebase:

1. **Rule 1:** Always read `/docs/frontend.md` before creating or modifying frontend code.
2. **Rule 2:** Treat `/docs/frontend.md` as the absolute frontend source of truth.
3. **Rule 3:** Do not invent new screens, pages, or major navigation routes without explicit user approval.
4. **Rule 4:** Do not change the visual design direction (Palantir/Datadog enterprise style) without explicit approval.
5. **Rule 5:** Do not introduce arbitrary colors, fonts, spacing values, or component styles outside the specified design system tokens.
6. **Rule 6:** Do not add unnecessary animations, decorative graphics, or performance-degrading visual effects.
7. **Rule 7:** Do not build generic consumer card-grid dashboards with low data density.
8. **Rule 8:** Do not visually present AI predictions as absolute or unchallengeable truth.
9. **Rule 9:** Keep AI evidence visuals (heatmaps, confidence scores) clearly distinct from human investigator decisions.
10. **Rule 10:** Do not modify unrelated application files or refactor unrequested components.
11. **Rule 11:** If implementation requirements evolve, immediately update `/docs/frontend.md` to keep the source of truth synchronized.
12. **Rule 12:** Prioritize investigator productivity, clarity, and information hierarchy over decorative aesthetics.

---

## 20. Phase 0 Acceptance Criteria Checklist

- [x] **Product Identity & Context:** Established enterprise fraud intelligence identity.
- [x] **Product Objective & Primary User Persona:** Defined Fraud Investigator mental model and 7 core objectives.
- [x] **Primary User Journey:** 6-step canonical flow documented with purpose descriptions.
- [x] **Core Screens:** locked 7 application views (Dashboard, Claims, New Claim, Investigation Workspace, Analytics, Models, Settings).
- [x] **Investigation Workspace Hierarchy:** Locked 5-tier question hierarchy (`WHAT IS THE RISK?` → `WHY SUSPICIOUS?` → `EVIDENCE?` → `HISTORICAL MATCH?` → `ACTION?`).
- [x] **Risk Terminology & Compliance:** Approved vs. Prohibited terminology matrix created.
- [x] **Risk Levels:** Defined `LOW`, `REVIEW`, `HIGH` states and semantic mappings.
- [x] **Visual Design Direction:** Enterprise dark/neutral intelligence aesthetic defined; anti-patterns prohibited.
- [x] **Design Philosophy:** 5 core principles locked (Clarity, Hierarchy, Density, Restraint, Trust).
- [x] **Typography Direction:** `Inter` font, scale hierarchy, tabular numeric formatting specified.
- [x] **Color Semantics:** Category map & risk level color mapping defined.
- [x] **Application Shell Direction:** Top header & left sidebar 2-column layout defined.
- [x] **Interaction Philosophy:** Fast, direct, keyboard-accessible, modal-free guidelines locked.
- [x] **AI Operational States:** `READY`, `PROCESSING`, `SUCCESS`, `FAILURE`, `EMPTY` states mapped.
- [x] **Human-in-the-Loop Principle:** Decision-support adjudication flow defined.
- [x] **Desktop Strategy:** `1440 × 900` baseline resolution locked.
- [x] **Information Architecture:** Complete tree structure locked.
- [x] **Rules for Future AI Development:** 12 binding instructions documented.

---

## 21. Phase 1 — Design System & Visual Language Specification

> **Phase Status:** Phase 1 Complete (Design System & Primitives Implemented)  
> **Showcase Route:** `/design-system`  
> **Source Directory:** `/frontend/src/design-system/`  

### 21.1 Design System Architecture

ClaimShield AI uses a centralized design token hierarchy:

```text
Primitive CSS Custom Properties (tokens.css)
      ↓
Semantic Design Tokens (colors.ts, typography.ts, spacing.ts)
      ↓
Reusable UI Primitives (Button, Form, Table, Badge, Overlays, Layout)
      ↓
Domain Primitives (AI Probability, XAI Heatmaps, Evidence Viewers, Similarity)
      ↓
Future Application Screens (Phase 2+)
```

### 21.2 Authoritative Design Tokens Reference

#### Color Tokens
* **Workspace Background:** `--cs-bg-base` (`#090d16` / Slate 950)
* **Surface Containers:** `--cs-bg-surface` (`#0f172a` / Slate 900)
* **Elevated Panels / Modals:** `--cs-bg-elevated` (`#141e33` / Slate 850)
* **Borders:**
  * Subtle: `--cs-border-subtle` (`rgba(255, 255, 255, 0.06)`)
  * Default: `--cs-border-default` (`#1e293b` / Slate 800)
  * Strong: `--cs-border-strong` (`#334155` / Slate 700)
  * Focus: `--cs-border-focus` (`#38bdf8` / Sky 400)
* **Text Contrast:**
  * Primary: `--cs-text-primary` (`#f8fafc` / Slate 50)
  * Secondary: `--cs-text-secondary` (`#94a3b8` / Slate 400)
  * Muted: `--cs-text-muted` (`#64748b` / Slate 500)
  * Disabled: `--cs-text-disabled` (`rgba(148, 163, 184, 0.35)`)
* **Brand Accent:** `--cs-primary` (`#0284c7`), `--cs-primary-hover` (`#0369a1`), `--cs-primary-subtle` (`rgba(2, 132, 199, 0.12)`)
* **Risk Levels (Strict Mapping):**
  * `LOW` → `--cs-risk-low` (`#10b981` Emerald / Success semantic)
  * `REVIEW` → `--cs-risk-review` (`#f59e0b` Amber / Warning semantic)
  * `HIGH` → `--cs-risk-high` (`#f43f5e` Rose / Danger semantic)

#### Typography Tokens
* **Font Family:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
* **Monospace & Tabular Data:** `JetBrains Mono`, `ui-monospace`, `monospace` (Tabular figures enabled via `.cs-tabular-nums`)
* **Typography Scale:**
  * `kpi`: `2.0rem` (32px), `700` weight, tabular numbers
  * `display`: `1.75rem` (28px), `600` weight
  * `h1`: `1.375rem` (22px), `600` weight
  * `h2`: `1.125rem` (18px), `600` weight
  * `h3`: `0.9375rem` (15px), `500` weight
  * `body-lg`: `0.9375rem` (15px), `400` weight
  * `body`: `0.84375rem` (13.5px), `400` weight
  * `body-sm`: `0.75rem` (12px), `400` weight
  * `label`: `0.6875rem` (11px), `500` weight, uppercase, tracking wide
  * `caption`: `0.6875rem` (11px), `400` weight

#### Spacing Tokens (4px Baseline Grid)
* `--cs-space-0-5`: `2px`
* `--cs-space-1`: `4px`
* `--cs-space-2`: `8px`
* `--cs-space-3`: `12px`
* `--cs-space-4`: `16px`
* `--cs-space-5`: `20px`
* `--cs-space-6`: `24px`
* `--cs-space-8`: `32px`
* `--cs-space-10`: `40px`
* `--cs-space-12`: `48px`
* `--cs-space-16`: `64px`

#### Radii & Geometry
* `radius-xs`: `2px`, `radius-sm`: `4px`, `radius-md`: `6px`, `radius-lg`: `8px`, `radius-xl`: `12px`, `radius-full`: `9999px`

#### Elevation & Shadows
* `elevation-none`: `none`
* `elevation-subtle`: `0 1px 2px 0 rgba(0, 0, 0, 0.4)`
* `elevation-elevated`: `0 4px 12px 0 rgba(0, 0, 0, 0.45)`
* `elevation-overlay`: `0 12px 32px 0 rgba(0, 0, 0, 0.65), 0 0 0 1px var(--cs-border-default)`

### 21.3 Implemented Component Library Catalog

#### 1. Buttons (`src/design-system/primitives/Button/`)
* `Button`: Primary, Secondary, Ghost, Outline, Danger, Danger-Subtle, Success-Subtle variants. Supports sizes `sm`, `md`, `lg`, loading spinner state, disabled state, left/right icons.
* `ButtonGroup`: Segmented button controls.
* `IconButton`: Accessible icon-only action button with mandatory `aria-label`.

#### 2. Form System (`src/design-system/primitives/Form/`)
* `FormField`: Form wrapper with accessible label, required asterisk, optional tag, helper text, and error text.
* `Input`: Text/number inputs with size variants, left/right icon slots, and error styling.
* `SearchInput`: Fast search input with clear button and keyboard shortcut badge (`⌘K`).
* `Textarea`: Multi-line text input with resizable control.
* `Select` & `MultiSelect`: Single select and multi-select tags dropdown.
* `Checkbox` & `Radio`: Native accessible controls styled for dark enterprise UI.
* `Switch`: Toggle switch for boolean configurations.
* `DatePicker`: Loss date picker input.
* `FileUpload`: Vehicle damage evidence dropzone with multi-file drag-and-drop, preview thumbnails, file size tags, and remove actions.

#### 3. Badges & Risk (`src/design-system/primitives/Badge/`)
* `RiskBadge`: Enforces canonical `LOW` (Emerald), `REVIEW` (Amber), and `HIGH` (Rose) states. Optional probability score attachment.
* `StatusBadge`: Claim lifecycle states (`NEW`, `TRIAGE`, `UNDER_INVESTIGATION`, `ADJUDICATED`, `ESCALATED`, `CLOSED`).
* `SeverityIndicator`: Anomaly severity (`low`, `medium`, `high`, `critical`).
* `ConfidenceIndicator`: Model statistical confidence meter.
* `ProgressIndicator`: Linear progress indicator with percentage readout.

#### 4. Data Display & KPIs (`src/design-system/primitives/DataDisplay/`)
* `KPI`: Portfolio metric card with tabular numbers, positive/negative trend delta, and loading skeleton state.
* `StatBlock`: Compact key-metric container.
* `Metric`: Icon-accented metric widget.
* `TrendIndicator`: Directional trend delta badge.
* `DataLabel`: Structured metadata key-value display with monospace support for VIN / dates.

#### 5. Data Table System (`src/design-system/primitives/Table/`)
* `DataTable`: Enterprise table supporting:
  * Sortable columns with directional arrows
  * Density switcher (`comfortable` / `compact`)
  * Multi-row checkbox selection and batch actions
  * Custom status, risk, and action cell renderers
  * Paginated navigation with items-per-page selector
  * Skeleton loading and empty state fallbacks

#### 6. Navigation & Overlays (`src/design-system/primitives/Navigation/` & `Overlay/`)
* `Tabs`: Boxed and underline tab variants.
* `Breadcrumb`: Hierarchical navigation path.
* `Tooltip` & `Popover`: Contextual helper information.
* `Drawer`: Slide-over drawer panel for contextual claim inspection without page reloads.
* `Dialog`: Modal dialog for confirmation flows.
* `Accordion`: Collapsible panels for evidence breakdowns.

#### 7. Feedback & Application States (`src/design-system/primitives/Feedback/`)
* `Alert`: Dismissible info, success, warning, and danger alert banners.
* `Toast` & `ToastProvider`: Dynamic floating notification system.
* `Skeleton`: Skeleton loading animations for text, blocks, and circles.
* `Spinner`: Inline activity spinners.
* `EmptyState`: Zero-data fallback display.
* `ErrorState`: Recoverable error display with retry action.

#### 8. Layout Primitives (`src/design-system/primitives/Layout/`)
* `AppShell`: Enterprise 2-column layout with collapsible sidebar and sticky header.
* `PageContainer`: Centered 1600px desktop workstation container.
* `Panel`: Structured card panel with header, actions, body, and footer.
* `SplitLayout`: 2-pane / 3-pane responsive investigation layouts.
* `Stack` & `Grid`: Flex and CSS Grid layout primitives.
* `Section` & `Toolbar`: Section headers and filter action toolbars.

#### 9. AI & Explainability Primitives (`src/design-system/ai/`)
* `FraudProbability`: High-visibility probability hero card (e.g. 87% HIGH RISK) with calibrated risk threshold bands. Supports `loading`, `available`, and `unavailable` states.
* `AIRecommendation`: Decision-support banner ("Manual Investigation Recommended", "Fast-Track Approval", "Escalate to SIU") with rationale and anomaly tags.
* `ConfidenceMeter`: Statistical certainty gauge distinguishing model confidence from fraud probability and visual similarity.
* `AIProcessingState`: Asynchronous multi-stage pipeline state visualizer (`READY`, `PROCESSING`, `SUCCESS`, `FAILURE`, `EMPTY`).
* `AnomalyList`: Risk factor breakdown with severity badges and evidence citations.
* `FeatureImportance`: Explainable AI risk factor weighting bars.

#### 10. Vehicle Evidence & Visual Inspection Primitives (`src/design-system/evidence/`)
* `EvidenceViewer`: High-resolution collision photo canvas with zoom (+, -, reset), pan, fullscreen mode, and damage annotations.
* `HeatmapOverlay`: Explainable AI attention layer controller with 3 modes:
  1. `Original Photo`
  2. `AI Heatmap Overlay` (with live opacity adjustment slider)
  3. `Activation Heatmap Only`
* `BoundingBoxOverlay`: Visual damage bounding box markers highlighting impact deformation or pre-existing corrosion.
* `ComparisonSlider`: Interactive draggable split slider handle for before/after or current/historical damage comparison.
* `ImageComparison`: Toggleable split slider and side-by-side comparison modes.
* `EvidenceGallery`: Damage photo grid and filmstrip selector.

#### 11. Similar Claims Primitives (`src/design-system/similarity/`)
* `SimilarClaimCard`: Historical duplicate match card displaying similarity %, claim ID, date of loss, location, and matching factors.
* `SimilarityScore`: Normalized similarity percentage badge distinguishing visual embedding similarity from fraud risk.
* `ClaimComparison`: Side-by-side attribute matching matrix highlighting identical metadata or part replacements.

### 21.4 Motion & Accessibility Standards

* **Motion System:**
  * Fast: `100ms` (hover, button active, focus states)
  * Normal: `180ms` (dropdowns, drawers, tabs, accordion)
  * Slow: `300ms` (probability reveals, progress animations)
  * Respects `prefers-reduced-motion: reduce` by zeroing transition durations.
* **Accessibility:**
  * Minimum 4.5:1 contrast on all body text against dark backgrounds.
  * Visible sky-blue (`#38bdf8`) focus rings via `:focus-visible`.
  * Proper ARIA roles on buttons, dialogs, drawers, tooltips, alerts, tables, and progress bars.
  * Tabular numbers (`.cs-tabular-nums`) ensuring financial and risk numbers remain jitter-free.

---

## 22. Phase 1 Acceptance Criteria Checklist

- [x] **Repository inspected:** Confirmed clean workspace structure.
- [x] **frontend.md read completely:** Locked Phase 0 decisions preserved as authoritative source of truth.
- [x] **Phase 0 preserved:** No strategy, screen structures, or terminology rules altered.
- [x] **Design token system implemented:** Centralized CSS Custom Properties in `tokens.css`.
- [x] **Color system implemented:** Neutral Slate 950 base, Slate 900 surfaces, Slate 850 elevated, Primary blue.
- [x] **Typography system implemented:** Inter font hierarchy with tabular numerals.
- [x] **Spacing system implemented:** 4px baseline scale (`0px` to `64px`).
- [x] **Layout system implemented:** AppShell, PageContainer, Panel, SplitLayout, Stack, Grid, Section, Toolbar.
- [x] **Border system implemented:** Subtle, default, strong, and focus border tokens.
- [x] **Radius system implemented:** Restrained enterprise geometry (`2px` to `12px`).
- [x] **Elevation system implemented:** Restrained tonal elevation (`elevation-none` to `elevation-overlay`).
- [x] **Button system implemented:** Primary, Secondary, Ghost, Outline, Danger, IconButton, ButtonGroup with loading/disabled states.
- [x] **Form system implemented:** Input, SearchInput, Textarea, Select, MultiSelect, Checkbox, Radio, Switch, DatePicker, FileUpload with complete validation styling.
- [x] **Badge/status/risk system implemented:** Strict RiskBadge (`LOW`, `REVIEW`, `HIGH`), StatusBadge, SeverityIndicator, ConfidenceIndicator, ProgressIndicator.
- [x] **KPI/data primitives implemented:** KPI, StatBlock, Metric, TrendIndicator, DataLabel.
- [x] **Table primitives implemented:** DataTable with sorting, pagination, selection, density toggle (`comfortable` / `compact`), risk cells.
- [x] **AI primitives implemented:** FraudProbability (87% HIGH RISK), AIRecommendation banner, ConfidenceMeter, AIProcessingState (5 stages), AnomalyList, FeatureImportance.
- [x] **Evidence primitives implemented:** EvidenceViewer, EvidenceThumbnail, EvidenceGallery, ComparisonSlider, ImageComparison, BoundingBoxOverlay.
- [x] **Explainability primitives implemented:** HeatmapOverlay with 3 modes (Original, Heatmap, Overlay) and live opacity slider.
- [x] **Similarity primitives implemented:** SimilarClaimCard, SimilarityScore, ClaimComparison matrix.
- [x] **Loading/empty/error states implemented:** Skeleton, Spinner, EmptyState, ErrorState with retry actions, Toast notification system.
- [x] **Motion system implemented:** Restrained durations with reduced motion support.
- [x] **Accessibility foundation implemented:** Semantic markup, focus indicators, ARIA roles, contrast compliance.
- [x] **No unnecessary dependencies added:** Minimal stack (React 19, TypeScript, Vite, Lucide React).

---

## 23. Phase 2 — Application Shell Architecture Specification

> **Phase Status:** Phase 2 Complete (Application Shell & Navigation Implemented)  
> **Source Directory:** `/frontend/src/shell/`  
> **Visual Identity:** Obsidian (`#070a11`), Warm Graphite (`#111624`), Arctic Blue (`#0284c7`), Cool Cyan (`#06b6d4`), Soft Stone (`#94a3b8` / `#f8fafc`)  

### 23.1 Workstation Layout Overview

ClaimShield AI uses a high-density, fixed-frame workstation structure designed for high-volume insurance fraud investigation:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ BRAND LOGO    GLOBAL SEARCH (Claim/Policy/VIN)     STATUS    ALERTS    USER │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ Dashboard    │                                                              │
│ Claims (128) │                                                              │
│ New Claim    │                     MAIN CONTENT AREA                        │
│ Analytics    │                   (PageHeader + Toolbar)                     │
│ Models (v2.4)│                                                              │
│ Settings     │                                                              │
│              │                                                              │
│ [Collapse <] │                                                              │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

### 23.2 Sidebar Navigation Specifications (`src/shell/Sidebar.tsx`)

* **Dimensions:**
  * Expanded Width: `240px` (`--cs-sidebar-width`)
  * Collapsed Width: `64px` (`--cs-sidebar-collapsed`)
  * Height: `100vh` sticky
* **Navigation Items:**
  1. `Dashboard` (`LayoutDashboard` icon)
  2. `Claims Queue` (`FileText` icon, with active count badge `128`)
  3. `New Claim Intake` (`PlusCircle` icon)
  4. `Fraud Analytics` (`BarChart3` icon)
  5. `Model Ensembles` (`Cpu` icon, with model version badge `v2.4`)
  6. `System Settings` (`Settings` icon)
* **States Supported:**
  * `default`: Warm graphite background, `#94a3b8` stone text.
  * `hover`: `#1f2942` highlight, `#f8fafc` text.
  * `active`: Arctic Blue subtle background (`rgba(2, 132, 199, 0.12)`), `#38bdf8` text, `3px` solid Arctic Blue left indicator pill.
  * `focus`: `:focus-visible` with sky-blue (`#38bdf8`) ring.
  * `disabled`: `40%` opacity with `pointer-events: none`.
* **Sidebar Footer:** One-click toggle button to collapse sidebar into icon-only mode with tooltips.

### 23.3 Global Header Specifications (`src/shell/Header.tsx`)

* **Height:** `56px` (`--cs-header-height`) sticky with subtle backdrop blur.
* **Header Elements:**
  1. **Mobile Menu Toggle:** Visible only below `768px` to open the navigation drawer.
  2. **Global Search (`src/shell/GlobalSearch.tsx`):**
     * Visual search input with `Search Claim ID, Policy #, VIN...` placeholder.
     * Keyboard shortcut badge: `⌘K`.
     * Interactive focus dropdown displaying recent investigations with risk category icons.
  3. **System Status (`src/shell/SystemStatus.tsx`):**
     * Institutional badge with emerald status dot: `SYSTEM OPERATIONAL`.
  4. **SIU Notification Menu (`src/shell/NotificationMenu.tsx`):**
     * Bell button with unread count badge (`3`).
     * Popover with investigation alert items, category icons (Danger/Warning/Success), and "Mark all as read" action.
  5. **User Profile Menu (`src/shell/UserProfileMenu.tsx`):**
     * Avatar with analyst initials (`AV`), name ("Arthur Vance"), and role ("Lead SIU Analyst").
     * Dropdown menu with Profile, Analysis Preferences, Compliance Audit Trail, System Settings, and Sign Out.

### 23.4 Main Content & Layout Primitives (`src/shell/`)

* **`AppShell` (`src/shell/AppShell.tsx`):** Master layout managing sidebar collapse state, mobile navigation drawer, and active view.
* **`PageHeader` (`src/shell/PageHeader.tsx`):** Standardized top container with H1 page title, subtitle, breadcrumbs, and right-hand action buttons.
* **`Toolbar` (`src/shell/Toolbar.tsx`):** Action bar supporting left filter inputs/dropdowns and right button groups.
* **`ShellDemo` (`src/shell/ShellDemo.tsx`):** Neutral application shell demonstration validating 1600px container boundaries, border geometry, and responsive behavior without implementing Phase 3 product screens.

### 23.5 Responsive Behavior & Breakpoints

* **Desktop Workstation (`>= 1024px`):** Full 240px sidebar, full header with search, notifications, status, and profile menu.
* **Tablet (`768px` to `1023px`):** Sidebar automatically collapses to 64px icon-only mode with tooltips; main content padding adjusts to 16px.
* **Mobile (`< 768px`):** Sidebar hides; hamburger button appears in header; clicking hamburger opens a full slide-out navigation drawer with backdrop. User metadata and system status text hide to prioritize search.

### 23.6 Accessibility Standards

* Semantic `<aside>`, `<header>`, `<main>`, `<nav>`, and `<button>` markup throughout.
* `aria-expanded`, `aria-label`, `role="navigation"`, `role="dialog"`, and `role="menu"` attributes implemented.
* High-contrast `:focus-visible` sky-blue focus rings on all interactive elements.
* Respects `prefers-reduced-motion: reduce` by setting transition durations to `0ms`.

---

## 24. Phase 2 Acceptance Criteria Checklist

- [x] **New Obsidian + Arctic Blue palette implemented:** Deep obsidian (`#070a11`), warm graphite surfaces (`#111624`), Arctic Blue brand actions (`#0284c7`), cool cyan AI accents (`#06b6d4`).
- [x] **Slate-heavy appearance eliminated:** Restrained enterprise intelligence aesthetic.
- [x] **Typography hierarchy refined:** Prominent KPI numbers with quiet supporting metadata.
- [x] **Component library refined:** Buttons, forms, risk badges, KPI cards, tables, AI, and evidence viewers updated to Obsidian palette.
- [x] **/design-system reorganized:** Re-structured into 5 clean sections: `FOUNDATIONS`, `PRIMITIVES`, `AI`, `VISUAL EVIDENCE`, `STATES`.
- [x] **Application shell created:** Production-grade workstation layout in `src/shell/`.
- [x] **Sidebar built:** Fixed navigation supporting Dashboard, Claims (128), New Claim, Analytics, Models (v2.4), Settings, with collapse toggle and active states.
- [x] **Header built:** 56px sticky top bar with global search, system status, notification popover, and user profile menu.
- [x] **Global search placeholder implemented:** Search input with `⌘K` hint and recent query cues.
- [x] **System status implemented:** Restrained `SYSTEM OPERATIONAL` indicator.
- [x] **Notification menu implemented:** Popover with unread counter and investigation alert items.
- [x] **User profile menu implemented:** Avatar, Analyst name, SIU role, preferences, and sign out options.
- [x] **Reusable shell primitives created:** `AppShell`, `PageHeader`, `Toolbar`, `ShellDemo`.
- [x] **Responsive behavior verified:** 1440 × 900 desktop baseline, 1024px tablet auto-collapse, 768px mobile slide-out drawer.
- [x] **Neutral shell demo built:** Validates workstation frame without creating Phase 3 business screens or fake analytics.
- [x] **Accessibility implemented:** Semantic landmark tags, ARIA attributes, keyboard focus rings, reduced motion support.
- [x] **Documentation updated:** `/docs/frontend.md` synchronized as the single source of truth.
- [x] **TypeScript check passes:** `tsc --noEmit` exits with 0 errors.
- [x] **Production build passes:** `vite build` succeeds with 0 errors.
- [x] **No Phase 3 screens created:** Dashboard, Claims Queue, Investigation Workspace, Analytics, Models, and Settings remain unbuilt until Phase 3.


