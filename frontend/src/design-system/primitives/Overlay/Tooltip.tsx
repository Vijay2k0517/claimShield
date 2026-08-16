import React, { useState } from 'react';
import './Overlay.css';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`cs-tooltip-wrapper ${className}`.trim()}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div className="cs-tooltip-content" role="tooltip">
          {content}
        </div>
      )}
    </div>
  );
};
