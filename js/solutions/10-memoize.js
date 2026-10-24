// 10. memoize: рішення

export function memoize(fn, getKey = (first) => first) {
  const cache = new Map();

  function memoized(...args) {
    const key = getKey(...args);
    if (cache.has(key)) return cache.get(key);
    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  }

  memoized.clear = () => cache.clear();
  return memoized;
}

export function memoizeAsync(fn) {
  const cache = new Map();

  return function memoized(key) {
    if (cache.has(key)) return cache.get(key);

    const promise = fn(key).catch((error) => {
      cache.delete(key);
      throw error;
    });
    cache.set(key, promise);
    return promise;
  };
}

/*
Розбір
- `cache.has(key)`, а не `if (cache.get(key))`: інакше undefined, 0 і '' не кешуються.
- Map, а не об'єкт: ключ може бути будь-якого типу, немає проблеми з 'constructor'.
- Async: кешуємо ПРОМІС одразу, синхронно. Тоді другий паралельний виклик бере той самий
  проміс. Якщо кешувати результат після await, будуть два запити.
- Помилку прибираємо з кешу в .catch і прокидаємо далі (throw), щоб викликач її побачив.
- Follow-up: «кеш росте нескінченно». Відповідь: LRU (Map зберігає порядок, видаляй
  перший ключ) або TTL.
*/
