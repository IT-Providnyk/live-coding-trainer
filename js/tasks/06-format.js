/**
 * 06. formatMoney і formatDate: вивід через Intl
 * Рівень: ★★☆   Ціль: 10 хв
 *
 * formatMoney(amountMinor, currency, direction?)
 * - amountMinor у мінімальних одиницях (125000 UAH це 1 250,00);
 * - формат: Intl.NumberFormat з локаллю 'uk-UA', style 'currency';
 * - direction 'incoming' додає '+' на початок, 'outgoing' додає '−' (U+2212, «мінус», не дефіс),
 *   без direction знака немає.
 *
 *   formatMoney(125000, 'UAH', 'outgoing')  // '−1 250,00 ₴'
 *   formatMoney(25000, 'USD', 'incoming')   // '+250,00 USD'
 *   formatMoney(5, 'UAH')                   // '0,05 ₴'
 *
 * formatDate(iso, timeZone = 'Europe/Kyiv')
 * - Intl.DateTimeFormat 'uk-UA', dateStyle 'medium', timeStyle 'short', переданий timeZone.
 *
 *   formatDate('2026-10-21T18:42:00Z')  // '21 жовт. 2026 р., 21:42'
 *
 * Примітка: Intl вставляє нерозривні пробіли (U+00A0, U+202F). Тести їх нормалізують,
 * тому звичайний пробіл у прикладах це нормально.
 *
 * Бонус: форматтери повільно створюються. Створи їх один раз, а не на кожен виклик.
 *
 * Перевірка: node run.js 06
 */
export function formatMoney(amountMinor, currency, direction) {
  throw new Error('Not implemented');
}

export function formatDate(iso, timeZone = 'Europe/Kyiv') {
  throw new Error('Not implemented');
}
