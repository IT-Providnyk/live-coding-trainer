/**
 * 16. retry з експоненційною затримкою
 * Рівень: ★★☆   Ціль: 12 хв
 *
 * retry(fn, options) викликає fn(attempt), де attempt починається з 1.
 * options:
 *   retries:     скільки ПОВТОРІВ після першої спроби (retries: 2 означає максимум 3 виклики);
 *   delayMs:     затримка перед першим повтором;
 *   factor:      множник затримки, за замовчуванням 2 (delayMs, delayMs*2, delayMs*4...);
 *   shouldRetry: (error) => boolean, за замовчуванням завжди true.
 *
 * - Успіх: повернути значення.
 * - Помилка і shouldRetry(error) === false: одразу прокинути помилку.
 * - Спроби скінчились: прокинути ОСТАННЮ помилку.
 *
 *   await retry(() => getJson('/api/rates'), {
 *     retries: 2,
 *     delayMs: 300,
 *     shouldRetry: (e) => !(e.status >= 400 && e.status < 500),  // 4xx повторювати безглуздо
 *   });
 *
 * Перевірка: node run.js 16
 */
export function retry(fn, options) {
  throw new Error('Not implemented');
}
