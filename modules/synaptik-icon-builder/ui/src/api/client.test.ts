import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { humanizeApiMessage, parseJsonBody } from './client.js';
import { apiMessages, mapApiError, t } from '../i18n/ru.js';

describe('parseJsonBody', () => {
  const fakeRes = { status: 200 } as Response;

  it('rejects HTML doctype', () => {
    assert.throws(
      () => parseJsonBody('<!DOCTYPE html><html></html>', fakeRes),
      (e: Error & { isNotJson?: boolean }) => e.isNotJson === true,
    );
  });

  it('parses valid JSON', () => {
    const data = parseJsonBody<{ ok: boolean }>('{"ok":true}', fakeRes);
    assert.equal(data.ok, true);
  });
});

describe('mapApiError', () => {
  it('maps known API errors to Russian', () => {
    assert.equal(mapApiError('url required'), apiMessages.urlRequired);
    assert.equal(mapApiError('Style DNA not found'), apiMessages.styleDnaNotFound);
    assert.match(
      mapApiError('Session "abc" has no Style DNA. Run analysis first.'),
      /Сессия «abc»/,
    );
  });

  it('passes through already-Russian text', () => {
    const ru = apiMessages.sessionExists;
    assert.equal(mapApiError(ru), ru);
  });
});

describe('humanizeApiMessage', () => {
  it('maps Internal Server Error to connection hint', () => {
    assert.equal(humanizeApiMessage('Internal Server Error'), t.apiConnectionFailed);
  });

  it('maps server url required via mapApiError', () => {
    assert.equal(humanizeApiMessage('url required'), apiMessages.urlRequired);
  });
});
