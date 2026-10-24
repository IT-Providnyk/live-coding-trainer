/**
 * 03. groupBy і countBy
 * Рівень: ★☆☆   Ціль: 7 хв
 *
 * groupBy(items, getKey) повертає звичайний об'єкт { [key]: item[] }.
 * Порядок елементів у групі такий самий, як у вхідному масиві.
 *
 *   groupBy(transfers, (t) => t.status)
 *   // { completed: [...], pending: [...], failed: [...] }
 *
 * countBy(items, getKey) повертає { [key]: number }.
 *
 *   countBy(transfers, (t) => t.direction)  // { incoming: 10, outgoing: 14 }
 *
 * Не використовуй `Object.groupBy`: на співбесіді просять написати руками.
 * Після цього, якщо лишився час, скажи, що `Object.groupBy` існує.
 *
 * Перевірка: node run.js 03
 */
export function groupBy(items, getKey) {
  throw new Error('Not implemented');
}

export function countBy(items, getKey) {
  throw new Error('Not implemented');
}
