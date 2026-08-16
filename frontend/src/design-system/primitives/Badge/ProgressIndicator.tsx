import React from 'react';
import './Badge.css';

export interface ProgressIndicatorProps {
  value: number; // 0 to 100
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  height?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  variant = 'primary',
  height = 6,
  label,
  showPercentage = false,
  className = '',
}) => {
  const clamped = Math.min(Math.max(value, 0), 100);

  const variantColors: Record<string, string> = {
    primary: 'var(--cs-primary)',
    success: 'var(--cs-success)',
    warning: 'var(--cs-warning)',
    danger: 'var(--cs-danger)',
    info: 'var(--cs-info)',
  };

  return (
    <div className={className} style={{ width: '100%' }}>
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
            fontSize: 'var(--cs-text-size-caption)',
            color: 'var(--cs-slate-400)',
          }}
        >
          {label && <span>{label}</span>}
          {showPercentage && (
            <span className="cs-tabular-nums" style={{ color: 'var(--cs-text-primary)' }}>
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div className="cs-progress-bar" style={{ height: `${height}px` }}>
        <div
          className="cs-progress-fill"
          style={{
            width: `${clamped}%`,
            backgroundColor: variantColors[variant] || variantColors.primary,
          }}
        />
      </div>
    </div>
  );
};
