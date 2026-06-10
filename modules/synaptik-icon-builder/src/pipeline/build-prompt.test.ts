import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  assembleFluxPrompt,
  buildPromptSections,
  buildPromptText,
  COMPOSITION_BLOCK,
} from './build-prompt.js';
import {
  assembleStyleBlockForFlux,
  getIconSetStyle,
} from '../icon-set-styles/index.js';
import { resolveConceptForRender } from './concepts.js';
import type { IconConceptSet } from '../types/index.js';

const styleBlock = assembleStyleBlockForFlux(
  getIconSetStyle('isometric'),
  'Deep olive green, warm mineral brown',
  'Damiat enterprise agrotech iconography',
);

const metaphorVariants: IconConceptSet = {
  cardId: 'growth',
  cardTitle: 'Growth',
  concepts: [
    {
      id: 'A',
      label: 'Sprout',
      visualObject: 'Young plant sprout with two leaves on a short stem',
    },
    {
      id: 'B',
      label: 'Gauge',
      visualObject: 'Circular gauge with needle showing upward trend',
    },
    {
      id: 'C',
      label: 'Shield',
      visualObject: 'Protective shield with leaf emblem',
    },
  ],
};

const prefixedLegacy: IconConceptSet = {
  cardId: 'nevernyj-moment-prodazhi',
  cardTitle: 'Неверный момент продажи',
  concepts: [
    {
      id: 'A',
      label: 'Timing',
      iconSubject:
        'Single isometric stylized icon object, not a photograph, no environment: Isometric stylized clock',
    },
  ],
};

describe('buildPromptText', () => {
  it('puts subject block first then style and composition', () => {
    const prompt = buildPromptText(styleBlock, 'A single wheat grain icon');
    const lines = prompt.split('\n');
    assert.ok(lines[0].includes('SUBJECT'));
    assert.match(prompt, /wheat grain/);
    assert.ok(prompt.includes(COMPOSITION_BLOCK));
    assert.doesNotMatch(prompt, /Render variant/i);
  });
});

describe('resolveConceptForRender', () => {
  it('returns different visualObject per metaphor', () => {
    const a = resolveConceptForRender(metaphorVariants, 'A', undefined, 'isometric');
    const b = resolveConceptForRender(metaphorVariants, 'B');
    assert.notEqual(a.visualObject, b.visualObject);
    assert.match(a.iconSubject, /sprout/i);
    assert.equal(a.label, 'Sprout');
  });

  it('extracts clock from legacy prefixed iconSubject (1b081e1c)', () => {
    const r = resolveConceptForRender(prefixedLegacy, 'A', undefined, 'isometric');
    assert.match(r.visualObject, /clock/i);
    assert.match(r.iconSubject, /clock/i);
    assert.doesNotMatch(r.iconSubject, /[\u0400-\u04FF]/);
    assert.doesNotMatch(r.iconSubject, /representing:/i);
  });

  it('supports legacy concepts with description only', () => {
    const legacy: IconConceptSet = {
      cardId: 'x',
      cardTitle: 'Title',
      concepts: [{ id: 'A', label: 'Legacy', description: 'Gear mechanism icon' }],
    };
    const r = resolveConceptForRender(legacy, 'A', undefined, 'flat');
    assert.match(r.visualObject, /Gear mechanism/i);
  });
});
