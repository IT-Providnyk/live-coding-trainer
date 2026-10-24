import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { asyncPool } = await load('15-async-pool');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('results in input order', async () => {
  const result = await asyncPool(2, [30, 10, 20, 5], async (ms, i) => {
    await sleep(ms);
    return `${i}:${ms}`;
  });
  assert.deepEqual(result, ['0:30', '1:10', '2:20', '3:5']);
});

test('never more than limit at once', async () => {
  let active = 0;
  let maxActive = 0;
  await asyncPool(3, Array.from({ length: 10 }, (_, i) => i), async () => {
    active++;
    maxActive = Math.max(maxActive, active);
    await sleep(10);
    active--;
  });
  assert.equal(maxActive, 3);
});

test('starts the next one as soon as a slot frees (not in batches)', async () => {
  const started = [];
  const t0 = Date.now();
  await asyncPool(2, [50, 10, 10, 10], async (ms, i) => {
    started.push([i, Date.now() - t0]);
    await sleep(ms);
  });
  const startOf = Object.fromEntries(started);
  // Item 2 must start when item 1 finishes (~10ms), not when item 0 does (~50ms).
  assert.ok(startOf[2] < 40, `item 2 started at ${startOf[2]}ms`);
});

test('empty input', async () => {
  assert.deepEqual(await asyncPool(3, [], async () => 1), []);
});

test('rejects on error and stops starting new work', async () => {
  const started = [];
  await assert.rejects(
    asyncPool(1, [1, 2, 3, 4], async (n) => {
      started.push(n);
      await sleep(5);
      if (n === 2) throw new Error('boom');
    }),
    /boom/,
  );
  await sleep(30);
  assert.deepEqual(started, [1, 2]);
});
