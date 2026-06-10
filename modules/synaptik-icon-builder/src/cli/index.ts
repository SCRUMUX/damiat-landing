#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { loadSynaptikEnv } from '../load-env.js';
import { getSessionPaths, slugify } from '../paths.js';
import { fileExists } from '../fs-json.js';
import { createSession } from '../pipeline/init.js';
import { runCapture } from '../pipeline/capture.js';
import { runAnalyzeStyle } from '../pipeline/style-dna.js';
import { runAnalyzeContent } from '../pipeline/content.js';
import { runConcepts, runSelectConcept } from '../pipeline/concepts.js';
import { runSemanticInterpret } from '../semantic/interpret.js';
import { runBuildPrompt } from '../pipeline/build-prompt.js';
import { auditPrompt } from '../pipeline/prompt-audit.js';
import { buildPromptPreview } from '../pipeline/prompt-preview.js';
import { runRender } from '../pipeline/render.js';
import { runRegenerate } from '../pipeline/regenerate.js';
import { runPublish } from '../pipeline/publish.js';
import { printSessionStatus } from '../pipeline/status.js';
import { runPipeline } from '../pipeline/run.js';
import { runRenderAll, runPublishAll } from '../pipeline/batch.js';
import { runPublishReady } from '../pipeline/publish-ready.js';
import { reconcileSessionRenders } from '../pipeline/catalog-reconcile.js';
import { deleteSession } from '../session/delete-session.js';
import { checkRegistry } from '../check-registry.js';
import { runIconStyleBible } from '../pipeline/icon-style-bible.js';
import { runExtendPage } from '../pipeline/extend-page.js';
import { runRepairStructure } from '../pipeline/repair-structure.js';
import { setCardSkipped } from '../pipeline/toggle-card-skipped.js';
import type { ConceptLetter } from '../types/index.js';
import { MVP_DEFAULTS } from '../types/index.js';
import {
  DEFAULT_ICON_SET_STYLE_ID,
  parseIconSetStyleId,
} from '../icon-set-styles/index.js';

loadSynaptikEnv();

const program = new Command();

program
  .name('synaptik')
  .description('Synaptik AI Icon System Builder')
  .version('0.1.0');

program
  .command('init')
  .description('Create a new session')
  .option('--url <url>', 'Source website URL')
  .option('--screenshots <dir>', 'Folder with user screenshots')
  .option('--slug <slug>', 'Project slug override')
  .option('--session <id>', 'Custom session id')
  .option(
    '--icon-style <id>',
    'Icon set style preset (glass|isometric|soft3d|shield|flat|outline)',
  )
  .action((opts) => {
    const iconSetStyleId = parseIconSetStyleId(opts.iconStyle) ?? undefined;
    const sessionId = createSession({
      url: opts.url,
      screenshots: opts.screenshots,
      slug: opts.slug,
      sessionId: opts.session,
      iconSetStyleId,
    });
    console.log(`Session: ${sessionId}`);
    console.log(`Path: ${getSessionPaths(sessionId).sessionDir}`);
  });

program
  .command('capture')
  .requiredOption('--session <id>', 'Session id')
  .option('--url <url>', 'Website URL')
  .option('--screenshots <dir>', 'Screenshots directory')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    await runCapture(paths, { url: opts.url, screenshots: opts.screenshots });
    console.log('Wrote capture-report.json');
  });

program
  .command('analyze-style')
  .requiredOption('--session <id>', 'Session id')
  .option('--force', 'Regenerate Style DNA (dev only)')
  .option('--slug <slug>', 'Project slug')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    const dna = await runAnalyzeStyle(paths, { force: opts.force, slug: opts.slug });
    console.log('Style DNA:', dna.projectSlug);
  });

program
  .command('icon-bible')
  .description('Generate or refresh icon-style-bible.json (STYLE_BLOCK) without rewriting Style DNA')
  .requiredOption('--session <id>', 'Session id')
  .option('--force', 'Regenerate even if icon-style-bible.json exists')
  .option('--icon-style <id>', 'Icon set style preset override')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    if (!fileExists(paths.styleDna)) {
      throw new Error('Style DNA missing. Run analyze-style or run pipeline first.');
    }
    const bible = await runIconStyleBible(paths, {
      force: opts.force,
      iconSetStyleId: parseIconSetStyleId(opts.iconStyle) ?? undefined,
    });
    console.log('Wrote icon-style-bible.json');
    console.log('Style anchor:', bible.styleAnchor ?? '(in styleBlock)');
    console.log('Next: synaptik concepts --session', opts.session, 'then re-render previews.');
  });

program
  .command('analyze-content')
  .requiredOption('--session <id>', 'Session id')
  .option('--max-blocks <n>', 'Max section blocks', String(MVP_DEFAULTS.maxBlocks))
  .option('--max-cards-per-block <n>', 'Max cards per block', String(MVP_DEFAULTS.maxCardsPerBlock))
  .option('--max-cards <n>', 'Legacy: approx total cards (maps to blocks×per-block)', '12')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    await runAnalyzeContent(paths, {
      maxBlocks: parseInt(opts.maxBlocks, 10),
      maxCardsPerBlock: parseInt(opts.maxCardsPerBlock, 10),
    });
    console.log('Wrote content-structure.json and content-cards.json');
  });

