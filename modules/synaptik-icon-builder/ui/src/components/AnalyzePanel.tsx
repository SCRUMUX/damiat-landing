import { Accordion } from '@ai-ds/core/components/Accordion';
import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { Input } from '@ai-ds/core/components/Input';
import { Select } from '@ai-ds/core/components/Select';
import { t } from '../i18n/ru.js';
import type { IconSetStyleOption } from '../types.js';
import { rowActionsClass, sectionStackClass, synaptikCardClass } from '../layout.js';

interface AnalyzePanelProps {
  url: string;
  iconSetStyleId: string;
  styleOptions: IconSetStyleOption[];
  busy: boolean;
  apiOk: boolean;
  flowStep: number;
  resumed: boolean;
  busyLabel: string;
  compact?: boolean;
  onUrlChange: (url: string) => void;
  onIconSetStyleChange: (id: string) => void;
  onRun: (forceNew: boolean) => void;
}

function AnalyzeFields({
  url,
  iconSetStyleId,
  styleOptions,
  busy,
  apiOk,
  flowStep,
  resumed,
  busyLabel,
  onUrlChange,
  onIconSetStyleChange,
  onRun,
}: AnalyzePanelProps) {
  const canRun = apiOk && !busy && url.trim() && iconSetStyleId.trim();

  return (
    <div className={sectionStackClass}>
      <div className={sectionStackClass}>
        <label className="text-style-body-sm text-[var(--color-text-primary)]" htmlFor="synaptik-icon-style">
          {t.iconSetStyleLabel}
        </label>
        <Select
          id="synaptik-icon-style"
          size="md"
          fullWidth
          value={iconSetStyleId}
          onValueChange={onIconSetStyleChange}
          options={styleOptions.map((o) => ({ value: o.id, label: o.labelRu }))}
          placeholder={t.iconSetStyleLabel}
          disabled={busy || styleOptions.length === 0}
        />
        <p className="text-style-caption text-[var(--color-text-secondary)] m-0">
          {t.iconSetStyleHint}
        </p>
      </div>
      <Input
        appearance="outline"
        size="md"
        fullWidth
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder={t.urlPlaceholder}
        aria-label={t.urlLabel}
        inputProps={{ id: 'synaptik-url', type: 'url', name: 'url' }}
      />
      <div className={rowActionsClass}>
        <Button
          appearance="brand"
          size="md"
          disabled={!canRun}
          loading={busy && flowStep === 1 && !resumed}
          onClick={() => onRun(false)}
        >
          {busy && flowStep === 1 && !resumed ? busyLabel : t.newAnalysis}
        </Button>
        <Button
          appearance="outline"
          size="md"
          disabled={!canRun}
          title={t.forceNewTitle}
          onClick={() => onRun(true)}
        >
          {t.forceNewSession}
        </Button>
      </div>
    </div>
  );
}

export function AnalyzePanel(props: AnalyzePanelProps) {
  const { compact } = props;

  if (compact) {
    return (
      <Accordion
        size="sm"
        fullWidth
        defaultOpen={false}
        content={<AnalyzeFields {...props} />}
      >
        {t.step1Title}
      </Accordion>
    );
  }

  return (
    <Card variant="outlined" size="md" title={t.step1Title} className={synaptikCardClass}>
      <AnalyzeFields {...props} />
    </Card>
  );
}
