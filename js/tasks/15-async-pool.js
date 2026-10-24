/**
 * 15. asyncPool: обмеження паралельності
 * Рівень: ★★★   Ціль: 20 хв
 *
 * asyncPool(limit, items, fn) викликає fn(item, index) для кожного елемента так, щоб
 * одночасно виконувалось НЕ більше `limit` викликів.
 * - результат: масив значень у порядку items;
 * - щойно один виклик завершився, стартує наступний (не пачками по limit!);
 * - якщо якийсь fn реджектнувся, asyncPool реджектиться з цією помилкою і більше
 *   нових викликів не стартує.
 *
 *   // 120 контактів, сервер дозволяє 3 запити одночасно
 *   const pages = await asyncPool(3, chunk(ids, 50), (ids) => postJson('/api/contacts/batch', { ids }));
 *
 * Перевірка: node run.js 15
 */
export function asyncPool(limit, items, fn) {
  throw new Error('Not implemented');
}
