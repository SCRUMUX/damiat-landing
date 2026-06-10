/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */
import React from 'react';
import type { AlertProps } from './Alert.types';
import contract from '../../../contracts/components/Alert.contract.json';
import { cn, findClasses, getFocusRing, type VR } from '../_shared';

const rules = (contract.variantRules || []) as unknown as VR[];

const DefaultCloseIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const {
    appearance = 'warning',
    variant = 'basic',
    iconLeft,
    iconRight,
    showLeftIcon = false,
    showRightIcon = false,
    showTitle = true,
    showParagraph = true,
    title = 'Alert title',
    paragraph = 'Alert message',
    onClose,
    open = true,
    children,
    className,
    ...rest
  } = props;

  if (!open) return null;

  const appearanceClasses = findClasses(rules, { appearance, variant });
  const closeFocusRing = getFocusRing(contract, appearance);
  const titleTextCls =
    appearanceClasses
      .find((c) => c.startsWith('[--title-text-class:'))
      ?.match(/\[--title-text-class:([^\]]+)\]/)?.[1] || '';
  const paragraphTextCls =
    appearanceClasses
      .find((c) => c.startsWith('[--paragraph-text-class:'))
      ?.match(/\[--paragraph-text-class:([^\]]+)\]/)?.[1] || '';

  const isSolid = variant === 'solid';
  const iconColorVar = isSolid ? `var(--color-${appearance}-text)` : `var(--color-${appearance}-base)`;

  const closeIconContent = iconRight ?? <DefaultCloseIcon />;

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        'transition-colors duration-150 font-base box-border flex flex-row justify-center items-start animate-alert-in',
        ...appearanceClasses,
        className,
      )}
      role="alert"
      {...rest}
    >
      {showLeftIcon && iconLeft && (
        <span
          className="shrink-0 flex items-center justify-center [&_svg]:!w-full [&_svg]:!h-full"
          style={{
            color: iconColorVar,
            width: 'var(--icon-size, 20px)',
            height: 'var(--icon-size, 20px)',
          }}
        >
          {React.isValidElement(iconLeft)
            ? React.cloneElement(iconLeft as React.ReactElement<{ style?: React.CSSProperties }>, {
                style: { width: '100%', height: '100%', color: iconColorVar },
              })
            : iconLeft}
        </span>
      )}
      <div className="flex flex-col flex-1 min-w-0 items-start gap-[inherit]">
        {showTitle && (
          <span
            className={`flex-1 min-w-0 ${titleTextCls}`}
            style={{ color: 'var(--title-color, currentColor)' }}
          >
            {title}
          </span>
        )}
        {showParagraph && (
          <span className={`flex-1 min-w-0 ${paragraphTextCls}`}>{paragraph}</span>
        )}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'shrink-0 flex items-center justify-center rounded cursor-pointer bg-transparent border-0 p-0 opacity-60 hover:opacity-100 transition-opacity',
            closeFocusRing,
          )}
          style={{
            color: iconColorVar,
            width: 'var(--icon-size, 20px)',
            height: 'var(--icon-size, 20px)',
          }}
          aria-label="Close alert"
        >
          {closeIconContent}
        </button>
      ) : showRightIcon && iconRight ? (
        <span
          className="shrink-0 flex items-center justify-center [&_svg]:!w-full [&_svg]:!h-full"
          style={{
            color: iconColorVar,
            width: 'var(--icon-size, 20px)',
            height: 'var(--icon-size, 20px)',
          }}
        >
          {React.isValidElement(iconRight)
            ? React.cloneElement(iconRight as React.ReactElement<{ style?: React.CSSProperties }>, {
                style: { width: '100%', height: '100%', color: iconColorVar },
              })
            : iconRight}
        </span>
      ) : null}
    </div>
  );
});

Alert.displayName = 'Alert';
