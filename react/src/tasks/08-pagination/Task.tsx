// Task 08: see README.md. Page-by-page loading with a «Показати ще» button.
// API: GET /api/transfers?page=1&limit=5 -> TransfersPageResponse (src/api/types.ts)
// To test errors on later pages add '&fail=0.3' to the URL.
// import { useEffect, useState } from 'react';
// import type { Transfer, TransfersPageResponse } from '../../api/types';

export default function Task() {
  return (
    <main className="page stack">
      <h1>Історія переказів</h1>

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
          <tr>
            <td>21 жовт. 2026 р., 20:42</td>
            <td>За квитки на концерт</td>
            <td className="num amount--outgoing">−1 250,00 грн</td>
            <td>
              <span className="badge badge--completed">completed</span>
            </td>
          </tr>
          <tr>
            <td>21 жовт. 2026 р., 11:15</td>
            <td>Freelance invoice #42</td>
            <td className="num amount--incoming">+250,00 USD</td>
            <td>
              <span className="badge badge--completed">completed</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="row">
        <button className="button">Показати ще</button>
        <span className="muted">Показано 2 з 24</span>
      </div>
    </main>
  );
}
