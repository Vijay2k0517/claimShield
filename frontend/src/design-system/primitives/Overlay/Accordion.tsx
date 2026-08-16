import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Overlay.css';

export interface AccordionItemData {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  badge?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenIds?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIds = [],
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((i) => i !== id));
    } else {
      if (allowMultiple) {
        setOpenIds([...openIds, id]);
      } else {
        setOpenIds([id]);
      }
    }
  };

  return (
    <div className={className}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div key={item.id} className="cs-accordion-item">
            <button
              type="button"
              className="cs-accordion-header"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{item.title}</span>
                {item.badge}
              </div>
              <span
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform var(--cs-duration-fast) var(--cs-ease-default)',
                  display: 'flex',
                  color: 'var(--cs-slate-400)',
                }}
              >
                <ChevronDown size={16} />
              </span>
            </button>

            {isOpen && <div className="cs-accordion-content">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};
