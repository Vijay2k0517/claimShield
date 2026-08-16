import React from 'react';
import './Feedback.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  circle = false,
  className = '',
  style,
}) => {
  return (
    <div
      className={`cs-skeleton ${circle ? 'cs-skeleton-circle' : ''} ${className}`.trim()}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: circle ? '50%' : undefined,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};
