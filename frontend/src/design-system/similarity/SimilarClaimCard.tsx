import React from 'react';
import { SimilarityScore } from './SimilarityScore';
import { RiskBadge } from '../primitives/Badge';
import { RiskLevel } from '../tokens/colors';
import './Similarity.css';

export interface SimilarClaim {
  id: string; // e.g. "CLM-44012"
  similarityScore: number; // e.g. 92
  riskLevel: RiskLevel;
  vehicle: string; // e.g. "2024 Honda Civic Sport"
  dateOfLoss: string; // e.g. "2025-11-14"
  lossLocation: string; // e.g. "Atlanta, GA"
  thumbnailUrl: string;
  matchFactors: string[];
}

export interface SimilarClaimCardProps {
  claim: SimilarClaim;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SimilarClaimCard: React.FC<SimilarClaimCardProps> = ({
  claim,
  isActive = false,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`cs-similar-card ${isActive ? 'cs-card-active' : ''} ${className}`.trim()}
      onClick={onClick}
    >
      <div className="cs-similar-thumb">
        <img src={claim.thumbnailUrl} alt={`Claim ${claim.id}`} />
      </div>

      <div className="cs-similar-content">
        <div className="cs-similar-header">
          <span className="cs-similar-id">{claim.id}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SimilarityScore score={claim.similarityScore} size="sm" showLabel={false} />
            <RiskBadge level={claim.riskLevel} size="sm" />
          </div>
        </div>

        <div style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-text-primary)' }}>
          {claim.vehicle}
        </div>

        <div style={{ fontSize: '10px', color: 'var(--cs-slate-400)' }}>
          Date: {claim.dateOfLoss} • {claim.lossLocation}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
          {claim.matchFactors.map((factor, i) => (
            <span
              key={i}
              style={{
                fontSize: '9px',
                padding: '1px 5px',
                borderRadius: 'var(--cs-radius-xs)',
                backgroundColor: 'var(--cs-slate-800)',
                color: 'var(--cs-slate-300)',
                border: '1px solid var(--cs-border-subtle)',
              }}
            >
              {factor}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
