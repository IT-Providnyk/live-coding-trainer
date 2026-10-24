/**
 * 09. debounce і throttle
 * Рівень: ★★☆   Ціль: 15 хв на обидві
 *
 * debounce(fn, ms) повертає функцію, яка викликає fn через ms після ОСТАННЬОГО виклику.
 * - викликається з останніми аргументами і з тим самим `this`;
 * - має метод `.cancel()`, який скасовує запланований виклик.
 *
 *   const save = debounce((q) => search(q), 300);
 *   save('a'); save('ab'); save('abc');  // через 300 мс один виклик search('abc')
 *
 * throttle(fn, ms): не частіше ніж раз на ms.
 * - перший виклик одразу (leading);
 * - виклики всередині вікна не губляться: останній з них виконається в кінці вікна (trailing);
 * - `this` і аргументи зберігаються.
 *
 *   const onScroll = throttle(update, 100);
 *   // t=0 виклик → одразу; t=10, t=50 → один виклик з аргументами t=50 на t=100
 *
 * Навіщо: пошук по мірі набору (React-задача 07), scroll і resize.
 *
 * Перевірка: node run.js 09
 */
export function debounce(fn, ms) {
  throw new Error('Not implemented');
}

export function throttle(fn, ms) {
  throw new Error('Not implemented');
}
