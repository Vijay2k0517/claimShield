import React from 'react';
import './Shell.css';

export interface ToolbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  left,
  right,
  children,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--cs-space-3)',
        padding: 'var(--cs-space-3) 0',
      }}
    >
      {left && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--cs-space-2)' }}>{left}</div>}
      {children}
      {right && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--cs-space-2)' }}>{right}</div>}
    </div>
  );
};
