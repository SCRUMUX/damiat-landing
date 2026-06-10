import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { loadSynaptikEnv } from '../../src/load-env.js';
import { getSynaptikEnvStatus } from '../../src/env-status.js';
import { runPipeline } from '../../src/pipeline/run.js';
import { getGeneratedIconDir, getSessionPaths, getRegistryPath, slugify } from '../../src/paths.js';
import { fileExists, readJsonFile } from '../../src/fs-json.js';
import {
  AssetMetaSchema,
  ContentCardsFileSchema,
  RegistrySchema,
  StyleDNASchema,
} from '../../src/types/index.js';
import {
  runSelectConcept,
  getConceptSetForCard,
} from '../../src/pipeline/concepts.js';
import { runRender } from '../../src/pipeline/render.js';
import { buildPromptPreview } from '../../src/pipeline/prompt-preview.js';
import { runPublish } from '../../src/pipeline/publish.js';
import { runPublishReady } from '../../src/pipeline/publish-ready.js';
import { runRenderAll } from '../../src/pipeline/batch.js';
import { reconcileSessionRenders } from '../../src/pipeline/catalog-reconcile.js';
import { deleteSession } from '../../src/session/delete-session.js';
import { getStoragePathsInfo } from '../../src/storage-paths.js';
import { runExtendPage } from '../../src/pipeline/extend-page.js';
import { runRepairStructure } from '../../src/pipeline/repair-structure.js';
import { setCardSkipped } from '../../src/pipeline/toggle-card-skipped.js';
import { auditContentStructure } from '../../src/pipeline/validate-content-structure.js';
import { loadContentBlocks } from '../../src/pipeline/content-structure.js';
import {
  listRenderVersions,
  setActiveRenderVersion,
  versionPreviewPath,
} from '../../src/utils/render-versions.js';
import { runRefreshIconStyle } from '../../src/pipeline/refresh-icon-style.js';
import { runChangeIconSetStyle } from '../../src/pipeline/change-icon-set-style.js';
import {
  ICON_SET_STYLES,
  parseIconSetStyleId,
} from '../../src/icon-set-styles/index.js';
import type { ConceptLetter } from '../../src/types/index.js';
import {
  listSessions,
  findSessionByUrl,
  buildSessionUiState,
} from '../../src/sessions-list.js';
import {
  buildStorybookUrl,
  generatedIconsStoryPath,
  resolveStorybookOrigin,
  resolveStorybookProjectSlug,
} from '../src/utils/storybookLink.js';
import { apiMessages, mapApiError } from '../src/i18n/ru.js';

function apiError(
  res: express.Response,
  status: number,
  error: string,
  errorCode?: string,
  extra?: Record<string, unknown>,
) {
  res.status(status).json({ error, errorCode, ...extra });
}

function handleUnknownError(res: express.Response, e: unknown) {
  const raw = e instanceof Error ? e.message : String(e);
  const code = (e as Error & { code?: string }).code;
  if (code === 'PROMPT_QUALITY_LOW') {
    const score = (e as Error & { score?: unknown }).score;
    apiError(res, 422, raw, code, { score });
    return;
  }
  apiError(res, 500, mapApiError(raw || apiMessages.internalError), 'INTERNAL');
}

loadSynaptikEnv();

const app = express();
app.use(express.json());

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    res.status(400).json({ error: apiMessages.invalidJsonBody, errorCode: 'INVALID_JSON' });
    return;
  }
  next(err);
});

