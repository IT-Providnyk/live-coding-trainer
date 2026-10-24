/**
 * 07. get: безпечно дістати значення за шляхом
 * Рівень: ★★☆   Ціль: 10 хв
 *
 * get(obj, path, defaultValue)
 * - path це рядок 'a.b.c' або 'items[0].name' або масив ['a', 'b', 'c'];
 * - якщо по дорозі null/undefined, або значення в кінці undefined, повернути defaultValue;
 * - null у кінці шляху це валідне значення, його повернути як є.
 *
 *   const data = { user: { address: { city: 'Київ' }, tags: ['a', 'b'] } };
 *   get(data, 'user.address.city')        // 'Київ'
 *   get(data, 'user.tags[1]')             // 'b'
 *   get(data, ['user', 'tags', 0])        // 'a'
 *   get(data, 'user.phone.number', '—')   // '—'
 *
 * Класична JS-задача: перевіряє парсинг рядка, цикли й роботу з null.
 *
 * Перевірка: node run.js 07
 */
export function get(obj, path, defaultValue) {
  throw new Error('Not implemented');
}
