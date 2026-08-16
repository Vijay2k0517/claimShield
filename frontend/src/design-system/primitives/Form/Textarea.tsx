import React, { forwardRef } from 'react';
import './Form.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ isError = false, className = '', disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={[
          'cs-textarea',
          isError ? 'cs-error' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
