import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { indexById, joinContacts } = await load('04-index-and-join');

const contacts = [
  // Deliberately not in the order the transfers reference them.
  { id: 'c_3', fullName: 'Sarah Miller', bank: 'Revolut', cardMask: '**** 9902' },
  { id: 'c_1', fullName: 'Олена Коваленко', bank: 'monobank', cardMask: '**** 4821' },
];

const transfers = [
  { id: 't1', counterpartyId: 'c_1', amount: 100 },
  { id: 't2', counterpartyId: 'c_404', amount: 200 },
  { id: 't3', counterpartyId: 'c_3', amount: 300 },
  { id: 't4', counterpartyId: 'c_1', amount: 400 },
];

test('indexById returns a Map by id', () => {
  const map = indexById(contacts);
  assert.ok(map instanceof Map);
  assert.equal(map.size, 2);
  assert.equal(map.get('c_1').fullName, 'Олена Коваленко');
});

test('joins by id, not by index', () => {
  const rows = joinContacts(transfers, contacts);
  assert.equal(rows[0].contact.fullName, 'Олена Коваленко');
  assert.equal(rows[2].contact.fullName, 'Sarah Miller');
  assert.equal(rows[3].contact.fullName, 'Олена Коваленко');
});

test('keeps transfer fields and drops the contact id', () => {
  const [row] = joinContacts(transfers, contacts);
  assert.deepEqual(row, {
    id: 't1',
    counterpartyId: 'c_1',
    amount: 100,
    contact: { fullName: 'Олена Коваленко', bank: 'monobank', cardMask: '**** 4821' },
  });
});

test('missing contact gets a fallback', () => {
  const rows = joinContacts(transfers, contacts);
  assert.deepEqual(rows[1].contact, { fullName: 'Невідомий контакт', bank: null, cardMask: null });
});

test('does not mutate inputs', () => {
  const t = structuredClone(transfers);
  joinContacts(t, contacts);
  assert.deepEqual(t, transfers);
});

test('fallback objects are not shared by reference', () => {
  const rows = joinContacts(
    [{ id: 'a', counterpartyId: 'x' }, { id: 'b', counterpartyId: 'y' }],
    [],
  );
  assert.notEqual(rows[0].contact, rows[1].contact);
});
