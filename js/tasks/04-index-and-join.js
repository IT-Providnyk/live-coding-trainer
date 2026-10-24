/**
 * 04. indexById і joinContacts: об'єднати дві відповіді API
 * Рівень: ★★☆   Ціль: 10 хв
 *
 * Це серце задачі з переказами: `/api/transfers` повертає `counterpartyId`,
 * `/api/contacts/batch` повертає контакти. Їх треба з'єднати.
 *
 * Пастки, які тут перевіряють:
 * - контакти приходять НЕ в порядку id із запиту, тому мапити за індексом не можна;
 * - контакту може не бути (видалений), API його просто не повертає.
 *
 * indexById(items) повертає Map<id, item>.
 *
 * joinContacts(transfers, contacts) повертає НОВИЙ масив переказів, у кожного додано поле
 * `contact`:
 * - знайдений контакт: { fullName, bank, cardMask } (поле `id` контакту не потрібне);
 * - не знайдений: { fullName: 'Невідомий контакт', bank: null, cardMask: null }.
 * Вхідні об'єкти не мутувати.
 *
 *   joinContacts(
 *     [{ id: 't1', counterpartyId: 'c_2' }],
 *     [{ id: 'c_2', fullName: 'Олена', bank: 'mono', cardMask: '**** 1' }],
 *   )
 *   // [{ id: 't1', counterpartyId: 'c_2', contact: { fullName: 'Олена', bank: 'mono', cardMask: '**** 1' } }]
 *
 * Перевірка: node run.js 04
 */
export const UNKNOWN_CONTACT = { fullName: 'Невідомий контакт', bank: null, cardMask: null };

export function indexById(items) {
  throw new Error('Not implemented');
}

export function joinContacts(transfers, contacts) {
  throw new Error('Not implemented');
}
