/**
 * 18. loadDashboard: паралельні та залежні запити (типова задача з fintech-співбесіди)
 * Рівень: ★★★   Ціль: 15 хв
 *
 * Те, що в такій задачі треба встигнути за перші 15 хвилин, тільки без React.
 *
 * loadDashboard(api, signal) повертає { transfers, rates, contacts }, де api:
 *   api.getTransfers(signal)       → Promise<{ items: Transfer[], total }>
 *   api.getRates(signal)           → Promise<{ base, rates }>
 *   api.getContacts(ids, signal)   → Promise<{ items: Contact[] }>, максимум 50 id за раз
 *
 * Вимоги:
 * 1. transfers і rates стартують ОДНОЧАСНО;
 * 2. contacts стартує одразу після transfers і НЕ чекає rates;
 * 3. ids для контактів унікальні; якщо їх більше 50, кілька паралельних getContacts
 *    по ≤ 50 id; якщо ids немає, getContacts не викликати;
 * 4. signal передається в кожен виклик;
 * 5. помилка будь-якого запиту відхиляє весь loadDashboard.
 *
 * Результат: { transfers: Transfer[], rates: { UAH: 1, ... }, contacts: Contact[] }.
 *
 * Можна імпортувати свої рішення: `import { chunk } from './01-chunk.js'`.
 *
 * Перевірка: node run.js 18
 */
export async function loadDashboard(api, signal) {
  throw new Error('Not implemented');
}
