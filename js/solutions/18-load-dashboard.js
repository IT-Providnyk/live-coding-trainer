// 18. loadDashboard: рішення

import { chunk } from './01-chunk.js';

const MAX_IDS_PER_REQUEST = 50;

async function loadContacts(api, transfers, signal) {
  const ids = [...new Set(transfers.map((t) => t.counterpartyId))];
  if (ids.length === 0) return [];

  const responses = await Promise.all(
    chunk(ids, MAX_IDS_PER_REQUEST).map((batch) => api.getContacts(batch, signal)),
  );
  return responses.flatMap((r) => r.items);
}

export async function loadDashboard(api, signal) {
  // Started now, awaited below: transfers and rates run in parallel.
  const transfersPromise = api.getTransfers(signal).then((r) => r.items);
  const ratesPromise = api.getRates(signal).then((r) => r.rates);
  // Contacts chain on transfers only, so they do not wait for rates.
  const contactsPromise = transfersPromise.then((items) => loadContacts(api, items, signal));

  const [transfers, rates, contacts] = await Promise.all([
    transfersPromise,
    ratesPromise,
    contactsPromise,
  ]);
  return { transfers, rates, contacts };
}

/*
Розбір. Три варіанти, які оцінює інтерв'юер (таймінги з мок-API тренажера):
  1) await transfers; await rates; await contacts           ~2.8 s  (мінус)
  2) await Promise.all([transfers, rates]); await contacts  ~2.1 s  (база)
  3) як тут: contacts чіпляється на .then від transfers     ~1.5 s  (плюс)
Вголос: «rates і transfers незалежні, тому стартують разом. contacts залежать тільки від
transfers, тому я чіпляю їх на transfers, і вони не чекають rates».

- Неприємна дрібниця: якщо transfersPromise реджектнеться, contactsPromise теж реджектнеться.
  Обидва в Promise.all, тож unhandled rejection не буде.
- Злиття (joinContacts із задачі 04) роби окремою чистою функцією вже над результатом.
*/
