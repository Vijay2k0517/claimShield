import React, { useState } from 'react';
import { Columns, SplitSquareVertical } from 'lucide-react';
import { Tabs } from '../primitives/Navigation';
import { ComparisonSlider } from './ComparisonSlider';
import './Evidence.css';

export type ComparisonViewMode = 'slider' | 'side-by-side';

export interface ImageComparisonProps {
  currentImageUrl: string;
  historicalImageUrl: string;
  currentLabel?: string;
  historicalLabel?: string;
  currentMetadata?: string;
  historicalMetadata?: string;
  className?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  currentImageUrl,
  historicalImageUrl,
  currentLabel = 'Current Claim #88421',
  historicalLabel = 'Historical Match #44012',
  currentMetadata = '2026 Honda Civic — Front Right Bumper',
  historicalMetadata = '2025 Honda Civic — Front Right Bumper (SIU Flagged)',
  className = '',
}) => {
  const [mode, setMode] = useState<ComparisonViewMode>('slider');

  const tabs = [
    { id: 'slider', label: 'Split Slider', icon: <SplitSquareVertical size={13} /> },
    { id: 'side-by-side', label: 'Side-by-Side', icon: <Columns size={13} /> },
  ];

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--cs-space-3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 'var(--cs-text-size-caption)',
            fontWeight: 'var(--cs-font-weight-semibold)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--cs-tracking-wider)',
            color: 'var(--cs-slate-400)',
          }}
        >
          Visual Evidence Comparison
        </span>
        <Tabs
          tabs={tabs}
          activeTab={mode}
          onChange={(id) => setMode(id as ComparisonViewMode)}
          variant="boxed"
        />
      </div>

      {mode === 'slider' ? (
        <ComparisonSlider
          beforeImageUrl={currentImageUrl}
          afterImageUrl={historicalImageUrl}
          beforeLabel={currentLabel}
          afterLabel={historicalLabel}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--cs-space-3)' }}>
          {/* Current Claim Pane */}
          <div
            style={{
              backgroundColor: 'var(--cs-slate-900)',
              border: '1px solid var(--cs-border-default)',
              borderRadius: 'var(--cs-radius-lg)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: 'var(--cs-space-2) var(--cs-space-3)',
                backgroundColor: 'var(--cs-slate-850)',
                borderBottom: '1px solid var(--cs-border-default)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--cs-text-size-caption)',
              }}
            >
              <strong style={{ color: 'var(--cs-primary-text)' }}>{currentLabel}</strong>
              <span style={{ color: 'var(--cs-slate-400)' }}>{currentMetadata}</span>
            </div>
            <div style={{ height: '320px', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={currentImageUrl}
                alt={currentLabel}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Historical Match Pane */}
          <div
            style={{
              backgroundColor: 'var(--cs-slate-900)',
              border: '1px solid var(--cs-border-default)',
              borderRadius: 'var(--cs-radius-lg)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: 'var(--cs-space-2) var(--cs-space-3)',
                backgroundColor: 'var(--cs-slate-850)',
                borderBottom: '1px solid var(--cs-border-default)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--cs-text-size-caption)',
              }}
            >
              <strong style={{ color: 'var(--cs-warning-text)' }}>{historicalLabel}</strong>
              <span style={{ color: 'var(--cs-slate-400)' }}>{historicalMetadata}</span>
            </div>
            <div style={{ height: '320px', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={historicalImageUrl}
                alt={historicalLabel}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
