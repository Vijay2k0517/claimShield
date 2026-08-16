import React from 'react';
import { Badge, BadgeSize, BadgeVariant } from './Badge';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SeverityIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  severity: SeverityLevel;
  size?: BadgeSize;
}

const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { label: string; variant: BadgeVariant }
> = {
  low: { label: 'Low Severity', variant: 'neutral' },
  medium: { label: 'Medium Severity', variant: 'warning' },
  high: { label: 'High Severity', variant: 'danger' },
  critical: { label: 'Critical Severity', variant: 'danger' },
};

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({
  severity,
  size = 'sm',
  className = '',
  ...props
}) => {
  const config = SEVERITY_CONFIG[severity];
  return (
    <Badge
      variant={config.variant}
      size={size}
      dot
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  );
};
