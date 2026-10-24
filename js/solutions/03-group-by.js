// 03. groupBy і countBy: рішення

export function groupBy(items, getKey) {
  const groups = {};
  for (const item of items) {
    const key = getKey(item);
    if (!Object.hasOwn(groups, key)) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

export function countBy(items, getKey) {
  const counts = {};
  for (const item of items) {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

/*
Розбір
- `groups[key] ??= []` теж читається добре, але на ключі 'constructor' зламається:
  `{}.constructor` вже існує (це функція Object), і push на ній впаде.
  Тому `Object.hasOwn`, або `Object.create(null)`, або Map.
- Map краще, коли ключі не рядки (об'єкти, числа без перетворення в рядок).
- Вбудовані варіанти: `Object.groupBy(items, fn)` і `Map.groupBy(items, fn)` (ES2024).
- reduce-версія коротша, але for..of легше пояснювати й дебажити наживо.
*/
