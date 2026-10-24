// Task 10: reference solution.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Contact, ContactsResponse, CreateTransferRequest, Currency, Transfer } from '../../api/types';

// ---------- API ----------

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

// ---------- Pure helpers ----------

/** '1 250,50' -> 125050. Works on strings, so there are no float errors. null = invalid. */
export function parseAmount(input: string): number | null {
  const normalized = input.replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.');
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return minor > 0 ? minor : null;
}

interface Values {
  counterpartyId: string;
  amount: string;
  currency: Currency;
  description: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { counterpartyId: '', amount: '', currency: 'UAH', description: '' };
const CURRENCIES: Currency[] = ['UAH', 'USD', 'EUR', 'PLN'];

export function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.counterpartyId) errors.counterpartyId = 'Вибери отримувача';
  if (parseAmount(values.amount) === null) errors.amount = 'Введи суму, наприклад 1250,50';
  const description = values.description.trim();
  if (!description) errors.description = 'Додай опис';
  else if (description.length > 100) errors.description = 'Не більше 100 символів';
  return errors;
}

// ---------- Component ----------

type ContactsState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; items: Contact[] };

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }
  | { status: 'success'; transfer: Transfer };

export default function Solution() {
  const [contacts, setContacts] = useState<ContactsState>({ status: 'loading' });
  const [values, setValues] = useState<Values>(EMPTY);
  const [submitted, setSubmitted] = useState(false); // show errors only after the first attempt
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' });
  // A ref, not state: two submits in the same tick both see the old state, but the ref is
  // updated synchronously.
  const inFlight = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    request<ContactsResponse>('/api/contacts', { signal: controller.signal })
      .then((r) => setContacts({ status: 'success', items: r.items }))
      .catch((e: unknown) => {
        if (!controller.signal.aborted) {
          setContacts({ status: 'error', message: e instanceof Error ? e.message : 'Невідома помилка' });
        }
      });
    return () => controller.abort();
  }, []);

  const errors = submitted ? validate(values) : {};

  // One generic change handler instead of four.
  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;

    setSubmitted(true);
    if (Object.keys(validate(values)).length > 0) return;

    const body: CreateTransferRequest = {
      counterpartyId: values.counterpartyId,
      amount: parseAmount(values.amount)!, // validated above
      currency: values.currency,
      description: values.description.trim(),
    };

    inFlight.current = true;
    setSubmit({ status: 'submitting' });
    try {
      const transfer = await request<Transfer>('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setSubmit({ status: 'success', transfer });
      setValues(EMPTY);
      setSubmitted(false);
    } catch (error) {
      setSubmit({ status: 'error', message: error instanceof Error ? error.message : 'Невідома помилка' });
    } finally {
      inFlight.current = false;
    }
  }

  const isSubmitting = submit.status === 'submitting';

  return (
    <main className="page">
      <h1>Новий переказ</h1>

      <form className="stack" style={{ maxWidth: 420 }} onSubmit={handleSubmit} noValidate>
        {submit.status === 'success' && (
          <div className="success">
            Переказ {submit.transfer.id} створено, статус {submit.transfer.status}
          </div>
        )}

        <label className="field">
          <span className="field__label">Отримувач</span>
          <select
            className={`select ${errors.counterpartyId ? 'input--invalid' : ''}`}
            value={values.counterpartyId}
            disabled={contacts.status !== 'success' || isSubmitting}
            onChange={(e) => update('counterpartyId', e.target.value)}
          >
            <option value="">
              {contacts.status === 'loading' ? 'Завантаження…' : 'Вибери контакт'}
            </option>
            {contacts.status === 'success' &&
              contacts.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} · {c.bank}
                </option>
              ))}
          </select>
          {contacts.status === 'error' && <span className="field__error">Контакти: {contacts.message}</span>}
          {errors.counterpartyId && <span className="field__error">{errors.counterpartyId}</span>}
        </label>

        <div className="row" style={{ alignItems: 'flex-start' }}>
          <label className="field" style={{ flex: 1 }}>
            <span className="field__label">Сума</span>
            <input
              className={`input ${errors.amount ? 'input--invalid' : ''}`}
              placeholder="1250,50"
              inputMode="decimal"
              value={values.amount}
              disabled={isSubmitting}
              onChange={(e) => update('amount', e.target.value)}
            />
            {errors.amount && <span className="field__error">{errors.amount}</span>}
          </label>
          <label className="field">
            <span className="field__label">Валюта</span>
            <select
              className="select"
              value={values.currency}
              disabled={isSubmitting}
              onChange={(e) => update('currency', e.target.value as Currency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field__label">Опис</span>
          <input
            className={`input ${errors.description ? 'input--invalid' : ''}`}
            placeholder="За що переказ"
            value={values.description}
            disabled={isSubmitting}
            onChange={(e) => update('description', e.target.value)}
          />
          {errors.description && <span className="field__error">{errors.description}</span>}
        </label>

        {submit.status === 'error' && <div className="error">{submit.message}</div>}

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Надсилаю…' : 'Надіслати'}
        </button>
      </form>
    </main>
  );
}

/*
Розбір
- Гроші з рядка: НЕ `Math.round(parseFloat(s) * 100)` (працює майже завжди, але на співбесіді
  питають чому «майже»). Розбір на цілу й дробову частину як рядки дає точні копійки.
- `errors` обчислюються з `values` під час рендеру, окремий стан для них не потрібен.
  `submitted` вмикає показ після першої спроби, щоб не кричати на порожню форму.
- `onSubmit` на form: Enter працює, `type="submit"` на кнопці. `noValidate` вимикає
  браузерні підказки, щоб показувати свої.
- Подвійний сабміт: disabled кнопка + guard через useRef на початку handleSubmit.
  Guard через стан (`if (submit.status === 'submitting')`) НЕ працює: два сабміти до
  ре-рендеру обидва бачать 'idle'. Перша версія еталона мала саме цей баг, і в Network
  було два POST. Ref оновлюється синхронно.
- Після помилки сервера значення лишаються. Після успіху форма скидається.
- Follow-up: «unmount під час відправки?» (AbortController у ref або ігнор результату),
  «оптимістичне оновлення списку?», «React 19 useActionState / form actions?».
*/
