// Task 07: see README.md. This search has a race condition and no debounce. Fix it.
import { useEffect, useState } from 'react';
import type { Product, ProductsResponse } from '../../api/types';

function formatPrice(minor: number) {
  return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(minor / 100);
}

export default function Task() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products?q=${query}`)
      .then((res) => res.json())
      .then((data: ProductsResponse) => setItems(data.items));
  }, [query]);

  return (
    <main className="page stack">
      <h1>Пошук товарів</h1>

      <input
        className="input"
        placeholder="Наприклад, ноутбук"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="list">
        {items.map((p) => (
          <li key={p.id} className="row">
            <span style={{ marginRight: 'auto' }}>{p.name}</span>
            <span className="muted">{formatPrice(p.price)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
