/**
 * ClaimShield AI — Spacing & Layout Tokens
 */

export const CS_SPACING = {
  0: 'var(--cs-space-0)',     // 0px
  0.5: 'var(--cs-space-0-5)', // 2px
  1: 'var(--cs-space-1)',     // 4px
  1.5: 'var(--cs-space-1-5)', // 6px
  2: 'var(--cs-space-2)',     // 8px
  2.5: 'var(--cs-space-2-5)', // 10px
  3: 'var(--cs-space-3)',     // 12px
  3.5: 'var(--cs-space-3-5)', // 14px
  4: 'var(--cs-space-4)',     // 16px
  5: 'var(--cs-space-5)',     // 20px
  6: 'var(--cs-space-6)',     // 24px
  7: 'var(--cs-space-7)',     // 28px
  8: 'var(--cs-space-8)',     // 32px
  10: 'var(--cs-space-10)',   // 40px
  12: 'var(--cs-space-12)',   // 48px
  16: 'var(--cs-space-16)',   // 64px
} as const;

export const CS_RADIUS = {
  xs: 'var(--cs-radius-xs)',   // 2px
  sm: 'var(--cs-radius-sm)',   // 4px
  md: 'var(--cs-radius-md)',   // 6px
  lg: 'var(--cs-radius-lg)',   // 8px
  xl: 'var(--cs-radius-xl)',   // 12px
  full: 'var(--cs-radius-full)', // 9999px
} as const;

export const CS_ELEVATION = {
  none: 'var(--cs-elevation-none)',
  subtle: 'var(--cs-elevation-subtle)',
  elevated: 'var(--cs-elevation-elevated)',
  overlay: 'var(--cs-elevation-overlay)',
} as const;
