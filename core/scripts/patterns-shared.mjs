/**
 * Shared utilities for ai-patterns.json build + check scripts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

export const PATTERNS_PATH = path.join(ROOT, 'ai-patterns.json');
const BLOCKS_MARKETING = path.join(ROOT, 'blocks', 'marketing');
const BLOCKS_APP = path.join(ROOT, 'blocks', 'app');

/** Block names that must have blocks/marketing/<Name>/ or blocks/app/<Name>/ */
export const EXPECTED_BLOCKS = [
  'HeroBlock',
  'FeaturesBlock',
  'PricingBlock',
  'CTABlock',
  'FooterBlock',
  'NavbarBlock',
  'LogoCloudBlock',
  'StatsBlock',
  'TestimonialsBlock',
  'FAQBlock',
  'HowItWorksBlock',
  'NewsletterBlock',
  'EventsBlock',
  'ServicesBlock',
  'SolutionsBlock',
  'TrustBlock',
  'SupportBlock',
  'ShowcasePanelBlock',
  'BlogBlock',
  'PartnersBlock',
  'ContactHeroBlock',
  'WhyUsBlock',
  'ChooseUsBlock',
  'ProcessBlock',
  'DamiatCalculatorBlock',
  'DamiatLandingPage',
  'LandingPageTemplate',
];

export function readPatternsManifest() {
  return JSON.parse(fs.readFileSync(PATTERNS_PATH, 'utf8'));
}

export function blockDirExists(blockName) {
  const marketing = path.join(BLOCKS_MARKETING, blockName);
  const app = path.join(BLOCKS_APP, blockName);
  return fs.existsSync(path.join(marketing, 'index.ts')) || fs.existsSync(path.join(app, 'index.ts'));
}

export function validatePatternsSync(manifest) {
  const errors = [];
  const warnings = [];

  const patterns = manifest.patterns || {};
  const seenBlocks = new Set();

  for (const [patternId, entry] of Object.entries(patterns)) {
    const block = entry.block;
    if (!block) {
      errors.push(`Pattern "${patternId}" missing block`);
      continue;
    }
    seenBlocks.add(block);
    if (!blockDirExists(block)) {
      errors.push(`Pattern "${patternId}" references missing block directory: ${block}`);
    }
    const recipe = entry.recipe;
    if (recipe && !recipe.startsWith('section.')) {
      warnings.push(`Pattern "${patternId}" recipe "${recipe}" should start with section.`);
    }
  }

  for (const block of EXPECTED_BLOCKS) {
    if (!seenBlocks.has(block) && block !== 'LandingPageTemplate' && block !== 'AppSidebarBlock') {
      // LandingPageTemplate referenced via pageTemplates; AppSidebar via app.shell
    }
  }

  const pageTemplates = manifest.pageTemplates || {};
  for (const [templateId, template] of Object.entries(pageTemplates)) {
    for (const sectionId of template.sections || []) {
      if (!patterns[sectionId]) {
        errors.push(`Page template "${templateId}" references unknown pattern "${sectionId}"`);
      }
    }
    if (template.component && !blockDirExists(template.component)) {
      errors.push(`Page template "${templateId}" component "${template.component}" not found`);
    }
  }

  return { errors, warnings };
}
