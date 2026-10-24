import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { chunk } = await load('01-chunk');

test('splits into chunks, last one shorter', () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test('size bigger than array', () => {
  assert.deepEqual(chunk([1, 2, 3], 5), [[1, 2, 3]]);
});

test('exact division', () => {
  assert.deepEqual(chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
});

test('empty array', () => {
  assert.deepEqual(chunk([], 3), []);
});

test('does not mutate input', () => {
  const input = [1, 2, 3];
  chunk(input, 1);
  assert.deepEqual(input, [1, 2, 3]);
});

test('throws RangeError on bad size', () => {
  assert.throws(() => chunk([1], 0), RangeError);
  assert.throws(() => chunk([1], -1), RangeError);
  assert.throws(() => chunk([1], 1.5), RangeError);
});
