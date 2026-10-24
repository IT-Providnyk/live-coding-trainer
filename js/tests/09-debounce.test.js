import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';

const { debounce, throttle } = await load('09-debounce');

test('debounce calls once with the last args', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const calls = [];
  const d = debounce((...args) => calls.push(args), 300);

  d('a');
  t.mock.timers.tick(100);
  d('ab');
  t.mock.timers.tick(100);
  d('abc', 1);
  t.mock.timers.tick(299);
  assert.deepEqual(calls, []);
  t.mock.timers.tick(1);
  assert.deepEqual(calls, [['abc', 1]]);
});

test('debounce works again after firing', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const calls = [];
  const d = debounce((x) => calls.push(x), 100);
  d(1);
  t.mock.timers.tick(100);
  d(2);
  t.mock.timers.tick(100);
  assert.deepEqual(calls, [1, 2]);
});

test('debounce keeps this', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const obj = {
    name: 'obj',
    seen: null,
    run: debounce(function () {
      this.seen = this.name;
    }, 10),
  };
  obj.run();
  t.mock.timers.tick(10);
  assert.equal(obj.seen, 'obj');
});

test('debounce cancel', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let called = false;
  const d = debounce(() => (called = true), 100);
  d();
  d.cancel();
  t.mock.timers.tick(200);
  assert.equal(called, false);
});

test('throttle: leading call immediately, trailing call with last args', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const calls = [];
  const th = throttle((x) => calls.push(x), 100);

  th('t0');
  assert.deepEqual(calls, ['t0']);
  t.mock.timers.tick(10);
  th('t10');
  t.mock.timers.tick(40);
  th('t50');
  assert.deepEqual(calls, ['t0']);
  t.mock.timers.tick(50);
  assert.deepEqual(calls, ['t0', 't50']);
});

test('throttle: no trailing call if nothing happened in the window', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const calls = [];
  const th = throttle((x) => calls.push(x), 100);
  th(1);
  t.mock.timers.tick(500);
  assert.deepEqual(calls, [1]);
  th(2);
  assert.deepEqual(calls, [1, 2]);
});
