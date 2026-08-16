import React from 'react';
import { RiskLevel } from '../tokens/colors';
import { RiskBadge } from '../primitives/Badge';
import './AI.css';

export interface FraudProbabilityProps {
  score?: number; // e.g. 87
  riskLevel?: RiskLevel;
  isLoading?: boolean;
  isUnavailable?: boolean;
  confidence?: number; // e.g. 94
  thresholds?: { lowMax: number; reviewMax: number };
  className?: string;
}

export const FraudProbability: React.FC<FraudProbabilityProps> = ({
  score = 0,
  riskLevel = 'REVIEW',
  isLoading = false,
  isUnavailable = false,
  confidence,
  thresholds = { lowMax: 30, reviewMax: 70 },
  className = '',
}) => {
  const derivedLevel: RiskLevel =
    riskLevel ||
    (score <= thresholds.lowMax ? 'LOW' : score <= thresholds.reviewMax ? 'REVIEW' : 'HIGH');

  const riskClasses = {
    LOW: 'cs-risk-low',
    REVIEW: 'cs-risk-review',
    HIGH: 'cs-risk-high',
  };

  const fillColors = {
    LOW: 'var(--cs-success)',
    REVIEW: 'var(--cs-warning)',
    HIGH: 'var(--cs-danger)',
  };

  return (
    <div
      className={`cs-fraud-prob-card ${riskClasses[derivedLevel]} ${className}`.trim()}
    >
      <div className="cs-fraud-prob-label">
        <span>Fraud Probability</span>
        {confidence !== undefined && !isLoading && !isUnavailable && (
          <span style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-slate-400)' }}>
            Model Confidence: <strong className="cs-tabular-nums">{confidence}%</strong>
          </span>
        )}
      </div>

      <div className="cs-fraud-prob-score-row">
        {isLoading ? (
          <div
            style={{
              height: '44px',
              width: '140px',
              backgroundColor: 'var(--cs-slate-800)',
              borderRadius: 'var(--cs-radius-sm)',
              animation: 'cs-pulse 1.5s infinite ease-in-out',
            }}
          />
        ) : isUnavailable ? (
          <span className="cs-fraud-prob-score" style={{ color: 'var(--cs-slate-500)' }}>
            N/A
          </span>
        ) : (
          <>
            <span className="cs-fraud-prob-score cs-tabular-nums">{score}%</span>
            <RiskBadge level={derivedLevel} size="lg" />
          </>
        )}
      </div>

      {!isLoading && !isUnavailable && (
        <div className="cs-fraud-prob-bar-container">
          <div className="cs-fraud-prob-track">
            <div
              className="cs-fraud-prob-fill"
              style={{
                width: `${Math.min(Math.max(score, 0), 100)}%`,
                backgroundColor: fillColors[derivedLevel],
              }}
            />
          </div>
          <div className="cs-fraud-prob-ticks">
            <span>0% (LOW)</span>
            <span>{thresholds.lowMax}%</span>
            <span>{thresholds.reviewMax}% (HIGH)</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
};
