// Task 04: see README.md. Load /api/transfers and /api/rates IN PARALLEL and fill the table.
// Types: src/api/types.ts
// import { useEffect, useState } from 'react';
// import type { RatesResponse, TransfersResponse } from '../../api/types';

export default function Task() {
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
          <tr>
            <td>21 жовт. 2026 р., 20:42</td>
            <td>За квитки на концерт</td>
            <td className="num amount--outgoing">−1 250,00 грн</td>
            <td className="num muted">−1 250,00 грн</td>
            <td>
              <span className="badge badge--completed">completed</span>
            </td>
          </tr>
          <tr>
            <td>21 жовт. 2026 р., 11:15</td>
            <td>Freelance invoice #42</td>
            <td className="num amount--incoming">+250,00 USD</td>
            <td className="num muted">+10 330,00 грн</td>
            <td>
              <span className="badge badge--completed">completed</span>
            </td>
          </tr>
          <tr>
            <td>20 жовт. 2026 р., 22:03</td>
            <td>Оренда паркомісця</td>
            <td className="num amount--outgoing">−450,00 грн</td>
            <td className="num muted">−450,00 грн</td>
            <td>
              <span className="badge badge--pending">pending</span>
            </td>
          </tr>
        </tbody>
      </table>

      <p className="muted">Курс оновлено: 22 жовт. 2026 р., 09:00</p>
    </main>
  );
}
