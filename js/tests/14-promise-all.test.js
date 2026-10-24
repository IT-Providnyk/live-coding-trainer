import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { promiseAll, promiseAllSettled } = await load('14-promise-all');

const delay = (ms, value, fail = false) =>
  new Promise((resolve, reject) => setTimeout(() => (fail ? reject(value) : resolve(value)), ms));

test('keeps input order, not finish order', async () => {
  assert.deepEqual(await promiseAll([delay(30, 'slow'), delay(5, 'fast'), 'plain']), [
    'slow',
    'fast',
    'plain',
  ]);
});

test('runs in parallel', async () => {
  const start = Date.now();
  await promiseAll([delay(40), delay(40), delay(40)]);
  assert.ok(Date.now() - start < 100, 'looks sequential');
});

test('empty array', async () => {
  assert.deepEqual(await promiseAll([]), []);
});

test('rejects with the first rejection', async () => {
  await assert.rejects(promiseAll([delay(50, 'ok'), delay(5, new Error('first'), true)]), /first/);
});

test('allSettled reports both kinds, in order, never rejects', async () => {
  const result = await promiseAllSettled([delay(20, 'a'), delay(5, 'bad', true), 3]);
  assert.deepEqual(result, [
    { status: 'fulfilled', value: 'a' },
    { status: 'rejected', reason: 'bad' },
    { status: 'fulfilled', value: 3 },
  ]);
});

test('allSettled on empty', async () => {
  assert.deepEqual(await promiseAllSettled([]), []);
});
