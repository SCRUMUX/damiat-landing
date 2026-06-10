import { fileExists, readJsonFile } from '../fs-json.js';
import { CaptureReportSchema } from '../types/index.js';
import { createSession } from './init.js';
import { runCapture } from './capture.js';
import { runAnalyzeStyle } from './style-dna.js';
import { runAnalyzeContent } from './content.js';
import { runCombinedAnalyze } from './combined-analyze.js';
import { useCombinedAnalyze } from '../adapters/vision/index.js';
import { runSemanticInterpret } from '../semantic/interpret.js';
import { runConcepts } from './concepts.js';
import { getSessionPaths } from '../paths.js';
import { printSessionStatus } from './status.js';
import { SelectionsFileSchema } from '../types/index.js';
import { runRenderAll, runPublishAll } from './batch.js';
import { upsertManifestPage } from './manifest-pages.js';
import {
  parseIconSetStyleId,
  type IconSetStyleId,
} from '../icon-set-styles/index.js';

export interface RunOptions {
  url?: string;
  screenshots?: string;
  slug?: string;
  iconSetStyleId?: IconSetStyleId;
  maxCards?: number;
  maxBlocks?: number;
  maxCardsPerBlock?: number;
  skipCapture?: boolean;
  auto?: boolean;
  publish?: boolean;
}

export async function runPipeline(opts: RunOptions): Promise<string> {
  if (!parseIconSetStyleId(opts.iconSetStyleId)) {
    throw new Error(
      'iconSetStyleId is required (glass | isometric | soft3d | shield | flat | outline)',
    );
  }

  const sessionId = createSession({
    url: opts.url,
    screenshots: opts.screenshots,
    slug: opts.slug,
    iconSetStyleId: opts.iconSetStyleId,
  });
  const paths = getSessionPaths(sessionId);

  console.log(`Session created: ${sessionId}`);

  if (!opts.skipCapture) {
    await runCapture(paths, { url: opts.url, screenshots: opts.screenshots });
    console.log('Capture done.');
  }

  const contentOpts = {
    maxBlocks: opts.maxBlocks,
    maxCardsPerBlock: opts.maxCardsPerBlock,
  };

  if (useCombinedAnalyze()) {
    await runCombinedAnalyze(paths, {
      slug: opts.slug,
      maxBlocks: opts.maxBlocks,
      maxCardsPerBlock: opts.maxCardsPerBlock,
    });
    console.log('Combined analyze: Style DNA + content structure written.');
  } else {
    await runAnalyzeStyle(paths, { slug: opts.slug });
    console.log('Style DNA written (immutable for this session).');
    await runAnalyzeContent(paths, contentOpts);
    console.log('Content structure + cards written.');
  }

  if (opts.url) {
    let pageTitle: string | undefined;
    try {
      const capture = readJsonFile(paths.captureReport, CaptureReportSchema);
      pageTitle = capture.pageTitle;
    } catch {
      // optional
    }
    upsertManifestPage(paths, opts.url, { pageTitle });
  }

  await runSemanticInterpret(paths, {});
  console.log('Semantic interpret written.');
  await runConcepts(paths, {});
  console.log('Concepts generated (3 per card by default).');

  printSessionStatus(paths);

  if (opts.auto) {
    if (!fileExists(paths.selections)) {
      console.log('\n--auto: No selections.json yet. Add selections then re-run render-all.');
      return sessionId;
    }
    const { selections } = readJsonFile(paths.selections, SelectionsFileSchema);
    if (selections.length === 0) {
      console.log('\n--auto: selections.json is empty. Run select-concept for each card first.');
      return sessionId;
    }
    const renderResult = await runRenderAll(paths, { overwrite: true });
    console.log(`Rendered: ${renderResult.rendered.join(', ') || '(none)'}`);
    if (renderResult.errors.length) {
      for (const e of renderResult.errors) console.error(`  ${e.cardId}: ${e.message}`);
    }
    if (opts.publish) {
      const pub = await runPublishAll(paths);
      console.log(`Published: ${pub.published.join(', ') || '(none)'}`);
    } else {
      console.log('Skipping publish (use --publish with --auto to publish all renders).');
    }
    return sessionId;
  }

  console.log(`
Next steps:
  1. synaptik select-concept --session ${sessionId} --card <id> --concept A|B|C
  2. synaptik render-all --session ${sessionId}
  3. synaptik publish --session ${sessionId} --card <id> --approve
  Or: synaptik publish-all --session ${sessionId} --approve
`);

  return sessionId;
}
