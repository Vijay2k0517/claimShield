import React from 'react';
import { Layers, Eye, Sliders } from 'lucide-react';
import { Tabs } from '../primitives/Navigation';
import './Evidence.css';

export type XAIMode = 'ORIGINAL' | 'HEATMAP' | 'OVERLAY';

export interface HeatmapOverlayProps {
  mode: XAIMode;
  onModeChange: (mode: XAIMode) => void;
  opacity: number; // 0 to 1
  onOpacityChange: (opacity: number) => void;
  heatmapImageUrl?: string;
  className?: string;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({
  mode,
  onModeChange,
  opacity,
  onOpacityChange,
  className = '',
}) => {
  const tabs = [
    { id: 'ORIGINAL', label: 'Original Photo', icon: <Eye size={13} /> },
    { id: 'OVERLAY', label: 'AI Heatmap Overlay', icon: <Layers size={13} /> },
    { id: 'HEATMAP', label: 'Activation Heatmap Only', icon: <Sliders size={13} /> },
  ];

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--cs-space-3)',
        padding: 'var(--cs-space-2) var(--cs-space-3)',
        backgroundColor: 'var(--cs-slate-850)',
        border: '1px solid var(--cs-border-default)',
        borderRadius: 'var(--cs-radius-md)',
      }}
    >
      <Tabs
        tabs={tabs}
        activeTab={mode}
        onChange={(id) => onModeChange(id as XAIMode)}
        variant="boxed"
      />

      {mode === 'OVERLAY' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-slate-400)' }}>
            Heatmap Opacity:
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            style={{ width: '90px', accentColor: 'var(--cs-primary)' }}
            aria-label="Heatmap Opacity"
          />
          <span
            className="cs-tabular-nums"
            style={{ fontSize: '11px', color: 'var(--cs-slate-300)', width: '32px' }}
          >
            {(opacity * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
};
