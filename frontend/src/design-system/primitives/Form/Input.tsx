import React, { forwardRef } from 'react';
import './Form.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  isError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      isError = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      wrapperClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={[
          'cs-input-wrapper',
          isError ? 'cs-error' : '',
          disabled ? 'cs-disabled' : '',
          wrapperClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {leftIcon && <div className="cs-input-icon">{leftIcon}</div>}
        <input
          ref={ref}
          className={`cs-input cs-input-${size} ${className}`.trim()}
          disabled={disabled}
          {...props}
        />
        {rightIcon && <div className="cs-input-icon">{rightIcon}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';
