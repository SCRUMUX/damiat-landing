import fs from 'node:fs';

import path from 'node:path';

import { chromium } from 'playwright';

import type { CaptureReport } from '../types/index.js';

import { MVP_DEFAULTS } from '../types/index.js';



export interface CaptureOptions {

  url?: string;

  screenshotsDir: string;

  sourceScreenshotsDir?: string;

}



function wrapCaptureError(e: unknown, phase: string): Error {

  const raw = e instanceof Error ? e.message : String(e);

  if (/Executable doesn't exist|browserType\.launch|Failed to launch/i.test(raw)) {

    return new Error(

      `Playwright Chromium is not installed (${phase}). Run: npx playwright install chromium`,

      { cause: e instanceof Error ? e : undefined },

    );

  }

  if (/MVP_DEFAULTS is not defined/i.test(raw)) {

    return new Error(

      'Capture script is outdated (MVP_DEFAULTS in browser context). Rebuild Synaptik: npm run synaptik:build',

      { cause: e instanceof Error ? e : undefined },

    );

  }

  if (e instanceof Error) {

    return new Error(`${phase}: ${raw}`, { cause: e });

  }

  return new Error(`${phase}: ${raw}`);

}



async function extractPageMetrics(

  page: import('playwright').Page,

  domMaxBlocks: number,

): Promise<

  Pick<

    CaptureReport,

    'dominantColors' | 'fontFamilies' | 'pageTitle' | 'extractedTextSample' | 'domStructure'

  >

> {

  try {

    return await page.evaluate(

      (maxBlocks) => {

        const colors = new Set<string>();

        document.querySelectorAll('*').forEach((el, i) => {

          if (i > 200) return;

          const style = getComputedStyle(el);

          if (style.color && style.color !== 'rgba(0, 0, 0, 0)') colors.add(style.color);

          if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {

            colors.add(style.backgroundColor);

          }

        });



        const fonts = new Set<string>();

        document.querySelectorAll('h1,h2,h3,p,button,a,span').forEach((el, i) => {

          if (i > 80) return;

          const ff = getComputedStyle(el).fontFamily;

          if (ff) fonts.add(ff.split(',')[0]?.trim() ?? ff);

        });



        const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4'))

          .map((h) => h.textContent?.trim())

          .filter(Boolean)

          .slice(0, 12);



        const cards = Array.from(

          document.querySelectorAll('[class*="card"],[class*="feature"],article,li'),

        )

          .map((el) => el.textContent?.trim()?.slice(0, 120))

          .filter((t) => t && t.length > 8)

          .slice(0, 20);



        const blocks: Array<{ title: string; cards: Array<{ title: string; description?: string }> }> =

          [];

        const h2s = Array.from(document.querySelectorAll('h2'));

        for (const h2 of h2s) {

          const blockTitle = h2.textContent?.trim();

          if (!blockTitle || blockTitle.length < 3) continue;

          const section = h2.closest('section') ?? h2.parentElement;

          const innerCards: Array<{ title: string; description?: string }> = [];

          if (section) {

            const heads = section.querySelectorAll('h3, h4');

            heads.forEach((el) => {

              const title = el.textContent?.trim();

              if (!title || title.length < 4 || title === blockTitle) return;

              let description = '';

              let sib = el.nextElementSibling;

              while (sib && !/^H[1-4]$/i.test(sib.tagName)) {

                const t = sib.textContent?.trim();

                if (t && t.length > 12) {

                  description = t.slice(0, 400);

                  break;

                }

                sib = sib.nextElementSibling;

              }

              innerCards.push({ title: title.slice(0, 120), description: description || undefined });

            });

          }

          blocks.push({ title: blockTitle.slice(0, 120), cards: innerCards.slice(0, 12) });

        }



        if (blocks.length === 0) {

          const h3s = Array.from(document.querySelectorAll('h3')).slice(0, 8);

          if (h3s.length > 0) {

            blocks.push({

              title: document.querySelector('h1')?.textContent?.trim()?.slice(0, 120) ?? 'Features',

              cards: h3s

                .map((h) => ({

                  title: h.textContent?.trim()?.slice(0, 120) ?? '',

                  description: h.nextElementSibling?.textContent?.trim()?.slice(0, 400),

                }))

                .filter((c) => c.title.length > 3),

            });

          }

        }



        const domStructure = {

          blocks: blocks.slice(0, maxBlocks),

        };



        return {

          dominantColors: Array.from(colors).slice(0, 24),

          fontFamilies: Array.from(fonts).slice(0, 8),

          pageTitle: document.title,

          extractedTextSample: [...headings, ...cards].join('\n').slice(0, 4000),

          domStructure,

        };

      },

      MVP_DEFAULTS.domMaxBlocks,

    );

  } catch (e) {

    throw wrapCaptureError(e, 'page.evaluate');

  }

}



export async function captureWebsite(opts: CaptureOptions): Promise<CaptureReport> {

  fs.mkdirSync(opts.screenshotsDir, { recursive: true });



  if (opts.sourceScreenshotsDir) {

    const files = fs.readdirSync(opts.sourceScreenshotsDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

    if (files.length === 0) throw new Error(`No images in ${opts.sourceScreenshotsDir}`);

    for (const file of files) {

      fs.copyFileSync(

        path.join(opts.sourceScreenshotsDir, file),

        path.join(opts.screenshotsDir, file.replace(/\s+/g, '-')),

      );

    }

    return {

      sourceUrl: undefined,

      screenshotsDir: opts.screenshotsDir,

      capturedAt: new Date().toISOString(),

    };

  }



  if (!opts.url) throw new Error('Provide --url or --screenshots');



  let browser: import('playwright').Browser | undefined;

  try {

    try {

      browser = await chromium.launch({ headless: true });

    } catch (e) {

      throw wrapCaptureError(e, 'chromium.launch');

    }



    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    try {

      await page.goto(opts.url, { waitUntil: 'networkidle', timeout: 60_000 });

    } catch (e) {

      throw wrapCaptureError(e, 'page.goto');

    }



    const metrics = await extractPageMetrics(page, MVP_DEFAULTS.domMaxBlocks);



    await page.screenshot({

      path: path.join(opts.screenshotsDir, 'viewport.png'),

      fullPage: false,

    });

    await page.screenshot({

      path: path.join(opts.screenshotsDir, 'fullpage.png'),

      fullPage: true,

    });



    return {

      sourceUrl: opts.url,

      screenshotsDir: opts.screenshotsDir,

      capturedAt: new Date().toISOString(),

      viewport: { width: 1440, height: 900 },

      ...metrics,

    };

  } finally {

    await browser?.close();

  }

}


