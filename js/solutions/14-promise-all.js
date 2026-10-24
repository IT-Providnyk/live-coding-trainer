// 14. promiseAll і promiseAllSettled: рішення

export function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) {
      resolve(results);
      return;
    }

    items.forEach((item, index) => {
      Promise.resolve(item).then((value) => {
        results[index] = value;
        remaining -= 1;
        if (remaining === 0) resolve(results);
      }, reject);
    });
  });
}

export function promiseAllSettled(items) {
  return promiseAll(
    items.map((item) =>
      Promise.resolve(item).then(
        (value) => ({ status: 'fulfilled', value }),
        (reason) => ({ status: 'rejected', reason }),
      ),
    ),
  );
}

/*
Розбір
- Записуємо за `index`, а не push: інакше порядок буде за часом завершення.
- Лічильник `remaining`, а не `results.length`: масив з дірками має повну length одразу.
- `Promise.resolve(item)` обгортає звичайні значення.
- Повторні resolve/reject після першого ігноруються самим промісом, тому зайвої логіки не треба.
- allSettled = all над промісами, які ніколи не реджектяться.

Паралельно чи послідовно:
  const a = await getA(); const b = await getB();             // послідовно: tA + tB
  const [a, b] = await Promise.all([getA(), getB()]);         // паралельно: max(tA, tB)
Паралельність дає те, що обидва виклики СТАРТУВАЛИ до першого await, а не сам Promise.all.

Коли allSettled: «якщо /api/rates впаде, показати перекази без колонки UAH» (часткова деградація).
*/