function findRenderMeta(
  paths: ReturnType<typeof getSessionPaths>,
  cardId: string,
): {
  dirName: string;
  iconSlug: string;
  meta: ReturnType<typeof AssetMetaSchema.parse>;
} | null {
  if (!fs.existsSync(paths.rendersDir)) return null;
  for (const name of fs.readdirSync(paths.rendersDir)) {
    const metaPath = path.join(paths.rendersDir, name, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = readJsonFile(metaPath, AssetMetaSchema);
    if (meta.cardId === cardId) {
      return { dirName: name, iconSlug: meta.iconSlug ?? name, meta };
    }
  }
  return null;
}

function findRenderPng(
  paths: ReturnType<typeof getSessionPaths>,
  cardId: string,
): string | null {
  const found = findRenderMeta(paths, cardId);
  if (!found) return null;
  const png = path.join(paths.rendersDir, found.dirName, 'icon.png');
  return fs.existsSync(png) ? path.resolve(png) : null;
}

function findPublishedPng(
  paths: ReturnType<typeof getSessionPaths>,
  cardId: string,
): string | null {
  const found = findRenderMeta(paths, cardId);
  if (!found || !fileExists(paths.styleDna)) return null;
  const dna = readJsonFile(paths.styleDna, StyleDNASchema);
  const catalogPng = path.join(
    getGeneratedIconDir(dna.projectSlug, found.iconSlug),
    'icon.png',
  );
  return fs.existsSync(catalogPng) ? path.resolve(catalogPng) : null;
}

function previewDataUrl(pngPath: string): string {
  const b64 = fs.readFileSync(pngPath).toString('base64');
  return `data:image/png;base64,${b64}`;
}

app.get('/api/health', (_req, res) => {
  const env = getSynaptikEnvStatus();
  res.json({
    ok: true,
    features: { sessions: true, sessionState: true },
    env: {
      fal: env.fal,
      vision: env.vision,
      openRouter: env.openRouter,
      workspaceRoot: process.env.SYNAPTIK_WORKSPACE_ROOT?.trim() || undefined,
      envFile: process.env.SYNAPTIK_ENV_FILE?.trim() || undefined,
      loadedFiles: env.loadedFiles,
    },
  });
});

app.get('/api/storybook-url', (req, res) => {
  const requested =
    typeof req.query.projectSlug === 'string' ? req.query.projectSlug : undefined;
  const registryPath = getRegistryPath();
  let publishedSlugs: string[] = [];
  if (fileExists(registryPath)) {
    const registry = readJsonFile(registryPath, RegistrySchema);
    publishedSlugs = [...new Set(registry.icons.map((i) => i.projectSlug))];
  }
  const projectSlug = resolveStorybookProjectSlug(requested, publishedSlugs);
  const origin = resolveStorybookOrigin();
  const path = generatedIconsStoryPath(projectSlug);
  res.json({
    url: buildStorybookUrl(origin, projectSlug),
    path,
    origin,
    projectSlug: projectSlug ?? null,
    fallback: Boolean(requested?.trim() && !projectSlug),
  });
});

app.get('/api/registry', (_req, res) => {
  try {
    const registryPath = getRegistryPath();
    if (!fileExists(registryPath)) {
      res.json({ icons: [] });
      return;
    }
    const registry = readJsonFile(registryPath, RegistrySchema);
    res.json(registry);
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/icon-set-styles', (_req, res) => {
  res.json({
    styles: ICON_SET_STYLES.map((p) => ({
      id: p.id,
      labelRu: p.labelRu,
      labelEn: p.labelEn,
    })),
  });
});

app.get('/api/storage-paths', (req, res) => {
  try {
    const sessionId = typeof req.query.sessionId === 'string' ? req.query.sessionId : undefined;
    res.json(getStoragePathsInfo(sessionId));
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/sessions', (_req, res) => {
  try {
    res.json({ sessions: listSessions() });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/state', (req, res) => {
  try {
    const state = buildSessionUiState(req.params.id);
    res.json(state);
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e);
    apiError(res, 404, mapApiError(raw), 'SESSION_NOT_FOUND');
  }
});

app.post('/api/run', async (req, res) => {
  try {
    const { url, forceNew, iconSetStyleId } = req.body as {
      url?: string;
      forceNew?: boolean;
      iconSetStyleId?: string;
    };
    if (!url) {
      apiError(res, 400, apiMessages.urlRequired, 'URL_REQUIRED');
      return;
    }
    if (!parseIconSetStyleId(iconSetStyleId)) {
      apiError(res, 400, apiMessages.iconSetStyleRequired, 'ICON_SET_STYLE_REQUIRED');
      return;
    }
    if (!forceNew) {
      let existing;
      try {
        existing = findSessionByUrl(url);
      } catch (e) {
        handleUnknownError(res, e);
        return;
      }
      if (existing) {
        apiError(res, 409, apiMessages.sessionExists, 'SESSION_EXISTS', {
          existingSessionId: existing.sessionId,
          projectSlug: existing.projectSlug,
          message: apiMessages.sessionExistsHint,
        });
        return;
      }
    }
    const sessionId = await runPipeline({ url, iconSetStyleId: parseIconSetStyleId(iconSetStyleId)! });
    const paths = getSessionPaths(sessionId);
    const dna = readJsonFile(paths.styleDna, StyleDNASchema);
    res.json({
      sessionId,
      projectSlug: dna.projectSlug,
      message: apiMessages.analysisComplete,
    });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/dna', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    if (!fileExists(paths.styleDna)) {
      apiError(res, 404, apiMessages.styleDnaNotFound, 'STYLE_DNA_NOT_FOUND');
      return;
    }
    const dna = readJsonFile(paths.styleDna, StyleDNASchema);
    res.json({ dna });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/cards', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
    res.json({ cards });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/concepts/:cardId', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const set = getConceptSetForCard(paths, req.params.cardId);
    res.json(set);
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/preview/:cardId/icon.png', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const png = findRenderPng(paths, req.params.cardId);
    if (!png) {
      apiError(res, 404, apiMessages.noRenderYet, 'NO_RENDER');
      return;
    }
    res.type('png').sendFile(png);
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/preview/:cardId/versions', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const found = findRenderMeta(paths, req.params.cardId);
    if (!found) {
      apiError(res, 404, apiMessages.noRenderYet, 'NO_RENDER');
      return;
    }
    const renderDir = path.join(paths.rendersDir, found.dirName);
    const index = listRenderVersions(renderDir);
    const sessionId = req.params.id;
    const cardId = req.params.cardId;
    res.json({
      activeVersionId: index.activeVersionId,
      versions: index.versions.map((v) => ({
        ...v,
        previewUrl: versionPreviewPath(sessionId, cardId, v.id),
        isActive: v.id === index.activeVersionId,
      })),
    });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/preview/:cardId/versions/:versionId/icon.png', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const found = findRenderMeta(paths, req.params.cardId);
    if (!found) {
      apiError(res, 404, apiMessages.noRenderYet, 'NO_RENDER');
      return;
    }
    const png = path.join(
      paths.rendersDir,
      found.dirName,
      'versions',
      req.params.versionId,
      'icon.png',
    );
    if (!fs.existsSync(png)) {
      apiError(res, 404, 'Version not found', 'VERSION_NOT_FOUND');
      return;
    }
    res.type('png').sendFile(path.resolve(png));
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/session/:id/preview/:cardId/active-version', async (req, res) => {
  try {
    const { versionId } = req.body as { versionId?: string };
    if (!versionId) {
      apiError(res, 400, 'versionId required', 'VERSION_REQUIRED');
      return;
    }
    const paths = getSessionPaths(req.params.id);
    const found = findRenderMeta(paths, req.params.cardId);
    if (!found) {
      apiError(res, 404, apiMessages.noRenderYet, 'NO_RENDER');
      return;
    }
    const renderDir = path.join(paths.rendersDir, found.dirName);
    const entry = setActiveRenderVersion(renderDir, versionId);
    const pngPath = path.join(renderDir, 'icon.png');
    const sessionId = req.params.id;
    const cardId = req.params.cardId;
    res.json({
      ok: true,
      activeVersionId: versionId,
      previewUrl: `/api/session/${sessionId}/preview/${cardId}/icon.png`,
      previewDataUrl: previewDataUrl(pngPath),
      conceptId: entry.conceptId,
      failedQa: entry.failedQa ?? false,
      qualityWarnings: entry.qualityWarnings ?? [],
    });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/published/:cardId/icon.png', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const png = findPublishedPng(paths, req.params.cardId);
    if (!png) {
      apiError(res, 404, apiMessages.noPublishedIcon, 'NO_PUBLISHED');
      return;
    }
    res.type('png').sendFile(png);
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/render-previews', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const sessionId = req.params.id;
    const previews: Record<string, { previewUrl: string }> = {};
    if (fs.existsSync(paths.rendersDir)) {
      for (const name of fs.readdirSync(paths.rendersDir)) {
        const metaPath = path.join(paths.rendersDir, name, 'meta.json');
        if (!fs.existsSync(metaPath)) continue;
        const meta = readJsonFile(metaPath, AssetMetaSchema);
        if (!meta.cardId) continue;
        const png = path.join(paths.rendersDir, name, 'icon.png');
        if (!fs.existsSync(png)) continue;
        previews[meta.cardId] = {
          previewUrl: `/api/session/${sessionId}/preview/${meta.cardId}/icon.png`,
        };
      }
    }
    res.json({ previews });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/select-concept', async (req, res) => {
  try {
    const { sessionId, cardId, concept } = req.body as {
      sessionId: string;
      cardId: string;
      concept: string;
    };
    const paths = getSessionPaths(sessionId);
    runSelectConcept(paths, cardId, concept.toUpperCase() as ConceptLetter);
    res.json({ ok: true });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/render-preview', async (req, res) => {
  try {
    const { sessionId, cardId, force, regenerateNonce } = req.body as {
      sessionId: string;
      cardId: string;
      force?: boolean;
      regenerateNonce?: number;
    };
    const paths = getSessionPaths(sessionId);
    const result = await runRender(paths, cardId, {
      overwrite: true,
      forceQuality: Boolean(force),
      regenerateNonce: regenerateNonce ?? Date.now(),
    });
    const pngPath = path.join(result.renderDir, 'icon.png');
    const previewUrl = `/api/session/${sessionId}/preview/${cardId}/icon.png`;
    res.json({
      ok: true,
      renderDir: result.renderDir,
      iconSlug: result.iconSlug,
      previewUrl,
      previewDataUrl: previewDataUrl(pngPath),
      failedQa: result.meta.failedQa ?? false,
      qualityWarnings: result.meta.qualityWarnings ?? [],
    });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/render-all', async (req, res) => {
  try {
    const { sessionId } = req.body as { sessionId: string };
    const paths = getSessionPaths(sessionId);
    const result = await runRenderAll(paths, { overwrite: true });
    res.json(result);
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/session/:id/refresh-icon-style', async (req, res) => {
  try {
    const { refreshConcepts, iconSetStyleId } = (req.body ?? {}) as {
      refreshConcepts?: boolean;
      iconSetStyleId?: string;
    };
    const paths = getSessionPaths(req.params.id);
    const styleId = parseIconSetStyleId(iconSetStyleId);
    const result = await runRefreshIconStyle(paths, {
      refreshConcepts: Boolean(refreshConcepts),
      iconSetStyleId: styleId,
    });
    res.json(result);
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/session/:id/icon-set-style', async (req, res) => {
  try {
    const { iconSetStyleId, refreshConcepts } = (req.body ?? {}) as {
      iconSetStyleId?: string;
      refreshConcepts?: boolean;
    };
    if (!parseIconSetStyleId(iconSetStyleId)) {
      apiError(res, 400, apiMessages.iconSetStyleRequired, 'ICON_SET_STYLE_REQUIRED');
      return;
    }
    const paths = getSessionPaths(req.params.id);
    const result = await runChangeIconSetStyle(paths, parseIconSetStyleId(iconSetStyleId)!, {
      refreshConcepts: Boolean(refreshConcepts),
    });
    res.json({ ok: true, ...result });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/prompt-preview/:cardId', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const concept = req.query.concept as string | undefined;
    const preview = buildPromptPreview(
      paths,
      req.params.cardId,
      concept?.toUpperCase() as ConceptLetter | undefined,
    );
    res.json(preview);
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/prompt/:cardId', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const promptPath = path.join(paths.promptsDir, `${slugify(req.params.cardId)}.txt`);
    if (!fs.existsSync(promptPath)) {
      apiError(res, 404, 'Prompt file not found', 'PROMPT_NOT_FOUND');
      return;
    }
    const text = fs.readFileSync(promptPath, 'utf8');
    res.json({ text });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.get('/api/session/:id/structure-audit', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const auditPath = path.join(
      path.dirname(paths.contentStructure),
      'content-structure.audit.json',
    );
    if (fileExists(auditPath)) {
      res.json(readJsonFile(auditPath));
      return;
    }
    const blocks = loadContentBlocks(paths);
    res.json(auditContentStructure(blocks));
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/session/:id/repair-structure', async (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const result = await runRepairStructure(paths);
    res.json({ ok: true, ...result });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/session/:id/card-skipped', async (req, res) => {
  try {
    const { cardId, skipped } = req.body as { cardId?: string; skipped?: boolean };
    if (!cardId) {
      apiError(res, 400, 'cardId required', 'CARD_REQUIRED');
      return;
    }
    const paths = getSessionPaths(req.params.id);
    setCardSkipped(paths, cardId, Boolean(skipped));
    res.json({ ok: true, cardId, skipped: Boolean(skipped) });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/session/:id/extend-page', async (req, res) => {
  try {
    const { url } = req.body as { url?: string };
    if (!url?.trim()) {
      apiError(res, 400, apiMessages.urlRequired, 'URL_REQUIRED');
      return;
    }
    const paths = getSessionPaths(req.params.id);
    const result = await runExtendPage(paths, url.trim());
    res.json({
      ok: true,
      pageSlug: result.pageSlug,
      addedBlocks: result.addedBlocks,
      addedCards: result.addedCards,
      newCardIds: result.newCardIds,
      message: apiMessages.extendPageDone(result.addedBlocks, result.addedCards),
    });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/publish-ready', async (req, res) => {
  try {
    const { sessionId, approve } = req.body as { sessionId?: string; approve?: boolean };
    if (!sessionId) {
      apiError(res, 400, 'sessionId required', 'SESSION_REQUIRED');
      return;
    }
    if (!approve) {
      apiError(res, 400, apiMessages.approveRequired, 'APPROVE_REQUIRED');
      return;
    }
    const paths = getSessionPaths(sessionId);
    const result = await runPublishReady(paths);
    const dna = readJsonFile(paths.styleDna, StyleDNASchema);
    res.json({
      ok: true,
      projectSlug: dna.projectSlug,
      published: result.published,
      skipped: result.skipped,
      publishSkipped: result.publishSkipped,
      errors: result.errors,
      message: apiMessages.publishReadyDone(result.published.length),
    });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.delete('/api/session/:id', (req, res) => {
  try {
    const bodyConfirm = (req.body as { confirm?: boolean } | undefined)?.confirm;
    const queryConfirm = req.query.confirm === 'true';
    const confirm = Boolean(bodyConfirm || queryConfirm);
    if (!confirm) {
      apiError(res, 400, apiMessages.deleteSessionConfirmRequired, 'CONFIRM_REQUIRED');
      return;
    }
    const sessionId = req.params.id;
    deleteSession(sessionId);
    res.json({ ok: true, sessionId, message: apiMessages.sessionDeleted });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/session/:id/reconcile', (req, res) => {
  try {
    const paths = getSessionPaths(req.params.id);
    const result = reconcileSessionRenders(paths);
    res.json({ ok: true, ...result });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.post('/api/publish', async (req, res) => {
  try {
    const { sessionId, cardId, approve } = req.body as {
      sessionId: string;
      cardId: string;
      approve?: boolean;
    };
    if (!approve) {
      apiError(res, 400, apiMessages.approveRequired, 'APPROVE_REQUIRED');
      return;
    }
    const paths = getSessionPaths(sessionId);
    const { projectSlug, iconSlug } = await runPublish(paths, cardId);
    res.json({
      projectSlug,
      iconSlug,
      storybookSidebar: `Generated Icons → ${projectSlug}`,
      message: apiMessages.published(projectSlug),
    });
  } catch (e) {
    handleUnknownError(res, e);
  }
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error('[synaptik] API error:', message);
  if (!res.headersSent) {
    apiError(res, 500, mapApiError(message || apiMessages.internalError), 'INTERNAL');
  }
});

const port = Number(process.env.SYNAPTIK_API_PORT ?? 3742);
const API_ROUTES = [
  'GET  /api/health',
  'GET  /api/storybook-url',
  'GET  /api/sessions',
  'GET  /api/session/:id/state',
  'GET  /api/registry',
  'GET  /api/icon-set-styles',
  'POST /api/run',
  'POST /api/session/:id/icon-set-style',
  'GET  /api/session/:id/published/:cardId/icon.png',
  'POST /api/session/:id/refresh-icon-style',
  'GET  /api/session/:id/prompt-preview/:cardId',
  'GET  /api/session/:id/prompt/:cardId',
  'POST /api/session/:id/extend-page',
  'POST /api/render-preview',
  'POST /api/publish',
  'POST /api/publish-ready',
  'GET  /api/storage-paths',
  'DELETE /api/session/:id',
  'POST /api/session/:id/reconcile',
];

const server = app.listen(port, () => {
  console.log(`Synaptik UI API http://127.0.0.1:${port}`);
  console.log('Features: sessions, sessionState (v2)');
  console.log('Routes:');
  for (const r of API_ROUTES) console.log(`  ${r}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\n[synaptik] Port ${port} is already in use. Run: npm run dev:reset (from modules/synaptik-icon-builder/ui)\n`,
    );
    process.exit(1);
  }
  throw err;
});
