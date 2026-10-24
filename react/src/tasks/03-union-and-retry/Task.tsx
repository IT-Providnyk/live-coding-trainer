// Task 03: see README.md. Refactor the three useState into one union and add a retry button.
import { useEffect, useState } from 'react';
import type { User } from '../../api/types';

const USERS_URL = '/api/users?fail=0.5'; // fails about every second time

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export default function Task() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getJson<User[]>(USERS_URL, controller.signal)
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setError(e instanceof Error ? e.message : 'Невідома помилка');
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <h1>Користувачі</h1>

      {isLoading && <p className="muted">Завантаження…</p>}

      {error && (
        <div className="error">
          Не вдалося завантажити: {error}
          {/* TODO: «Спробувати ще раз» */}
        </div>
      )}

      <ul className="list">
        {users.map((user) => (
          <li key={user.id}>
            <div>{user.name}</div>
            <div className="muted">
              {user.email} · {user.city}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