program
  .command('repair-structure')
  .description('Fix duplicate block/card ids and rebuild content-cards.json')
  .requiredOption('--session <id>', 'Session id')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    const result = await runRepairStructure(paths);
    console.log(
      `Repaired: ${result.blocks} blocks, ${result.cards} cards. repaired=${result.repaired}`,
    );
    if (result.warnings.length) {
      console.warn('Warnings:', result.warnings.join('\n'));
    }
  });

program
  .command('extend-page')
  .description('Capture another page on the same site and merge new icon cards (keeps Style DNA)')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--url <url>', 'Page URL (same origin as session)')
  .option('--max-blocks <n>', 'Max new blocks', String(MVP_DEFAULTS.maxBlocks))
  .option('--max-cards-per-block <n>', 'Max cards per block', String(MVP_DEFAULTS.maxCardsPerBlock))
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    const result = await runExtendPage(paths, opts.url, {
      maxBlocks: parseInt(opts.maxBlocks, 10),
      maxCardsPerBlock: parseInt(opts.maxCardsPerBlock, 10),
    });
    console.log(
      `Page ${result.pageSlug}: +${result.addedBlocks} blocks, +${result.addedCards} cards.`,
    );
    if (result.newCardIds.length) {
      console.log('New card ids:', result.newCardIds.join(', '));
    }
  });

program
  .command('semantic')
  .description('Translate card titles into English visual objects (semantic layer)')
  .requiredOption('--session <id>', 'Session id')
  .option('--card <id>', 'Single card id')
  .option('--force', 'Regenerate existing semantic files')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    await runSemanticInterpret(paths, {
      cardId: opts.card,
      force: opts.force,
    });
    console.log('Semantic interpret written.');
  });

program
  .command('concepts')
  .requiredOption('--session <id>', 'Session id')
  .option('--card <id>', 'Single card id')
  .option('--max-concepts <n>', 'Concepts per card (max 5)', '3')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    await runConcepts(paths, {
      cardId: opts.card,
      maxConcepts: parseInt(opts.maxConcepts, 10),
    });
    console.log('Concepts written.');
  });

program
  .command('audit-prompt')
  .description('Audit a prompt file or dry-run build for a card')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--card <id>', 'Card id')
  .option('--concept <letter>', 'Concept A–E (default: selection)')
  .action((opts) => {
    const paths = getSessionPaths(opts.session);
    const concept = opts.concept?.toUpperCase() as ConceptLetter | undefined;
    try {
      const preview = buildPromptPreview(paths, opts.card, concept);
      console.log(JSON.stringify({ audit: preview.audit, score: preview.score }, null, 2));
      console.log('\n--- Full prompt ---\n');
      console.log(preview.fullPrompt);
    } catch (e) {
      const promptPath = path.join(paths.promptsDir, `${slugify(opts.card)}.txt`);
      if (fileExists(promptPath)) {
        const text = fs.readFileSync(promptPath, 'utf8');
        console.log(JSON.stringify(auditPrompt(text), null, 2));
      } else {
        throw e;
      }
    }
  });

program
  .command('select-concept')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--card <id>', 'Card id')
  .requiredOption('--concept <letter>', 'Concept A–E')
  .action((opts) => {
    const paths = getSessionPaths(opts.session);
    runSelectConcept(paths, opts.card, opts.concept.toUpperCase() as ConceptLetter);
    console.log(`Selected ${opts.concept} for ${opts.card}`);
  });

program
  .command('build-prompt')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--card <id>', 'Card id')
  .action((opts) => {
    const paths = getSessionPaths(opts.session);
    const text = runBuildPrompt(paths, opts.card);
    console.log(text);
  });

program
  .command('render')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--card <id>', 'Card id')
  .option('--overwrite', 'Overwrite existing render')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    if (!fileExists(paths.selections)) {
      throw new Error('Run select-concept first.');
    }
    const result = await runRender(paths, opts.card, { overwrite: opts.overwrite });
    console.log(`Rendered: ${result.renderDir}`);
  });

program
  .command('regenerate')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--card <id>', 'Card id')
  .option('--concept <letter>', 'New concept A–E')
  .option('--realism <style>', 'Realism override')
  .option('--description <text>', 'Extra description')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    await runRegenerate(paths, {
      cardId: opts.card,
      concept: opts.concept?.toUpperCase() as ConceptLetter | undefined,
      realism: opts.realism,
      description: opts.description,
    });
    console.log('Regenerated (Style DNA unchanged).');
  });

program
  .command('publish')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--card <id>', 'Card id')
  .requiredOption('--approve', 'Confirm publish to generated-icons/')
  .action(async (opts) => {
    if (!opts.approve) throw new Error('--approve is required');
    const paths = getSessionPaths(opts.session);
    const { projectSlug, iconSlug } = await runPublish(paths, opts.card);
    console.log(`Published: generated-icons/${projectSlug}/${iconSlug}`);
  });

