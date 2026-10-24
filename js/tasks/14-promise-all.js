/**
 * 14. promiseAll і promiseAllSettled власноруч
 * Рівень: ★★☆   Ціль: 15 хв
 *
 * Без Promise.all, Promise.allSettled, Promise.race і Promise.any.
 *
 * promiseAll(items)
 * - items може містити проміси і звичайні значення;
 * - результат у порядку ВХОДУ, а не завершення;
 * - перший reject відхиляє весь проміс з цією причиною;
 * - порожній масив резолвиться в [].
 *
 * promiseAllSettled(items) повертає масив
 *   { status: 'fulfilled', value } | { status: 'rejected', reason }
 * у порядку входу і ніколи не реджектиться.
 *
 * Навіщо: у типовій задачі зі співбесіди transfers і rates треба запустити ПАРАЛЕЛЬНО. Коли розумієш, як
 * Promise.all влаштований, не сплутаєш паралельний запуск з двома await поспіль.
 *
 * Перевірка: node run.js 14
 */
export function promiseAll(items) {
  throw new Error('Not implemented');
}

export function promiseAllSettled(items) {
  throw new Error('Not implemented');
}
