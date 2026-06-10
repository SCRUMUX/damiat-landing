import React from 'react';
import type {
  TooltipProps,
  TooltipBubbleProps,
  TooltipPosition,
  TooltipAppearance,
} from './Tooltip.types';
import { cn, findClasses, type VR } from '../_shared';
import { RadixTooltip } from '../_internal';
import contract from '../../../contracts/components/Tooltip.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const BUBBLE_BASE =
  'inline-flex items-center justify-center px-[var(--space-8)] py-[var(--space-6)] rounded-[var(--radius-medium)] text-style-caption whitespace-nowrap';

/** Custom properties must live on the root wrapper so the arrow sibling can read them. */
const BUBBLE_VAR_PREFIX = '[--bubble-';

function splitAppearanceClasses(classes: string[]) {
  const vars: string[] = [];
  const surface: string[] = [];
  for (const cls of classes) {
    if (cls.startsWith(BUBBLE_VAR_PREFIX)) vars.push(cls);
    else surface.push(cls);
  }
  return { vars, surface };
}

interface ArrowProps {
  position: TooltipPosition;
}

const Arrow: React.FC<ArrowProps> = ({ position }) => {
  const fillStyle = { fill: 'var(--bubble-bg)' } as const;

  if (position === 'top') {
    return (
      <svg width={12} height={6} viewBox="0 0 12 6" style={{ display: 'block', flexShrink: 0 }} aria-hidden="true">
        <polygon points="0,0 12,0 6,6" style={fillStyle} />
      </svg>
    );
  }
  if (position === 'bottom') {
    return (
      <svg width={12} height={6} viewBox="0 0 12 6" style={{ display: 'block', flexShrink: 0 }} aria-hidden="true">
        <polygon points="0,6 12,6 6,0" style={fillStyle} />
      </svg>
    );
  }
  if (position === 'left') {
    return (
      <svg width={6} height={12} viewBox="0 0 6 12" style={{ display: 'block', flexShrink: 0 }} aria-hidden="true">
        <polygon points="0,0 0,12 6,6" style={fillStyle} />
      </svg>
    );
  }
  return (
    <svg width={6} height={12} viewBox="0 0 6 12" style={{ display: 'block', flexShrink: 0 }} aria-hidden="true">
      <polygon points="6,0 6,12 0,6" style={fillStyle} />
    </svg>
  );
};

export const TooltipBubble: React.FC<TooltipBubbleProps> = ({
  content,
  position = 'top',
  appearance = 'base',
  className,
  style,
}) => {
  const appearanceClasses = findClasses(rules, { appearance: appearance as TooltipAppearance });
  const { vars: appearanceVars, surface: appearanceSurface } = splitAppearanceClasses(appearanceClasses);
  const isVertical = position === 'top' || position === 'bottom';

  const bubble = (
    <div className={cn(BUBBLE_BASE, ...appearanceSurface)}>
      {content}
    </div>
  );

  const arrow = <Arrow position={position} />;

  return (
    <div
      className={cn('inline-flex animate-tooltip-in', isVertical ? 'flex-col items-center' : 'flex-row items-center', ...appearanceVars, className)}
      style={style}
    >
      {(position === 'top' || position === 'left') ? (
        <>{bubble}{arrow}</>
      ) : (
        <>{arrow}{bubble}</>
      )}
    </div>
  );
};

const POSITION_TO_SIDE: Record<TooltipPosition, 'top' | 'bottom' | 'left' | 'right'> = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
};

/** Mirrors `--space-6` token (6px). Keep in sync if the token changes. */
const TOOLTIP_GAP_PX = 6;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  appearance = 'base',
  children,
  delayMs = 0,
  className,
}) => {
  return (
    <RadixTooltip.Provider delayDuration={delayMs} disableHoverableContent>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <span className={cn('inline-flex items-center justify-center', className)}>
            {children}
          </span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={POSITION_TO_SIDE[position]}
            sideOffset={TOOLTIP_GAP_PX}
            avoidCollisions={false}
            style={{ zIndex: 'var(--z-tooltip)' as React.CSSProperties['zIndex'], pointerEvents: 'none' }}
            asChild
          >
            <div>
              <TooltipBubble content={content} position={position} appearance={appearance} />
            </div>
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

Tooltip.displayName = 'Tooltip';
TooltipBubble.displayName = 'TooltipBubble';
