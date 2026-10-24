// 08. deepEqual: рішення

export function deepEqual(a, b) {
  if (Object.is(a, b)) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}

/*
Розбір
Порядок перевірок важливий, проговорюй його:
  1) однакові (Object.is) → true;
  2) хоч один не об'єкт або null → false;
  3) спецвипадки (Date);
  4) масив проти не-масиву → false;
  5) однакова кількість ключів і рекурсія.
- `typeof null === 'object'`, тому null треба перевірити окремо. Класична пастка.
- `Object.hasOwn(b, key)` ловить { a: 1, b: undefined } проти { a: 1, c: undefined }.
- Масиви проходять тим самим кодом: Object.keys на масиві повертає індекси.
- Follow-up: «а Map, Set, цикли?» Цикли через WeakMap пар, які вже бачили. Достатньо сказати.
*/
