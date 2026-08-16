import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Tag } from 'lucide-react';
import { IconButton } from '../primitives/Button';
import { BoundingBoxOverlay, BoundingBox } from './BoundingBoxOverlay';
import { XAIMode } from './HeatmapOverlay';
import './Evidence.css';

export interface EvidenceViewerProps {
  imageUrl: string;
  heatmapUrl?: string;
  xaiMode?: XAIMode;
  heatmapOpacity?: number;
  boundingBoxes?: BoundingBox[];
  showBoundingBoxes?: boolean;
  metadataTag?: string;
  alt?: string;
  className?: string;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  imageUrl,
  heatmapUrl,
  xaiMode = 'ORIGINAL',
  heatmapOpacity = 0.65,
  boundingBoxes = [],
  showBoundingBoxes = true,
  metadataTag,
  alt = 'Vehicle damage evidence',
  className = '',
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [boxesVisible, setBoxesVisible] = useState(showBoundingBoxes);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoom(1);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`cs-evidence-viewer ${className}`.trim()}
      style={isFullscreen ? { height: '100vh', width: '100vw', borderRadius: 0 } : undefined}
    >
      {metadataTag && (
        <div className="cs-evidence-topbar">
          <span
            style={{
              fontSize: '11px',
              backgroundColor: 'rgba(9, 13, 22, 0.85)',
              padding: '3px 8px',
              borderRadius: 'var(--cs-radius-sm)',
              border: '1px solid var(--cs-border-default)',
              color: 'var(--cs-slate-300)',
            }}
          >
            {metadataTag}
          </span>
        </div>
      )}

      <div
        className="cs-evidence-viewer-canvas"
        style={{
          transform: `scale(${zoom})`,
        }}
      >
        {/* Base Vehicle Image */}
        {xaiMode !== 'HEATMAP' && (
          <img src={imageUrl} alt={alt} className="cs-evidence-image" />
        )}

        {/* Heatmap Layer */}
        {heatmapUrl && (xaiMode === 'HEATMAP' || xaiMode === 'OVERLAY') && (
          <img
            src={heatmapUrl}
            alt="AI Attention Heatmap"
            className="cs-heatmap-layer"
            style={{
              opacity: xaiMode === 'HEATMAP' ? 1 : heatmapOpacity,
              position: xaiMode === 'HEATMAP' ? 'relative' : 'absolute',
            }}
          />
        )}

        {/* Bounding Box Annotations */}
        {boundingBoxes.length > 0 && (
          <BoundingBoxOverlay boxes={boundingBoxes} visible={boxesVisible} />
        )}
      </div>

      {/* Floating Canvas Controls */}
      <div className="cs-evidence-toolbar">
        <IconButton
          variant="ghost"
          size="sm"
          icon={<ZoomIn size={14} />}
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          aria-label="Zoom in"
        />
        <span
          className="cs-tabular-nums"
          style={{ fontSize: '11px', color: 'var(--cs-slate-300)', padding: '0 4px' }}
        >
          {(zoom * 100).toFixed(0)}%
        </span>
        <IconButton
          variant="ghost"
          size="sm"
          icon={<ZoomOut size={14} />}
          onClick={handleZoomOut}
          disabled={zoom <= 0.75}
          aria-label="Zoom out"
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={<RotateCcw size={14} />}
          onClick={handleResetZoom}
          disabled={zoom === 1}
          aria-label="Reset zoom"
        />
        {boundingBoxes.length > 0 && (
          <IconButton
            variant={boxesVisible ? 'primary' : 'ghost'}
            size="sm"
            icon={<Tag size={14} />}
            onClick={() => setBoxesVisible(!boxesVisible)}
            aria-label="Toggle annotations"
          />
        )}
        <IconButton
          variant="ghost"
          size="sm"
          icon={isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
        />
      </div>
    </div>
  );
};
