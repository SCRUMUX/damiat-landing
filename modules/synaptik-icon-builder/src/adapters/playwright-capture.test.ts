import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { captureWebsite } from './playwright-capture.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(here, 'playwright-capture.ts');

describe('playwright-capture', () => {
  it('does not reference Node-only MVP_DEFAULTS inside page.evaluate', () => {
    const src = fs.readFileSync(sourcePath, 'utf8');
    const evaluateStart = src.indexOf('page.evaluate');
    assert.ok(evaluateStart >= 0, 'page.evaluate call must exist');
    const evaluateEnd = src.indexOf('MVP_DEFAULTS.domMaxBlocks', evaluateStart);
    assert.ok(evaluateEnd >= 0, 'domMaxBlocks must be passed as evaluate argument');
    const between = src.slice(evaluateStart, evaluateEnd);
    assert.ok(
      !/\bMVP_DEFAULTS\b/.test(between),
      'MVP_DEFAULTS must not appear inside the browser evaluate callback',
    );
  });

  it(
    'smoke: captureWebsite extracts domStructure from inline HTML',
    {
      skip:
        process.env.SYNAPTIK_CAPTURE_SMOKE !== '1'
          ? 'Set SYNAPTIK_CAPTURE_SMOKE=1 (needs: npx playwright install chromium)'
          : false,
    },
    async () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-capture-smoke-'));
      try {
        const html =
          '<html><head><title>Demo</title></head><body><h1>Demo</h1><h2>Section</h2><h3>Card one</h3><p>Description text here for the card</p></body></html>';
        const url = `data:text/html,${encodeURIComponent(html)}`;
        const report = await captureWebsite({
          url,
          screenshotsDir: path.join(dir, 'screenshots'),
        });
        assert.ok(report.domStructure?.blocks?.length);
        assert.equal(report.pageTitle, 'Demo');
        assert.ok(fs.existsSync(path.join(dir, 'screenshots', 'viewport.png')));
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    },
  );
});
