import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './DataDisplay.css';

export type TrendDirection = 'positive' | 'negative' | 'neutral';

export interface TrendIndicatorProps {
  value: string | number;
  direction?: TrendDirection;
  label?: string;
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  direction = 'neutral',
  label,
  className = '',
}) => {
  const Icon =
    direction === 'positive'
      ? TrendingUp
      : direction === 'negative'
      ? TrendingDown
      : Minus;

  return (
    <span
      className={`cs-trend cs-trend-${direction} ${className}`.trim()}
      title={label}
    >
      <Icon size={12} />
      <span className="cs-tabular-nums">{value}</span>
      {label && <span style={{ opacity: 0.8 }}>{label}</span>}
    </span>
  );
};
