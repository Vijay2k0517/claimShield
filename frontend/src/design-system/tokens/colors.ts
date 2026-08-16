/**
 * ClaimShield AI — Color Tokens & Risk Semantic Types
 * Visual Direction: Obsidian + Arctic Blue + Soft Stone
 */

export const CS_COLORS = {
  obsidian: {
    950: '#070a11',
    900: '#0b0f19',
    850: '#111624',
    800: '#171e31',
    750: '#1f2942',
    700: '#2a3756',
    600: '#3b4d75',
  },
  stone: {
    500: '#64748b',
    400: '#94a3b8',
    300: '#cbd5e1',
    200: '#e2e8f0',
    100: '#f1f5f9',
    50:  '#f8fafc',
  },
  primary: {
    base: '#0284c7',
    hover: '#0369a1',
    active: '#075985',
    subtle: 'rgba(2, 132, 199, 0.12)',
    border: 'rgba(2, 132, 199, 0.28)',
    text: '#38bdf8',
  },
  cyan: {
    base: '#06b6d4',
    subtle: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.28)',
    text: '#22d3ee',
  },
  success: {
    base: '#10b981',
    hover: '#059669',
    subtle: 'rgba(16, 185, 129, 0.10)',
    border: 'rgba(16, 185, 129, 0.24)',
    text: '#34d399',
  },
  warning: {
    base: '#f59e0b',
    hover: '#d97706',
    subtle: 'rgba(245, 158, 11, 0.10)',
    border: 'rgba(245, 158, 11, 0.24)',
    text: '#fbbf24',
  },
  danger: {
    base: '#f43f5e',
    hover: '#e11d48',
    subtle: 'rgba(244, 63, 94, 0.10)',
    border: 'rgba(244, 63, 94, 0.26)',
    text: '#fb7185',
  },
  info: {
    base: '#0ea5e9',
    hover: '#0284c7',
    subtle: 'rgba(14, 165, 233, 0.10)',
    border: 'rgba(14, 165, 233, 0.24)',
    text: '#38bdf8',
  },
} as const;

export type RiskLevel = 'LOW' | 'REVIEW' | 'HIGH';

export const RISK_LEVEL_CONFIG: Record<
  RiskLevel,
  {
    label: string;
    semantic: 'success' | 'warning' | 'danger';
    bgVar: string;
    borderVar: string;
    textVar: string;
    dotVar: string;
    description: string;
  }
> = {
  LOW: {
    label: 'LOW',
    semantic: 'success',
    bgVar: 'var(--cs-risk-low-bg)',
    borderVar: 'var(--cs-risk-low-border)',
    textVar: 'var(--cs-risk-low-text)',
    dotVar: 'var(--cs-success)',
    description: 'Claim matches standard baseline parameters. Low anomaly probability.',
  },
  REVIEW: {
    label: 'REVIEW',
    semantic: 'warning',
    bgVar: 'var(--cs-risk-review-bg)',
    borderVar: 'var(--cs-risk-review-border)',
    textVar: 'var(--cs-risk-review-text)',
    dotVar: 'var(--cs-warning)',
    description: 'Moderate anomaly or metadata inconsistency detected. Requires routine review.',
  },
  HIGH: {
    label: 'HIGH',
    semantic: 'danger',
    bgVar: 'var(--cs-risk-high-bg)',
    borderVar: 'var(--cs-risk-high-border)',
    textVar: 'var(--cs-risk-high-text)',
    dotVar: 'var(--cs-danger)',
    description: 'Significant visual damage mismatch, duplicate image match, or severe metadata anomaly.',
  },
};
