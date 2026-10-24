// Task 09: reference solution.
import { useCallback, useEffect, useState } from 'react';
import type { RatesResponse, User } from '../../api/types';

type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T; // the only `as` in the file
}

function useFetch<T>(url: string | null): { state: FetchState<T>; refetch: () => void } {
  const [state, setState] = useState<FetchState<T>>(url ? { status: 'loading' } : { status: 'idle' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (url === null) {
      setState({ status: 'idle' });
      return;
    }

    const controller = new AbortController();
    setState({ status: 'loading' });

    getJson<T>(url, controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: e instanceof Error ? e.message : 'Невідома помилка' });
      });

    return () => controller.abort();
  }, [url, reloadKey]);

  // Stable identity: safe to pass to memoized children or put into deps.
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { state, refetch };
}

const SOURCES = {
  normal: '/api/users',
  failing: '/api/users?fail=1',
  none: null,
} as const;

export default function Solution() {
  const [source, setSource] = useState<keyof typeof SOURCES>('normal');
  const users = useFetch<User[]>(SOURCES[source]);
  const rates = useFetch<RatesResponse>('/api/rates');

  return (
    <main className="page stack">
      <h1>useFetch</h1>

      <div className="row">
        <span className="muted">Джерело користувачів:</span>
        <select className="select" value={source} onChange={(e) => setSource(e.target.value as keyof typeof SOURCES)}>
          <option value="normal">/api/users</option>
          <option value="failing">/api/users?fail=1</option>
          <option value="none">null (без запиту)</option>
        </select>
      </div>

      <section className="card">
        <div className="card__label">Користувачі</div>
        {users.state.status === 'idle' && <p className="muted">Вибери джерело</p>}
        {users.state.status === 'loading' && <p className="muted">Завантаження…</p>}
        {users.state.status === 'error' && (
          <div className="error row">
            <span>{users.state.message}</span>
            <button className="button" onClick={users.refetch}>
              Ще раз
            </button>
          </div>
        )}
        {users.state.status === 'success' && (
          <p>
            {users.state.data.length} користувачів: {users.state.data.map((u) => u.name).join(', ')}
          </p>
        )}
      </section>

      <section className="card">
        <div className="card__label">Курси до UAH</div>
        {rates.state.status === 'loading' && <p className="muted">Завантаження…</p>}
        {rates.state.status === 'error' && <div className="error">{rates.state.message}</div>}
        {rates.state.status === 'success' && (
          <ul>
            {Object.entries(rates.state.data.rates).map(([currency, rate]) => (
              <li key={currency}>
                {currency}: {rate}
              </li>
            ))}
          </ul>
        )}
        <button className="button" onClick={rates.refetch}>
          Оновити курси
        </button>
      </section>
    </main>
  );
}

/*
Розбір
- `FetchState<T>` це discriminated union: поле `status` з літеральними типами. Після
  `if (s.status === 'success')` TS звужує тип до варіанту з `data: T`. Це і є narrowing,
  на якому часто плутаються: звужують не ту змінну (відповідь API замість стану).
- Generic ходить ланцюжком: useFetch<User[]> → useState<FetchState<User[]>> → getJson<User[]>.
  Тип вказуємо один раз у місці використання.
- Чому це помилка: `useFetch<FetchState<User[]>>` робить data типу FetchState<User[]>,
  і `data.length` не існує на `{ status: 'loading' }`. Повідомлення TS буквально каже,
  який варіант union не має поля.
- `useCallback` для refetch: стабільна функція. Без нього кожен рендер дає нову, і якщо
  хтось покладе її в deps, ефект крутитиметься.
- Хук це те, що на співбесіді можна запропонувати після бази: «зараз винесу в useFetch».
  У проді беруть React Query або SWR: кеш, дедуплікація, ретраї, invalidation.
*/
