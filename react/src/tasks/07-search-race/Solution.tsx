// Task 07: reference solution.
import { useEffect, useState } from 'react';
import type { Product, ProductsResponse } from '../../api/types';

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

function formatPrice(minor: number) {
  return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(minor / 100);
}

// Debounces a VALUE: returns `value` only after it stopped changing for `ms`.
function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return debounced;
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; q: string; items: Product[] };

export default function Solution() {
  const [query, setQuery] = useState('');
  const q = useDebouncedValue(query.trim(), 300);
  const [state, setState] = useState<State>({ status: 'idle' });

  useEffect(() => {
    if (q === '') {
      setState({ status: 'idle' });
      return;
    }

    const controller = new AbortController();
    setState({ status: 'loading' });

    const params = new URLSearchParams({ q });
    getJson<ProductsResponse>(`/api/products?${params}`, controller.signal)
      .then((data) => setState({ status: 'success', q, items: data.items }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: e instanceof Error ? e.message : 'Невідома помилка' });
      });

    // A newer q aborts this request: its late response can never overwrite newer results.
    return () => controller.abort();
  }, [q]);

  return (
    <main className="page stack">
      <h1>Пошук товарів</h1>

      <input
        className="input"
        placeholder="Наприклад, ноутбук"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {state.status === 'idle' && <p className="muted">Почни вводити назву товару</p>}
      {state.status === 'loading' && <p className="muted">Шукаю…</p>}
      {state.status === 'error' && <div className="error">{state.message}</div>}
      {state.status === 'success' && state.items.length === 0 && (
        <p className="muted">Нічого не знайдено за «{state.q}»</p>
      )}
      {state.status === 'success' && state.items.length > 0 && (
        <ul className="list">
          {state.items.map((p) => (
            <li key={p.id} className="row">
              <span style={{ marginRight: 'auto' }}>{p.name}</span>
              <span className="muted">{formatPrice(p.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

/*
Розбір багів оригіналу
1. Запит на кожну клавішу: «ноутбук» = 7 запитів.
2. Race: відповіді приходять у випадковому порядку, останньою може прийти відповідь на «но».
   На екрані результати не для того, що в полі.
3. Немає res.ok, немає loading, empty, error.
4. `?q=${query}` без кодування: '&', '#', '+' зламають URL.
5. Порожній рядок теж іде на сервер.

Як закрито race
- Cleanup ефекту з abort(): новий q → React викликає cleanup попереднього ефекту → старий
  запит скасовано, його .then не виконається (fetch реджектиться з AbortError, ми його ігноруємо).
- Альтернатива без abort: прапорець `let ignore = false; return () => { ignore = true }`.
  Відповідь не перезапише стан, але запит усе одно дійде до сервера. Abort краще.

Debounce значення, а не функції: не треба useRef/useMemo для таймера, все в одному ефекті.
*/
