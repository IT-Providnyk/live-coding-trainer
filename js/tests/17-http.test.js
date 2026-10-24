import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { ApiError, getJson, postJson } = await load('17-http');

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

test('getJson returns parsed JSON', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => json({ items: [1], total: 1 }));
  assert.deepEqual(await getJson('/api/transfers'), { items: [1], total: 1 });
});

test('getJson passes init (signal) to fetch', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => json({}));
  const controller = new AbortController();
  await getJson('/api/rates', { signal: controller.signal });
  const [url, init] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, '/api/rates');
  assert.equal(init.signal, controller.signal);
});

test('getJson throws ApiError with message from { error }', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => json({ error: 'Transfer not found' }, 404));
  await assert.rejects(getJson('/api/x'), (error) => {
    assert.ok(error instanceof ApiError);
    assert.ok(error instanceof Error);
    assert.equal(error.name, 'ApiError');
    assert.equal(error.status, 404);
    assert.equal(error.message, 'Transfer not found');
    return true;
  });
});

test('getJson falls back to HTTP <status> when the body is not JSON', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('<html>oops</html>', { status: 502 }));
  await assert.rejects(getJson('/api/x'), (error) => {
    assert.equal(error.status, 502);
    assert.equal(error.message, 'HTTP 502');
    return true;
  });
});

test('postJson sends JSON with Content-Type', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => json({ items: [] }));
  await postJson('/api/contacts/batch', { ids: ['c_1'] });
  const [url, init] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, '/api/contacts/batch');
  assert.equal(init.method, 'POST');
  assert.equal(new Headers(init.headers).get('content-type'), 'application/json');
  assert.equal(init.body, '{"ids":["c_1"]}');
});

test('postJson keeps extra init (signal)', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => json({}));
  const controller = new AbortController();
  await postJson('/api/x', {}, { signal: controller.signal });
  assert.equal(fetchMock.mock.calls[0].arguments[1].signal, controller.signal);
});

test('postJson errors work like getJson', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => json({ error: 'Body must be JSON' }, 400));
  await assert.rejects(postJson('/api/x', {}), /Body must be JSON/);
});
