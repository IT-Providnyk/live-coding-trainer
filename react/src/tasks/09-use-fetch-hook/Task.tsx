// Task 09: see README.md. Implement useFetch<T> and FetchState<T>; the component already uses them.
import { useState } from 'react';
import type { RatesResponse, User } from '../../api/types';

// TODO: a union: idle | loading | error (message) | success (data: T)
type FetchState<T> = { status: 'loading' } | { status: 'success'; data: T };

// TODO: implement. Keep the signature.
function useFetch<T>(url: string | null): { state: FetchState<T>; refetch: () => void } {
  void url;
  return { state: { status: 'loading' }, refetch: () => {} };
}

// ---------- Component: you should not need to change much below ----------

const SOURCES = {
  normal: '/api/users',
  failing: '/api/users?fail=1',
  none: null,
} as const;

export default function Task() {
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
        {users.state.status === 'loading' && <p className="muted">Завантаження…</p>}
        {users.state.status === 'success' && (
          <p>
            {users.state.data.length} користувачів: {users.state.data.map((u) => u.name).join(', ')}
          </p>
        )}
        {/* TODO: idle and error (with a «Ще раз» button calling users.refetch) */}
      </section>

      <section className="card">
        <div className="card__label">Курси до UAH</div>
        {rates.state.status === 'loading' && <p className="muted">Завантаження…</p>}
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
