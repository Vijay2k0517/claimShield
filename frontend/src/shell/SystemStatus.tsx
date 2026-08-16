import React from 'react';
import './Shell.css';

export interface SystemStatusProps {
  statusText?: string;
  isOnline?: boolean;
  className?: string;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  statusText = 'System Operational',
  isOnline = true,
  className = '',
}) => {
  return (
    <div
      className={`cs-system-status ${className}`.trim()}
      title="All AI Computer Vision & Vector Models Healthy"
      aria-label="System operational status"
    >
      <span
        className="cs-system-status-dot"
        style={{
          backgroundColor: isOnline ? 'var(--cs-success)' : 'var(--cs-danger)',
        }}
        aria-hidden="true"
      />
      <span className="cs-system-status-text">{statusText}</span>
    </div>
  );
};
