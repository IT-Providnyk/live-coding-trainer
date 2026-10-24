// Task 10: see README.md. Make the form work: contacts select, validation, POST /api/transfers.
// Types: Contact, ContactsResponse, CreateTransferRequest, Transfer in src/api/types.ts
// import { useEffect, useState, type FormEvent } from 'react';

export default function Task() {
  return (
    <main className="page">
      <h1>Новий переказ</h1>

      <form className="stack" style={{ maxWidth: 420 }}>
        <label className="field">
          <span className="field__label">Отримувач</span>
          <select className="select">
            <option value="">Вибери контакт</option>
            <option value="c_101">Олена Коваленко</option>
          </select>
        </label>

        <div className="row">
          <label className="field" style={{ flex: 1 }}>
            <span className="field__label">Сума</span>
            <input className="input" placeholder="1250,50" inputMode="decimal" />
          </label>
          <label className="field">
            <span className="field__label">Валюта</span>
            <select className="select">
              <option>UAH</option>
              <option>USD</option>
              <option>EUR</option>
              <option>PLN</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field__label">Опис</span>
          <input className="input" placeholder="За що переказ" />
        </label>

        <button className="button" type="submit">
          Надіслати
        </button>
      </form>
    </main>
  );
}
