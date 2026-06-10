import { Accordion } from '@ai-ds/core/components/Accordion';

import { Badge } from '@ai-ds/core/components/Badge';

import { Button } from '@ai-ds/core/components/Button';

import { Card } from '@ai-ds/core/components/Card';

import { Input } from '@ai-ds/core/components/Input';

import { Alert } from '@ai-ds/core/components/Alert';

import { t } from '../i18n/ru.js';

import { shortPagePath } from '../utils/shortPagePath.js';

import { blockStats, groupCardsByBlock } from '../utils/groupCards.js';

import {

  contentStackTightClass,

  rowActionsClass,

  sectionStackClass,

  synaptikCardClass,

} from '../layout.js';

import type {
  Card as ContentCard,
  CardUiState,
  ContentBlock,
  StructureAuditSummary,
} from '../types.js';



interface BlocksMapPanelProps {

  cards: ContentCard[];

  blocks?: ContentBlock[];

  cardUi: Record<string, CardUiState>;

  searchQuery: string;

  structureAudit?: StructureAuditSummary;

  busy?: boolean;

  onSearchChange: (q: string) => void;

  onScrollToBlock: (blockKey: string) => void;

  onRepairStructure?: () => void;

}



export function BlocksMapPanel({

  cards,

  blocks,

  cardUi,

  searchQuery,

  structureAudit,

  busy,

  onSearchChange,

  onScrollToBlock,

  onRepairStructure,

}: BlocksMapPanelProps) {

  const groups = groupCardsByBlock(cards, blocks, searchQuery);

  const hasStructureIssues = Boolean(
    structureAudit &&
      (structureAudit.duplicateBlockIds.length > 0 ||
        structureAudit.duplicateCardIds.length > 0 ||
        structureAudit.emptyBlocks.length > 0 ||
        structureAudit.warnings.length > 0),
  );



  return (

    <section id="step-blocks-map" className="w-full">

      <Card variant="filled" size="md" title={t.blocksMapTitle} className={synaptikCardClass}>

        <div className={sectionStackClass}>

          <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">

            {t.blocksMapHint}

          </p>

          <Input

            size="md"

            fullWidth

            value={searchQuery}

            onChange={(e) => onSearchChange(e.target.value)}

            placeholder={t.blocksMapSearchPlaceholder}

            aria-label={t.blocksMapSearchPlaceholder}

          />

          {structureAudit && (
            <div className={sectionStackClass}>
              <p className="text-style-body-strong text-[var(--color-text-primary)] m-0">
                {t.structureAuditTitle}
              </p>
              {hasStructureIssues ? (
                <Alert appearance="warning" title={t.structureAuditWarnings}>
                  <ul className="m-0 pl-[var(--space-content-m)] text-style-body-sm">
                    {structureAudit.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </Alert>
              ) : (
                <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
                  {t.structureAuditOk}
                </p>
              )}
              {onRepairStructure && (
                <Button
                  appearance="outline"
                  size="sm"
                  disabled={busy}
                  onClick={onRepairStructure}
                >
                  {t.repairStructure}
                </Button>
              )}
            </div>
          )}

          {groups.length === 0 && (

            <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">

              {t.blocksMapNoMatch}

            </p>

          )}



          <div className={contentStackTightClass}>

            {groups.map((group, idx) => {

              const stats = blockStats(group.cards, cardUi);

              const pageLabel = shortPagePath(group.sourcePageUrl);

              const defaultOpen = idx === 0 || stats.outdated > 0;

              return (

                <Accordion

                  key={group.blockKey}

                  size="sm"

                  fullWidth

                  defaultOpen={defaultOpen}

                  content={

                    <div className={sectionStackClass}>

                      {group.blockDescription && (

                        <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">

                          {group.blockDescription}

                        </p>

                      )}

                      <ul className={`m-0 list-none p-0 ${contentStackTightClass}`}>

                        {group.cards.map((c) => (

                          <li

                            key={c.id}

                            className="text-style-body-sm text-[var(--color-text-primary)]"

                          >

                            {c.title}

                          </li>

                        ))}

                      </ul>

                      <Button

                        appearance="outline"

                        size="sm"

                        onClick={() => onScrollToBlock(group.blockKey)}

                      >

                        {t.blocksMapGoToBlock}

                      </Button>

                    </div>

                  }

                >

                  <span className="flex flex-wrap items-center gap-[var(--space-content-xs)]">

                    <span className="text-style-body-strong">{group.blockTitle}</span>

                    {pageLabel && (

                      <Badge appearance="outline" size="sm">

                        {t.blockPageBadge(pageLabel)}

                      </Badge>

                    )}

                    <span className="text-style-caption text-[var(--color-text-secondary)]">

                      {t.blockStats(

                        stats.total,

                        stats.preview,

                        stats.published,

                        stats.outdated,

                      )}

                    </span>

                  </span>

                </Accordion>

              );

            })}

          </div>

        </div>

      </Card>

    </section>

  );

}

