// Task 02: reference fix of the live-coding code.
//
// Problems in the original, most important first:
//  1. CRITICAL  getJson<TransfersData>: the generic is the UI state type, not the API response.
//               The API returns { items, total }, there is no `status` field. This one mistake
//               causes a long chain of confusing TS errors.
//  2. CRITICAL  `if (transfersData.status === 'success')` was added to silence TS. At runtime
//               `status` is undefined, so setTransfers is never called: loading forever.
//  3. CRITICAL  URL is '/api/api/transfers' (baseUrl already has /api): 404.
//  4. CRITICAL  catch reads `transfers.status`: a stale closure, it is always 'loading' there,
//               and the condition is inverted anyway. The error state is never set.
//  5. IMPORTANT No cleanup: AbortController is created but abort() is never called. In StrictMode
//               there are two requests and nothing is cancelled on unmount.
//  6. IMPORTANT No loading and no error UI at all.
//  7. IMPORTANT Error text from the { error } body is ignored; message: '' would show nothing.
//  8. IMPORTANT Hand-written `Items` duplicates src/api/types.ts and loses literal unions
//               (`status: string` instead of 'completed' | 'pending' | 'failed').
//  9. IMPORTANT No `key` in .map.
// 10. IMPORTANT amount is in minor units: 125000 is shown instead of 1 250,00 грн. Date is raw ISO.
// 11. MINOR     getJson is declared inside the component: recreated on every render.
// 12. MINOR     [baseUrl] in deps: a module constant, never changes. Should be [].
// 13. MINOR     Early return for the empty list drops the whole page (no heading, no table).
// 14. MINOR     Badge has no modifier class (badge--completed etc.), `total` in state is unused.
import { useEffect, useState } from 'react';
import type { Transfer, TransfersResponse } from '../../api/types';

const TRANSFERS_URL = '/api/transfers'; // try '?fail=1'

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat('uk-UA', { style: 'currency', currency }).format(amountMinor / 100);
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; items: Transfer[] };

export default function Solution() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await getJson<TransfersResponse>(TRANSFERS_URL, controller.signal);
        setState({ status: 'success', items: data.items });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: error instanceof Error ? error.message : 'Невідома помилка' });
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <h1>Історія переказів</h1>

      {state.status === 'loading' && <p className="muted">Завантаження…</p>}
      {state.status === 'error' && <div className="error">Не вдалося завантажити: {state.message}</div>}
      {state.status === 'success' && state.items.length === 0 && <p className="muted">Переказів ще немає</p>}

      {state.status === 'success' && state.items.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Опис</th>
              <th className="num">Сума</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {state.items.map((transfer) => (
              <tr key={transfer.id}>
                <td>{dateFormat.format(new Date(transfer.createdAt))}</td>
                <td>{transfer.description}</td>
                <td className={`num amount--${transfer.direction}`}>
                  {transfer.direction === 'incoming' ? '+' : '−'}
                  {formatMoney(transfer.amount, transfer.currency)}
                </td>
                <td>
                  <span className={`badge badge--${transfer.status}`}>{transfer.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

/*
Головний урок
Коли TypeScript свариться, не «заглушуй» його (`if`, `?.`, `as any`). Спитай: «чому ця змінна
має цей тип?». Тут відповідь: «бо я сам сказав getJson, що він повертає стан UI». Правильний
фікс на одне слово: `getJson<TransfersResponse>`.

І друге: перевіряй у браузері після кожного кроку. Бага 2 видно за 5 секунд у DevTools,
якщо подивитись на екран, а не тільки на редактор.
*/
