import React, { forwardRef } from 'react';
import './Form.css';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, disabled, className = '', ...props }, ref) => {
    return (
      <label className={`cs-switch-label ${disabled ? 'cs-disabled' : ''} ${className}`.trim()}>
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className="cs-switch-input"
          disabled={disabled}
          {...props}
        />
        <div className="cs-switch-track">
          <div className="cs-switch-thumb" />
        </div>
        {label && <span style={{ fontSize: 'var(--cs-text-size-body)', color: 'var(--cs-slate-300)' }}>{label}</span>}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
