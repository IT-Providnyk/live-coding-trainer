// 13. sleep і withTimeout: рішення

export function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export function withTimeout(promise, ms) {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`Timed out after ${ms} ms`);
      error.name = 'TimeoutError';
      reject(error);
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/*
Розбір
- signal це EventTarget: `aborted`, `reason`, подія 'abort'. Вся «магія» fetch з signal
  працює так само: fetch слухає 'abort' і відхиляє проміс з AbortError.
- Перевір `aborted` ДО підписки: подія вже відбулася, і слухач не спрацює ніколи.
- Прибирай за собою: removeEventListener після таймера, clearTimeout після abort.
- withTimeout: Promise.race плюс .finally для clearTimeout. Без finally таймер жив би й далі.
- Важливо: withTimeout НЕ скасовує сам запит, він просто перестає його чекати.
  Скасувати запит може лише AbortController. У браузері вже є AbortSignal.timeout(ms) і
  AbortSignal.any([a, b]).

У React (цього часто бракує наживо):
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();  // без цього рядка abort не викликається НІКОЛИ
  }, []);
*/
