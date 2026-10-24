/**
 * 01. chunk: розбити масив на шматки
 * Рівень: ★☆☆   Ціль: 5 хв
 *
 * Навіщо: `POST /api/contacts/batch` приймає максимум 50 id. Якщо id 120, треба 3 запити.
 *
 * chunk(array, size) повертає масив масивів довжиною `size`, останній може бути коротшим.
 *
 *   chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]
 *   chunk([1, 2, 3], 5)        // [[1, 2, 3]]
 *   chunk([], 3)               // []
 *
 * Правила:
 * - вхідний масив не мутувати;
 * - `size` не ціле або <= 0: кинути `RangeError`.
 *
 * Перевірка: node run.js 01
 */
export function chunk(array, size) {
  throw new Error('Not implemented');
}
