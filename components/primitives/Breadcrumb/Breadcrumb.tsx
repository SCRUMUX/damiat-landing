import React from 'react';
import type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb.types';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import { ChevronRightIcon } from '../../icons';
import contract from '../../../contracts/components/Breadcrumb.contract.json';
import { cn, findClasses, getFocusRing, type VR } from '../_shared';

const rules = (contract.variantRules || []) as unknown as VR[];

const Separator: React.FC = () => (
  <span
    className="shrink-0 flex items-center justify-center text-[var(--color-text-muted)] w-[var(--space-12)] h-[var(--space-12)]"
    aria-hidden="true"
  >
    <ChevronRightIcon style={{ width: '100%', height: '100%' }} />
  </span>
);

const DEFAULT_LABELS: Record<string, string[]> = {
  '1': ['Section'],
  '2': ['Section', 'Subsection'],
  '3': ['Section', 'Subsection', 'Category'],
  '4': ['Section', 'Subsection', 'Category', 'Current page'],
};

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>((props, ref) => {
  const {
    levels = '1',
    items,
    size = 'sm',
    className,
    ...rest
  } = props;

  const containerClasses = findClasses(rules, { levels });
  const linkFocusRing = getFocusRing(contract);

  const resolvedItems: BreadcrumbItem[] = items ?? DEFAULT_LABELS[levels].map(
    (label, i, arr) => ({ label, href: i < arr.length - 1 ? '#' : undefined }),
  );

  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={cn(
        'inline-flex flex-row items-center flex-wrap',
        ...containerClasses,
        className,
      )}
      {...rest}
    >
      {resolvedItems.map((item, index) => {
        const isLast = index === resolvedItems.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && <Separator />}

            {item.href && !isLast ? (
              <a
                href={item.href}
                onClick={item.onClick}
                className={cn(
                  'no-underline hover:opacity-75 transition-opacity rounded-[var(--radius-default)]',
                  linkFocusRing,
                )}
                aria-current={undefined}
              >
                <SectionHeader
                  size={size}
                  appearance="base"
                  showLeftIcon={!!item.iconLeft}
                  iconLeft={item.iconLeft}
                  showBadge={!!item.badge}
                  badge={item.badge}
                  showRightIcon={!!item.iconRight}
                  iconRight={item.iconRight}
                  className="cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  style={{ padding: 0 }}
                >
                  {item.label}
                </SectionHeader>
              </a>
            ) : (
              <SectionHeader
                size={size}
                appearance="base"
                showLeftIcon={!!item.iconLeft}
                iconLeft={item.iconLeft}
                showBadge={!!item.badge}
                badge={item.badge}
                showRightIcon={!!item.iconRight}
                iconRight={item.iconRight}
                className={isLast ? 'text-[var(--color-text-primary)]' : undefined}
                style={{ padding: 0 }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </SectionHeader>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
