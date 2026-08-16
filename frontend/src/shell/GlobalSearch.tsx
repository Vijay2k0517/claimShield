import React, { useState, useRef, useEffect } from 'react';
import { Search, FileText, Hash, ShieldAlert } from 'lucide-react';
import './Shell.css';

export interface GlobalSearchProps {
  placeholder?: string;
  onSelectResult?: (id: string, type: string) => void;
  className?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  placeholder = 'Search Claim ID, Policy #, VIN, or Policyholder...',
  onSelectResult,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentSearches = [
    { id: 'CLM-88421', type: 'claim', label: 'Claim #88421 — Arthur Vance (High Risk)', icon: <ShieldAlert size={14} color="var(--cs-danger-text)" /> },
    { id: '1HGCR2F83HA029184', type: 'vin', label: 'VIN 1HGCR2F83HA029184 — Honda Civic Sport', icon: <Hash size={14} color="var(--cs-primary-text)" /> },
    { id: 'POL-992014', type: 'policy', label: 'Policy #POL-992014 — Comprehensive Auto', icon: <FileText size={14} color="var(--cs-stone-400)" /> },
  ];

  return (
    <div ref={containerRef} className={`cs-global-search ${className}`.trim()}>
      <Search size={15} className="cs-global-search-icon" aria-hidden="true" />
      <input
        type="search"
        className="cs-global-search-input"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        aria-label="Global triage search"
      />
      <kbd className="cs-global-search-shortcut">⌘K</kbd>

      {isFocused && (
        <div className="cs-search-dropdown" role="listbox">
          <div className="cs-search-dropdown-title">Recent SIU Investigations</div>
          {recentSearches.map((item) => (
            <div
              key={item.id}
              className="cs-search-recent-item"
              onClick={() => {
                setSearchValue(item.id);
                setIsFocused(false);
                if (onSelectResult) onSelectResult(item.id, item.type);
              }}
              role="option"
              aria-selected="false"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--cs-stone-500)', textTransform: 'uppercase' }}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
