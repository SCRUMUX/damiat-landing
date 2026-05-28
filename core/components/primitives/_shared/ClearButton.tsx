import React from 'react';

interface ClearButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: string;
  label?: string;
  className?: string;
  visible?: boolean;
}

const ClearIcon: React.FC<{ size: string }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 6l8 8M14 6l-8 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Shared inline clear (×) button for Input, Autocomplete, etc.
 * Only renders when `visible` is true (or defaults to true).
 */
export const ClearButton: React.FC<ClearButtonProps> = React.memo(
  ({
    onClick,
    size = 'var(--icon-size, 20px)',
    label = 'Clear',
    className = '',
    visible = true,
  }) => {
    if (!visible) return null;

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        className={[
          'shrink-0 flex items-center justify-center',
          'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
          'transition-colors duration-150 rounded-[var(--radius-subtle)]',
          'focus-visible:shadow-[var(--effect-focus-brand)] focus-visible:outline-none',
          className,
        ].join(' ')}
        style={{ width: size, height: size }}
        aria-label={label}
        tabIndex={-1}
      >
        <ClearIcon size="16" />
      </button>
    );
  },
);

ClearButton.displayName = 'ClearButton';
