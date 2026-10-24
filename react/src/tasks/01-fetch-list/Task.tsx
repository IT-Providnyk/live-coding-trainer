// Task 01: see README.md in this folder (or the «Умова» tab).
// Replace the hardcoded users with data from GET /api/users.
// Try these URLs too: '/api/users?fail=1', '/api/users?empty=1', '/api/users?delay=3000'.
// import { useEffect, useState } from 'react';
// import type { User } from '../../api/types';

export default function Task() {
  return (
    <main className="page">
      <h1>Користувачі</h1>

      <ul className="list">
        <li>
          <div>Олена Коваленко</div>
          <div className="muted">olena@example.com · Київ</div>
        </li>
        <li>
          <div>Андрій Шевчук</div>
          <div className="muted">andrii@example.com · Львів</div>
        </li>
        <li>
          <div>Ірина Бондар</div>
          <div className="muted">iryna@example.com · Одеса</div>
        </li>
      </ul>
    </main>
  );
}
