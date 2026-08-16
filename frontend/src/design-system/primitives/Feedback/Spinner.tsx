import React from 'react';
import './Feedback.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  return (
    <span
      className={`cs-spinner cs-spinner-${size} ${className}`.trim()}
      role="status"
      aria-label="Loading"
    />
  );
};
