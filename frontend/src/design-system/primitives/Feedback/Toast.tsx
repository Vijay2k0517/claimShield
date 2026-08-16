import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import './Feedback.css';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, variant = 'info', durationMs = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, variant, durationMs }]);

      if (durationMs > 0) {
        setTimeout(() => {
          removeToast(id);
        }, durationMs);
      }
    },
    [removeToast]
  );

  const icons: Record<ToastVariant, React.ReactNode> = {
    info: <Info size={16} color="var(--cs-info-text)" />,
    success: <CheckCircle2 size={16} color="var(--cs-success-text)" />,
    warning: <AlertTriangle size={16} color="var(--cs-warning-text)" />,
    danger: <AlertOctagon size={16} color="var(--cs-danger-text)" />,
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="cs-toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="cs-toast">
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{icons[t.variant || 'info']}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 'var(--cs-text-size-body-sm)',
                  fontWeight: 'var(--cs-font-weight-semibold)',
                  color: 'var(--cs-text-primary)',
                }}
              >
                {t.title}
              </div>
              {t.message && (
                <div
                  style={{
                    fontSize: 'var(--cs-text-size-caption)',
                    color: 'var(--cs-slate-400)',
                    marginTop: '2px',
                  }}
                >
                  {t.message}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              style={{ color: 'var(--cs-slate-400)', padding: '2px' }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
