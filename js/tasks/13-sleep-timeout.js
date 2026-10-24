/**
 * 13. sleep і withTimeout: проміси, таймери, AbortSignal
 * Рівень: ★★☆   Ціль: 12 хв
 *
 * sleep(ms, signal?) повертає проміс, який резолвиться через ms.
 * - якщо signal уже aborted, одразу reject із signal.reason;
 * - якщо signal абортнули під час очікування, reject із signal.reason і прибрати таймер.
 *
 * withTimeout(promise, ms) повертає проміс, який:
 * - резолвиться або реджектиться так само, як promise, якщо той встиг за ms;
 * - інакше реджектиться з помилкою TimeoutError: `error.name === 'TimeoutError'`,
 *   у message є кількість мілісекунд;
 * - таймер прибирається, коли promise завершився (без зайвих таймерів, що висять).
 *
 *   await withTimeout(getJson('/api/rates'), 2000);
 *
 * Навіщо: типова помилка на співбесіді: AbortController створили, але abort не викликається і cleanup нема.
 * Тут розбираєшся, як signal реально працює зсередини.
 *
 * Перевірка: node run.js 13
 */
export function sleep(ms, signal) {
  throw new Error('Not implemented');
}

export function withTimeout(promise, ms) {
  throw new Error('Not implemented');
}
