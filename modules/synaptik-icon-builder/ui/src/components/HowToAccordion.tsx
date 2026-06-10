import { Accordion } from '@ai-ds/core/components/Accordion';
import { fullWidthSectionClass, sectionStackClass } from '../layout.js';
import { HOW_TO_USE } from '../i18n/ru.js';

export function HowToAccordion() {
  return (
    <div className={fullWidthSectionClass}>
      <Accordion
        size="md"
        fullWidth
        defaultOpen={false}
        className={fullWidthSectionClass}
        content={
          <ol
            className={`m-0 w-full list-decimal pl-[var(--space-inset-l)] text-style-body-sm text-[var(--color-text-secondary)] ${sectionStackClass}`}
          >
            {HOW_TO_USE.steps.map((step, i) => (
              <li key={i} className="w-full">
                {step}
              </li>
            ))}
          </ol>
        }
      >
        {HOW_TO_USE.summary}
      </Accordion>
    </div>
  );
}
