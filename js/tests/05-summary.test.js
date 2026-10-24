import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { summarize } = await load('05-summary');

const rates = { UAH: 1, USD: 41.32, EUR: 48.05, PLN: 11.27 };

test('example from the task', () => {
  const result = summarize(
    [
      { direction: 'incoming', amount: 25000, currency: 'USD', status: 'completed' },
      { direction: 'outgoing', amount: 125000, currency: 'UAH', status: 'completed' },
      { direction: 'outgoing', amount: 99900, currency: 'UAH', status: 'failed' },
    ],
    rates,
  );
  assert.deepEqual(result, { incoming: 1033000, outgoing: 125000, balance: 908000 });
});

test('pending and failed are ignored', () => {
  const result = summarize(
    [
      { direction: 'incoming', amount: 100, currency: 'UAH', status: 'pending' },
      { direction: 'outgoing', amount: 100, currency: 'UAH', status: 'failed' },
    ],
    rates,
  );
  assert.deepEqual(result, { incoming: 0, outgoing: 0, balance: 0 });
});

test('empty list', () => {
  assert.deepEqual(summarize([], rates), { incoming: 0, outgoing: 0, balance: 0 });
});

test('rounds each converted transfer to a whole kopeck', () => {
  // 1 grosz * 11.27 = 11.27 kopecks -> 11 each, so 33 in total (not round(33.81) = 34).
  // 133 euro cents * 48.05 = 6390.65 kopecks -> 6391.
  const result = summarize(
    [
      { direction: 'incoming', amount: 1, currency: 'PLN', status: 'completed' },
      { direction: 'incoming', amount: 1, currency: 'PLN', status: 'completed' },
      { direction: 'incoming', amount: 1, currency: 'PLN', status: 'completed' },
      { direction: 'outgoing', amount: 133, currency: 'EUR', status: 'completed' },
    ],
    rates,
  );
  assert.deepEqual(result, { incoming: 33, outgoing: 6391, balance: -6358 });
});

test('results are integers', () => {
  const result = summarize(
    [{ direction: 'incoming', amount: 12345, currency: 'EUR', status: 'completed' }],
    rates,
  );
  assert.ok(Number.isInteger(result.incoming));
});

test('unknown currency throws with its name', () => {
  assert.throws(
    () => summarize([{ direction: 'incoming', amount: 1, currency: 'GBP', status: 'completed' }], rates),
    /GBP/,
  );
});
