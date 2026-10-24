// Response types of the mock API (see mock-api/plugin.js). Shared by all tasks.

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
}

export type Currency = 'UAH' | 'USD' | 'EUR' | 'PLN';
export type TransferDirection = 'incoming' | 'outgoing';
export type TransferStatus = 'completed' | 'pending' | 'failed';

export interface Transfer {
  id: string;
  direction: TransferDirection;
  /** Contact id, resolve it via POST /api/contacts/batch */
  counterpartyId: string;
  /** Minor units: kopecks / cents / grosze. 125000 UAH = 1 250,00 ₴ */
  amount: number;
  currency: Currency;
  status: TransferStatus;
  description: string;
  /** ISO 8601, UTC */
  createdAt: string;
}

/** GET /api/transfers */
export interface TransfersResponse {
  items: Transfer[];
  total: number;
}

/** GET /api/transfers?page=1&limit=10 */
export interface TransfersPageResponse extends TransfersResponse {
  page: number;
  limit: number;
  totalPages: number;
}

/** GET /api/rates */
export interface RatesResponse {
  base: 'UAH';
  /** How many UAH one unit of the currency costs. rates.UAH === 1 */
  rates: Record<Currency, number>;
  updatedAt: string;
}

export interface Contact {
  id: string;
  fullName: string;
  bank: string;
  cardMask: string;
}

/** GET /api/contacts and POST /api/contacts/batch */
export interface ContactsResponse {
  items: Contact[];
}

/** POST /api/contacts/batch, request body */
export interface ContactsRequest {
  ids: string[];
}

/** POST /api/transfers, request body. Response: the created Transfer (status 201). */
export interface CreateTransferRequest {
  counterpartyId: string;
  /** Minor units, positive integer */
  amount: number;
  currency: Currency;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  /** Minor units, UAH */
  price: number;
}

/** GET /api/products?q=... */
export interface ProductsResponse {
  q: string;
  items: Product[];
}

/** Body of any 4xx/5xx response */
export interface ApiError {
  error: string;
}
