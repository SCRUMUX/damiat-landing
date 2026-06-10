import { Badge } from '@ai-ds/core/components/Badge';
import { STEPS, t } from '../i18n/ru.js';
import {
  stepTileBodyClass,
  stepTileClass,
  stepsGridClass,
} from '../layout.js';

interface FlowStepsNavProps {
  flowStep: number;
}

export function FlowStepsNav({ flowStep }: FlowStepsNavProps) {
  return (
    <nav className={stepsGridClass} aria-label={t.progressAria}>
      {STEPS.map((s) => {
        const done = flowStep > s.n;
        const active = flowStep === s.n;
        const upcoming = !done && !active;
        const badgeAppearance = done ? 'success' : active ? 'brand' : 'outline';
        return (
          <div
            key={s.n}
            className={`${stepTileClass} ${
              active
                ? 'bg-[var(--color-surface-2)] shadow-[var(--effect-elevation-1)]'
                : 'bg-[var(--color-surface-1)]'
            }`}
          >
            <Badge appearance={badgeAppearance} size="sm" className="shrink-0">
              {done ? '✓' : String(s.n)}
            </Badge>
            <div className={stepTileBodyClass}>
              <span
                className={`text-style-body-strong w-full ${
                  upcoming
                    ? 'text-[var(--color-text-secondary)]'
                    : 'text-[var(--color-text-primary)]'
                }`}
              >
                {s.title}
              </span>
              <span className="text-style-caption text-[var(--color-text-secondary)] block w-full">
                {s.hint}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
