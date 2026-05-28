import React, { useState } from 'react';
import type { PaginationProps, PaginationSize, PaginationAppearance } from './Pagination.types';
import { Button } from '../Button/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { cn, findClasses, getFocusRing, type VR } from '../_shared';
import contract from '../../../contracts/components/Pagination.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<PaginationSize, string> = {
  sm: 'gap-[var(--space-button-gap-sm)]',
  md: 'gap-[var(--space-button-gap-md)]',
  lg: 'gap-[var(--space-button-gap-lg)]',
};

const NAV_BTN_SIZE: Record<PaginationSize, string> = {
  sm: 'w-[var(--space-button-h-sm)] h-[var(--space-button-h-sm)]',
  md: 'w-[var(--space-button-h-md)] h-[var(--space-button-h-md)]',
  lg: 'w-[var(--space-button-h-lg)] h-[var(--space-button-h-lg)]',
};

const NAV_ICON_SIZE: Record<PaginationSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const NavButton: React.FC<{
  direction: 'prev' | 'next';
  size: PaginationSize;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ direction, size, disabled, onClick }) => {
  const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon;
  const focusRing = getFocusRing(contract);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous page' : 'Next page'}
      className={cn(
        'inline-flex items-center justify-center shrink-0 rounded-[var(--radius-default)]',
        'transition-colors duration-150',
        'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]',
        'disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed disabled:pointer-events-none',
        NAV_BTN_SIZE[size],
        focusRing,
      )}
    >
      <Icon size={NAV_ICON_SIZE[size]} />
    </button>
  );
};

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>((props, ref) => {
  const {
    size = 'sm',
    appearance = 'brand',
    variant = 'with-numbers',
    currentPage: controlledPage,
    totalPages = 5,
    onPageChange,
    onPrev,
    onNext,
    pageWindowSize = 3,
    className,
    ...rest
  } = props;

  const [internalPage, setInternalPage] = useState(1);
  const currentPage = controlledPage ?? internalPage;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (controlledPage === undefined) setInternalPage(page);
    onPageChange?.(page);
  };

  const handlePrev = () => {
    handlePageChange(currentPage - 1);
    onPrev?.();
  };

  const handleNext = () => {
    handlePageChange(currentPage + 1);
    onNext?.();
  };

  const appearanceClasses = findClasses(rules, { appearance });
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const getPageWindow = (): number[] => {
    const half = Math.floor(pageWindowSize / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + pageWindowSize - 1);
    start = Math.max(1, end - pageWindowSize + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const getActiveAppearance = (active: boolean): PaginationAppearance | 'ghost' => {
    if (!active) return 'ghost';
    return appearance;
  };

  return (
    <nav
      ref={ref as React.Ref<HTMLElement>}
      aria-label="pagination"
      className={cn(
        'inline-flex flex-row items-center',
        SIZE_CLASSES[size],
        ...appearanceClasses,
        className,
      )}
      {...rest}
    >
      <NavButton
        direction="prev"
        size={size}
        disabled={isPrevDisabled}
        onClick={handlePrev}
      />

      {variant === 'with-numbers' && (
        <>
          {getPageWindow().map((page) => {
            const isActive = page === currentPage;
            return (
              <Button
                key={page}
                size={size}
                appearance={getActiveAppearance(isActive)}
                onClick={() => handlePageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {String(page)}
              </Button>
            );
          })}
        </>
      )}

      {variant === 'compact' && (
        <span className="text-style-caption-xs font-medium text-[var(--color-text-primary)] select-none whitespace-nowrap">
          {currentPage} / {totalPages}
        </span>
      )}

      <NavButton
        direction="next"
        size={size}
        disabled={isNextDisabled}
        onClick={handleNext}
      />
    </nav>
  );
});

Pagination.displayName = 'Pagination';
