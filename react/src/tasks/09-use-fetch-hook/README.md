# 09. Свій хук useFetch<T> і TypeScript

Рівень: ★★★ · Ціль: 20 хв

Наживо найбільше часу часто йде на TypeScript: generic не того типу і звуження union.
Ця задача тренує саме це, а заодно виносить завантаження в перевикористовуваний хук.

## Завдання

Напиши в `Task.tsx` хук:

```ts
function useFetch<T>(url: string | null): { state: FetchState<T>; refetch: () => void }
```

- `FetchState<T>`: union `idle | loading | error | success`, у success поле `data: T`;
- `url === null`: стан `idle`, запиту немає;
- зміна `url`: старий запит скасовується, новий стартує;
- `refetch()`: повторює запит для поточного url;
- abort і cleanup всередині хука.

Компонент нижче вже використовує хук двічі: для `User[]` і для `RatesResponse`. Перемикач
вгорі змінює URL користувачів (звичайний / `?fail=1` / `null`).

## Вимоги до типів

- Без `any`. `as T` дозволено рівно в одному місці: на результаті `res.json()`.
- У JSX `state.data` доступний тільки після перевірки `state.status === 'success'`, і TS
  сам знає тип (`User[]` чи `RatesResponse`). Не пиши `state.data!` чи `(state as any)`.
- Тип стану UI (`FetchState<T>`) і тип відповіді API (`User[]`) це різні речі. Generic хука
  це тип ВІДПОВІДІ.

## Перевірка

- `npm run typecheck` без помилок.
- Перемкни URL на `?fail=1` → помилка з кнопкою «Ще раз». На `null` → «Вибери джерело».
- Швидко перемикай: у Network старі запити `canceled`.

## Вправа на TS-помилки (5 хв, після рішення)

Тимчасово напиши `useFetch<FetchState<User[]>>('/api/users')` і прочитай, що каже TypeScript
у місці використання. Це типова помилка наживо. Сформулюй вголос, що вона означає.
