// Task 03: reference solution.
import { useEffect, useState } from 'react';
import type { User } from '../../api/types';

const USERS_URL = '/api/users?fail=0.5';

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; users: User[] };

export default function Solution() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    getJson<User[]>(USERS_URL, controller.signal)
      .then((users) => setState({ status: 'success', users }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: e instanceof Error ? e.message : 'Невідома помилка' });
      });

    return () => controller.abort();
  }, [reloadKey]);

  const retry = () => setReloadKey((k) => k + 1);

  return (
    <main className="page">
      <h1>Користувачі</h1>

      {state.status === 'loading' && <p className="muted">Завантаження…</p>}

      {state.status === 'error' && (
        <div className="error row">
          <span>Не вдалося завантажити: {state.message}</span>
          <button className="button" onClick={retry}>
            Спробувати ще раз
          </button>
        </div>
      )}

      {state.status === 'success' && (
        <ul className="list">
          {state.users.map((user) => (
            <li key={user.id}>
              <div>{user.name}</div>
              <div className="muted">
                {user.email} · {user.city}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

/*
Розбір багів оригіналу
- Помилка: isLoading лишався true → «Завантаження…» і помилка одночасно.
- Не було способу скинути error: навіть якби був retry, після успіху помилка висіла б.
- users = [] з самого початку: порожній список і «немає даних» не відрізнити від «ще вантажиться».
Union робить ці стани неможливими: у кожен момент рівно один варіант.

Retry
- `reloadKey` у deps: ефект перезапускається, попередній cleanup скасовує старий запит.
- `setState({ status: 'loading' })` на початку ефекту: кнопка зникає разом із блоком помилки,
  тому подвійний клік неможливий. Якщо хочеш показувати старі дані під час оновлення, додай
  варіант `{ status: 'refreshing', users }`. Це гарний follow-up для обговорення.
- Лінтер (react-hooks/set-state-in-effect) може свариться на setState на початку ефекту.
  Альтернатива: скидати стан в обробнику кліку: `onClick={() => { setState({ status: 'loading' }); setReloadKey(k => k + 1); }}`.
*/
