// Task 06: reference solution.
import { useEffect, useMemo, useState } from 'react';
import type {
  Currency,
  RatesResponse,
  Transfer,
  TransferDirection,
  TransferStatus,
  TransfersResponse,
} from '../../api/types';

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

type Rates = RatesResponse['rates'];

type Data =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; transfers: Transfer[]; rates: Rates };

function useTransfersAndRates(): Data {
  const [data, setData] = useState<Data>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getJson<TransfersResponse>('/api/transfers', controller.signal),
      getJson<RatesResponse>('/api/rates', controller.signal),
    ])
      .then(([t, r]) => setData({ status: 'success', transfers: t.items, rates: r.rates }))
      .catch((e: unknown) => {
        if (!controller.signal.aborted) setData({ status: 'error', message: String(e) });
      });
    return () => controller.abort();
  }, []);
  return data;
}

function formatMoney(amountMinor: number, currency: Currency = 'UAH') {
  return new Intl.NumberFormat('uk-UA', { style: 'currency', currency }).format(amountMinor / 100);
}

// Pure function: all cards from one pass, in kopecks.
function summarize(transfers: Transfer[], rates: Rates) {
  let incoming = 0;
  let outgoing = 0;
  for (const t of transfers) {
    if (t.status !== 'completed') continue;
    const uah = Math.round(t.amount * rates[t.currency]);
    if (t.direction === 'incoming') incoming += uah;
    else outgoing += uah;
  }
  return { incoming, outgoing, balance: incoming - outgoing };
}

const STATUSES: TransferStatus[] = ['completed', 'pending', 'failed'];

export default function Solution() {
  const data = useTransfersAndRates();
  const [status, setStatus] = useState<TransferStatus | 'all'>('all');
  const [direction, setDirection] = useState<TransferDirection | 'all'>('all');

  // Hooks must run on every render, so they go before the early returns.
  const transfers = data.status === 'success' ? data.transfers : [];
  const rates = data.status === 'success' ? data.rates : null;

  const summary = useMemo(() => (rates ? summarize(transfers, rates) : null), [transfers, rates]);

  const visible = useMemo(
    () =>
      transfers.filter(
        (t) => (status === 'all' || t.status === status) && (direction === 'all' || t.direction === direction),
      ),
    [transfers, status, direction],
  );

  const countByStatus = useMemo(() => {
    const counts: Record<TransferStatus, number> = { completed: 0, pending: 0, failed: 0 };
    for (const t of transfers) counts[t.status] += 1;
    return counts;
  }, [transfers]);

  if (data.status === 'loading') return <p className="page muted">Завантаження…</p>;
  if (data.status === 'error') return <div className="page error">{data.message}</div>;

  return (
    <main className="page">
      <h1>Історія переказів</h1>

      {summary && (
        <div className="summary">
          <div className="card">
            <div className="card__label">Отримано (completed)</div>
            <div className="card__value amount--incoming">{formatMoney(summary.incoming)}</div>
          </div>
          <div className="card">
            <div className="card__label">Відправлено (completed)</div>
            <div className="card__value">{formatMoney(summary.outgoing)}</div>
          </div>
          <div className="card">
            <div className="card__label">Баланс</div>
            <div className="card__value">{formatMoney(summary.balance)}</div>
          </div>
        </div>
      )}

      <div className="row" style={{ marginBottom: 12 }}>
        <select
          className="select"
          value={status}
          onChange={(e) => setStatus(e.target.value as TransferStatus | 'all')}
        >
          <option value="all">Усі статуси ({transfers.length})</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s} ({countByStatus[s]})
            </option>
          ))}
        </select>
        <select
          className="select"
          value={direction}
          onChange={(e) => setDirection(e.target.value as TransferDirection | 'all')}
        >
          <option value="all">Усі напрямки</option>
          <option value="incoming">Вхідні</option>
          <option value="outgoing">Вихідні</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="muted">За цими фільтрами переказів немає</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Опис</th>
              <th>Напрямок</th>
              <th className="num">Сума</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.id}>
                <td>{t.description}</td>
                <td>{t.direction === 'incoming' ? 'Вхідний' : 'Вихідний'}</td>
                <td className={`num amount--${t.direction}`}>{formatMoney(t.amount, t.currency)}</td>
                <td>
                  <span className={`badge badge--${t.status}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="muted">
        Показано {visible.length} з {transfers.length}
      </p>
    </main>
  );
}

/*
Розбір
- Стан: тільки те, що НЕ можна обчислити (дані з сервера, вибір користувача). Решта
  обчислюється: summary, visible, countByStatus.
- `useEffect + setFiltered` дає зайвий рендер, мить зі старими даними і ризик розсинхрону.
- useMemo тут необов'язковий (24 рядки), але показує, що ти думаєш про перерахунок.
  Скажи вголос: «без профілювання я б не мемоїзував, тут для ясності».
- Хуки до early return: правило хуків. Тому transfers/rates виносимо з фолбеком.
- `e.target.value as ...`: select віддає string. Альтернатива без `as` це type guard
  `isStatus(value): value is TransferStatus`.
*/
