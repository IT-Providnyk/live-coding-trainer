import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { get } = await load('07-get');

const data = {
  user: { address: { city: 'Київ' }, tags: ['a', 'b'], nothing: null, zero: 0 },
  items: [{ name: 'first' }, { name: 'second' }],
};

test('dot path', () => {
  assert.equal(get(data, 'user.address.city'), 'Київ');
});

test('brackets', () => {
  assert.equal(get(data, 'user.tags[1]'), 'b');
  assert.equal(get(data, 'items[1].name'), 'second');
});

test('array path', () => {
  assert.equal(get(data, ['user', 'tags', 0]), 'a');
});

test('missing path returns default', () => {
  assert.equal(get(data, 'user.phone.number', '—'), '—');
  assert.equal(get(data, 'items[5].name', 'none'), 'none');
});

test('falsy values are returned, not replaced by default', () => {
  assert.equal(get(data, 'user.zero', 42), 0);
  assert.equal(get(data, 'user.nothing', 42), null);
});

test('walking through null returns default', () => {
  assert.equal(get(data, 'user.nothing.deeper', 'x'), 'x');
});

test('null or undefined root', () => {
  assert.equal(get(null, 'a.b', 'd'), 'd');
  assert.equal(get(undefined, 'a', 'd'), 'd');
});
