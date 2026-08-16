import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';
import './Button.css';

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  'aria-label': string;
  icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className = '', 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={`cs-btn-icon-only ${className}`.trim()}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
