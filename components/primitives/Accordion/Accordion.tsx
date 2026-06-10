/**
 * Accordion — collapsible panel, backed by `@radix-ui/react-accordion`.
 *
 * Visual: no wrapper border. Open state shows a 1px brand-primary top accent only.
 */
import React, { useCallback } from 'react';
import type { AccordionProps, AccordionSize, AccordionInteraction } from './Accordion.types';
import contract from '../../../contracts/components/Accordion.contract.json';
import { cn, findClasses, radixRootRest, type VR } from '../_shared';
import { useControllableState } from '../../../hooks/useControllableState';
import { RadixAccordion } from '../_internal';

const AccordionChevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={cn('transition-transform duration-200', open && 'rotate-180')}
  >
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const rules = (contract.variantRules || []) as unknown as VR[];

const HEADER_CLASSES: Record<AccordionSize, string> = {
  sm: 'px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)] min-h-[var(--space-28)] gap-[var(--space-button-gap-sm)] text-style-caption [--icon-size:20px]',
  md: 'px-[var(--space-button-x-md)] py-[var(--space-button-y-md)] min-h-[var(--space-36)] gap-[var(--space-button-gap-md)] text-style-body [--icon-size:20px]',
  lg: 'px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)] min-h-[var(--space-40)] gap-[var(--space-button-gap-lg)] text-style-body-lg [--icon-size:24px]',
};

const ROOT_CLASSES: Record<AccordionSize, string> = {
  sm: 'rounded-[var(--radius-default)]',
  md: 'rounded-[var(--radius-default)]',
  lg: 'rounded-[var(--radius-default)]',
};

const CONTENT_PAD: Record<AccordionSize, string> = {
  sm: 'px-[var(--space-button-x-sm)] pb-[var(--space-button-y-sm)]',
  md: 'px-[var(--space-button-x-md)] pb-[var(--space-button-y-md)]',
  lg: 'px-[var(--space-button-x-lg)] pb-[var(--space-button-y-lg)]',
};

const CONTENT_TEXT_MAP: Record<AccordionSize, string> = {
  sm: 'text-style-caption-xs',
  md: 'text-style-body-sm',
  lg: 'text-style-body',
};

const ITEM_VALUE = 'accordion-item';

/** Accordion has no wrapper border — contract may still emit border utilities for Figma sync. */
function stripWrapperBorderClasses(classes: string[]): string[] {
  return classes.filter(
    (c) => c !== 'border' && !c.startsWith('border-[') && c !== 'border-solid',
  );
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
  const {
    state: stateProp,
    size = 'sm',
    interaction: controlledState,
    iconLeft1,
    iconLeft2,
    badge,
    showIconLeft1 = false,
    showIconLeft2 = false,
    showBadge = false,
    fullWidth = false,
    defaultOpen = false,
    content,
    onToggle,
    children,
    className,
    style,
    ...rest
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    if (props.chevron !== undefined) {
      console.warn('[Accordion] `chevron` is deprecated. The chevron icon is now rendered internally.');
    }
    if ((props as { showTopBorder?: boolean }).showTopBorder !== undefined) {
      console.warn('[Accordion] `showTopBorder` is deprecated. Top accent renders automatically when open.');
    }
  }

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: stateProp !== undefined ? stateProp === 'open' : undefined,
    defaultValue: defaultOpen,
  });

  const handleValueChange = useCallback((value: string) => {
    const nextOpen = value === ITEM_VALUE;
    setIsOpen(nextOpen);
    onToggle?.();
  }, [onToggle, setIsOpen]);

  const effectiveState: AccordionInteraction = controlledState === 'disabled' ? 'disabled' : 'base';
  const stateClasses = stripWrapperBorderClasses(
    findClasses(rules, {
      state: isOpen ? 'open' : 'closed',
      interaction: effectiveState,
    }),
  );

  const suppressFocusRing =
    'outline-none focus:outline-none focus-visible:outline-none focus-visible:shadow-none';

  return (
    <RadixAccordion.Root
      ref={ref}
      type="single"
      collapsible
      value={isOpen ? ITEM_VALUE : ''}
      onValueChange={handleValueChange}
      disabled={effectiveState === 'disabled'}
      className={cn(
        'transition-colors duration-150 font-base box-border flex flex-col relative overflow-hidden',
        ...stateClasses,
        ROOT_CLASSES[size],
        fullWidth && 'w-full max-w-none min-w-0',
        className,
      )}
      data-state={isOpen ? 'open' : 'closed'}
      style={style}
      {...radixRootRest(rest)}
    >
      {isOpen && (
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[var(--border-width-base)] bg-[var(--color-brand-primary)]"
          aria-hidden="true"
        />
      )}

      <RadixAccordion.Item value={ITEM_VALUE} className="flex flex-col">
        <RadixAccordion.Header className="flex">
          <RadixAccordion.Trigger
            className={cn(
              'flex min-w-0 items-center cursor-pointer w-full bg-transparent border-0 text-left',
              HEADER_CLASSES[size],
              suppressFocusRing,
            )}
          >
            {showIconLeft1 && iconLeft1 && (
              <span
                className="shrink-0 flex items-center justify-center rounded hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-active)] focus:outline-none transition-colors"
                style={{ color: 'var(--icon-color, currentColor)', width: 'var(--icon-size, 20px)', height: 'var(--icon-size, 20px)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">{iconLeft1}</span>
              </span>
            )}
            {showIconLeft2 && iconLeft2 && (
              <span
                className="shrink-0 flex items-center justify-center rounded hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-active)] focus:outline-none transition-colors"
                style={{ color: 'var(--icon-color, currentColor)', width: 'var(--icon-size, 20px)', height: 'var(--icon-size, 20px)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">{iconLeft2}</span>
              </span>
            )}
            <span className="flex-1 min-w-0">{children}</span>
            {showBadge && badge && <div className="shrink-0">{badge}</div>}
            <span className="shrink-0 flex items-center justify-center" style={{ color: 'var(--icon-color, currentColor)', width: 'var(--icon-size, 20px)', height: 'var(--icon-size, 20px)' }}>
              <AccordionChevron open={isOpen} />
            </span>
          </RadixAccordion.Trigger>
        </RadixAccordion.Header>

        <RadixAccordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-close data-[state=open]:animate-accordion-open">
          <div className={cn('w-full', CONTENT_TEXT_MAP[size], CONTENT_PAD[size])}>
            {content ?? 'Accordion content...'}
          </div>
        </RadixAccordion.Content>
      </RadixAccordion.Item>
    </RadixAccordion.Root>
  );
});

Accordion.displayName = 'Accordion';
