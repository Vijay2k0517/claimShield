import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { SeverityIndicator, SeverityLevel } from '../primitives/Badge';
import './AI.css';

export interface AnomalyItem {
  id: string;
  title: string;
  category: 'Visual' | 'Metadata' | 'Historical' | 'Estimate';
  severity: SeverityLevel;
  description: string;
  evidenceReference?: string;
}

export interface AnomalyListProps {
  anomalies: AnomalyItem[];
  emptyMessage?: string;
  className?: string;
}

export const AnomalyList: React.FC<AnomalyListProps> = ({
  anomalies,
  emptyMessage = 'No risk anomalies detected across evidence media.',
  className = '',
}) => {
  if (anomalies.length === 0) {
    return (
      <div
        className={className}
        style={{
          padding: 'var(--cs-space-4)',
          backgroundColor: 'var(--cs-slate-850)',
          borderRadius: 'var(--cs-radius-md)',
          border: '1px solid var(--cs-border-default)',
          color: 'var(--cs-success-text)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: 'var(--cs-text-size-body-sm)',
        }}
      >
        <CheckCircle2 size={16} />
        <span>{emptyMessage}</span>
      </div>
    );
  }

  const categoryIcons = {
    Visual: <AlertTriangle size={15} color="var(--cs-danger-text)" />,
    Metadata: <Info size={15} color="var(--cs-info-text)" />,
    Historical: <AlertCircle size={15} color="var(--cs-warning-text)" />,
    Estimate: <AlertCircle size={15} color="var(--cs-warning-text)" />,
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--cs-space-2)',
      }}
    >
      {anomalies.map((item) => (
        <div
          key={item.id}
          style={{
            padding: 'var(--cs-space-3) var(--cs-space-4)',
            backgroundColor: 'var(--cs-slate-850)',
            border: '1px solid var(--cs-border-default)',
            borderRadius: 'var(--cs-radius-md)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div style={{ marginTop: '2px', flexShrink: 0 }}>{categoryIcons[item.category]}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontWeight: 'var(--cs-font-weight-semibold)',
                    fontSize: 'var(--cs-text-size-body-sm)',
                    color: 'var(--cs-text-primary)',
                  }}
                >
                  {item.title}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '1px 5px',
                    borderRadius: 'var(--cs-radius-xs)',
                    backgroundColor: 'var(--cs-slate-800)',
                    color: 'var(--cs-slate-400)',
                  }}
                >
                  {item.category}
                </span>
              </div>

              <SeverityIndicator severity={item.severity} />
            </div>

            <p
              style={{
                fontSize: 'var(--cs-text-size-caption)',
                color: 'var(--cs-slate-300)',
                marginTop: '4px',
                lineHeight: 'var(--cs-leading-normal)',
              }}
            >
              {item.description}
            </p>

            {item.evidenceReference && (
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--cs-primary-text)',
                  marginTop: '4px',
                }}
              >
                Ref: {item.evidenceReference}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
