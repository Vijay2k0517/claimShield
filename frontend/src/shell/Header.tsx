import React from 'react';
import { Menu } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { SystemStatus } from './SystemStatus';
import { NotificationMenu } from './NotificationMenu';
import { UserProfileMenu } from './UserProfileMenu';
import './Shell.css';

export interface HeaderProps {
  onMobileMenuToggle?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onMobileMenuToggle,
  className = '',
}) => {
  return (
    <header className={`cs-header ${className}`.trim()} role="banner">
      <div className="cs-header-left">
        <button
          type="button"
          className="cs-mobile-menu-btn"
          onClick={onMobileMenuToggle}
          aria-label="Open mobile navigation menu"
        >
          <Menu size={18} />
        </button>

        <GlobalSearch />
      </div>

      <div className="cs-header-right">
        <SystemStatus statusText="System Operational" isOnline />
        <NotificationMenu />
        <UserProfileMenu />
      </div>
    </header>
  );
};
