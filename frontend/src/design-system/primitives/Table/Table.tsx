import React from 'react';
import './Table.css';

export type TableDensity = 'comfortable' | 'compact';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  containerClassName?: string;
}

export const Table: React.FC<TableProps> = ({
  density = 'comfortable',
  containerClassName = '',
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`cs-table-container ${containerClassName}`.trim()}>
      <table
        className={`cs-table cs-table-${density} ${className}`.trim()}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  isSelected = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <tr
      className={`cs-tr ${isSelected ? 'cs-tr-selected' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </tr>
  );
};

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  isHeader?: boolean;
  isSortable?: boolean;
  isMono?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({
  isHeader = false,
  isSortable = false,
  isMono = false,
  className = '',
  children,
  ...props
}) => {
  if (isHeader) {
    return (
      <th
        className={`cs-th ${isSortable ? 'cs-th-sortable' : ''} ${className}`.trim()}
        {...(props as React.ThHTMLAttributes<HTMLTableCellElement>)}
      >
        {children}
      </th>
    );
  }

  return (
    <td
      className={`cs-td ${isMono ? 'cs-tabular-nums' : ''} ${className}`.trim()}
      style={isMono ? { fontFamily: 'var(--cs-font-mono)' } : undefined}
      {...props}
    >
      {children}
    </td>
  );
};
