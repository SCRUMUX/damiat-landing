import { Badge } from '@ai-ds/core/components/Badge';
import { t } from '../i18n/ru.js';
import { shortPagePath } from '../utils/shortPagePath.js';
import { blockHeaderStackClass, contentStackTightClass } from '../layout.js';
import type { CardBlockGroup } from '../utils/groupCards.js';

interface BlockSectionHeaderProps {
  group: CardBlockGroup;
  stats?: { total: number; preview: number; published: number; outdated: number };
}

export function BlockSectionHeader({ group, stats }: BlockSectionHeaderProps) {
  const pageLabel = shortPagePath(group.sourcePageUrl);
  return (
    <div className={blockHeaderStackClass}>
      <div className="flex flex-wrap items-center gap-[var(--space-content-s)]">
        <h3 className="text-style-h3 text-[var(--color-text-primary)] m-0">
          {group.blockTitle}
        </h3>
        {pageLabel && (
          <Badge appearance="outline" size="sm">
            {t.blockPageBadge(pageLabel)}
          </Badge>
        )}
        {stats && (
          <span className="text-style-caption text-[var(--color-text-secondary)]">
            {t.blockStats(stats.total, stats.preview, stats.published, stats.outdated)}
          </span>
        )}
      </div>
      {group.blockDescription && (
        <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
          {group.blockDescription}
        </p>
      )}
      {group.sourcePageTitle && group.sourcePageUrl && (
        <p className="text-style-caption text-[var(--color-text-secondary)] m-0">
          {t.blockPageTitle(group.sourcePageTitle, group.sourcePageUrl)}
        </p>
      )}
    </div>
  );
}
