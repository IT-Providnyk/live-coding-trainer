import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { retry } = await load('16-retry');

test('returns value on first success', async () => {
  let calls = 0;
  const value = await retry(async () => (calls++, 'ok'), { retries: 3, delayMs: 1 });
  assert.equal(value, 'ok');
  assert.equal(calls, 1);
});

test('retries until success, passes attempt number', async () => {
  const attempts = [];
  const value = await retry(
    async (attempt) => {
      attempts.push(attempt);
      if (attempt < 3) throw new Error(`fail ${attempt}`);
      return 'ok';
    },
    { retries: 5, delayMs: 1 },
  );
  assert.equal(value, 'ok');
  assert.deepEqual(attempts, [1, 2, 3]);
});

test('gives up after retries and throws the last error', async () => {
  let calls = 0;
  await assert.rejects(
    retry(
      async () => {
        calls++;
        throw new Error(`fail ${calls}`);
      },
      { retries: 2, delayMs: 1 },
    ),
    /fail 3/,
  );
  assert.equal(calls, 3);
});

test('shouldRetry=false stops at once', async () => {
  let calls = 0;
  const error = Object.assign(new Error('bad request'), { status: 400 });
  await assert.rejects(
    retry(
      async () => {
        calls++;
        throw error;
      },
      { retries: 5, delayMs: 1, shouldRetry: (e) => e.status >= 500 },
    ),
    /bad request/,
  );
  assert.equal(calls, 1);
});

test('delays grow by factor', async () => {
  const times = [];
  const t0 = Date.now();
  await assert.rejects(
    retry(
      async () => {
        times.push(Date.now() - t0);
        throw new Error('x');
      },
      { retries: 2, delayMs: 20, factor: 3 },
    ),
  );
  // Calls at ~0, ~20, ~80 (20 + 60).
  assert.ok(times[1] >= 18 && times[1] < 60, `second call at ${times[1]}`);
  assert.ok(times[2] - times[1] >= 55, `gap before third call ${times[2] - times[1]}`);
});
