/**
 * 12. Event loop: передбач порядок виводу
 * Рівень: ★★☆   Ціль: 15 хв
 *
 * Часта помилка наживо: забутий `await`, і в змінній Promise замість даних.
 * Ця задача тренує саме це: як виконуються sync-код, мікрозадачі (then, await,
 * queueMicrotask) і макрозадачі (setTimeout).
 *
 * Як працювати:
 * 1. НЕ запускай код. Прочитай кожен сніпет і впиши в `answers` порядок, у якому
 *    викличеться `log`. Значення це рядки, як у log('...').
 * 2. Тільки коли заповнив УСІ відповіді: node run.js 12
 * 3. На кожну помилку поясни собі вголос, чому так, а не інакше.
 *
 * Сніпети не змінюй, тести беруть їх із цього файлу.
 */

export const snippets = {
  basics(log) {
    log('A');
    setTimeout(() => log('B'), 0);
    Promise.resolve().then(() => log('C'));
    queueMicrotask(() => log('D'));
    log('E');
  },

  forgottenAwait(log) {
    async function getData() {
      log('fetch start');
      await null;
      log('fetch end');
      return 42;
    }
    async function main() {
      const data = getData(); // no await!
      log(typeof data);
      log(data instanceof Promise ? 'promise' : 'value');
      const real = await data;
      log(String(real));
    }
    main();
    log('after main');
  },

  mixed(log) {
    async function first() {
      log('1');
      await Promise.resolve();
      log('2');
    }
    setTimeout(() => {
      log('3');
      queueMicrotask(() => log('4'));
    }, 0);
    first();
    new Promise((resolve) => {
      log('5');
      resolve();
      log('6');
    })
      .then(() => {
        queueMicrotask(() => log('7'));
        log('8');
      })
      .then(() => log('9'));
    setTimeout(() => log('10'), 10);
  },

  twoChains(log) {
    Promise.resolve()
      .then(() => log('a1'))
      .then(() => log('a2'))
      .then(() => log('a3'));
    Promise.resolve()
      .then(() => log('b1'))
      .then(() => log('b2'));
  },

  returnWithoutAwait(log) {
    async function fails() {
      throw new Error('x');
    }
    async function noAwait() {
      try {
        return fails();
      } catch {
        log('caught in noAwait');
      }
    }
    async function withAwait() {
      try {
        return await fails();
      } catch {
        log('caught in withAwait');
      }
    }
    noAwait().catch(() => log('rejected noAwait'));
    withAwait().then(() => log('resolved withAwait'));
  },

  varVsLet(log) {
    for (var i = 0; i < 3; i++) setTimeout(() => log(`var ${i}`), 0);
    for (let j = 0; j < 3; j++) setTimeout(() => log(`let ${j}`), 0);
  },
};

// Fill these in before running the tests.
export const answers = {
  basics: [],
  forgottenAwait: [],
  mixed: [],
  twoChains: [],
  returnWithoutAwait: [],
  varVsLet: [],
};
