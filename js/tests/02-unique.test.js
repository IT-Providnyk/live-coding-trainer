import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { unique, uniqueBy } = await load('02-unique');

test('unique keeps first-seen order', () => {
  assert.deepEqual(unique(['c_2', 'c_1', 'c_2', 'c_3', 'c_1']), ['c_2', 'c_1', 'c_3']);
});

test('unique on empty', () => {
  assert.deepEqual(unique([]), []);
});

test('unique treats 1 and "1" as different', () => {
  assert.deepEqual(unique([1, '1', 1]), [1, '1']);
});

test('uniqueBy keeps the first item for a key', () => {
  const items = [
    { id: 1, v: 'a' },
    { id: 2, v: 'b' },
    { id: 1, v: 'c' },
  ];
  assert.deepEqual(uniqueBy(items, (x) => x.id), [
    { id: 1, v: 'a' },
    { id: 2, v: 'b' },
  ]);
});

test('uniqueBy with derived key', () => {
  const transfers = [
    { id: 't1', counterpartyId: 'c_1' },
    { id: 't2', counterpartyId: 'c_2' },
    { id: 't3', counterpartyId: 'c_1' },
  ];
  assert.deepEqual(
    uniqueBy(transfers, (t) => t.counterpartyId).map((t) => t.id),
    ['t1', 't2'],
  );
});
