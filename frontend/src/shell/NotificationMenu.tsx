import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import './Shell.css';

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
  type: 'danger' | 'warning' | 'info' | 'success';
}

const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Claim #CLM-88421: 92% image collision match flagged with prior claim #CLM-44012.',
    time: '4 mins ago',
    unread: true,
    type: 'danger',
  },
  {
    id: 'n2',
    title: 'Claim #CLM-88424: Extreme odometer delta detected during intake inspection.',
    time: '28 mins ago',
    unread: true,
    type: 'warning',
  },
  {
    id: 'n3',
    title: 'Vision Classifier v2.4 successfully re-indexed 14,200 historical claim vectors.',
    time: '2 hours ago',
    unread: false,
    type: 'success',
  },
];

export const NotificationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'danger':
        return <ShieldAlert size={16} color="var(--cs-danger-text)" />;
      case 'warning':
        return <AlertTriangle size={16} color="var(--cs-warning-text)" />;
      case 'success':
        return <CheckCircle2 size={16} color="var(--cs-success-text)" />;
      default:
        return <Bell size={16} color="var(--cs-info-text)" />;
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="cs-notification-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
      >
        <Bell size={17} />
        {unreadCount > 0 && <span className="cs-notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="cs-notification-popover" role="dialog" aria-label="Notifications list">
          <div className="cs-notification-header">
            <span style={{ fontWeight: 'var(--cs-font-weight-semibold)', fontSize: 'var(--cs-text-size-body-sm)' }}>
              SIU Investigation Alerts
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                style={{
                  fontSize: '11px',
                  color: 'var(--cs-primary-text)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="cs-notification-list">
            {notifications.length === 0 ? (
              <div style={{ padding: 'var(--cs-space-4)', textAlign: 'center', color: 'var(--cs-stone-400)', fontSize: '12px' }}>
                No active notifications
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`cs-notification-item ${item.unread ? 'cs-unread' : ''}`}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
                    );
                  }}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon(item.type)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: 'var(--cs-text-primary)', lineHeight: '1.4' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--cs-stone-500)', marginTop: '2px' }}>
                      {item.time}
                    </div>
                  </div>
                  {item.unread && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--cs-primary)',
                        flexShrink: 0,
                        marginTop: '6px',
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
