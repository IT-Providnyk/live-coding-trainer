// Task 05: reference solution.
import { useEffect, useState } from 'react';
import type {
  Contact,
  ContactsRequest,
  ContactsResponse,
  Currency,
  RatesResponse,
  Transfer,
  TransfersResponse,
} from '../../api/types';

// ---------- API helpers ----------

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

const getJson = <T,>(url: string, signal?: AbortSignal) => request<T>(url, { signal });

const postJson = <T,>(url: string, body: unknown, signal?: AbortSignal) =>
  request<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

// ---------- Pure merge: easy to test, no React here ----------

interface Row extends Transfer {
  contact: Contact | null; // null = deleted / unknown contact
  uahAmount: number; // minor units
}

function buildRows(transfers: Transfer[], rates: RatesResponse, contacts: Contact[]): Row[] {
  const contactsById = new Map(contacts.map((c) => [c.id, c]));
  return transfers.map((t) => ({
    ...t,
    contact: contactsById.get(t.counterpartyId) ?? null,
    uahAmount: Math.round(t.amount * rates.rates[t.currency]),
  }));
}

// ---------- Formatting ----------

const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

function formatMoney(amountMinor: number, currency: Currency, direction: Transfer['direction']) {
  const sign = direction === 'incoming' ? '+' : '−';
  return sign + new Intl.NumberFormat('uk-UA', { style: 'currency', currency }).format(amountMinor / 100);
}

// ---------- Component ----------

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; rows: Row[] };

async function loadContacts(transfers: Transfer[], signal: AbortSignal): Promise<Contact[]> {
  const ids = [...new Set(transfers.map((t) => t.counterpartyId))];
  if (ids.length === 0) return [];
  const body: ContactsRequest = { ids };
  const res = await postJson<ContactsResponse>('/api/contacts/batch', body, signal);
  return res.items;
}

export default function Solution() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function load() {
      try {
        const transfersPromise = getJson<TransfersResponse>('/api/transfers', signal).then((r) => r.items);
        const ratesPromise = getJson<RatesResponse>('/api/rates', signal);
        // Chained on transfers only: does not wait for rates.
        const contactsPromise = transfersPromise.then((items) => loadContacts(items, signal));

        const [transfers, rates, contacts] = await Promise.all([transfersPromise, ratesPromise, contactsPromise]);
        setState({ status: 'success', rows: buildRows(transfers, rates, contacts) });
      } catch (error) {
        if (signal.aborted) return;
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

      {state.status === 'success' && (
        <table className="table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Контакт</th>
              <th>Опис</th>
              <th className="num">Сума</th>
              <th className="num">В UAH</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {state.rows.map((row) => (
              <tr key={row.id}>
                <td>{dateFormat.format(new Date(row.createdAt))}</td>
                <td>
                  {row.contact ? (
                    <>
                      <div>{row.contact.fullName}</div>
                      <div className="muted">
                        {row.contact.bank} · {row.contact.cardMask}
                      </div>
                    </>
                  ) : (
                    <div className="muted">Невідомий контакт</div>
                  )}
                </td>
                <td>{row.description}</td>
                <td className={`num amount--${row.direction}`}>{formatMoney(row.amount, row.currency, row.direction)}</td>
                <td className="num muted">{formatMoney(row.uahAmount, 'UAH', row.direction)}</td>
                <td>
                  <span className={`badge badge--${row.status}`}>{row.status}</span>
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
Розбір
- Три проміси створюються ДО першого await. contactsPromise чіпляється на transfersPromise,
  тому стартує одразу після transfers (~0.7 с) і закінчується ~1.3 с, поки rates ще йде.
- Якщо transfers впаде, contactsPromise теж реджектнеться, і обидва в Promise.all:
  unhandled rejection не буде.
- `contact: Contact | null` у типі рядка змушує JSX обробити відсутній контакт. Тут TypeScript
  працює на тебе, а не проти.
- buildRows чиста: на співбесіді можна сказати «я б покрив її юніт-тестом» (плюс у рубриці).
- Більше 50 id: `chunk(ids, 50)` + Promise.all (JS-задачі 01 і 18).
*/
