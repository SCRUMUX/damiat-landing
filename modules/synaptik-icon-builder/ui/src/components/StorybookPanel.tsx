import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { t } from '../i18n/ru.js';
import { useStorybookUrl } from '../hooks/useStorybookUrl.js';
import { resolveStorybookProjectSlug } from '../utils/storybookLink.js';
import {
  contentStackTightClass,
  sectionStackClass,
  synaptikCardClass,
} from '../layout.js';
import type { RegistryIcon } from '../types.js';

interface StorybookPanelProps {
  registry: RegistryIcon[];
  hasRegistry: boolean;
  publishedCount: number;
  projectSlug: string;
}

export function StorybookPanel({
  registry,
  hasRegistry,
  publishedCount,
  projectSlug,
}: StorybookPanelProps) {
  const publishedSlugs = [...new Set(registry.map((i) => i.projectSlug))];
  const targetSlug = resolveStorybookProjectSlug(projectSlug, publishedSlugs);
  const { url: storybookUrl, loading } = useStorybookUrl(targetSlug);

  const openStorybook = () => {
    if (!storybookUrl) return;
    window.open(storybookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card variant="outlined" size="md" title={t.storybook} className={synaptikCardClass}>
      <div className={sectionStackClass}>
        {!hasRegistry && (
          <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
            {t.storybookEmpty}
          </p>
        )}
        {hasRegistry && registry[0] && (
          <p className="text-style-body text-[var(--color-text-primary)] m-0">
            {t.storybookPublished(registry.length, registry[0].projectSlug)}
          </p>
        )}
        <div className={contentStackTightClass}>
          <Button
            appearance="brand"
            size="md"
            disabled={loading || !storybookUrl}
            onClick={openStorybook}
          >
            {loading ? t.storybookLinkLoading : t.openStorybook}
          </Button>
          <p className="text-style-caption text-[var(--color-text-secondary)] m-0">
            {targetSlug
              ? t.storybookOpenHintProject(targetSlug)
              : t.storybookOpenHintCatalog}
          </p>
        </div>
        {hasRegistry && (
          <ul className={`m-0 list-none p-0 ${contentStackTightClass}`}>
            {registry.map((icon) => (
              <li
                key={`${icon.projectSlug}/${icon.iconSlug}`}
                className="text-style-body-sm text-[var(--color-text-secondary)]"
              >
                {icon.projectSlug} / {icon.name}
              </li>
            ))}
          </ul>
        )}
        {publishedCount > 0 && projectSlug && (
          <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
            {t.sessionPublishedHint(publishedCount, projectSlug)}
          </p>
        )}
      </div>
    </Card>
  );
}
