import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { groupBy, countBy } = await load('03-group-by');

const transfers = [
  { id: 't1', status: 'completed', direction: 'incoming' },
  { id: 't2', status: 'pending', direction: 'outgoing' },
  { id: 't3', status: 'completed', direction: 'outgoing' },
  { id: 't4', status: 'failed', direction: 'outgoing' },
];

test('groupBy groups and keeps order inside groups', () => {
  const groups = groupBy(transfers, (t) => t.status);
  assert.deepEqual(Object.keys(groups).sort(), ['completed', 'failed', 'pending']);
  assert.deepEqual(groups.completed.map((t) => t.id), ['t1', 't3']);
  assert.deepEqual(groups.pending.map((t) => t.id), ['t2']);
});

test('groupBy on empty array', () => {
  assert.deepEqual(groupBy([], (x) => x), {});
});

test('groupBy works with a computed key', () => {
  const groups = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? 'even' : 'odd'));
  assert.deepEqual(groups, { odd: [1, 3, 5], even: [2, 4] });
});

test('groupBy is not fooled by keys like "constructor"', () => {
  const groups = groupBy([{ k: 'constructor' }], (x) => x.k);
  assert.equal(groups.constructor.length, 1);
});

test('countBy counts', () => {
  assert.deepEqual(countBy(transfers, (t) => t.direction), { incoming: 1, outgoing: 3 });
});
