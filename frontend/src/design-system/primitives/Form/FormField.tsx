import React from 'react';
import { AlertCircle } from 'lucide-react';
import './Form.css';

export interface FormFieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  optional = false,
  helperText,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`cs-form-field ${className}`.trim()}>
      {label && (
        <div className="cs-form-label-row">
          <label htmlFor={id} className="cs-form-label">
            {label}
            {required && <span className="cs-form-required" aria-hidden="true">*</span>}
          </label>
          {optional && !required && <span className="cs-form-optional">Optional</span>}
        </div>
      )}
      {children}
      {error ? (
        <div className="cs-form-error-text" role="alert">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div className="cs-form-helper-text">{helperText}</div>
      ) : null}
    </div>
  );
};
