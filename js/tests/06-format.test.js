import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { formatMoney, formatDate } = await load('06-format');

// Intl uses U+00A0 / U+202F; compare with plain spaces.
const norm = (s) => s.replace(/\s/g, ' ');

test('outgoing UAH', () => {
  assert.equal(norm(formatMoney(125000, 'UAH', 'outgoing')), '−1 250,00 ₴');
});

test('incoming USD', () => {
  assert.equal(norm(formatMoney(25000, 'USD', 'incoming')), '+250,00 USD');
});

test('no direction, small amount', () => {
  assert.equal(norm(formatMoney(5, 'UAH')), '0,05 ₴');
});

test('uses the real minus sign U+2212, not a hyphen', () => {
  assert.equal(formatMoney(100, 'UAH', 'outgoing')[0], '−');
});

test('big amount', () => {
  assert.equal(norm(formatMoney(123456789, 'EUR', 'incoming')), '+1 234 567,89 EUR');
});

test('formatDate in Kyiv time', () => {
  assert.equal(norm(formatDate('2026-10-21T18:42:00Z')), '21 жовт. 2026 р., 21:42');
});

test('formatDate in another time zone', () => {
  assert.equal(norm(formatDate('2026-10-21T18:42:00Z', 'UTC')), '21 жовт. 2026 р., 18:42');
});
