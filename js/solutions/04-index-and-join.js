// 04. indexById і joinContacts: рішення

export const UNKNOWN_CONTACT = { fullName: 'Невідомий контакт', bank: null, cardMask: null };

export function indexById(items) {
  return new Map(items.map((item) => [item.id, item]));
}

export function joinContacts(transfers, contacts) {
  const byId = indexById(contacts);

  return transfers.map((transfer) => {
    const found = byId.get(transfer.counterpartyId);
    const contact = found
      ? { fullName: found.fullName, bank: found.bank, cardMask: found.cardMask }
      : { ...UNKNOWN_CONTACT };
    return { ...transfer, contact };
  });
}

/*
Розбір
- Map за id дає O(1) пошук. `contacts.find(...)` у циклі дає O(n·m). На 24 рядках різниці
  нема, але інтерв'юер хоче почути, що ти це розумієш.
- Індекс будуємо один раз, поза .map.
- `{ ...UNKNOWN_CONTACT }` замість спільного об'єкта: якщо хтось потім мутує один рядок,
  інші не зміняться.
- Мапити за індексом (`contacts[i]`) не можна: API віддає контакти в порядку бази.

У React такий merge виносять у чисту функцію поза компонентом. Її легко тестувати, а
інтерв'юер записує це в плюси.

Питання: «Що показати, якщо контакту немає?» Текст-фолбек і приглушений стиль, без падіння
на `contact.fullName`.
*/
