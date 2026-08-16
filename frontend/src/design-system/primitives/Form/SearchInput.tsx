import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input, InputProps } from './Input';
import './Form.css';

export interface SearchInputProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  onClear?: () => void;
  shortcut?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, shortcut, rightIcon, ...props }, ref) => {
    const hasValue = value !== undefined && value !== '';

    const defaultRightIcon = (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="cs-btn-ghost"
            style={{ padding: '2px', borderRadius: '4px', display: 'flex' }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        {shortcut && !hasValue && (
          <kbd
            style={{
              padding: '2px 5px',
              fontSize: '10px',
              borderRadius: '3px',
              background: 'var(--cs-slate-800)',
              color: 'var(--cs-slate-400)',
              border: '1px solid var(--cs-slate-700)',
              fontFamily: 'var(--cs-font-mono)',
            }}
          >
            {shortcut}
          </kbd>
        )}
        {rightIcon}
      </div>
    );

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search size={15} />}
        rightIcon={defaultRightIcon}
        value={value}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
