import React from 'react';
import { RiskBadge } from '../primitives/Badge';
import { RiskLevel } from '../tokens/colors';
import { SimilarityScore } from './SimilarityScore';
import './Similarity.css';

export interface ComparisonField {
  label: string;
  currentValue: string;
  historicalValue: string;
  isMatch?: boolean;
}

export interface ClaimComparisonProps {
  currentClaimId: string;
  historicalClaimId: string;
  currentRisk: RiskLevel;
  historicalRisk: RiskLevel;
  similarityScore: number;
  fields: ComparisonField[];
  className?: string;
}

export const ClaimComparison: React.FC<ClaimComparisonProps> = ({
  currentClaimId,
  historicalClaimId,
  currentRisk,
  historicalRisk,
  similarityScore,
  fields,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--cs-slate-900)',
        border: '1px solid var(--cs-border-default)',
        borderRadius: 'var(--cs-radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          padding: 'var(--cs-space-3) var(--cs-space-4)',
          backgroundColor: 'var(--cs-slate-850)',
          borderBottom: '1px solid var(--cs-border-default)',
          fontSize: 'var(--cs-text-size-caption)',
          fontWeight: 'var(--cs-font-weight-semibold)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--cs-tracking-wider)',
        }}
      >
        <span style={{ color: 'var(--cs-slate-400)' }}>Attribute</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'var(--cs-primary-text)' }}>Current: {currentClaimId}</span>
          <RiskBadge level={currentRisk} size="sm" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'var(--cs-warning-text)' }}>Historical: {historicalClaimId}</span>
          <RiskBadge level={historicalRisk} size="sm" />
        </div>
      </div>

      <div style={{ padding: 'var(--cs-space-2) var(--cs-space-4)' }}>
        {fields.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              padding: '8px 0',
              borderBottom: i === fields.length - 1 ? 'none' : '1px solid var(--cs-border-subtle)',
              fontSize: 'var(--cs-text-size-body-sm)',
              alignItems: 'center',
            }}
          >
            <span style={{ color: 'var(--cs-slate-400)' }}>{f.label}</span>
            <span style={{ color: 'var(--cs-text-primary)' }}>{f.currentValue}</span>
            <span
              style={{
                color: f.isMatch ? 'var(--cs-danger-text)' : 'var(--cs-slate-300)',
                fontWeight: f.isMatch ? 'var(--cs-font-weight-semibold)' : 'normal',
                backgroundColor: f.isMatch ? 'var(--cs-danger-subtle)' : 'transparent',
                padding: f.isMatch ? '2px 6px' : '0',
                borderRadius: 'var(--cs-radius-xs)',
                display: 'inline-block',
                width: 'fit-content',
              }}
            >
              {f.historicalValue} {f.isMatch ? '(Exact Match)' : ''}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--cs-space-3) var(--cs-space-4)',
          backgroundColor: 'var(--cs-slate-850)',
          borderTop: '1px solid var(--cs-border-default)',
        }}
      >
        <span style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-slate-400)' }}>
          Vector Distance & Multi-modal Damage Alignment
        </span>
        <SimilarityScore score={similarityScore} />
      </div>
    </div>
  );
};
