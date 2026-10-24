// 02. unique і uniqueBy: рішення

export function unique(values) {
  return [...new Set(values)];
}

export function uniqueBy(items, getKey) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = getKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

/*
Розбір
- `Set` зберігає порядок вставки, тому `[...new Set(arr)]` дає порядок першої появи.
- `Set` порівнює через SameValueZero: 1 і '1' різні, NaN дорівнює NaN.
- `arr.filter((x, i) => arr.indexOf(x) === i)` теж працює, але це O(n²). Скажи про це вголос.
- uniqueBy через Map: `[...new Map(items.map((x) => [getKey(x), x])).values()]` лишає
  ОСТАННІЙ елемент, а не перший. Типова непомітна помилка.

У задачі з переказами:
  const ids = [...new Set(transfers.map((t) => t.counterpartyId))];
*/
