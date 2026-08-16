import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableDensity } from './Table';
import { TablePagination } from './TablePagination';
import { Checkbox } from '../Form';
import './Table.css';

export interface ColumnDef<T> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (info: { row: T; value: any; index: number }) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  isMono?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  density?: TableDensity;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T, index: number) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  showPagination?: boolean;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  density = 'comfortable',
  selectable = false,
  selectedIds = [],
  onSelectChange,
  getRowId = (_row, index) => String(index),
  isLoading = false,
  emptyMessage = 'No data available.',
  pageSize = 10,
  showPagination = true,
  className = '',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (colId: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortCol === colId) {
      if (sortDir === 'asc') setSortDir('desc');
      else {
        setSortCol(null);
        setSortDir('asc');
      }
    } else {
      setSortCol(colId);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortCol) return data;
    const col = columns.find((c) => c.id === sortCol);
    if (!col || !col.accessorKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[col.accessorKey!];
      const bVal = b[col.accessorKey!];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const result = aVal < bVal ? -1 : 1;
      return sortDir === 'asc' ? result : -result;
    });
  }, [data, sortCol, sortDir, columns]);

  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const start = (currentPage - 1) * currentPageSize;
    return sortedData.slice(start, start + currentPageSize);
  }, [sortedData, currentPage, currentPageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / currentPageSize);

  const toggleSelectAll = () => {
    if (!onSelectChange) return;
    if (selectedIds.length === paginatedData.length && paginatedData.length > 0) {
      onSelectChange([]);
    } else {
      onSelectChange(paginatedData.map((row, i) => getRowId(row, i)));
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectChange) return;
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectChange([...selectedIds, id]);
    }
  };

  return (
    <div style={{ width: '100%' }} className={className}>
      <Table density={density}>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableCell isHeader style={{ width: '40px' }}>
                <Checkbox
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((r, i) => selectedIds.includes(getRowId(r, i)))
                  }
                  onChange={toggleSelectAll}
                  aria-label="Select all rows"
                />
              </TableCell>
            )}
            {columns.map((col) => (
              <TableCell
                key={col.id}
                isHeader
                isSortable={col.sortable}
                style={{ width: col.width }}
                onClick={() => handleSort(col.id, col.sortable)}
              >
                <span className="cs-th-inner">
                  {col.header}
                  {col.sortable && (
                    <span style={{ color: sortCol === col.id ? 'var(--cs-primary-text)' : 'var(--cs-slate-600)' }}>
                      {sortCol === col.id ? (
                        sortDir === 'asc' ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      ) : (
                        <ChevronsUpDown size={14} />
                      )}
                    </span>
                  )}
                </span>
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, rIndex) => (
              <TableRow key={`skeleton-${rIndex}`}>
                {selectable && <TableCell><div style={{ width: 16, height: 16, backgroundColor: 'var(--cs-slate-800)', borderRadius: 2 }} /></TableCell>}
                {columns.map((col) => (
                  <TableCell key={`cell-${rIndex}-${col.id}`}>
                    <div
                      style={{
                        height: '16px',
                        width: '70%',
                        backgroundColor: 'var(--cs-slate-800)',
                        borderRadius: 'var(--cs-radius-sm)',
                        animation: 'cs-pulse 1.5s infinite ease-in-out',
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                style={{ textAlign: 'center', padding: 'var(--cs-space-8)', color: 'var(--cs-slate-400)' }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const rowId = getRowId(row, rowIndex);
              const isSelected = selectedIds.includes(rowId);

              return (
                <TableRow key={rowId} isSelected={isSelected}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleRow(rowId)}
                        aria-label={`Select row ${rowId}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => {
                    const cellVal = col.accessorKey ? row[col.accessorKey] : undefined;
                    return (
                      <TableCell key={col.id} isMono={col.isMono}>
                        {col.cell ? col.cell({ row, value: cellVal, index: rowIndex }) : String(cellVal ?? '')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {showPagination && !isLoading && data.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={data.length}
          pageSize={currentPageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setCurrentPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}
