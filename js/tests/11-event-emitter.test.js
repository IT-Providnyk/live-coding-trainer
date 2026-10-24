import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { EventEmitter } = await load('11-event-emitter');

test('on + emit with args, in subscription order', () => {
  const bus = new EventEmitter();
  const log = [];
  bus.on('e', (a, b) => log.push(['first', a, b]));
  bus.on('e', (a) => log.push(['second', a]));
  assert.equal(bus.emit('e', 1, 2), true);
  assert.deepEqual(log, [['first', 1, 2], ['second', 1]]);
});

test('emit without listeners returns false', () => {
  assert.equal(new EventEmitter().emit('nothing'), false);
});

test('on returns unsubscribe', () => {
  const bus = new EventEmitter();
  let count = 0;
  const unsubscribe = bus.on('e', () => count++);
  bus.emit('e');
  unsubscribe();
  bus.emit('e');
  assert.equal(count, 1);
});

test('off removes a listener; unknown listener is fine', () => {
  const bus = new EventEmitter();
  let count = 0;
  const listener = () => count++;
  bus.on('e', listener);
  bus.off('e', listener);
  bus.off('e', () => {});
  bus.off('other', listener);
  bus.emit('e');
  assert.equal(count, 0);
});

test('once fires once', () => {
  const bus = new EventEmitter();
  let count = 0;
  bus.once('e', () => count++);
  bus.emit('e');
  bus.emit('e');
  assert.equal(count, 1);
});

test('off works for a once listener before it fires', () => {
  const bus = new EventEmitter();
  let count = 0;
  const listener = () => count++;
  bus.once('e', listener);
  bus.off('e', listener);
  bus.emit('e');
  assert.equal(count, 0);
});

test('unsubscribing during emit does not skip other listeners', () => {
  const bus = new EventEmitter();
  const log = [];
  const a = () => {
    log.push('a');
    bus.off('e', a);
  };
  bus.on('e', a);
  bus.on('e', () => log.push('b'));
  bus.emit('e');
  bus.emit('e');
  assert.deepEqual(log, ['a', 'b', 'b']);
});
