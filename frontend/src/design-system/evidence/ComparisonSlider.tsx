import React, { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import './Evidence.css';

export interface ComparisonSliderProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number; // 0 to 100 percentage
  className?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeImageUrl,
  afterImageUrl,
  beforeLabel = 'Current Claim Evidence',
  afterLabel = 'Historical Reference Claim',
  initialPosition = 50,
  className = '',
}) => {
  const [sliderPos, setSliderPos] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`cs-comparison-container ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Background (After / Historical Image) */}
      <img src={afterImageUrl} alt={afterLabel} className="cs-comparison-image" />
      <span
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 4,
          backgroundColor: 'rgba(9, 13, 22, 0.85)',
          padding: '2px 8px',
          borderRadius: 'var(--cs-radius-sm)',
          fontSize: '11px',
          color: 'var(--cs-slate-300)',
          border: '1px solid var(--cs-border-default)',
        }}
      >
        {afterLabel}
      </span>

      {/* Foreground (Before / Current Claim Image - Clipped) */}
      <div className="cs-comparison-before" style={{ width: `${sliderPos}%` }}>
        <img
          src={beforeImageUrl}
          alt={beforeLabel}
          className="cs-comparison-image"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
        />
        <span
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 6,
            backgroundColor: 'rgba(9, 13, 22, 0.85)',
            padding: '2px 8px',
            borderRadius: 'var(--cs-radius-sm)',
            fontSize: '11px',
            color: 'var(--cs-primary-text)',
            border: '1px solid var(--cs-primary-border)',
          }}
        >
          {beforeLabel}
        </span>
      </div>

      {/* Draggable Divider Handle */}
      <div
        className="cs-comparison-handle"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="cs-comparison-handle-btn" aria-label="Slide to compare">
          <ChevronsLeftRight size={14} />
        </div>
      </div>
    </div>
  );
};
