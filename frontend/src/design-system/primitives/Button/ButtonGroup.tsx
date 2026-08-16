import React from 'react';
import './Button.css';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`cs-btn-group ${className}`.trim()} role="group" {...props}>
      {children}
    </div>
  );
};