program
  .command('status')
  .requiredOption('--session <id>', 'Session id')
  .action((opts) => {
    printSessionStatus(getSessionPaths(opts.session));
  });

program
  .command('render-all')
  .requiredOption('--session <id>', 'Session id')
  .option('--overwrite', 'Overwrite existing renders')
  .action(async (opts) => {
    const paths = getSessionPaths(opts.session);
    const result = await runRenderAll(paths, { overwrite: opts.overwrite ?? true });
    console.log('Rendered:', result.rendered.join(', ') || '(none)');
    for (const id of result.skipped) console.warn('Skipped:', id);
    for (const e of result.errors) console.error(`${e.cardId}: ${e.message}`);
    if (result.errors.length) process.exit(1);
  });

program
  .command('publish-all')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--approve', 'Confirm publish')
  .action(async (opts) => {
    if (!opts.approve) throw new Error('--approve is required');
    const paths = getSessionPaths(opts.session);
    const result = await runPublishAll(paths);
    console.log('Published:', result.published.join(', ') || '(none)');
    for (const e of result.errors) console.error(`${e.cardId}: ${e.message}`);
    if (result.errors.length) process.exit(1);
  });

program
  .command('publish-ready')
  .description('Publish all QA-passing renders with concept selection')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--approve', 'Confirm publish')
  .action(async (opts) => {
    if (!opts.approve) throw new Error('--approve is required');
    const paths = getSessionPaths(opts.session);
    const result = await runPublishReady(paths);
    console.log('Published:', result.published.join(', ') || '(none)');
    for (const id of result.publishSkipped) console.warn('Skipped:', id);
    for (const e of result.errors) console.error(`${e.cardId}: ${e.message}`);
    if (result.errors.length) process.exit(1);
  });

program
  .command('reconcile')
  .description('Match render meta.cardId to content cards by title')
  .requiredOption('--session <id>', 'Session id')
  .action((opts) => {
    const paths = getSessionPaths(opts.session);
    const result = reconcileSessionRenders(paths);
    console.log('Updated cardIds:', result.renderCardIdsUpdated.join(', ') || '(none)');
    if (result.orphanRenderDirs.length) {
      console.warn('Orphan renders:', result.orphanRenderDirs.join(', '));
    }
  });

program
  .command('delete-session')
  .description('Remove .synaptik session folder only (keeps generated-icons/)')
  .requiredOption('--session <id>', 'Session id')
  .requiredOption('--confirm', 'Confirm deletion')
  .action((opts) => {
    if (!opts.confirm) throw new Error('--confirm is required');
    deleteSession(opts.session);
    console.log(`Deleted session ${opts.session} (generated-icons untouched).`);
  });

program
  .command('run')
  .option('--url <url>', 'Website URL')
  .option('--screenshots <dir>', 'Screenshots folder')
  .option('--slug <slug>', 'Project slug')
  .option('--max-cards <n>', 'Legacy total card hint', '12')
  .option('--max-blocks <n>', 'Max section blocks', String(MVP_DEFAULTS.maxBlocks))
  .option('--max-cards-per-block <n>', 'Max cards per block', String(MVP_DEFAULTS.maxCardsPerBlock))
  .option('--auto', 'After concepts, render-all if selections exist')
  .option('--publish', 'With --auto, also publish-all')
  .option('--approve', 'Required when using --publish with --auto')
  .option(
    '--icon-style <id>',
    `Icon set style preset (default: ${DEFAULT_ICON_SET_STYLE_ID})`,
    DEFAULT_ICON_SET_STYLE_ID,
  )
  .action(async (opts) => {
    if (!opts.url && !opts.screenshots) {
      throw new Error('Provide --url or --screenshots');
    }
    const iconSetStyleId = parseIconSetStyleId(opts.iconStyle);
    if (!iconSetStyleId) {
      throw new Error(
        'Invalid --icon-style. Use: glass | isometric | soft3d | shield | flat | outline',
      );
    }
    if (opts.publish && !opts.approve) {
      throw new Error('--approve is required when using --publish');
    }
    await runPipeline({
      url: opts.url,
      screenshots: opts.screenshots,
      slug: opts.slug,
      iconSetStyleId,
      maxBlocks: parseInt(opts.maxBlocks, 10),
      maxCardsPerBlock: parseInt(opts.maxCardsPerBlock, 10),
      auto: Boolean(opts.auto),
      publish: Boolean(opts.publish) && Boolean(opts.approve),
    });
  });

program
  .command('check')
  .option(
    '--fix-stories',
    'Restore published icons from sessions, sync registry.json, regenerate Storybook stories',
  )
  .action((opts) => {
    const result = checkRegistry(Boolean(opts.fixStories));
    if (result.errors.length) {
      for (const e of result.errors) console.error(e);
      process.exit(1);
    }
    console.log('Registry OK');
  });

program.parse();
