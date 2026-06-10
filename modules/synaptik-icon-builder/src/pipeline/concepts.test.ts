import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveConceptForRender } from './concepts.js';
import type { IconConceptSet } from '../types/index.js';

const set: IconConceptSet = {
  cardId: 'demo',
  cardTitle: 'Demo',
  concepts: [
    { id: 'A', label: 'Sprout', iconSubject: 'Plant sprout icon' },
    { id: 'B', label: 'Sensor', iconSubject: 'Wireless sensor on stalk' },
    { id: 'C', label: 'Drop', iconSubject: 'Water droplet with leaf' },
  ],
};

describe('resolveConceptForRender metaphors', () => {
  it('keeps distinct iconSubject per letter', () => {
    const subjects = (['A', 'B', 'C'] as const).map(
      (id) => resolveConceptForRender(set, id).iconSubject,
    );
    assert.equal(new Set(subjects).size, 3);
  });

  it('uses concept iconSubject not shared set field', () => {
    const withLegacy: IconConceptSet = {
      ...set,
      iconSubject: 'Legacy shared subject',
    };
    assert.match(
      resolveConceptForRender(withLegacy, 'B').iconSubject,
      /Wireless sensor on stalk/,
    );
  });
});
