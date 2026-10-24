import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { memoize, memoizeAsync } = await load('10-memoize');

test('memoize caches by first arg', () => {
  let calls = 0;
  const square = memoize((n) => {
    calls++;
    return n * n;
  });
  assert.equal(square(3), 9);
  assert.equal(square(3), 9);
  assert.equal(square(4), 16);
  assert.equal(calls, 2);
});

test('memoize with custom key', () => {
  let calls = 0;
  const add = memoize(
    (a, b) => {
      calls++;
      return a + b;
    },
    (a, b) => `${a}:${b}`,
  );
  assert.equal(add(1, 2), 3);
  assert.equal(add(1, 3), 4);
  assert.equal(add(1, 2), 3);
  assert.equal(calls, 2);
});

test('memoize caches undefined results too', () => {
  let calls = 0;
  const f = memoize(() => {
    calls++;
    return undefined;
  });
  f('x');
  f('x');
  assert.equal(calls, 1);
});

test('memoize clear', () => {
  let calls = 0;
  const f = memoize((x) => ++calls);
  f(1);
  f.clear();
  f(1);
  assert.equal(calls, 2);
});

test('memoizeAsync dedupes concurrent calls', async () => {
  let calls = 0;
  const load = memoizeAsync(async (id) => {
    calls++;
    await new Promise((r) => setTimeout(r, 5));
    return { id };
  });
  const [a, b] = await Promise.all([load('c_1'), load('c_1')]);
  assert.equal(calls, 1);
  assert.equal(a, b);
  await load('c_1');
  assert.equal(calls, 1);
});

test('memoizeAsync does not cache rejections', async () => {
  let calls = 0;
  const load = memoizeAsync(async () => {
    calls++;
    if (calls === 1) throw new Error('boom');
    return 'ok';
  });
  await assert.rejects(load('k'), /boom/);
  assert.equal(await load('k'), 'ok');
  assert.equal(calls, 2);
});
