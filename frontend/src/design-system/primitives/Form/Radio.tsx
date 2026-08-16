import React, { forwardRef } from 'react';
import './Form.css';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, disabled, className = '', ...props }, ref) => {
    return (
      <label className={`cs-control-row ${disabled ? 'cs-disabled' : ''} ${className}`.trim()}>
        <input
          ref={ref}
          type="radio"
          className="cs-radio"
          disabled={disabled}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
