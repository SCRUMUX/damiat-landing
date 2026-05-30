import React, { useCallback, useRef } from 'react';

import { PencilIcon } from '../../../components/icons';
import { cn } from '../../../components/primitives/_shared';
import { formatOpexCell, formatSalesCell, parseScheduleCell, roundTons1 } from './calculatorSchedule';

export interface DamiatCalculatorScheduleCellProps {
  value: string;
  kind: 'sales' | 'opex';
  monthIndex: number;
  onChange: (monthIndex: number, value: string) => void;
  onCommit?: (monthIndex: number, value: string) => void;
  className?: string;
}

export const DamiatCalculatorScheduleCell: React.FC<DamiatCalculatorScheduleCellProps> = ({
  value,
  kind,
  monthIndex,
  onChange,
  onCommit,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(monthIndex, e.target.value);
    },
    [monthIndex, onChange],
  );

  const handleBlur = useCallback(() => {
    const parsed = parseScheduleCell(value, 0);

    if (kind === 'sales' && onCommit) {
      const formatted = parsed <= 0 ? '' : formatSalesCell(roundTons1(parsed));
      onCommit(monthIndex, formatted);
      return;
    }

    if (kind === 'opex') {
      const formatted = formatOpexCell(parsed);
      if (formatted !== value) onChange(monthIndex, formatted);
      return;
    }

    if (parsed <= 0) {
      if (value !== '') onChange(monthIndex, '');
      return;
    }
    const formatted = formatSalesCell(roundTons1(parsed));
    if (formatted !== value) onChange(monthIndex, formatted);
  }, [kind, monthIndex, onChange, onCommit, value]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const placeholder = kind === 'opex' ? '0' : '—';

  return (
    <div
      className={cn(
        'group/cell relative flex w-full min-w-0 items-center justify-center px-[var(--space-inset-s)]',
        className,
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        onClick={focusInput}
        className={cn(
          'absolute left-[var(--space-4)] top-1/2 flex -translate-y-1/2 shrink-0 cursor-text items-center border-0 bg-transparent p-0',
          'text-[var(--color-text-muted)]',
          'pointer-events-none opacity-0 transition-opacity duration-150',
          'group-hover/cell:pointer-events-auto group-hover/cell:opacity-70',
          'group-focus-within/cell:pointer-events-auto group-focus-within/cell:opacity-100',
        )}
        aria-hidden
      >
        <PencilIcon size={12} />
      </button>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(
          'text-style-tabular min-w-0 flex-1 border-0 bg-transparent p-0 text-center text-style-body-sm leading-none text-[var(--color-text-primary)] outline-none',
          'placeholder:text-[var(--color-text-muted)]',
          'focus:underline focus:decoration-[var(--color-border-base)] focus:underline-offset-2',
        )}
        aria-label={kind === 'sales' ? `Реализация, месяц ${monthIndex + 1}` : `Расходы, месяц ${monthIndex + 1}`}
      />
    </div>
  );
};

DamiatCalculatorScheduleCell.displayName = 'DamiatCalculatorScheduleCell';
