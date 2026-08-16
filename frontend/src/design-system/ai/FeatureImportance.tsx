import React from 'react';
import './AI.css';

export interface FeatureWeight {
  name: string;
  weight: number; // e.g. +0.38 or -0.22
  category?: string;
}

export interface FeatureImportanceProps {
  features: FeatureWeight[];
  maxFeatures?: number;
  className?: string;
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({
  features,
  maxFeatures = 6,
  className = '',
}) => {
  const visible = features.slice(0, maxFeatures);

  return (
    <div className={className}>
      <div
        style={{
          fontSize: 'var(--cs-text-size-caption)',
          fontWeight: 'var(--cs-font-weight-semibold)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--cs-tracking-wider)',
          color: 'var(--cs-slate-400)',
          marginBottom: 'var(--cs-space-3)',
        }}
      >
        Explainable AI — Top Risk Factor Weights
      </div>

      {visible.map((feat, index) => {
        const isPositiveRisk = feat.weight > 0;
        const absVal = Math.min(Math.abs(feat.weight) * 100, 100);

        return (
          <div key={index} className="cs-feature-item">
            <div className="cs-feature-header">
              <span>{feat.name}</span>
              <span
                className="cs-tabular-nums"
                style={{
                  fontWeight: 'var(--cs-font-weight-semibold)',
                  color: isPositiveRisk ? 'var(--cs-danger-text)' : 'var(--cs-success-text)',
                }}
              >
                {isPositiveRisk ? `+${(feat.weight * 100).toFixed(0)}%` : `${(feat.weight * 100).toFixed(0)}%`}
              </span>
            </div>

            <div className="cs-fraud-prob-track" style={{ height: '5px' }}>
              <div
                className="cs-fraud-prob-fill"
                style={{
                  width: `${absVal}%`,
                  backgroundColor: isPositiveRisk ? 'var(--cs-danger)' : 'var(--cs-success)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
