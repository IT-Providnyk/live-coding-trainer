// Task 04: reference solution.
import { useEffect, useState } from 'react';
import type { Currency, RatesResponse, Transfer, TransfersResponse } from '../../api/types';

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

function formatMoney(amountMinor: number, currency: Currency, direction?: Transfer['direction']) {
  const sign = direction === 'incoming' ? '+' : direction === 'outgoing' ? '−' : '';
  return sign + new Intl.NumberFormat('uk-UA', { style: 'currency', currency }).format(amountMinor / 100);
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; transfers: Transfer[]; rates: RatesResponse };

export default function Solution() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function load() {
      try {
        // Both requests start here, before any await: they run in parallel.
        const [transfersRes, rates] = await Promise.all([
          getJson<TransfersResponse>('/api/transfers', signal),
          getJson<RatesResponse>('/api/rates', signal),
        ]);
        setState({ status: 'success', transfers: transfersRes.items, rates });
      } catch (error) {
        if (signal.aborted) return;
        setState({ status: 'error', message: error instanceof Error ? error.message : 'Невідома помилка' });
      }
    }

    load();
    return () => controller.abort();
  }, []);

  if (state.status === 'loading') {
    return (
      <main className="page">
        <h1>Історія переказів</h1>
        <p className="muted">Завантаження…</p>
      </main>
    );
  }

  if (state.status === 'error') {
    return (
      <main className="page">
        <h1>Історія переказів</h1>
        <div className="error">Не вдалося завантажити: {state.message}</div>
      </main>
    );
  }

  const { transfers, rates } = state;

  return (
    <main className="page">
      <h1>Історія переказів</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Опис</th>
            <th className="num">Сума</th>
            <th className="num">В UAH</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((t) => {
            const uahMinor = Math.round(t.amount * rates.rates[t.currency]);
            return (
              <tr key={t.id}>
                <td>{dateFormat.format(new Date(t.createdAt))}</td>
                <td>{t.description}</td>
                <td className={`num amount--${t.direction}`}>{formatMoney(t.amount, t.currency, t.direction)}</td>
                <td className="num muted">{formatMoney(uahMinor, 'UAH', t.direction)}</td>
                <td>
                  <span className={`badge badge--${t.status}`}>{t.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="muted">Курс оновлено: {dateFormat.format(new Date(rates.updatedAt))}</p>
    </main>
  );
}

/*
Розбір
- Паралельність дає те, що обидва getJson ВИКЛИКАНІ до першого await. Promise.all лише чекає обидва.
  Послідовно: `const a = await getJson(...); const b = await getJson(...)` → 0.7 + 1.5 с.
- Один стан на обидві відповіді: в success є і transfers, і rates, тому не треба перевіряти
  `rates && transfers && ...` у JSX.
- Early return для loading/error тут нормальний: заголовок лишається, верстка не ламається.
- Конвертація в рендері: це похідні дані, окремий стан для них не потрібен. Якщо рядків тисячі,
  загорни в useMemo.
- Follow-up «rates впали»: `Promise.allSettled`, і в success `rates: RatesResponse | null`.
  Колонку UAH тоді показуємо як «—».
*/
