import React, { useState, useRef, useEffect } from 'react';
import './Overlay.css';

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({ trigger, content, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 'var(--cs-z-popover)',
            backgroundColor: 'var(--cs-slate-850)',
            border: '1px solid var(--cs-border-default)',
            borderRadius: 'var(--cs-radius-md)',
            boxShadow: 'var(--cs-elevation-overlay)',
            padding: 'var(--cs-space-3)',
            minWidth: '220px',
            animation: 'cs-fade-in var(--cs-duration-fast) var(--cs-ease-default)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
