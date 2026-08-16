import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../Button';
import './Overlay.css';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  size?: 'md' | 'lg';
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  footer,
  children,
  className = '',
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="cs-drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        className={`cs-drawer ${size === 'lg' ? 'cs-drawer-lg' : ''} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
      >
        <div className="cs-drawer-header">
          <div className="cs-dialog-title">{title}</div>
          <IconButton
            variant="ghost"
            size="sm"
            icon={<X size={16} />}
            onClick={onClose}
            aria-label="Close drawer"
          />
        </div>

        <div className="cs-drawer-body">{children}</div>

        {footer && <div className="cs-drawer-footer">{footer}</div>}
      </aside>
    </>
  );
};
