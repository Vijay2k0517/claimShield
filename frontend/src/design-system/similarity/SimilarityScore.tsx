import React from 'react';
import { Copy } from 'lucide-react';
import './Similarity.css';

export interface SimilarityScoreProps {
  score: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SimilarityScore: React.FC<SimilarityScoreProps> = ({
  score,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const clamped = Math.min(Math.max(score, 0), 100);

  // Match severity color
  const color =
    clamped >= 85
      ? 'var(--cs-danger-text)'
      : clamped >= 60
      ? 'var(--cs-warning-text)'
      : 'var(--cs-slate-400)';

  const bg =
    clamped >= 85
      ? 'var(--cs-danger-subtle)'
      : clamped >= 60
      ? 'var(--cs-warning-subtle)'
      : 'var(--cs-slate-800)';

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '1px 6px' : '3px 8px',
        backgroundColor: bg,
        border: `1px solid ${color}40`,
        borderRadius: 'var(--cs-radius-sm)',
        color,
        fontSize: size === 'sm' ? '11px' : 'var(--cs-text-size-caption)',
        fontWeight: 'var(--cs-font-weight-semibold)',
      }}
    >
      <Copy size={size === 'sm' ? 11 : 13} />
      {showLabel && <span>Similarity:</span>}
      <span className="cs-tabular-nums">{clamped}%</span>
    </div>
  );
};
