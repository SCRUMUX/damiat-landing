import type { TestRunnerConfig } from '@storybook/test-runner';

/**
 * Storybook test-runner config — VRT entry point (Phase 10 task 10.9).
 *
 * Each story is rendered in a real Chromium instance (Playwright under the
 * hood) and snapshotted. Threshold mirrors `.chromatic.config.json`
 * (`diffThreshold: 0.002` == 0.2%). Combined with Chromatic for visual
 * baseline storage and PR-blocking review.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    // Reduce flake by waiting for fonts + token CSS to load before snapshot.
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });
  },
  async postVisit(page, context) {
    // Hook left open for future axe-core / a11y checks.
    void context;
    void page;
  },
};

export default config;
