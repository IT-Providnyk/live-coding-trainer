# 05. Залежний запит: контакти за id з переказів

Рівень: ★★★ · Ціль: 20 хв

Типова задача з fintech-співбесіди, без карток підсумків.

## Завдання

До задачі 04 додається третій ендпоінт:

```
POST /api/contacts/batch
Content-Type: application/json
{ "ids": ["c_101", "c_102"] }

→ { "items": [{ "id": "c_101", "fullName": "Олена Коваленко", "bank": "monobank", "cardMask": "**** 4821" }] }
```

Запит будується **на основі відповіді** `/api/transfers` (`counterpartyId` кожного переказу).
Заповни колонку «Контакт»: ім'я, нижче банк і маска картки.

## Вимоги

1. transfers і rates стартують паралельно.
2. contacts стартують одразу після transfers і **не чекають rates**.
3. У batch ідуть унікальні id (`new Set`).
4. POST з `Content-Type: application/json` і `JSON.stringify`.
5. Злиття через `Map` за id, а не за індексом: контакти приходять у порядку бази.
6. Контакт `c_404` видалений, API його не повертає. Покажи фолбек «Невідомий контакт»,
   нічого не повинно впасти.
7. Злиття окремою чистою функцією поза компонентом: `buildRows(transfers, rates, contacts)`.
8. Loading, error, abort, `key`.

## Перевірка

| Як написано | Час до рендеру |
|---|---|
| Послідовно transfers → rates → contacts | ~2.8 с |
| `Promise.all([transfers, rates])`, потім contacts | ~2.1 с |
| contacts одразу після transfers, паралельно з rates | ~1.5 с |

Network → Waterfall: contacts має стартувати до того, як закінчиться rates.

Пастки, які ловлять інтерв'юери:
- забув `Content-Type` → 400 «Body must be JSON...»; подивись Payload і Request Headers у Network;
- `body: { ids }` без stringify → 400;
- `contacts[i]` замість Map → імена не тих людей;
- `contact.fullName` на undefined → білий екран (див. `tr_005`, `tr_019`).

## Порядок роботи

1. 2 хв: план вголос. Назви всі три варіанти з таблиці й скажи, який робиш і чому.
2. 5 хв: `getJson`, `postJson`, перевірка в консолі.
3. 5 хв: `buildRows` (можна взяти логіку з JS-задачі 04).
4. 5 хв: рендер, фолбек, loading, error.
5. Решта: перевірка Network і пастки.
