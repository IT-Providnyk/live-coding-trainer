// 07. get: рішення

function toKeys(path) {
  if (Array.isArray(path)) return path;
  // 'items[1].name' -> 'items.1.name' -> ['items', '1', 'name']
  return path.replace(/\[(\w+)\]/g, '.$1').split('.').filter(Boolean);
}

export function get(obj, path, defaultValue) {
  let current = obj;
  for (const key of toKeys(path)) {
    if (current === null || current === undefined) return defaultValue;
    current = current[key];
  }
  return current === undefined ? defaultValue : current;
}

/*
Розбір
- Нормалізуй шлях в один формат (масив ключів), потім один простий цикл.
- Перевірка `== null` по дорозі, а не `!current`: інакше 0, '' і false зламаються.
- У кінці підміняємо тільки undefined. Так працює lodash.get.
- Рядковий ключ '1' на масиві працює: `arr['1'] === arr[1]`.
- Однорядковий варіант через reduce і `?.` теж ок:
    toKeys(path).reduce((acc, k) => acc?.[k], obj) ?? defaultValue
  але `??` підмінить і null у кінці. Тут це розходиться з умовою, і це добре помітити вголос.
*/
