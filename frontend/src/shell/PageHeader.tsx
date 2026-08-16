import React from 'react';
import './Shell.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className = '',
}) => {
  return (
    <div className={`cs-page-header ${className}`.trim()}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {breadcrumbs && <div style={{ marginBottom: '4px' }}>{breadcrumbs}</div>}
        <h1 className="cs-page-header-title">{title}</h1>
        {subtitle && <p className="cs-page-header-subtitle">{subtitle}</p>}
      </div>

      {actions && <div className="cs-page-header-actions">{actions}</div>}
    </div>
  );
};
