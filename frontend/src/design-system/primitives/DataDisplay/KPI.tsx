import React from 'react';
import { TrendIndicator, TrendDirection } from './TrendIndicator';
import './DataDisplay.css';

export interface KPIProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string | number;
    direction: TrendDirection;
    label?: string;
  };
  isLoading?: boolean;
  isUnavailable?: boolean;
  badge?: React.ReactNode;
  className?: string;
}

export const KPI: React.FC<KPIProps> = ({
  title,
  value,
  subtitle,
  trend,
  isLoading = false,
  isUnavailable = false,
  badge,
  className = '',
}) => {
  return (
    <div className={`cs-kpi-card ${className}`.trim()}>
      <div className="cs-kpi-header">
        <span className="cs-kpi-title">{title}</span>
        {badge}
      </div>

      <div className="cs-kpi-value-row">
        {isLoading ? (
          <div
            style={{
              height: '38px',
              width: '120px',
              backgroundColor: 'var(--cs-slate-800)',
              borderRadius: 'var(--cs-radius-sm)',
              animation: 'cs-pulse 1.5s infinite ease-in-out',
            }}
          />
        ) : isUnavailable ? (
          <span className="cs-kpi-value" style={{ color: 'var(--cs-slate-500)' }}>
            N/A
          </span>
        ) : (
          <span className="cs-kpi-value cs-tabular-nums">{value}</span>
        )}

        {!isLoading && !isUnavailable && trend && (
          <TrendIndicator
            value={trend.value}
            direction={trend.direction}
            label={trend.label}
          />
        )}
      </div>

      {subtitle && <div className="cs-kpi-subtitle">{subtitle}</div>}
    </div>
  );
};
