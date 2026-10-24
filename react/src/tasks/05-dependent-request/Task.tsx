// Task 05: see README.md.
// transfers + rates in parallel, contacts right after transfers (not waiting for rates).
// Types: src/api/types.ts
// import { useEffect, useState } from 'react';
// import type { ContactsResponse, RatesResponse, TransfersResponse } from '../../api/types';

export default function Task() {
  return (
    <main className="page">
      <h1>Історія переказів</h1>

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
          <tr>
            <td>21 жовт. 2026 р., 20:42</td>
            <td>
              <div>Олена Коваленко</div>
              <div className="muted">monobank · **** 4821</div>
            </td>
            <td>За квитки на концерт</td>
            <td className="num amount--outgoing">−1 250,00 грн</td>
            <td className="num muted">−1 250,00 грн</td>
            <td>
              <span className="badge badge--completed">completed</span>
            </td>
          </tr>
          <tr>
            <td>21 жовт. 2026 р., 11:15</td>
            <td>
              <div>Sarah Miller</div>
              <div className="muted">Revolut · **** 9902</div>
            </td>
            <td>Freelance invoice #42</td>
            <td className="num amount--incoming">+250,00 USD</td>
            <td className="num muted">+10 330,00 грн</td>
            <td>
              <span className="badge badge--completed">completed</span>
            </td>
          </tr>
          <tr>
            <td>17 жовт. 2026 р., 19:45</td>
            <td>
              <div className="muted">Невідомий контакт</div>
            </td>
            <td>Подарунок</td>
            <td className="num amount--outgoing">−300,00 грн</td>
            <td className="num muted">−300,00 грн</td>
            <td>
              <span className="badge badge--completed">completed</span>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
