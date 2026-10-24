// Task 08: reference solution.
import { useEffect, useState } from 'react';
import type { Currency, Transfer, TransferDirection, TransfersPageResponse } from '../../api/types';

const LIMIT = 5;
const EXTRA = ''; // try '&fail=0.3'

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

function formatMoney(amountMinor: number, currency: Currency, direction: TransferDirection) {
  const sign = direction === 'incoming' ? '+' : '−';
  return sign + new Intl.NumberFormat('uk-UA', { style: 'currency', currency }).format(amountMinor / 100);
}

type PageStatus = { status: 'loading' } | { status: 'idle' } | { status: 'error'; message: string };

export default function Solution() {
  const [items, setItems] = useState<Transfer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1); // the page that should be loaded
  const [loadedPage, setLoadedPage] = useState(0); // the last page that actually arrived
  const [retryKey, setRetryKey] = useState(0);
  const [pageStatus, setPageStatus] = useState<PageStatus>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setPageStatus({ status: 'loading' });

    getJson<TransfersPageResponse>(`/api/transfers?page=${page}&limit=${LIMIT}${EXTRA}`, controller.signal)
      .then((data) => {
        // Page 1 replaces, later pages append. With abort in cleanup, StrictMode's first run
        // never reaches this line, so nothing is appended twice.
        setItems((prev) => (data.page === 1 ? data.items : [...prev, ...data.items]));
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setLoadedPage(data.page);
        setPageStatus({ status: 'idle' });
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setPageStatus({ status: 'error', message: e instanceof Error ? e.message : 'Невідома помилка' });
      });

    return () => controller.abort();
  }, [page, retryKey]);

  const isFirstLoad = items.length === 0;
  const hasMore = loadedPage < totalPages;

  if (isFirstLoad && pageStatus.status === 'loading') {
    return <p className="page muted">Завантаження…</p>;
  }

  return (
    <main className="page stack">
      <h1>Історія переказів</h1>

      {items.length > 0 && (
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
            {items.map((t) => (
              <tr key={t.id}>
                <td>{dateFormat.format(new Date(t.createdAt))}</td>
                <td>{t.description}</td>
                <td className={`num amount--${t.direction}`}>{formatMoney(t.amount, t.currency, t.direction)}</td>
                <td>
                  <span className={`badge badge--${t.status}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pageStatus.status === 'error' && (
        <div className="error row">
          <span>Не вдалося завантажити сторінку {page}: {pageStatus.message}</span>
          <button className="button" onClick={() => setRetryKey((k) => k + 1)}>
            Спробувати ще раз
          </button>
        </div>
      )}

      <div className="row">
        {hasMore && pageStatus.status !== 'error' && (
          <button
            className="button"
            disabled={pageStatus.status === 'loading'}
            // Derived from the loaded page, not `p + 1`: a double click sets the same value twice.
            onClick={() => setPage(loadedPage + 1)}
          >
            {pageStatus.status === 'loading' ? 'Завантаження…' : 'Показати ще'}
          </button>
        )}
        {items.length > 0 && (
          <span className="muted">
            Показано {items.length} з {total}
          </span>
        )}
      </div>
    </main>
  );
}

/*
Розбір
- `page` у стані означає «яку сторінку треба мати». Клік лише збільшує page, а ефект на [page]
  вантажить. Один шлях завантаження для першої сторінки, наступних і retry.
- Подвійний клік: `setPage((p) => p + 1)` двічі підряд (до ре-рендеру) дає page + 2, і
  сторінка ПРОПУСКАЄТЬСЯ. disabled тут не рятує: другий клік може прийти раніше, ніж React
  перемалює кнопку. Тому наступна сторінка рахується від останньої ЗАВАНТАЖЕНОЇ:
  `setPage(loadedPage + 1)`. Два кліки ставлять те саме значення. disabled лишається для UX.
  (Цей баг був і в першій версії еталона, його зловила перевірка подвійним кліком.)
- Retry: `retryKey` у deps перезапускає ефект для ТОГО САМОГО page.
- Альтернатива: вантажити в onClick (async-обробник), без ефекту. Тоді StrictMode не заважає,
  але треба самому стежити за unmount і першою сторінкою. Обидва підходи ок, головне пояснити.
- Пастка з дублікатами при зсуві даних (новий переказ з'явився між сторінками): курсорна
  пагінація (`?after=tr_019`) замість page/limit. Гарна тема для follow-up.
*/
