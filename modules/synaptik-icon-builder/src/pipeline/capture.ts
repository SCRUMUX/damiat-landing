import { captureWebsite } from '../adapters/playwright-capture.js';
import { extractPaletteFromScreenshotsDir } from '../adapters/image-palette.js';
import { writeJsonFile } from '../fs-json.js';
import type { SessionPaths } from '../paths.js';
import { CaptureReportSchema } from '../types/index.js';

export async function runCapture(
  paths: SessionPaths,
  opts: { url?: string; screenshots?: string },
): Promise<void> {
  const report = await captureWebsite({
    url: opts.url,
    screenshotsDir: paths.screenshotsDir,
    sourceScreenshotsDir: opts.screenshots,
  });

  try {
    const paletteFromImage = await extractPaletteFromScreenshotsDir(paths.screenshotsDir);
    if (paletteFromImage.length > 0) {
      report.paletteFromImage = paletteFromImage;
    }
  } catch {
    // optional enhancement
  }

  writeJsonFile(paths.captureReport, CaptureReportSchema.parse(report));
}
