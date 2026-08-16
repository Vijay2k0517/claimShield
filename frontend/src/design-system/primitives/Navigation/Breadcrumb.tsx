import React from 'react';
import { ChevronRight } from 'lucide-react';
import './Navigation.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`cs-breadcrumb ${className}`.trim()} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="cs-breadcrumb-item">
            {index > 0 && (
              <span className="cs-breadcrumb-separator" aria-hidden="true">
                <ChevronRight size={14} />
              </span>
            )}
            {isLast ? (
              <span className="cs-breadcrumb-current" aria-current="page">
                {item.label}
              </span>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                style={{
                  color: 'var(--cs-slate-400)',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  padding: 0,
                }}
              >
                {item.label}
              </button>
            ) : item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
};
