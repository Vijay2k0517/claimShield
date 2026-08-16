import React from 'react';
import './DataDisplay.css';

export interface StatBlockProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  variant?: 'default' | 'highlight' | 'danger' | 'warning' | 'success';
  className?: string;
}

export const StatBlock: React.FC<StatBlockProps> = ({
  label,
  value,
  hint,
  variant = 'default',
  className = '',
}) => {
  const variantColors: Record<string, string> = {
    default: 'var(--cs-text-primary)',
    highlight: 'var(--cs-primary-text)',
    danger: 'var(--cs-danger-text)',
    warning: 'var(--cs-warning-text)',
    success: 'var(--cs-success-text)',
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: 'var(--cs-space-2) var(--cs-space-3)',
        backgroundColor: 'var(--cs-slate-850)',
        border: '1px solid var(--cs-border-default)',
        borderRadius: 'var(--cs-radius-md)',
      }}
    >
      <span
        style={{
          fontSize: 'var(--cs-text-size-caption)',
          color: 'var(--cs-slate-400)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--cs-tracking-wider)',
        }}
      >
        {label}
      </span>
      <span
        className="cs-tabular-nums"
        style={{
          fontSize: 'var(--cs-text-size-h2)',
          fontWeight: 'var(--cs-font-weight-semibold)',
          color: variantColors[variant],
          lineHeight: 'var(--cs-leading-tight)',
        }}
      >
        {value}
      </span>
      {hint && (
        <span
          style={{
            fontSize: '10px',
            color: 'var(--cs-slate-500)',
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
};
