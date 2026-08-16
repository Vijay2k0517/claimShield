import React from 'react';
import './DataDisplay.css';

export interface DataLabelProps {
  label: string;
  value: React.ReactNode;
  isMono?: boolean;
  tooltip?: string;
  className?: string;
}

export const DataLabel: React.FC<DataLabelProps> = ({
  label,
  value,
  isMono = false,
  tooltip,
  className = '',
}) => {
  return (
    <div className={`cs-data-label ${className}`.trim()} title={tooltip}>
      <span className="cs-data-label-key">{label}</span>
      <span
        className={`cs-data-label-value ${isMono ? 'cs-tabular-nums' : ''}`}
        style={isMono ? { fontFamily: 'var(--cs-font-mono)' } : undefined}
      >
        {value}
      </span>
    </div>
  );
};
