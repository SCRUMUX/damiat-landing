import { Accordion } from '@ai-ds/core/components/Accordion';
import { Badge } from '@ai-ds/core/components/Badge';
import { t } from '../i18n/ru.js';
import { contentStackTightClass, sectionStackClass } from '../layout.js';

export interface PromptPreviewData {
  cardTitle: string;
  semantic: {
    iconType: string;
    visualObject: string;
    visualFocus: string[];
  } | null;
  selectedConcept: {
    id: string;
    label: string;
    visualObject: string;
  };
  sections: { subject: string; style: string; composition: string };
  subjectLine?: string;
  stylePresetId?: string;
  fullPrompt: string;
  audit: {
    styleWeight: number;
    semanticWeight: number;
    subjectWeight: number;
    compositionWeight: number;
    identifiedIssues: string[];
  };
  score: {
    styleCoverage: number;
    semanticCoverage: number;
    objectClarity: number;
    ambiguityRisk: number;
  };
}

function stripBlockHeader(section: string, header: string): string {
  const lines = section.split('\n');
  if (lines[0]?.trim() === header) return lines.slice(1).join('\n').trim();
  return section.trim();
}

interface PromptDebugPanelProps {
  data: PromptPreviewData;
}

export function PromptDebugPanel({ data }: PromptDebugPanelProps) {
  const clarity = data.score.objectClarity;
  const clarityOk = clarity >= 0.6;
  const subjectBody =
    data.subjectLine?.trim() ||
    stripBlockHeader(data.sections.subject, '=== SUBJECT BLOCK ===');
  const styleBody = stripBlockHeader(data.sections.style, '=== STYLE BLOCK ===');
  const compositionBody = stripBlockHeader(
    data.sections.composition,
    '=== COMPOSITION BLOCK ===',
  );

  return (
    <div className={sectionStackClass}>
      <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
        {t.promptDebugChain}
      </p>
      <ol className={`${contentStackTightClass} m-0 pl-[var(--space-inset-l)] text-style-body-sm`}>
        <li>
          <strong>{t.promptDebugCardTitle}:</strong> {data.cardTitle}
        </li>
        <li>
          <strong>{t.promptDebugSemantic}:</strong>{' '}
          {data.semantic
            ? `${data.semantic.iconType} — ${data.semantic.visualObject}`
            : t.promptDebugSemanticMissing}
        </li>
        <li>
          <strong>{t.promptDebugConcept}:</strong> {data.selectedConcept.id}.{' '}
          {data.selectedConcept.label} — {data.selectedConcept.visualObject}
        </li>
      </ol>
      <div className="flex flex-wrap gap-[var(--space-content-s)] items-center">
        <Badge appearance={clarityOk ? 'success' : 'warning'} size="sm">
          {t.promptDebugClarity(clarity)}
        </Badge>
        {data.stylePresetId && (
          <Badge appearance="neutral" size="sm">
            {t.promptDebugStylePreset(data.stylePresetId)}
          </Badge>
        )}
        {data.audit.identifiedIssues.length > 0 && (
          <span className="text-style-caption text-[var(--color-text-warning)]">
            {data.audit.identifiedIssues.join(', ')}
          </span>
        )}
      </div>
      <Accordion
        size="sm"
        fullWidth
        defaultOpen
        content={
          <pre className="m-0 overflow-auto rounded-[var(--radius-default)] bg-[var(--color-surface-2)] p-[var(--space-inset-m)] text-style-body-xs text-[var(--color-text-secondary)] whitespace-pre-wrap">
            <span className="text-style-caption text-[var(--color-text-primary)]">
              {t.promptDebugSubjectStyle}
            </span>
            {'\n\n'}
            {subjectBody}
            {'\n\n'}
            {styleBody}
          </pre>
        }
      >
        {t.promptDebugSubjectStyle}
      </Accordion>
      <Accordion
        size="sm"
        fullWidth
        content={
          <pre className="m-0 overflow-auto rounded-[var(--radius-default)] bg-[var(--color-surface-2)] p-[var(--space-inset-m)] text-style-body-xs text-[var(--color-text-secondary)] whitespace-pre-wrap max-h-[var(--space-320)]">
            {compositionBody}
          </pre>
        }
      >
        {t.promptDebugComposition}
      </Accordion>
      <Accordion
        size="sm"
        fullWidth
        content={
          <pre className="m-0 overflow-auto rounded-[var(--radius-default)] bg-[var(--color-surface-2)] p-[var(--space-inset-m)] text-style-body-xs text-[var(--color-text-secondary)] whitespace-pre-wrap max-h-[var(--space-320)]">
            {data.fullPrompt}
          </pre>
        }
      >
        {t.promptDebugFinalPrompt}
      </Accordion>
    </div>
  );
}
