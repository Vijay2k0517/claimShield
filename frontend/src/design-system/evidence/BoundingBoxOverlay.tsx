import React from 'react';
import './Evidence.css';

export interface BoundingBox {
  id: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage 0 - 100
  height: number; // percentage 0 - 100
  label: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface BoundingBoxOverlayProps {
  boxes: BoundingBox[];
  visible?: boolean;
}

export const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({
  boxes,
  visible = true,
}) => {
  if (!visible || boxes.length === 0) return null;

  return (
    <>
      {boxes.map((box) => (
        <div
          key={box.id}
          className="cs-bbox-marker"
          style={{
            top: `${box.y}%`,
            left: `${box.x}%`,
            width: `${box.width}%`,
            height: `${box.height}%`,
          }}
        >
          <div className="cs-bbox-label">{box.label}</div>
        </div>
      ))}
    </>
  );
};
