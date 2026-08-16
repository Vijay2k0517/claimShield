/**
 * ClaimShield AI — Typography Token Specifications
 */

export const CS_TYPOGRAPHY = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  roles: {
    kpi: {
      fontSize: 'var(--cs-text-size-kpi)',
      lineHeight: 'var(--cs-leading-tight)',
      fontWeight: 'var(--cs-font-weight-bold)',
      letterSpacing: 'var(--cs-tracking-tight)',
      tabularNums: true,
      description: 'Fraud probability %, large risk score, top-level financial metrics',
    },
    display: {
      fontSize: 'var(--cs-text-size-display)',
      lineHeight: 'var(--cs-leading-tight)',
      fontWeight: 'var(--cs-font-weight-semibold)',
      letterSpacing: 'var(--cs-tracking-tight)',
      tabularNums: false,
      description: 'Workspace top-level header',
    },
    h1: {
      fontSize: 'var(--cs-text-size-h1)',
      lineHeight: 'var(--cs-leading-snug)',
      fontWeight: 'var(--cs-font-weight-semibold)',
      letterSpacing: 'var(--cs-tracking-tight)',
      tabularNums: false,
      description: 'Primary screen titles, modal titles',
    },
    h2: {
      fontSize: 'var(--cs-text-size-h2)',
      lineHeight: 'var(--cs-leading-snug)',
      fontWeight: 'var(--cs-font-weight-semibold)',
      letterSpacing: 'var(--cs-tracking-normal)',
      tabularNums: false,
      description: 'Panel and major card headers',
    },
    h3: {
      fontSize: 'var(--cs-text-size-h3)',
      lineHeight: 'var(--cs-leading-snug)',
      fontWeight: 'var(--cs-font-weight-medium)',
      letterSpacing: 'var(--cs-tracking-normal)',
      tabularNums: false,
      description: 'Sub-panel headers, section subtitles',
    },
    bodyLg: {
      fontSize: 'var(--cs-text-size-body-lg)',
      lineHeight: 'var(--cs-leading-normal)',
      fontWeight: 'var(--cs-font-weight-regular)',
      letterSpacing: 'var(--cs-tracking-normal)',
      tabularNums: false,
      description: 'Lead paragraphs, summary descriptions',
    },
    body: {
      fontSize: 'var(--cs-text-size-body)',
      lineHeight: 'var(--cs-leading-normal)',
      fontWeight: 'var(--cs-font-weight-regular)',
      letterSpacing: 'var(--cs-tracking-normal)',
      tabularNums: false,
      description: 'Standard interface text, evidence notes, form inputs',
    },
    bodySm: {
      fontSize: 'var(--cs-text-size-body-sm)',
      lineHeight: 'var(--cs-leading-normal)',
      fontWeight: 'var(--cs-font-weight-regular)',
      letterSpacing: 'var(--cs-tracking-normal)',
      tabularNums: false,
      description: 'Secondary descriptions, table body cells',
    },
    label: {
      fontSize: 'var(--cs-text-size-label)',
      lineHeight: 'var(--cs-leading-tight)',
      fontWeight: 'var(--cs-font-weight-medium)',
      letterSpacing: 'var(--cs-tracking-wider)',
      textTransform: 'uppercase' as const,
      tabularNums: false,
      description: 'Form labels, metadata keys, card header tags',
    },
    caption: {
      fontSize: 'var(--cs-text-size-caption)',
      lineHeight: 'var(--cs-leading-tight)',
      fontWeight: 'var(--cs-font-weight-regular)',
      letterSpacing: 'var(--cs-tracking-normal)',
      tabularNums: false,
      description: 'Timestamps, footnote status, helper text',
    },
  },
} as const;
