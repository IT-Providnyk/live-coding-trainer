// 06. formatMoney і formatDate: рішення

// Created once per currency and reused: constructing Intl formatters is relatively slow.
const moneyFormatters = new Map();

function getMoneyFormatter(currency) {
  let formatter = moneyFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat('uk-UA', { style: 'currency', currency });
    moneyFormatters.set(currency, formatter);
  }
  return formatter;
}

const SIGN = { incoming: '+', outgoing: '−' };

export function formatMoney(amountMinor, currency, direction) {
  const formatted = getMoneyFormatter(currency).format(amountMinor / 100);
  return (SIGN[direction] ?? '') + formatted;
}

export function formatDate(iso, timeZone = 'Europe/Kyiv') {
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(new Date(iso));
}

/*
Розбір
- Ділимо на 100 тільки тут, під час виводу. Рахуємо завжди в цілих копійках.
- Знак береться з direction, а не з amount: у цьому API amount завжди додатний.
- `/ 100` годиться для UAH, USD, EUR, PLN. Є валюти без копійок (JPY) і з 3 знаками (KWD).
  Правильно брати `formatter.resolvedOptions().maximumFractionDigits`. Достатньо згадати це вголос.
- Не форматуй руками через toFixed і regex: інтерв'юер записує `Intl` у плюси.
- Без timeZone дата залежить від часового поясу машини. На співбесіді це нормально, але
  варто сказати: «час показується в поясі браузера».
- formatDate можна закешувати так само, як formatMoney, ключем буде timeZone.
*/
