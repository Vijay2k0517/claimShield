import React from 'react';
import { RiskLevel, RISK_LEVEL_CONFIG } from '../../tokens/colors';
import { BadgeSize } from './Badge';
import './Badge.css';

export interface RiskBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: RiskLevel;
  size?: BadgeSize;
  dot?: boolean;
  score?: number; // Optional probability percentage, e.g. 87
  showLabel?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  dot = true,
  score,
  showLabel = true,
  className = '',
  ...props
}) => {
  const config = RISK_LEVEL_CONFIG[level] || RISK_LEVEL_CONFIG.REVIEW;
  const levelClass = `cs-risk-badge-${level.toLowerCase()}`;

  return (
    <span
      className={`cs-badge cs-risk-badge ${levelClass} cs-badge-${size} ${className}`.trim()}
      title={`${config.label} Risk: ${config.description}`}
      {...props}
    >
      {dot && <span className="cs-badge-dot" aria-hidden="true" />}
      {showLabel && <span>{config.label}</span>}
      {score !== undefined && (
        <span className="cs-tabular-nums" style={{ opacity: 0.9 }}>
          {score}%
        </span>
      )}
    </span>
  );
};
