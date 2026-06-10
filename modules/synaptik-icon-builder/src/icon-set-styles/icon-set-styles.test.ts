import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ICON_SET_STYLES,
  assembleStyleBlockFromPreset,
  getIconSetStyle,
  sanitizeIconSubject,
  buildSanitizedIconSubject,
  buildSubjectLine,
  extractVisualObject,
  stripIconSubjectPrefix,
} from './index.js';
import { SubjectSanitizeError } from './errors.js';

const PREFIXED_CLOCK =
  'Single isometric stylized icon object, not a photograph, no environment: Isometric stylized clock';

describe('icon-set-styles', () => {
  it('presets never contain photoreal in renderModeLine', () => {
    for (const p of ICON_SET_STYLES) {
      assert.doesNotMatch(p.renderModeLine, /\bphotoreal/i);
      const block = assembleStyleBlockFromPreset(p, '#00AA00', 'Test brand icons');
      assert.match(block, /No photorealistic photography/i);
      assert.match(block, /Icon set style preset: /);
    }
  });

  it('sanitizeIconSubject rejects studio and soil', () => {
    const preset = getIconSetStyle('isometric');
    assert.equal(
      sanitizeIconSubject('Young plant sprout with soil and roots in studio', preset),
      '',
    );
    assert.equal(
      sanitizeIconSubject('Photorealistic equipment case on wooden floor', preset),
      '',
    );
  });

  it('does not reject guardrail negation phrases after strip', () => {
    const preset = getIconSetStyle('isometric');
    const vo = extractVisualObject(PREFIXED_CLOCK, preset);
    assert.match(vo, /clock/i);
    assert.doesNotMatch(vo, /Усушка/i);
  });

  it('buildSubjectLine keeps clock from 1b081e1c prefixed concept', () => {
    const preset = getIconSetStyle('isometric');
    const line = buildSubjectLine(
      extractVisualObject(PREFIXED_CLOCK, preset),
      preset,
    );
    assert.match(line, /clock/i);
    assert.doesNotMatch(line, /representing:/i);
    assert.doesNotMatch(line, /[\u0400-\u04FF]/);
  });

  it('throws SubjectSanitizeError instead of RU title fallback', () => {
    const preset = getIconSetStyle('isometric');
    assert.throws(
      () => buildSubjectLine('studio photoshoot on wooden floor', preset),
      SubjectSanitizeError,
    );
  });

  it('stripIconSubjectPrefix removes preset prefix', () => {
    const preset = getIconSetStyle('isometric');
    const stripped = stripIconSubjectPrefix(PREFIXED_CLOCK, preset);
    assert.match(stripped, /^Isometric stylized clock/i);
  });

  it('buildSanitizedIconSubject uses subject line for clean metaphor', () => {
    const preset = getIconSetStyle('shield');
    const out = buildSanitizedIconSubject('Shield with leaf emblem', preset);
    assert.match(out, /Shield with leaf emblem/);
  });
});
