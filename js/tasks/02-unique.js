/**
 * 02. unique і uniqueBy: прибрати дублікати
 * Рівень: ★☆☆   Ціль: 5 хв
 *
 * Навіщо: на 24 перекази 10 унікальних контактів. Без дедуплікації в batch-запит підуть
 * дублікати id. Наживо цю пастку часто пропускають.
 *
 * unique(values): унікальні примітиви, порядок першої появи.
 *   unique(['c_1', 'c_2', 'c_1'])  // ['c_1', 'c_2']
 *
 * uniqueBy(items, getKey): унікальні об'єкти за ключем, лишається ПЕРШИЙ.
 *   uniqueBy([{ id: 1, v: 'a' }, { id: 1, v: 'b' }], (x) => x.id)  // [{ id: 1, v: 'a' }]
 *
 * Перевірка: node run.js 02
 */
export function unique(values) {
  throw new Error('Not implemented');
}

export function uniqueBy(items, getKey) {
  throw new Error('Not implemented');
}
