import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../Button';
import './Table.css';

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className = '',
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`cs-table-footer ${className}`.trim()}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>
          Showing <strong className="cs-tabular-nums">{startItem}–{endItem}</strong> of{' '}
          <strong className="cs-tabular-nums">{totalItems}</strong> entries
        </span>

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                backgroundColor: 'var(--cs-slate-800)',
                color: 'var(--cs-slate-200)',
                border: '1px solid var(--cs-slate-700)',
                borderRadius: 'var(--cs-radius-sm)',
                padding: '2px 6px',
                fontSize: 'var(--cs-text-size-caption)',
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
          style={{ padding: '0 6px' }}
        >
          <ChevronsLeft size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          style={{ padding: '0 6px' }}
        >
          <ChevronLeft size={14} />
        </Button>

        <span
          className="cs-tabular-nums"
          style={{
            padding: '0 8px',
            fontSize: 'var(--cs-text-size-caption)',
            color: 'var(--cs-slate-300)',
          }}
        >
          Page {currentPage} of {Math.max(totalPages, 1)}
        </span>

        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          style={{ padding: '0 6px' }}
        >
          <ChevronRight size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages || totalPages === 0}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
          style={{ padding: '0 6px' }}
        >
          <ChevronsRight size={14} />
        </Button>
      </div>
    </div>
  );
};
