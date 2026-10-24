/**
 * 17. getJson і postJson: обгортка над fetch
 * Рівень: ★★☆   Ціль: 10 хв. Мета: писати з пам'яті за 3 хв.
 *
 * Це перше, що пишеш на будь-якому live coding з API. Має бути в м'язовій пам'яті.
 *
 * class ApiError extends Error: поля `status` (число) і `name === 'ApiError'`.
 *
 * getJson(url, init?)
 * - fetch(url, init); `init` (зокрема signal) передається як є;
 * - !res.ok: кинути ApiError зі статусом. message береться з тіла `{ "error": "..." }`,
 *   якщо воно є і це JSON; інакше `HTTP <status>`;
 * - інакше повернути розпарсений JSON.
 *
 * postJson(url, body, init?)
 * - method POST, заголовок 'Content-Type': 'application/json', body = JSON.stringify(body);
 * - помилки так само, як у getJson (не дублюй код).
 *
 * Пам'ятай: fetch НЕ кидає помилку на 4xx/5xx, тільки на мережеві збої та abort.
 *
 * Перевірка: node run.js 17 (тести підміняють глобальний fetch)
 */
export class ApiError extends Error {}

export async function getJson(url, init) {
  throw new Error('Not implemented');
}

export async function postJson(url, body, init) {
  throw new Error('Not implemented');
}
