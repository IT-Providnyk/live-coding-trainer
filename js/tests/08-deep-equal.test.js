import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { deepEqual } = await load('08-deep-equal');

test('primitives', () => {
  assert.equal(deepEqual(1, 1), true);
  assert.equal(deepEqual('a', 'b'), false);
  assert.equal(deepEqual(NaN, NaN), true);
  assert.equal(deepEqual(null, undefined), false);
  assert.equal(deepEqual(null, null), true);
  assert.equal(deepEqual(1, '1'), false);
});

test('nested objects and arrays', () => {
  assert.equal(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }), true);
  assert.equal(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] }), false);
});

test('key order does not matter', () => {
  assert.equal(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
});

test('extra key, even undefined, is a difference', () => {
  assert.equal(deepEqual({ a: 1 }, { a: 1, b: undefined }), false);
  assert.equal(deepEqual({ a: 1, b: undefined }, { a: 1 }), false);
});

test('array vs object', () => {
  assert.equal(deepEqual([1, 2], { 0: 1, 1: 2 }), false);
});

test('array length and order', () => {
  assert.equal(deepEqual([1, 2], [1, 2, 3]), false);
  assert.equal(deepEqual([1, 2], [2, 1]), false);
});

test('object vs null', () => {
  assert.equal(deepEqual({}, null), false);
  assert.equal(deepEqual(null, {}), false);
});

test('dates', () => {
  assert.equal(deepEqual(new Date(1000), new Date(1000)), true);
  assert.equal(deepEqual(new Date(1000), new Date(2000)), false);
  assert.equal(deepEqual(new Date(1000), {}), false);
});
