import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deriveFlowStep } from './deriveFlowStep.js';

describe('deriveFlowStep', () => {
  it('returns 1 without session', () => {
    assert.equal(deriveFlowStep('', [], {}), 1);
  });

  it('returns 2 with session and cards', () => {
    assert.equal(deriveFlowStep('abc', [{ id: 'c1', title: 'T' }], { c1: { phase: 'pick' } }), 2);
  });

  it('returns 4 when any published', () => {
    assert.equal(
      deriveFlowStep('abc', [{ id: 'c1', title: 'T' }], { c1: { phase: 'published' } }),
      4,
    );
  });
});
