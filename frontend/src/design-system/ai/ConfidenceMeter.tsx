import React from 'react';
import { Gauge, HelpCircle } from 'lucide-react';
import { Tooltip } from '../primitives/Overlay';
import './AI.css';

export interface ConfidenceMeterProps {
  confidenceScore: number; // 0 to 100
  sampleSize?: number;
  modelIdentifier?: string;
  className?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidenceScore,
  sampleSize,
  modelIdentifier = 'Vision-Classifier-v2.4',
  className = '',
}) => {
  const clamped = Math.min(Math.max(confidenceScore, 0), 100);

  const getTier = (val: number) => {
    if (val >= 85) return { label: 'High Confidence', color: 'var(--cs-info-text)' };
    if (val >= 65) return { label: 'Moderate Confidence', color: 'var(--cs-warning-text)' };
    return { label: 'Low Confidence / Sparse Data', color: 'var(--cs-slate-400)' };
  };

  const tier = getTier(clamped);

  return (
    <div
      className={className}
      style={{
        padding: 'var(--cs-space-3) var(--cs-space-4)',
        backgroundColor: 'var(--cs-slate-850)',
        border: '1px solid var(--cs-border-default)',
        borderRadius: 'var(--cs-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Gauge size={14} color="var(--cs-info-text)" />
          <span
            style={{
              fontSize: 'var(--cs-text-size-caption)',
              fontWeight: 'var(--cs-font-weight-semibold)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--cs-tracking-wider)',
              color: 'var(--cs-slate-400)',
            }}
          >
            Model Confidence
          </span>
          <Tooltip content="Statistical certainty score indicating model feature completeness. Distinct from fraud probability.">
            <span style={{ color: 'var(--cs-slate-500)', display: 'flex', cursor: 'help' }}>
              <HelpCircle size={12} />
            </span>
          </Tooltip>
        </div>

        <span
          className="cs-tabular-nums"
          style={{
            fontWeight: 'var(--cs-font-weight-bold)',
            color: tier.color,
            fontSize: 'var(--cs-text-size-body)',
          }}
        >
          {clamped}% ({tier.label})
        </span>
      </div>

      <div className="cs-fraud-prob-track" style={{ height: '6px' }}>
        <div
          className="cs-fraud-prob-fill"
          style={{ width: `${clamped}%`, backgroundColor: tier.color }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: 'var(--cs-slate-500)',
        }}
      >
        <span>Model: {modelIdentifier}</span>
        {sampleSize && <span>Calibrated across {sampleSize.toLocaleString()} cases</span>}
      </div>
    </div>
  );
};
