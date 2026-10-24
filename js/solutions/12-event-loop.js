// 12. Event loop: відповіді з поясненнями

export const answers = {
  // Sync first (A, E), then microtasks in queue order (C, D), then the timer (B).
  basics: ['A', 'E', 'C', 'D', 'B'],

  // getData runs synchronously up to the first await and returns a Promise right away.
  // `typeof promise` is 'object'. 'after main' is sync code, so it beats everything after an await.
  forgottenAwait: ['fetch start', 'object', 'promise', 'after main', 'fetch end', '42'],

  // Sync: 1, 5, 6 (the Promise executor runs synchronously).
  // Microtasks: continuation of first() → 2; first .then → queues 7, logs 8, which schedules the
  // second .then AFTER 7 → 7, 9. Then timers: 3 and its microtask 4 (all microtasks run before
  // the next timer), then 10.
  mixed: ['1', '5', '6', '2', '8', '7', '9', '3', '4', '10'],

  // Each .then is queued only when the previous one finishes, so two chains interleave.
  twoChains: ['a1', 'b1', 'a2', 'b2', 'a3'],

  // `return fails()` without await returns the rejected promise as is: the try/catch
  // never sees the error, the caller gets a rejection. `return await` throws inside try.
  // Order: adopting a returned promise takes extra microtask ticks, so withAwait finishes first.
  returnWithoutAwait: ['caught in withAwait', 'resolved withAwait', 'rejected noAwait'],

  // var: one shared binding, the loop is over when timers fire → 3 three times.
  // let: a new binding per iteration.
  varVsLet: ['var 3', 'var 3', 'var 3', 'let 0', 'let 1', 'let 2'],
};

/*
Що винести
- async-функція виконується синхронно до першого await і одразу повертає Promise.
- Усі мікрозадачі виконуються до наступної макрозадачі (таймера, події, рендеру).
- `return promise` у try без await не ловить помилку. Для try/catch пиши `return await`.
- Типова помилка: `const data = getJson(url)` без await дає Promise, а не дані.
  TypeScript показав `Promise<unknown>`: це і була підказка.
*/
