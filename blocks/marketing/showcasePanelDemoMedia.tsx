import type { ShowcasePanelBlockProps } from './ShowcasePanelBlock/ShowcasePanelBlock.types';
import { showcasePanelDemoImage } from './demo-assets/showcasePanelDemoImages';

/** Attach demo preview images for Storybook render() — keep out of CSF args. */
export function withShowcasePanelDemoMedia(props: ShowcasePanelBlockProps): ShowcasePanelBlockProps {
  return {
    ...props,
    panels: props.panels.map((panel) => ({
      ...panel,
      imageSrc: panel.imageSrc ?? (panel.id ? showcasePanelDemoImage(panel.id) : undefined),
      imageAlt: panel.imageAlt ?? `${panel.title} — preview`,
    })),
  };
}
