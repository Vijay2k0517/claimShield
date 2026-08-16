import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../Button';
import './Overlay.css';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
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
      <div className="cs-overlay-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="cs-dialog-container">
        <div className={`cs-dialog ${className}`.trim()} role="dialog" aria-modal="true">
          <div className="cs-dialog-header">
            <div className="cs-dialog-title">{title}</div>
            <IconButton
              variant="ghost"
              size="sm"
              icon={<X size={16} />}
              onClick={onClose}
              aria-label="Close dialog"
            />
          </div>

          <div className="cs-dialog-body">{children}</div>

          {footer && <div className="cs-dialog-footer">{footer}</div>}
        </div>
      </div>
    </>
  );
};
