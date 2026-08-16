import React from 'react';
import { Badge, BadgeProps, BadgeVariant } from './Badge';

export type ClaimStatus =
  | 'NEW'
  | 'TRIAGE'
  | 'UNDER_INVESTIGATION'
  | 'ADJUDICATED'
  | 'ESCALATED'
  | 'CLOSED';

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: ClaimStatus;
  children?: React.ReactNode;
}

const STATUS_CONFIG: Record<
  ClaimStatus,
  { label: string; variant: BadgeVariant; dot: boolean }
> = {
  NEW: { label: 'New', variant: 'primary', dot: true },
  TRIAGE: { label: 'Triage', variant: 'info', dot: true },
  UNDER_INVESTIGATION: { label: 'In Review', variant: 'warning', dot: true },
  ADJUDICATED: { label: 'Adjudicated', variant: 'success', dot: false },
  ESCALATED: { label: 'Escalated to SIU', variant: 'danger', dot: true },
  CLOSED: { label: 'Closed', variant: 'neutral', dot: false },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={config.dot}
      className={className}
      {...props}
    >
      {children || config.label}
    </Badge>
  );
};
