// Mock API as a Vite plugin: the dev server answers /api/* itself.
//
// Every endpoint supports two query params for practice:
//   ?fail=1     always answer 500 { error }
//   ?fail=0.5   fail randomly with this probability
//   ?delay=2000 override the response delay, ms
// Start with DELAY=0 npm run dev to turn delays off.

import { contacts, products, rates, transfers, users } from './data.js';

const NO_DELAY = process.env.DELAY === '0';
const MAX_PAGE_LIMIT = 50;
const MAX_CONTACT_IDS = 50;
const CURRENCIES = Object.keys(rates.rates);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function parsePositiveInt(value) {
  if (value === null || !/^\d+$/.test(value)) return null;
  const n = Number(value);
  return n > 0 ? n : null;
}

async function readJson(req) {
  if (!String(req.headers['content-type'] ?? '').includes('application/json')) {
    throw new HttpError(400, 'Body must be JSON. Did you set the Content-Type: application/json header?');
  }
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try {
    return JSON.parse(raw);
  } catch {
    throw new HttpError(400, 'Malformed JSON body');
  }
}

const newestFirst = (list) => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

// [method, path, base delay ms, handler(url, req) -> [status, body]]
const routes = [
  ['GET', '/api/users', 600, (url) => {
    if (url.searchParams.get('empty') === '1') return [200, []];
    return [200, users];
  }],

  ['GET', '/api/transfers', 700, (url) => {
    const sorted = newestFirst(transfers);
    const total = sorted.length;
    const rawPage = url.searchParams.get('page');
    const rawLimit = url.searchParams.get('limit');
    if (rawPage === null && rawLimit === null) return [200, { items: sorted, total }];

    const page = rawPage === null ? 1 : parsePositiveInt(rawPage);
    const limit = rawLimit === null ? 10 : parsePositiveInt(rawLimit);
    if (page === null) throw new HttpError(400, '"page" must be a positive integer');
    if (limit === null || limit > MAX_PAGE_LIMIT) {
      throw new HttpError(400, `"limit" must be an integer from 1 to ${MAX_PAGE_LIMIT}`);
    }
    const start = (page - 1) * limit;
    return [200, {
      items: sorted.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }];
  }],

  ['POST', '/api/transfers', 800, async (url, req) => {
    const body = await readJson(req);
    const { counterpartyId, amount, currency, description } = body ?? {};
    if (!contacts.some((c) => c.id === counterpartyId)) throw new HttpError(400, 'Unknown counterpartyId');
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new HttpError(400, '"amount" must be a positive integer in minor units');
    }
    if (!CURRENCIES.includes(currency)) throw new HttpError(400, `"currency" must be one of ${CURRENCIES.join(', ')}`);
    if (typeof description !== 'string' || description.trim() === '') {
      throw new HttpError(400, '"description" is required');
    }
    if (amount > 10_000_000) throw new HttpError(422, 'Limit exceeded: max 100 000,00 per transfer');

    const item = {
      id: `tr_${String(transfers.length + 1).padStart(3, '0')}`,
      direction: 'outgoing',
      counterpartyId,
      amount,
      currency,
      status: 'pending',
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };
    transfers.push(item);
    return [201, item];
  }],

  ['GET', '/api/rates', 1500, () => [200, rates]],

  ['GET', '/api/contacts', 500, () => [200, { items: contacts }]],

  ['POST', '/api/contacts/batch', 600, async (url, req) => {
    const body = await readJson(req);
    const rawIds = body?.ids;
    if (!Array.isArray(rawIds) || !rawIds.every((id) => typeof id === 'string')) {
      throw new HttpError(400, 'Body must be JSON like { "ids": ["c_101", "c_102"] }');
    }
    const ids = new Set(rawIds);
    if (ids.size === 0) throw new HttpError(400, '"ids" must contain at least one id');
    if (ids.size > MAX_CONTACT_IDS) throw new HttpError(400, `"ids" can contain at most ${MAX_CONTACT_IDS} ids`);
    return [200, { items: contacts.filter((c) => ids.has(c.id)) }];
  }],

  // Random delay on purpose: fast typing produces responses out of order.
  ['GET', '/api/products', () => 200 + Math.floor(Math.random() * 1000), (url) => {
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
    if (q.length > 50) throw new HttpError(400, '"q" is too long');
    const items = q === '' ? [] : products.filter((p) => p.name.toLowerCase().includes(q));
    return [200, { q, items }];
  }],
];

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export function mockApi() {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api')) return next();

        const startedAt = Date.now();
        const url = new URL(req.url, 'http://localhost');
        res.on('finish', () => {
          console.log(`[api] ${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - startedAt} ms)`);
        });

        const route = routes.find(([method, path]) => method === req.method && path === url.pathname);
        if (!route) return send(res, 404, { error: `Not found: ${req.method} ${url.pathname}` });

        const [, , baseDelay, handler] = route;
        const delayParam = url.searchParams.get('delay');
        const delay = delayParam !== null
          ? Number(delayParam)
          : NO_DELAY ? 0 : (typeof baseDelay === 'function' ? baseDelay() : baseDelay + Math.random() * 150);

        try {
          await sleep(delay);
          const fail = Number(url.searchParams.get('fail') ?? 0);
          if (fail > 0 && Math.random() < fail) throw new HttpError(500, 'Сервер тимчасово недоступний');
          const [status, body] = await handler(url, req);
          send(res, status, body);
        } catch (error) {
          send(res, error instanceof HttpError ? error.status : 500, {
            error: error instanceof HttpError ? error.message : 'Internal server error',
          });
        }
      });
    },
  };
}
