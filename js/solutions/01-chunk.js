// 01. chunk: рішення

export function chunk(array, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError(`size must be a positive integer, got ${size}`);
  }

  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/*
Розбір
- Цикл з кроком `size` і `slice` простіший за reduce, і його легко пояснити вголос.
- `slice` не мутує масив. `splice` мутує, тут він не підходить.
- `Number.isInteger` одразу відсікає NaN, 1.5, '2'.

Варіант через Array.from:
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size));

Питання інтерв'юера: «У тебе 120 id, як відправиш?»
  const batches = chunk(ids, 50);
  const results = await Promise.all(batches.map((ids) => postJson('/api/contacts/batch', { ids })));
  const contacts = results.flatMap((r) => r.items);
*/
