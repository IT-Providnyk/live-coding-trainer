/**
 * 10. memoize: кеш результатів
 * Рівень: ★★☆   Ціль: 10 хв
 *
 * memoize(fn, getKey?) повертає функцію з кешем.
 * - за замовчуванням ключ = перший аргумент;
 * - getKey(...args) дає власний ключ (наприклад, JSON.stringify(args));
 * - кешуються й значення undefined (fn не викликається вдруге для того самого ключа);
 * - `.clear()` очищає кеш.
 *
 * memoizeAsync(fn): те саме для async-функцій, але:
 * - паралельні виклики з тим самим ключем роблять ОДИН виклик fn (кешуємо проміс);
 * - якщо проміс відхилено, його НЕ лишати в кеші: наступний виклик пробує знову.
 *
 *   const getContact = memoizeAsync((id) => fetchContact(id));
 *   await Promise.all([getContact('c_1'), getContact('c_1')]);  // fetchContact викликано 1 раз
 *
 * Навіщо: кеш контактів при пагінації («не запитувати повторно тих, кого вже знаємо»).
 *
 * Перевірка: node run.js 10
 */
export function memoize(fn, getKey) {
  throw new Error('Not implemented');
}

export function memoizeAsync(fn) {
  throw new Error('Not implemented');
}
