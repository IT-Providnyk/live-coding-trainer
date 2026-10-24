// 16. retry: рішення

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function retry(fn, { retries, delayMs, factor = 2, shouldRetry = () => true }) {
  let delay = delayMs;

  for (let attempt = 1; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      const attemptsLeft = attempt <= retries;
      if (!attemptsLeft || !shouldRetry(error)) throw error;
      await sleep(delay);
      delay *= factor;
    }
  }
}

/*
Розбір
- `return await fn()` у try: без await помилка пролетить повз catch (див. задачу 12).
- Цикл з лічильником простіший, ніж рекурсія, і стек не росте.
- 4xx не повторюємо: запит неправильний, повтор нічого не змінить. 5xx і мережеві помилки
  повторюємо.
- У продакшені додають jitter (випадковий розкид), щоб тисяча клієнтів не прийшла одночасно,
  і AbortSignal, щоб скасувати очікування.

У React кнопка «Спробувати ще раз» це не retry-функція, а новий запуск ефекту:
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => { ... }, [reloadKey]);
  <button onClick={() => setReloadKey((k) => k + 1)}>Спробувати ще раз</button>
*/
