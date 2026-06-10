import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { Input } from '@ai-ds/core/components/Input';
import { t } from '../i18n/ru.js';
import { shortPagePath } from '../utils/shortPagePath.js';
import {
  contentStackTightClass,
  rowActionsClass,
  sectionStackClass,
  synaptikCardClass,
} from '../layout.js';
import type { SessionPageEntry } from '../types.js';

interface ExtendPagePanelProps {
  sourceUrl?: string;
  pages: SessionPageEntry[];
  pageUrls: string[];
  busy: boolean;
  apiOk: boolean;
  onPageUrlChange: (index: number, url: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onExtendRow: (index: number) => void;
  onExtendAll: () => void;
  onPickScannedUrl: (url: string) => void;
}

export function ExtendPagePanel({
  sourceUrl,
  pages,
  pageUrls,
  busy,
  apiOk,
  onPageUrlChange,
  onAddRow,
  onRemoveRow,
  onExtendRow,
  onExtendAll,
  onPickScannedUrl,
}: ExtendPagePanelProps) {
  const nonEmptyCount = pageUrls.filter((u) => u.trim()).length;
  const canExtend = apiOk && !busy && nonEmptyCount > 0;

  return (
    <Card variant="outlined" size="md" title={t.extendPageTitle} className={synaptikCardClass}>
      <div className={sectionStackClass}>
        <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
          {t.extendPageHint(sourceUrl)}
        </p>
        <div className={contentStackTightClass}>
          {pageUrls.map((pageUrl, index) => (
            <div key={index} className={rowActionsClass}>
              <Input
                size="md"
                fullWidth
                value={pageUrl}
                onChange={(e) => onPageUrlChange(index, e.target.value)}
                placeholder={t.extendPageUrlPlaceholder}
                aria-label={t.extendPageUrlPlaceholder}
                disabled={busy}
              />
              <Button
                appearance="outline"
                size="md"
                type="button"
                disabled={busy}
                onClick={onAddRow}
                title={t.extendPageAddRow}
                aria-label={t.extendPageAddRow}
              >
                +
              </Button>
              {pageUrls.length > 1 && (
                <Button
                  appearance="outline"
                  size="md"
                  type="button"
                  disabled={busy}
                  onClick={() => onRemoveRow(index)}
                  title={t.extendPageRemoveRow}
                  aria-label={t.extendPageRemoveRow}
                >
                  ×
                </Button>
              )}
              <Button
                appearance="brand"
                size="md"
                disabled={busy || !apiOk || !pageUrl.trim()}
                onClick={() => onExtendRow(index)}
              >
                {t.extendPageSubmit}
              </Button>
            </div>
          ))}
        </div>
        {nonEmptyCount > 1 && (
          <Button
            appearance="outline"
            size="md"
            disabled={!canExtend}
            onClick={onExtendAll}
          >
            {t.extendPageSubmitAll(nonEmptyCount)}
          </Button>
        )}
        {pages.length > 0 && (
          <div className={contentStackTightClass}>
            <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
              {t.extendPageScannedList}
            </p>
            <ul className={`m-0 list-none p-0 ${contentStackTightClass}`}>
              {pages.map((p) => (
                <li key={p.pageSlug}>
                  <button
                    type="button"
                    className="text-style-body-sm text-[var(--color-text-link)] bg-transparent border-0 p-0 cursor-pointer text-left hover:underline"
                    disabled={busy}
                    onClick={() => onPickScannedUrl(p.url)}
                  >
                    {shortPagePath(p.url)}
                    {p.pageTitle ? ` — ${p.pageTitle}` : ''}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
