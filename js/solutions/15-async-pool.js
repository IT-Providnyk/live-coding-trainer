// 15. asyncPool: рішення

export async function asyncPool(limit, items, fn) {
  const results = new Array(items.length);
  let next = 0;
  let failed = false;

  // Each worker takes the next index until the list is over.
  async function worker() {
    while (next < items.length && !failed) {
      const index = next++;
      try {
        results[index] = await fn(items[index], index);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

/*
Розбір
- Ідея «воркерів»: запускаємо `limit` циклів, кожен бере наступний індекс. Слот звільнився,
  і той самий воркер одразу бере нову роботу. Це простіше, ніж керувати Set активних промісів.
- `next++` безпечний: JS однопотоковий, між читанням і інкрементом ніхто не втрутиться.
- Пачки (`for (const batch of chunk(items, limit)) await Promise.all(batch.map(fn))`)
  працюють гірше: найповільніший у пачці блокує всю пачку. Тест №3 саме про це.
- `failed` зупиняє старт нової роботи. Вже запущені виклики не скасовуються: для цього
  потрібен AbortController.
*/
