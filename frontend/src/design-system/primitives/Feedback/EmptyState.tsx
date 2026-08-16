import React from 'react';
import { Inbox } from 'lucide-react';
import './Feedback.css';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <Inbox size={24} />,
  action,
  className = '',
}) => {
  return (
    <div className={`cs-state-box ${className}`.trim()}>
      <div className="cs-state-icon">{icon}</div>
      <div className="cs-state-title">{title}</div>
      {description && <div className="cs-state-desc">{description}</div>}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
};
