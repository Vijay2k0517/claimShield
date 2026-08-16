import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../Button';
import './Feedback.css';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  isRetrying?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  description = 'An error occurred while connecting to the investigation intelligence service. Please check your connection or retry.',
  onRetry,
  retryLabel = 'Retry Request',
  isRetrying = false,
  className = '',
}) => {
  return (
    <div className={`cs-state-box ${className}`.trim()} role="alert">
      <div className="cs-state-icon" style={{ color: 'var(--cs-danger-text)', backgroundColor: 'var(--cs-danger-subtle)' }}>
        <AlertCircle size={24} />
      </div>
      <div className="cs-state-title" style={{ color: 'var(--cs-danger-text)' }}>{title}</div>
      <div className="cs-state-desc">{description}</div>
      {onRetry && (
        <div style={{ marginTop: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            isLoading={isRetrying}
            leftIcon={<RefreshCw size={14} />}
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
