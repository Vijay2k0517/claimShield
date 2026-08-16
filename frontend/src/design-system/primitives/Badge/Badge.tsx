import React from 'react';
import './Badge.css';

export type BadgeVariant = 'neutral' | 'primary' | 'cyan' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`cs-badge cs-badge-${variant} cs-badge-${size} ${className}`.trim()}
      {...props}
    >
      {dot && <span className="cs-badge-dot" aria-hidden="true" />}
      {icon && <span>{icon}</span>}
      {children && <span>{children}</span>}
    </span>
  );
};
