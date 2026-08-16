import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import './Form.css';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  isError?: boolean;
  disabled?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  isError = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeTag = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
      className={className}
    >
      <div
        className={[
          'cs-input-wrapper',
          isError ? 'cs-error' : '',
          disabled ? 'cs-disabled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          minHeight: 'var(--cs-control-height-md)',
          padding: '4px 8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          flexWrap: 'wrap',
          gap: '4px',
        }}
      >
        {value.length === 0 ? (
          <span style={{ color: 'var(--cs-slate-500)', fontSize: 'var(--cs-text-size-body)' }}>
            {placeholder}
          </span>
        ) : (
          value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'var(--cs-slate-800)',
                  border: '1px solid var(--cs-slate-700)',
                  borderRadius: 'var(--cs-radius-sm)',
                  padding: '1px 6px',
                  fontSize: 'var(--cs-text-size-caption)',
                  color: 'var(--cs-text-primary)',
                }}
              >
                {opt ? opt.label : val}
                <button
                  type="button"
                  onClick={(e) => removeTag(e, val)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                    color: 'var(--cs-slate-400)',
                  }}
                >
                  <X size={12} />
                </button>
              </span>
            );
          })
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <ChevronDown size={14} color="var(--cs-slate-400)" />
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 'var(--cs-z-dropdown)',
            backgroundColor: 'var(--cs-slate-850)',
            border: '1px solid var(--cs-border-default)',
            borderRadius: 'var(--cs-radius-md)',
            boxShadow: 'var(--cs-elevation-overlay)',
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: 'var(--cs-radius-sm)',
                  fontSize: 'var(--cs-text-size-body-sm)',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--cs-primary-subtle)' : 'transparent',
                  color: isSelected ? 'var(--cs-primary-text)' : 'var(--cs-text-primary)',
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
