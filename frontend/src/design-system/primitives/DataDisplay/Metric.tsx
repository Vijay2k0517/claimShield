import React from 'react';
import { TrendIndicator, TrendDirection } from './TrendIndicator';
import './DataDisplay.css';

export interface MetricProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: TrendDirection;
    label?: string;
  };
  description?: string;
  className?: string;
}

export const Metric: React.FC<MetricProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 'var(--cs-space-3) var(--cs-space-4)',
        backgroundColor: 'var(--cs-obsidian-900)',
        border: '1px solid var(--cs-border-default)',
        borderRadius: 'var(--cs-radius-md)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span
          style={{
            fontSize: 'var(--cs-text-size-caption)',
            color: 'var(--cs-stone-400)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--cs-tracking-wider)',
          }}
        >
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            className="cs-tabular-nums"
            style={{
              fontSize: 'var(--cs-text-size-h1)',
              fontWeight: 'var(--cs-font-weight-bold)',
              color: 'var(--cs-text-primary)',
            }}
          >
            {value}
          </span>
          {trend && (
            <TrendIndicator
              value={trend.value}
              direction={trend.direction}
              label={trend.label}
            />
          )}
        </div>
        {description && (
          <span style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-stone-500)' }}>
            {description}
          </span>
        )}
      </div>

      {icon && (
        <div
          style={{
            padding: '8px',
            borderRadius: 'var(--cs-radius-md)',
            backgroundColor: 'var(--cs-obsidian-800)',
            color: 'var(--cs-stone-300)',
            display: 'flex',
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
};
