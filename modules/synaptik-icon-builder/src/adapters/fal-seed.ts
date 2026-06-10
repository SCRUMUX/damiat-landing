import crypto from 'node:crypto';

/** Deterministic fal seed for reproducible renders (attempt shifts seed on retry). */
export function deriveFalSeed(
  sessionId: string,
  cardId: string,
  conceptId: string,
  attempt = 0,
  /** Changes on each UI «Сгенерировать» click so repeated runs are not identical. */
  regenerateNonce = 0,
  /** Session icon preset — different style → different seed. */
  iconSetStyleId = '',
): number {
  const hash = crypto
    .createHash('sha256')
    .update(
      `${sessionId}:${cardId}:${conceptId}:${attempt}:${regenerateNonce}:${iconSetStyleId}`,
    )
    .digest();
  const n = hash.readUInt32BE(0);
  return (n % 2_147_483_646) + 1;
}
