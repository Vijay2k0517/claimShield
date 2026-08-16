import React from 'react';
import { Gauge } from 'lucide-react';
import './Badge.css';

export interface ConfidenceIndicatorProps {
  confidence: number; // 0 to 100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  label = 'AI Confidence',
  size = 'md',
  showBar = false,
  className = '',
}) => {
  const clamped = Math.min(Math.max(confidence, 0), 100);
  
  // High confidence is reassuring (>80%), medium (60-80%), low (<60%)
  const color =
    clamped >= 80
      ? 'var(--cs-info-text)'
      : clamped >= 60
      ? 'var(--cs-warning-text)'
      : 'var(--cs-slate-400)';

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: size === 'sm' ? 'var(--cs-text-size-caption)' : 'var(--cs-text-size-body-sm)',
          color: 'var(--cs-slate-300)',
        }}
      >
        <Gauge size={size === 'sm' ? 12 : 14} color={color} />
        {label && <span style={{ color: 'var(--cs-slate-400)' }}>{label}:</span>}
        <span className="cs-tabular-nums" style={{ fontWeight: 'var(--cs-font-weight-semibold)', color }}>
          {clamped.toFixed(0)}%
        </span>
      </div>

      {showBar && (
        <div className="cs-progress-bar" style={{ height: '4px', width: '100px' }}>
          <div
            className="cs-progress-fill"
            style={{
              width: `${clamped}%`,
              backgroundColor: color,
            }}
          />
        </div>
      )}
    </div>
  );
};
