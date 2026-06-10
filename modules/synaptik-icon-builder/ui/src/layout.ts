/** Synaptik page layout — token-only Tailwind utilities (no raw px). */

/** Page shell: content max × 1.5; generous vertical padding. */
export const synaptikPageMaxClass =
  'mx-auto w-full max-w-[calc(var(--space-container-content-max)*1.5)] px-[var(--space-inset-l)] py-[var(--space-section-y-m)]';

/** Override Card md max-width (480px) so sections fill the page shell. */
export const synaptikCardClass = 'w-full max-w-none';

/** @deprecated Use synaptikPageMaxClass */
export const pageShellClass = synaptikPageMaxClass;

/** Gap between major page blocks (header, panels, steps). */
export const pageStackClass = 'flex flex-col gap-[var(--space-section-stack-l)]';

/** Gap inside a Card section (form fields, lists). */
export const sectionStackClass = 'flex flex-col gap-[var(--space-section-stack-m)]';

/** Looser stack (block groups in CardsWorkflow). */
export const sectionStackLooseClass = 'flex flex-col gap-[var(--space-section-stack-l)]';

/** Tight text/list rhythm (captions, registry lines). */
export const contentStackTightClass = 'flex flex-col gap-[var(--space-content-s)]';

/** Page title + lede. */
export const headerStackClass = 'flex flex-col gap-[var(--space-content-m)]';

export const rowActionsClass =
  'flex flex-wrap items-center gap-[var(--space-content-m)]';

/** Vertical list of cards / sessions. */
export const listStackClass = `flex flex-col gap-[var(--space-section-stack-m)]`;

/** Block title + hint inside CardsWorkflow. */
export const blockHeaderStackClass = contentStackTightClass;

/** Four workflow steps in one row. */
export const stepsGridClass =
  'grid w-full grid-cols-4 gap-[var(--space-content-m)] items-stretch';

/** Single step tile padding and inner gaps. */
export const stepTileClass =
  'flex h-full min-h-[var(--space-40)] min-w-0 w-full items-start gap-[var(--space-content-m)] rounded-[var(--radius-medium)] border border-solid border-[var(--color-border-base)] p-[var(--space-inset-m)]';

export const stepTileBodyClass =
  'flex min-w-0 w-full flex-1 flex-col gap-[var(--space-content-xs)]';

/** Full-width block inside page shell (alerts, accordion). */
export const fullWidthSectionClass = 'w-full max-w-none';

/** Alerts stacked with section rhythm. */
export const alertStackClass = `flex flex-col ${fullWidthSectionClass} gap-[var(--space-section-stack-m)]`;
