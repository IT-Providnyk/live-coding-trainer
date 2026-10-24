import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { loadDashboard } = await load('18-load-dashboard');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeApi({ transferCount = 4, ratesMs = 120, fail } = {}) {
  const t0 = Date.now();
  const log = [];
  const at = () => Date.now() - t0;

  const transfers = Array.from({ length: transferCount }, (_, i) => ({
    id: `t${i}`,
    counterpartyId: `c_${i % Math.max(1, Math.ceil(transferCount / 2))}`,
  }));

  const api = {
    async getTransfers(signal) {
      log.push(['transfers', at(), signal]);
      await sleep(30);
      if (fail === 'transfers') throw new Error('transfers failed');
      return { items: transfers, total: transfers.length };
    },
    async getRates(signal) {
      log.push(['rates', at(), signal]);
      await sleep(ratesMs);
      if (fail === 'rates') throw new Error('rates failed');
      return { base: 'UAH', rates: { UAH: 1, USD: 41.32 } };
    },
    async getContacts(ids, signal) {
      log.push(['contacts', at(), signal, ids]);
      await sleep(30);
      return { items: ids.map((id) => ({ id, fullName: `Name ${id}` })) };
    },
  };
  return { api, log };
}

test('returns transfers, rates and contacts', async () => {
  const { api } = makeApi();
  const result = await loadDashboard(api, new AbortController().signal);
  assert.equal(result.transfers.length, 4);
  assert.equal(result.rates.USD, 41.32);
  assert.deepEqual(result.contacts.map((c) => c.id).sort(), ['c_0', 'c_1']);
});

test('transfers and rates start together', async () => {
  const { api, log } = makeApi();
  await loadDashboard(api, new AbortController().signal);
  const start = Object.fromEntries(log.map(([name, time]) => [name, time]));
  assert.ok(start.rates < 15, `rates started at ${start.rates}ms`);
  assert.ok(start.transfers < 15, `transfers started at ${start.transfers}ms`);
});

test('contacts do not wait for rates', async () => {
  const { api, log } = makeApi({ ratesMs: 150 });
  await loadDashboard(api, new AbortController().signal);
  const contactsStart = log.find(([name]) => name === 'contacts')[1];
  assert.ok(contactsStart < 100, `contacts started at ${contactsStart}ms, after rates`);
});

test('contact ids are unique', async () => {
  const { api, log } = makeApi({ transferCount: 6 });
  await loadDashboard(api, new AbortController().signal);
  const ids = log.filter(([name]) => name === 'contacts').flatMap(([, , , ids]) => ids);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 3);
});

test('more than 50 ids are split into parallel batches', async () => {
  const { api, log } = makeApi({ transferCount: 240 }); // 120 unique ids
  const result = await loadDashboard(api, new AbortController().signal);
  const calls = log.filter(([name]) => name === 'contacts');
  assert.deepEqual(calls.map(([, , , ids]) => ids.length), [50, 50, 20]);
  const starts = calls.map(([, time]) => time);
  assert.ok(Math.max(...starts) - Math.min(...starts) < 15, 'batches ran one after another');
  assert.equal(result.contacts.length, 120);
});

test('no transfers means no contacts request', async () => {
  const { api, log } = makeApi({ transferCount: 0 });
  const result = await loadDashboard(api, new AbortController().signal);
  assert.equal(log.filter(([name]) => name === 'contacts').length, 0);
  assert.deepEqual(result.contacts, []);
});

test('signal is passed to every call', async () => {
  const { api, log } = makeApi();
  const { signal } = new AbortController();
  await loadDashboard(api, signal);
  for (const entry of log) assert.equal(entry[2], signal, `${entry[0]} got no signal`);
});

test('any failure rejects', async () => {
  await assert.rejects(loadDashboard(makeApi({ fail: 'rates' }).api, new AbortController().signal), /rates failed/);
  await assert.rejects(loadDashboard(makeApi({ fail: 'transfers' }).api, new AbortController().signal), /transfers failed/);
});
