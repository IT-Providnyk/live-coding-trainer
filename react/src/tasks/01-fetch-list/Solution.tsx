// Task 01: reference solution.
import { useEffect, useState } from 'react';
import type { User } from '../../api/types';

const USERS_URL = '/api/users'; // try '?fail=1', '?empty=1', '?delay=3000'

// Module level: not recreated on every render.
async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    // Error body is { error: string }, but it may be missing or not JSON.
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

// One union instead of isLoading + error + data: impossible combinations cannot exist.
type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; users: User[] };

export default function Solution() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    getJson<User[]>(USERS_URL, controller.signal)
      .then((users) => {
        if (!controller.signal.aborted) setState({ status: 'success', users });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return; // unmounted or StrictMode re-run: not an error
        setState({ status: 'error', message: error instanceof Error ? error.message : 'Невідома помилка' });
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <h1>Користувачі</h1>

      {state.status === 'loading' && <p className="muted">Завантаження…</p>}

      {state.status === 'error' && <div className="error">Не вдалося завантажити: {state.message}</div>}

      {state.status === 'success' &&
        (state.users.length === 0 ? (
          <p className="muted">Користувачів немає</p>
        ) : (
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
        ))}
    </main>
  );
}

/*
Розбір
- `getJson<User[]>`: generic це тип ВІДПОВІДІ API. Тип стану (State) окремий. Їх часто
  плутають: `getJson<TransfersData>`, де TransfersData це стан UI.
- `.then/.catch` чи async-функція всередині ефекту: обидва ок. Ефект не може бути async сам,
  бо має повертати cleanup, а не Promise.
- Перевірка `aborted` у catch: fetch після abort реджектиться з AbortError. Це не помилка
  для користувача.
- Чому не `if (transfers.status === 'error')` у catch, як часто пишуть наживо: `state` у замиканні
  ефекту це значення з ПЕРШОГО рендера (stale closure). Від стану тут нічого не залежить.
  Просто викликай setState.
- Empty показуємо в межах сторінки, не early return без заголовка.
*/
