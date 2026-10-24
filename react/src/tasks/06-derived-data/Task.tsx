// Task 06: see README.md. Loading is done for you, focus on derived data.
import { useEffect, useState } from 'react';
import type { Currency, RatesResponse, Transfer, TransfersResponse } from '../../api/types';

// ---------- Ready: data loading ----------

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

type Data =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; transfers: Transfer[]; rates: RatesResponse['rates'] };

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

// ---------- Your part ----------

export default function Task() {
  const data = useTransfersAndRates();

  if (data.status === 'loading') return <p className="page muted">Завантаження…</p>;
  if (data.status === 'error') return <div className="page error">{data.message}</div>;

  const { transfers } = data;

  return (
    <main className="page">
      <h1>Історія переказів</h1>

      <div className="summary">
        <div className="card">
          <div className="card__label">Отримано (completed)</div>
          <div className="card__value amount--incoming">0,00 грн</div>
        </div>
        <div className="card">
          <div className="card__label">Відправлено (completed)</div>
          <div className="card__value">0,00 грн</div>
        </div>
        <div className="card">
          <div className="card__label">Баланс</div>
          <div className="card__value">0,00 грн</div>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 12 }}>
        <select className="select">
          <option value="all">Усі статуси</option>
          <option value="completed">completed</option>
          <option value="pending">pending</option>
          <option value="failed">failed</option>
        </select>
        <select className="select">
          <option value="all">Усі напрямки</option>
          <option value="incoming">Вхідні</option>
          <option value="outgoing">Вихідні</option>
        </select>
      </div>

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
          {transfers.map((t) => (
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

      <p className="muted">Показано ? з ?</p>
    </main>
  );
}
