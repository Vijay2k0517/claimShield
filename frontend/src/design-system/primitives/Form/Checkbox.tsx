import React, { forwardRef } from 'react';
import './Form.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, disabled, className = '', ...props }, ref) => {
    return (
      <label className={`cs-control-row ${disabled ? 'cs-disabled' : ''} ${className}`.trim()}>
        <input
          ref={ref}
          type="checkbox"
          className="cs-checkbox"
          disabled={disabled}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
