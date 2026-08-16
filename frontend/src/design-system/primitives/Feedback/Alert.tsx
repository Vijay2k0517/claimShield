import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon, X } from 'lucide-react';
import './Feedback.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  variant?: AlertVariant;
  title?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onDismiss,
  action,
  className = '',
}) => {
  const defaultIcons: Record<AlertVariant, React.ReactNode> = {
    info: <Info size={18} />,
    success: <CheckCircle2 size={18} />,
    warning: <AlertTriangle size={18} />,
    danger: <AlertOctagon size={18} />,
  };

  return (
    <div className={`cs-alert cs-alert-${variant} ${className}`.trim()} role="alert">
      <div className="cs-alert-icon">{icon || defaultIcons[variant]}</div>
      <div className="cs-alert-content">
        {title && <div className="cs-alert-title">{title}</div>}
        <div>{children}</div>
        {action && <div style={{ marginTop: '8px' }}>{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{
            color: 'inherit',
            opacity: 0.7,
            cursor: 'pointer',
            padding: '2px',
          }}
          aria-label="Dismiss alert"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
