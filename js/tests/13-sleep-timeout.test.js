import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { sleep, withTimeout } = await load('13-sleep-timeout');

test('sleep resolves after ms', async () => {
  const start = Date.now();
  await sleep(30);
  assert.ok(Date.now() - start >= 25);
});

test('sleep rejects with the abort reason when aborted', async () => {
  const controller = new AbortController();
  const promise = sleep(1000, controller.signal);
  controller.abort(new Error('stop'));
  await assert.rejects(promise, /stop/);
});

test('sleep rejects at once with an already aborted signal', async () => {
  await assert.rejects(sleep(1000, AbortSignal.abort(new Error('already'))), /already/);
});

test('sleep clears its timer on abort', async (t) => {
  const cleared = t.mock.method(globalThis, 'clearTimeout');
  const controller = new AbortController();
  const promise = sleep(1000, controller.signal).catch(() => 'aborted');
  controller.abort();
  assert.equal(await promise, 'aborted');
  assert.ok(cleared.mock.callCount() >= 1, 'clearTimeout was not called');
});

test('withTimeout passes through a fast value', async () => {
  assert.equal(await withTimeout(Promise.resolve('ok'), 50), 'ok');
});

test('withTimeout passes through a fast rejection', async () => {
  await assert.rejects(withTimeout(Promise.reject(new Error('api')), 50), /api/);
});

test('withTimeout rejects with TimeoutError', async () => {
  const slow = new Promise((resolve) => setTimeout(resolve, 200, 'late'));
  await assert.rejects(withTimeout(slow, 20), (error) => {
    assert.equal(error.name, 'TimeoutError');
    assert.match(error.message, /20/);
    return true;
  });
});

test('withTimeout clears its timer when the promise wins', async (t) => {
  const cleared = t.mock.method(globalThis, 'clearTimeout');
  await withTimeout(Promise.resolve(1), 1000);
  assert.ok(cleared.mock.callCount() >= 1, 'clearTimeout was not called');
});
