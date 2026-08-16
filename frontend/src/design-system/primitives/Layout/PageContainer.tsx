import React from 'react';
import './Layout.css';

export interface PageContainerProps {
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  fullWidth = false,
  children,
  className = '',
}) => {
  return (
    <div
      className={`cs-page-container ${fullWidth ? 'cs-page-container-full' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export interface PanelProps {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  actions,
  footer,
  children,
  className = '',
}) => {
  return (
    <div className={`cs-panel ${className}`.trim()}>
      {(title || actions) && (
        <div className="cs-panel-header">
          {title && <div className="cs-panel-title">{title}</div>}
          {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{actions}</div>}
        </div>
      )}
      <div className="cs-panel-body">{children}</div>
      {footer && <div className="cs-panel-footer">{footer}</div>}
    </div>
  );
};

export interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftRatio?: number; // e.g. 1
  rightRatio?: number; // e.g. 1
  className?: string;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({
  left,
  right,
  leftRatio = 1,
  rightRatio = 1,
  className = '',
}) => {
  return (
    <div className={`cs-split-layout ${className}`.trim()}>
      <div className="cs-split-pane" style={{ flex: leftRatio }}>
        {left}
      </div>
      <div className="cs-split-pane" style={{ flex: rightRatio }}>
        {right}
      </div>
    </div>
  );
};

export interface StackProps {
  direction?: 'row' | 'column';
  gap?: number | string;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  wrap?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  gap = 'var(--cs-space-3)',
  align = 'stretch',
  justify = 'flex-start',
  wrap = false,
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export interface GridProps {
  columns?: number | string;
  gap?: number | string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Grid: React.FC<GridProps> = ({
  columns = 3,
  gap = 'var(--cs-space-4)',
  children,
  className = '',
  style,
}) => {
  const gridTemplateColumns =
    typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export interface SectionProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  actions,
  children,
  className = '',
}) => {
  return (
    <section className={className} style={{ marginBottom: 'var(--cs-space-6)' }}>
      {(title || actions) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 'var(--cs-space-3)',
          }}
        >
          <div>
            {title && (
              <h2
                style={{
                  fontSize: 'var(--cs-text-size-h2)',
                  fontWeight: 'var(--cs-font-weight-semibold)',
                  color: 'var(--cs-text-primary)',
                  lineHeight: 'var(--cs-leading-tight)',
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: 'var(--cs-text-size-caption)',
                  color: 'var(--cs-slate-400)',
                  marginTop: '2px',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export interface ToolbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ left, right, children, className = '' }) => {
  return (
    <div className={`cs-toolbar ${className}`.trim()}>
      {left && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>{left}</div>}
      {children}
      {right && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>{right}</div>}
    </div>
  );
};
